import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  fetchSongsRequest,
  createSongRequest,
  updateSongRequest,
  deleteSongRequest,
  clearError,
  setCurrentSong,
  connectSocket,
  disconnectSocket,
} from "../features/songs/songsSlice";
import { Song, CreateSongRequest } from "../types/song.types";
import {
  Button,
  Card,
  Input,
  Select,
  Badge,
  ModalOverlay,
  ModalContent,
  Spinner,
  Alert,
} from "../components/ui";
import socketService from "../services/socketService";

export default function SongsList() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error, currentSong, pagination } = useSelector(
    (state: RootState) => state.songs
  ) as {
    list: Song[];
    loading: {
      fetch: boolean;
      create: boolean;
      update: boolean;
      delete: boolean;
    };
    error: string | null;
    currentSong: Song | null;
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
      total: number;
    } | null;
  };

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);
  const [formData, setFormData] = useState<CreateSongRequest>({
    title: "",
    artist: "",
    songType: "single",
    genre: "",
  });

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    // Fetch initial songs data with pagination and current filters
    dispatch(
      fetchSongsRequest({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        genre: selectedGenre !== "all" ? selectedGenre : undefined,
        songType: selectedAlbum !== "all" ? selectedAlbum : undefined,
        sort:
          sortBy === "title"
            ? "title"
            : sortBy === "artist"
            ? "artist"
            : sortBy === "genre"
            ? "genre"
            : "-createdAt",
      })
    );

    // Connect to Socket.IO for real-time updates
    dispatch(connectSocket());

    // Monitor socket connection status
    const checkSocketStatus = () => {
      setIsSocketConnected(socketService.isSocketConnected());
    };

    // Check initial status
    checkSocketStatus();

    // Monitor socket connection status
    const interval = setInterval(checkSocketStatus, 1000);

    // Cleanup: disconnect socket when component unmounts
    return () => {
      clearInterval(interval);
      dispatch(disconnectSocket());
    };
  }, [dispatch, currentPage, sortBy, selectedGenre, selectedAlbum]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateSong = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createSongRequest(formData));
    setFormData({ title: "", artist: "", songType: "single", genre: "" });
    setShowCreateForm(false);
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setFormData({
      title: song.title,
      artist: song.artist,
      songType: song.songType,
      genre: song.genre,
    });
    setShowCreateForm(true);
  };

  const handleUpdateSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSong) {
      dispatch(updateSongRequest({ id: editingSong._id, data: formData }));
      setEditingSong(null);
      setFormData({ title: "", artist: "", songType: "single", genre: "" });
      setShowCreateForm(false);
    }
  };

  const handleDeleteSong = (song: Song) => {
    setSongToDelete(song);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (songToDelete) {
      dispatch(deleteSongRequest(songToDelete._id));
      setShowDeleteModal(false);
      setSongToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSongToDelete(null);
  };

  const handleViewSong = (song: Song) => {
    dispatch(setCurrentSong(song));
  };

  const handleCloseModal = () => {
    dispatch(setCurrentSong(null));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    dispatch(
      fetchSongsRequest({
        page: newPage,
        limit: itemsPerPage,
        search: searchTerm,
        genre: selectedGenre !== "all" ? selectedGenre : undefined,
        songType: selectedAlbum !== "all" ? selectedAlbum : undefined,
        sort:
          sortBy === "title"
            ? "title"
            : sortBy === "artist"
            ? "artist"
            : sortBy === "genre"
            ? "genre"
            : "-createdAt",
      })
    );
  };

  // Handle sort change
  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1); // Reset to first page when sorting changes
    dispatch(
      fetchSongsRequest({
        page: 1,
        limit: itemsPerPage,
        search: searchTerm,
        genre: selectedGenre !== "all" ? selectedGenre : undefined,
        songType: selectedAlbum !== "all" ? selectedAlbum : undefined,
        sort:
          newSort === "title"
            ? "title"
            : newSort === "artist"
            ? "artist"
            : newSort === "genre"
            ? "genre"
            : "-createdAt",
      })
    );
  };

  // Handle search with debouncing
  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    // Don't dispatch immediately - let debounced search handle it
  };

  // Handle genre filter change
  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
    dispatch(
      fetchSongsRequest({
        page: 1,
        limit: itemsPerPage,
        search: searchTerm,
        genre: genre !== "all" ? genre : undefined,
        songType: selectedAlbum !== "all" ? selectedAlbum : undefined,
        sort:
          sortBy === "title"
            ? "title"
            : sortBy === "artist"
            ? "artist"
            : sortBy === "genre"
            ? "genre"
            : "-createdAt",
      })
    );
  };

  // Handle song type filter change
  const handleSongTypeChange = (songType: string) => {
    setSelectedAlbum(songType);
    setCurrentPage(1);
    dispatch(
      fetchSongsRequest({
        page: 1,
        limit: itemsPerPage,
        search: searchTerm,
        genre: selectedGenre !== "all" ? selectedGenre : undefined,
        songType: songType !== "all" ? songType : undefined,
        sort:
          sortBy === "title"
            ? "title"
            : sortBy === "artist"
            ? "artist"
            : sortBy === "genre"
            ? "genre"
            : "-createdAt",
      })
    );
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      dispatch(
        fetchSongsRequest({
          page: 1,
          limit: itemsPerPage,
          search: searchTerm,
          genre: selectedGenre !== "all" ? selectedGenre : undefined,
          songType: selectedAlbum !== "all" ? selectedAlbum : undefined,
          sort:
            sortBy === "title"
              ? "title"
              : sortBy === "artist"
              ? "artist"
              : sortBy === "genre"
              ? "genre"
              : "-createdAt",
        })
      );
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [
    searchTerm,
    dispatch,
    sortBy,
    itemsPerPage,
    selectedGenre,
    selectedAlbum,
  ]);

  // Use server-side data directly (no client-side filtering/sorting)
  const displaySongs = list;

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedAlbum("all");
    setSelectedGenre("all");
    setSortBy("title");
    setCurrentPage(1);
    // Reset API call with cleared filters
    dispatch(
      fetchSongsRequest({
        page: 1,
        limit: itemsPerPage,
        sort: "title",
      })
    );
  };

  // Get unique genres and song types for filter dropdowns
  const uniqueGenres = Array.from(new Set(list.map((song) => song.genre)));
  const uniqueSongTypes = Array.from(
    new Set(list.map((song) => song.songType))
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "0",
      }}
    >
      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
        {/* Error Alert */}
        {error && (
          <Alert variant="error" style={{ marginBottom: "16px" }}>
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearError}
              style={{ marginLeft: "auto" }}
            >
              ✕
            </Button>
          </Alert>
        )}

        {/* Compact Filter Section */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            padding: "16px",
            marginBottom: "20px",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                Filters & Search
              </h3>

              {/* Connection Status */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  backgroundColor: isSocketConnected ? "#f0fdf4" : "#fef2f2",
                  border: `1px solid ${
                    isSocketConnected ? "#bbf7d0" : "#fecaca"
                  }`,
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: isSocketConnected ? "#22c55e" : "#ef4444",
                    animation: isSocketConnected ? "pulse 2s infinite" : "none",
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    color: isSocketConnected ? "#16a34a" : "#dc2626",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                  }}
                >
                  {isSocketConnected ? "Live" : "Offline"}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Button
                variant="secondary"
                onClick={clearFilters}
                style={{
                  padding: "6px 12px",
                  fontSize: "11px",
                  fontWeight: "500",
                  borderRadius: "4px",
                }}
              >
                Clear All
              </Button>

              <Button
                variant="primary"
                onClick={() => setShowCreateForm(true)}
                style={{
                  padding: "6px 14px",
                  fontSize: "12px",
                  fontWeight: "600",
                  borderRadius: "6px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                }}
              >
                + Add New Song
              </Button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              alignItems: "end",
            }}
          >
            {/* Search Input */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.3px",
                }}
              >
                Search
              </label>
              <div style={{ position: "relative" }}>
                <Input
                  placeholder="Search songs, artists, or genres..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{
                    paddingLeft: "32px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    fontSize: "13px",
                    height: "36px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    fontSize: "14px",
                  }}
                >
                  🔍
                </div>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.3px",
                }}
              >
                Sort By
              </label>
              <Select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                style={{
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                  height: "36px",
                }}
              >
                <option value="title">Title (A-Z)</option>
                <option value="artist">Artist (A-Z)</option>
                <option value="genre">Genre (A-Z)</option>
                <option value="-createdAt">Date (Newest)</option>
              </Select>
            </div>

            {/* Song Type Filter */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.3px",
                }}
              >
                Song Type
              </label>
              <Select
                value={selectedAlbum}
                onChange={(e) => handleSongTypeChange(e.target.value)}
                style={{
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                  height: "36px",
                }}
              >
                <option value="all">All Types</option>
                {uniqueSongTypes.map((songType) => (
                  <option key={songType} value={songType}>
                    {songType.charAt(0).toUpperCase() + songType.slice(1)}
                  </option>
                ))}
              </Select>
            </div>

            {/* Genre Filter */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.3px",
                }}
              >
                Genre
              </label>
              <Select
                value={selectedGenre}
                onChange={(e) => handleGenreChange(e.target.value)}
                style={{
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                  height: "36px",
                }}
              >
                <option value="all">All Genres</option>
                {uniqueGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Professional Songs Grid */}
        {displaySongs.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {displaySongs.map((song: Song) => (
              <div
                key={song._id}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px 0 rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
                }}
              >
                {/* Card Header */}
                <div
                  style={{
                    padding: "16px 16px 12px 16px",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#1e293b",
                          margin: "0 0 4px 0",
                          lineHeight: "1.3",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {song.title}
                      </h3>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#64748b",
                          margin: 0,
                          fontWeight: "500",
                        }}
                      >
                        by {song.artist}
                      </p>
                    </div>
                    <Badge
                      variant={
                        song.songType === "single" ? "primary" : "success"
                      }
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        padding: "3px 6px",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                        letterSpacing: "0.3px",
                      }}
                    >
                      {song.songType}
                    </Badge>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px",
                        color: "#64748b",
                      }}
                    >
                      <span>🎵</span>
                      <span>{song.genre}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px",
                        color: "#64748b",
                      }}
                    >
                      <span>📅</span>
                      <span>
                        {new Date(song.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                    }}
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleViewSong(song)}
                      style={{
                        flex: 1,
                        padding: "6px 10px",
                        fontSize: "11px",
                        fontWeight: "600",
                        borderRadius: "4px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        color: "#64748b",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f8fafc";
                        e.currentTarget.style.borderColor = "#cbd5e1";
                        e.currentTarget.style.color = "#475569";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ffffff";
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.color = "#64748b";
                      }}
                    >
                      👁️ View
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditSong(song)}
                      style={{
                        flex: 1,
                        padding: "6px 10px",
                        fontSize: "11px",
                        fontWeight: "600",
                        borderRadius: "4px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        color: "#64748b",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f8fafc";
                        e.currentTarget.style.borderColor = "#cbd5e1";
                        e.currentTarget.style.color = "#475569";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ffffff";
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.color = "#64748b";
                      }}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDeleteSong(song)}
                      disabled={loading.delete}
                      style={{
                        flex: 1,
                        padding: "6px 10px",
                        fontSize: "11px",
                        fontWeight: "600",
                        borderRadius: "4px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        color: "#64748b",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                        transition: "all 0.2s ease",
                        opacity: loading.delete ? 0.6 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!loading.delete) {
                          e.currentTarget.style.backgroundColor = "#fef2f2";
                          e.currentTarget.style.borderColor = "#fecaca";
                          e.currentTarget.style.color = "#dc2626";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading.delete) {
                          e.currentTarget.style.backgroundColor = "#ffffff";
                          e.currentTarget.style.borderColor = "#e2e8f0";
                          e.currentTarget.style.color = "#64748b";
                        }
                      }}
                    >
                      {loading.delete ? <Spinner /> : "🗑️ Delete"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              padding: "48px 24px",
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                fontSize: "36px",
                marginBottom: "12px",
              }}
            >
              🎵
            </div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1e293b",
                margin: "0 0 6px 0",
              }}
            >
              No songs found
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "#64748b",
                margin: "0 0 20px 0",
              }}
            >
              {searchTerm
                ? "Try adjusting your search criteria"
                : "Start building your music library"}
            </p>
            <Button
              variant="primary"
              onClick={() => setShowCreateForm(true)}
              style={{
                padding: "10px 20px",
                fontSize: "13px",
                fontWeight: "600",
                borderRadius: "6px",
              }}
            >
              + Add Your First Song
            </Button>
          </div>
        )}

        {/* Professional Pagination */}
        {pagination && (
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              padding: "16px 20px",
              marginBottom: "24px",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: "500",
                  }}
                >
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} songs
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  style={{
                    padding: "6px 12px",
                    fontSize: "13px",
                    fontWeight: "500",
                    borderRadius: "4px",
                    opacity: !pagination.hasPrev ? 0.5 : 1,
                  }}
                >
                  ← Previous
                </Button>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#1e293b",
                      fontWeight: "600",
                    }}
                  >
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                </div>

                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  style={{
                    padding: "6px 12px",
                    fontSize: "13px",
                    fontWeight: "500",
                    borderRadius: "4px",
                    opacity: !pagination.hasNext ? 0.5 : 1,
                  }}
                >
                  Next →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Form Modal */}
        {showCreateForm && (
          <ModalOverlay>
            <ModalContent style={{ padding: "24px" }}>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1e293b",
                  margin: "0 0 20px 0",
                }}
              >
                {editingSong ? "Edit Song" : "Add New Song"}
              </h3>

              <form
                onSubmit={editingSong ? handleUpdateSong : handleCreateSong}
              >
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Title
                  </label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Artist
                  </label>
                  <Input
                    type="text"
                    name="artist"
                    value={formData.artist}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Song Type
                  </label>
                  <Select
                    name="songType"
                    value={formData.songType}
                    onChange={handleInputChange}
                  >
                    <option value="single">Single</option>
                    <option value="album">Album</option>
                  </Select>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Genre
                  </label>
                  <Input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading.create || loading.update}
                    style={{ flex: 1 }}
                  >
                    {loading.create || loading.update ? (
                      <>
                        <Spinner />
                        <span style={{ marginLeft: "8px" }}>
                          {editingSong ? "Updating..." : "Creating..."}
                        </span>
                      </>
                    ) : editingSong ? (
                      "Update"
                    ) : (
                      "Create"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingSong(null);
                      setFormData({
                        title: "",
                        artist: "",
                        songType: "single",
                        genre: "",
                      });
                    }}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Song Details Modal */}
        {currentSong && (
          <ModalOverlay>
            <ModalContent style={{ padding: "24px" }}>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1e293b",
                  margin: "0 0 20px 0",
                }}
              >
                Song Details
              </h3>

              <div style={{ marginBottom: "24px" }}>
                <div style={{ marginBottom: "16px" }}>
                  <span
                    style={{
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Title:
                  </span>
                  <span
                    style={{
                      marginLeft: "8px",
                      color: "#1e293b",
                    }}
                  >
                    {currentSong.title}
                  </span>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <span
                    style={{
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Artist:
                  </span>
                  <span
                    style={{
                      marginLeft: "8px",
                      color: "#1e293b",
                    }}
                  >
                    {currentSong.artist}
                  </span>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <span
                    style={{
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Type:
                  </span>
                  <span
                    style={{
                      marginLeft: "8px",
                      color: "#1e293b",
                      textTransform: "capitalize",
                    }}
                  >
                    {currentSong.songType}
                  </span>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <span
                    style={{
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Genre:
                  </span>
                  <span
                    style={{
                      marginLeft: "8px",
                      color: "#1e293b",
                    }}
                  >
                    {currentSong.genre}
                  </span>
                </div>

                <div>
                  <span
                    style={{
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Created:
                  </span>
                  <span
                    style={{
                      marginLeft: "8px",
                      color: "#1e293b",
                    }}
                  >
                    {new Date(currentSong.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <Button
                variant="secondary"
                onClick={handleCloseModal}
                style={{ width: "100%" }}
              >
                Close
              </Button>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && songToDelete && (
          <ModalOverlay>
            <ModalContent style={{ padding: "24px", maxWidth: "400px" }}>
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    fontSize: "48px",
                    marginBottom: "16px",
                  }}
                >
                  ⚠️
                </div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#dc2626",
                    margin: "0 0 8px 0",
                  }}
                >
                  Delete Song
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                    margin: "0 0 16px 0",
                    lineHeight: "1.5",
                  }}
                >
                  Are you sure you want to delete this song? This action cannot
                  be undone.
                </p>
                <div
                  style={{
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "600",
                      color: "#dc2626",
                      fontSize: "14px",
                      marginBottom: "4px",
                    }}
                  >
                    "{songToDelete.title}"
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#7f1d1d",
                    }}
                  >
                    by {songToDelete.artist} • {songToDelete.genre}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <Button
                  variant="secondary"
                  onClick={cancelDelete}
                  disabled={loading.delete}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    fontSize: "14px",
                    fontWeight: "600",
                    borderRadius: "6px",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    color: "#64748b",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={confirmDelete}
                  disabled={loading.delete}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    fontSize: "14px",
                    fontWeight: "600",
                    borderRadius: "6px",
                    backgroundColor: "#dc2626",
                    border: "1px solid #dc2626",
                    color: "#ffffff",
                  }}
                >
                  {loading.delete ? (
                    <>
                      <Spinner />
                      <span style={{ marginLeft: "8px" }}>Deleting...</span>
                    </>
                  ) : (
                    "Delete Song"
                  )}
                </Button>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
}
