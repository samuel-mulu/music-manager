import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import {
  fetchSongsRequest,
  createSongRequest,
  updateSongRequest,
  deleteSongRequest,
  clearError,
  setCurrentSong,
} from "./songsSlice";
import { Song, CreateSongRequest } from "../../types/song.types";
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
} from "../../components/ui";

export default function SongList() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error, currentSong } = useSelector(
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
  };

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
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
  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(fetchSongsRequest());
  }, [dispatch]);

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

  const handleDeleteSong = (id: string) => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      dispatch(deleteSongRequest(id));
    }
  };

  const handleViewSong = (song: Song) => {
    dispatch(setCurrentSong(song));
  };

  const handleCloseModal = () => {
    setCurrentSong(null);
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  // Filter and search functions
  const filteredSongs = list.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAlbum =
      selectedAlbum === "all" || song.songType === selectedAlbum;
    const matchesGenre =
      selectedGenre === "all" ||
      song.genre.toLowerCase() === selectedGenre.toLowerCase();

    return matchesSearch && matchesAlbum && matchesGenre;
  });

  const sortedSongs = [...filteredSongs].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "artist":
        return a.artist.localeCompare(b.artist);
      case "genre":
        return a.genre.localeCompare(b.genre);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedSongs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSongs = sortedSongs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedAlbum("all");
    setSelectedGenre("all");
    setSortBy("title");
    setCurrentPage(1);
  };

  // Get unique genres and albums for filter dropdowns
  const uniqueGenres = Array.from(new Set(list.map((song) => song.genre)));
  const uniqueAlbums = Array.from(new Set(list.map((song) => song.songType)));

  if (loading.fetch)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Spinner />
          <span style={{ fontSize: "18px", color: "#64748b" }}>
            Loading songs...
          </span>
        </div>
      </div>
    );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>🎵</span>
          <h2
            style={{
              fontSize: "25px",
              fontWeight: "700",
              color: "#1e293b",
              margin: 0,
            }}
          >
            Song List
          </h2>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setShowCreateForm(true)}
        >
          Add New Song
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" style={{ marginBottom: "24px" }}>
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

      {/* Filter and Search Section */}
      <Card style={{ padding: "24px", marginBottom: "32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            alignItems: "end",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Title
            </label>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="title">Sort by Title</option>
              <option value="artist">Sort by Artist</option>
              <option value="genre">Sort by Genre</option>
            </Select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Search
            </label>
            <Input
              placeholder="Search by title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Albums
            </label>
            <Select
              value={selectedAlbum}
              onChange={(e) => setSelectedAlbum(e.target.value)}
            >
              <option value="all">All Albums</option>
              {uniqueAlbums.map((album) => (
                <option key={album} value={album}>
                  {album.charAt(0).toUpperCase() + album.slice(1)}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Genres
            </label>
            <Select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="all">All Genres</option>
              {uniqueGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Button
              variant="secondary"
              onClick={clearFilters}
              style={{ width: "100%" }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Songs Grid */}
      {paginatedSongs.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {paginatedSongs.map((song: Song) => (
            <Card key={song._id} hover={true} style={{ padding: "24px" }}>
              <div style={{ marginBottom: "16px" }}>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#1e293b",
                    margin: "0 0 8px 0",
                  }}
                >
                  {song.title}
                </h3>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#64748b",
                    margin: "0 0 8px 0",
                  }}
                >
                  <strong>Artist:</strong> {song.artist}
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#64748b",
                    margin: "0 0 8px 0",
                  }}
                >
                  <strong>Genre:</strong> {song.genre}
                </p>
                <div style={{ marginBottom: "16px" }}>
                  <Badge variant="primary">
                    {song.songType.charAt(0).toUpperCase() +
                      song.songType.slice(1)}
                  </Badge>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                }}
              >
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleViewSong(song)}
                  style={{ flex: 1 }}
                >
                  View
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEditSong(song)}
                  style={{ flex: 1 }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteSong(song._id)}
                  disabled={loading.delete}
                  style={{ flex: 1 }}
                >
                  {loading.delete ? <Spinner /> : "Delete"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card
          style={{
            padding: "48px",
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <p
            style={{
              fontSize: "18px",
              color: "#64748b",
              margin: 0,
            }}
          >
            No songs found
          </p>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Button
            variant="secondary"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <span
            style={{
              fontSize: "16px",
              color: "#64748b",
              fontWeight: "500",
            }}
          >
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="secondary"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <ModalOverlay>
          <ModalContent style={{ padding: "32px" }}>
            <h3
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#1e293b",
                margin: "0 0 24px 0",
              }}
            >
              {editingSong ? "Edit Song" : "Add New Song"}
            </h3>

            <form onSubmit={editingSong ? handleUpdateSong : handleCreateSong}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
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

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
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

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
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

              <div style={{ marginBottom: "32px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
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
          <ModalContent style={{ padding: "32px" }}>
            <h3
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#1e293b",
                margin: "0 0 24px 0",
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
    </div>
  );
}
