import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";

// Version: 2025-01-06-v3 - Force cache bust
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
import { Alert, Button } from "../components/ui";
import {
  FilterSection,
  SongCard,
  SongForm,
  Pagination,
  SongDetailsModal,
  DeleteConfirmationModal,
  EmptyState,
} from "../components/songs";

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

  // Form and modal states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);
  const [deletingSongId, setDeletingSongId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateSongRequest>({
    title: "",
    artist: "",
    songType: "single",
    genre: "",
    album: "",
  });

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title"); // Default to title search
  const [selectedSongType, setSelectedSongType] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedAlbumName, setSelectedAlbumName] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [allSongsForFilters, setAllSongsForFilters] = useState<Song[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const itemsPerPage = 6;

  // Fetch all songs for filter options (without pagination/filters)
  useEffect(() => {
    const fetchAllSongsForFilters = async () => {
      try {
        const response = await fetch(
          `${
            process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"
          }/api/v1/songs?limit=1000`
        );
        const data = await response.json();
        if (data.success) {
          setAllSongsForFilters(data.data);
          console.log("📊 Fetched all songs for filters:", data.data.length);
        }
      } catch (error) {
        console.error("Failed to fetch all songs for filters:", error);
      }
    };

    fetchAllSongsForFilters();
  }, []);

  // Main effect for fetching songs
  useEffect(() => {
    const requestParams = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      searchType: searchType,
      genre: selectedGenre !== "all" ? selectedGenre : undefined,
      songType: selectedSongType !== "all" ? selectedSongType : undefined,
      album: selectedAlbumName !== "all" ? selectedAlbumName : undefined,
      sort:
        sortBy === "title"
          ? "title"
          : sortBy === "artist"
          ? "artist"
          : sortBy === "genre"
          ? "genre"
          : "-createdAt",
    };

    console.log("🔍 Fetching songs with params:", requestParams);
    dispatch(fetchSongsRequest(requestParams));

    dispatch(connectSocket());
    return () => {
      dispatch(disconnectSocket());
    };
  }, [
    dispatch,
    currentPage,
    sortBy,
    selectedGenre,
    selectedSongType,
    selectedAlbumName,
    searchTerm,
    searchType,
  ]);

  // Debounced search effect
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      const searchParams = {
        page: 1,
        limit: itemsPerPage,
        search: searchTerm,
        searchType: searchType,
        genre: selectedGenre !== "all" ? selectedGenre : undefined,
        songType: selectedSongType !== "all" ? selectedSongType : undefined,
        album: selectedAlbumName !== "all" ? selectedAlbumName : undefined,
        sort:
          sortBy === "title"
            ? "title"
            : sortBy === "artist"
            ? "artist"
            : sortBy === "genre"
            ? "genre"
            : "-createdAt",
      };

      console.log("🔍 Debounced search with params:", searchParams);
      dispatch(fetchSongsRequest(searchParams));
      setIsSearching(false);
    }, 800);

    return () => {
      clearTimeout(timeoutId);
      setIsSearching(false);
    };
  }, [
    searchTerm,
    searchType,
    dispatch,
    selectedGenre,
    selectedSongType,
    selectedAlbumName,
    sortBy,
  ]);

  // Clear deleting state when delete operation completes
  useEffect(() => {
    if (deletingSongId && !loading.delete) {
      setDeletingSongId(null);
    }
  }, [loading.delete, deletingSongId]);

  // Event handlers
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

    if (
      formData.songType === "album" &&
      (!formData.album || formData.album.trim() === "")
    ) {
      alert("Album name is required when song type is 'album'");
      return;
    }

    dispatch(createSongRequest(formData));
    setFormData({
      title: "",
      artist: "",
      songType: "single",
      genre: "",
      album: "",
    });
    setShowCreateForm(false);
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setFormData({
      title: song.title,
      artist: song.artist,
      songType: song.songType,
      genre: song.genre,
      album: song.album || "",
    });
    setShowCreateForm(true);
  };

  const handleUpdateSong = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.songType === "album" &&
      (!formData.album || formData.album.trim() === "")
    ) {
      alert("Album name is required when song type is 'album'");
      return;
    }

    if (editingSong) {
      dispatch(updateSongRequest({ id: editingSong._id, data: formData }));
      setEditingSong(null);
      setFormData({
        title: "",
        artist: "",
        songType: "single",
        genre: "",
        album: "",
      });
      setShowCreateForm(false);
    }
  };

  const handleDeleteSong = (song: Song) => {
    if (deletingSongId === song._id) {
      return;
    }
    setSongToDelete(song);
    setDeletingSongId(song._id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (songToDelete) {
      dispatch(deleteSongRequest(songToDelete._id));
      setShowDeleteModal(false);
      setSongToDelete(null);
      setDeletingSongId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSongToDelete(null);
    setDeletingSongId(null);
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

  // Filter handlers
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    dispatch(
      fetchSongsRequest({
        page: newPage,
        limit: itemsPerPage,
        search: searchTerm,
        searchType: searchType,
        genre: selectedGenre !== "all" ? selectedGenre : undefined,
        songType: selectedSongType !== "all" ? selectedSongType : undefined,
        album: selectedAlbumName !== "all" ? selectedAlbumName : undefined,
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

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const handleSearchTypeChange = (searchType: string) => {
    setSearchType(searchType);
    setCurrentPage(1);
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  const handleSongTypeChange = (songType: string) => {
    setSelectedSongType(songType);
    setSelectedAlbumName("all");
    setCurrentPage(1);
  };

  const handleAlbumNameChange = (albumName: string) => {
    setSelectedAlbumName(albumName);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSearchType("title");
    setSelectedSongType("all");
    setSelectedGenre("all");
    setSelectedAlbumName("all");
    setSortBy("title");
    setCurrentPage(1);
    dispatch(
      fetchSongsRequest({
        page: 1,
        limit: itemsPerPage,
        sort: "title",
      })
    );
  };

  // Get unique values for filters - we need to get these from all songs, not just filtered ones
  // Use all songs for filter options to ensure consistent filter options
  const uniqueGenres = Array.from(
    new Set(allSongsForFilters.map((song) => song.genre))
  ).sort();
  const uniqueSongTypes = ["single", "album"]; // Fixed options for song types

  // Fix: Use all songs for filter options, not just current page
  const uniqueAlbumNames = Array.from(
    new Set(
      allSongsForFilters
        .filter(
          (song) =>
            song.songType === "album" && song.album && song.album.trim() !== ""
        )
        .map((song) => song.album!.trim())
    )
  ).sort();

  // Debug logging
  console.log("🔍 Album Filter Debug:", {
    totalSongs: list.length,
    allSongsForFilters: allSongsForFilters.length,
    albumSongs: list.filter((song) => song.songType === "album").length,
    albumSongsWithNames: list.filter(
      (song) => song.songType === "album" && song.album
    ).length,
    uniqueAlbumNames,
    selectedSongType,
    shouldShowFilter: selectedSongType === "album",
    sampleAlbumSongs: allSongsForFilters
      .filter((song) => song.songType === "album")
      .slice(0, 3)
      .map((song) => ({
        title: song.title,
        songType: song.songType,
        album: song.album,
        hasAlbum: !!song.album,
      })),
  });

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

        {/* Filter Section */}
        <FilterSection
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          searchType={searchType}
          onSearchTypeChange={handleSearchTypeChange}
          isSearching={isSearching}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          selectedSongType={selectedSongType}
          onSongTypeChange={handleSongTypeChange}
          selectedGenre={selectedGenre}
          onGenreChange={handleGenreChange}
          selectedAlbumName={selectedAlbumName}
          onAlbumNameChange={handleAlbumNameChange}
          uniqueGenres={uniqueGenres}
          uniqueSongTypes={uniqueSongTypes}
          uniqueAlbumNames={uniqueAlbumNames}
          onClearFilters={clearFilters}
          onAddNewSong={() => setShowCreateForm(true)}
        />

        {/* Songs Grid */}
        {list.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {list.map((song: Song) => (
              <SongCard
                key={song._id}
                song={song}
                onView={handleViewSong}
                onEdit={handleEditSong}
                onDelete={handleDeleteSong}
                isDeleting={deletingSongId === song._id}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            searchTerm={searchTerm}
            onAddNewSong={() => setShowCreateForm(true)}
          />
        )}

        {/* Pagination */}
        {pagination && pagination.total !== undefined && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
            onPageChange={handlePageChange}
          />
        )}

        {/* Song Form Modal */}
        <SongForm
          isOpen={showCreateForm}
          isEditing={!!editingSong}
          formData={formData}
          loading={loading.create || loading.update}
          onInputChange={handleInputChange}
          onSubmit={editingSong ? handleUpdateSong : handleCreateSong}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingSong(null);
            setFormData({
              title: "",
              artist: "",
              songType: "single",
              genre: "",
              album: "",
            });
          }}
        />

        {/* Song Details Modal */}
        <SongDetailsModal song={currentSong} onClose={handleCloseModal} />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          song={songToDelete}
          isDeleting={deletingSongId !== null}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
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
