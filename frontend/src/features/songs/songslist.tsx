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

  if (loading.fetch)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading songs...</div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Songs</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add New Song
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={handleClearError}
            className="text-red-700 hover:text-red-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-full mx-4 shadow-2xl border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {editingSong ? "Edit Song" : "Add New Song"}
            </h3>
            <form onSubmit={editingSong ? handleUpdateSong : handleCreateSong}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Artist
                </label>
                <input
                  type="text"
                  name="artist"
                  value={formData.artist}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Song Type
                </label>
                <select
                  name="songType"
                  value={formData.songType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                >
                  <option value="single">Single</option>
                  <option value="album">Album</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre
                </label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading.create || loading.update}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 px-4 rounded-md transition-colors"
                >
                  {loading.create || loading.update
                    ? "Saving..."
                    : editingSong
                    ? "Update"
                    : "Create"}
                </button>
                <button
                  type="button"
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
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Song Details Modal */}
      {currentSong && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-full mx-4 shadow-2xl border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Song Details
            </h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Title:</span>
                <span className="ml-2 text-gray-900">{currentSong.title}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Artist:</span>
                <span className="ml-2 text-gray-900">{currentSong.artist}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <span className="ml-2 text-gray-900 capitalize">
                  {currentSong.songType}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Genre:</span>
                <span className="ml-2 text-gray-900">{currentSong.genre}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Created:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(currentSong.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={handleCloseModal}
              className="mt-6 w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Songs List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((song: Song) => (
          <div
            key={song._id}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {song.title}
            </h3>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Artist:</span> {song.artist}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Genre:</span> {song.genre}
            </p>
            <p className="text-gray-600 mb-4">
              <span className="font-medium">Type:</span>
              <span className="ml-1 capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {song.songType}
              </span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleViewSong(song)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm transition-colors"
              >
                View
              </button>
              <button
                onClick={() => handleEditSong(song)}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded text-sm transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteSong(song._id)}
                disabled={loading.delete}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-1 px-3 rounded text-sm transition-colors"
              >
                {loading.delete ? "..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {list.length === 0 && !loading.fetch && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No songs found. Add your first song!
          </p>
        </div>
      )}
    </div>
  );
}
