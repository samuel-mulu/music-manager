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
  const [selectedSongType, setSelectedSongType] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedAlbumName, setSelectedAlbumName] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const itemsPerPage = 6;

  // Main effect for fetching songs
  useEffect(() => {
    dispatch(
      fetchSongsRequest({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
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
      dispatch(
        fetchSongsRequest({
          page: 1,
          limit: itemsPerPage,
          search: searchTerm,
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
      setIsSearching(false);
    }, 800);

    return () => {
      clearTimeout(timeoutId);
      setIsSearching(false);
    };
  }, [
    searchTerm,
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

  // Get unique values for filters
  const uniqueGenres = Array.from(new Set(list.map((song) => song.genre)));
  const uniqueSongTypes = Array.from(
    new Set(list.map((song) => song.songType))
  );
  const uniqueAlbumNames = Array.from(
    new Set(
      list
        .filter((song) => song.songType === "album" && song.album)
        .map((song) => song.album!)
    )
  );

  // Debug logging
  console.log("🔍 Album Filter Debug:", {
    totalSongs: list.length,
    albumSongs: list.filter((song) => song.songType === "album").length,
    albumSongsWithNames: list.filter(
      (song) => song.songType === "album" && song.album
    ).length,
    uniqueAlbumNames,
    selectedSongType,
    shouldShowFilter: selectedSongType === "album",
    sampleAlbumSongs: list
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
