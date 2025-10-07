import React from "react";
import { Button, Input, Select } from "../ui";

interface FilterSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchType: string;
  onSearchTypeChange: (value: string) => void;
  isSearching: boolean;
  sortBy: string;
  onSortChange: (value: string) => void;
  selectedSongType: string;
  onSongTypeChange: (value: string) => void;
  selectedGenre: string;
  onGenreChange: (value: string) => void;
  selectedAlbumName: string;
  onAlbumNameChange: (value: string) => void;
  uniqueGenres: string[];
  uniqueSongTypes: string[];
  uniqueAlbumNames: string[];
  onClearFilters: () => void;
  onAddNewSong: () => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  searchTerm,
  onSearchChange,
  searchType,
  onSearchTypeChange,
  isSearching,
  sortBy,
  onSortChange,
  selectedSongType,
  onSongTypeChange,
  selectedGenre,
  onGenreChange,
  selectedAlbumName,
  onAlbumNameChange,
  uniqueGenres,
  uniqueSongTypes,
  uniqueAlbumNames,
  onClearFilters,
  onAddNewSong,
}) => {
  return (
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
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Button
            variant="secondary"
            onClick={onClearFilters}
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
            onClick={onAddNewSong}
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
        {/* Search Section */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.3px",
            }}
          >
            By
          </label>
          <div style={{ display: "flex", gap: "2px" }}>
            {/* Search Type Dropdown - Now larger */}
            <Select
              value={searchType}
              onChange={(e) => onSearchTypeChange(e.target.value)}
              style={{
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                fontSize: "13px",
                height: "36px",
                flex: 1,
                backgroundColor: "#ffffff",
              }}
            >
              <option value="title">Title</option>
              <option value="artist">Artist</option>
              <option value="album">Album</option>
              <option value="genre">Genre</option>
            </Select>

            {/* Search Input - Now smaller */}
            <div
              style={{
                position: "relative",
                minWidth: "0px",
                maxWidth: "300px",
              }}
            >
              <Input
                placeholder={`Search by ${searchType}...`}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{
                  paddingLeft: "32px",
                  paddingRight: isSearching ? "32px" : "12px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                  height: "36px",
                  width: "100%",
                }}
              />
              {isSearching && (
                <div
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "16px",
                    height: "16px",
                    border: "2px solid #e5e7eb",
                    borderTop: "2px solid #3b82f6",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
              )}
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
        </div>

        {/* Sort Dropdown */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "2px",
              textTransform: "uppercase",
              letterSpacing: "0.3px",
            }}
          >
            Sort By
          </label>
          <Select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            style={{
              borderRadius: "60px",
              border: "0px solid #d1d5db",
              fontSize: "12px",
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
              marginBottom: "3px",
              textTransform: "uppercase",
              letterSpacing: "0.3px",
            }}
          >
            Song Type
          </label>
          <Select
            value={selectedSongType}
            onChange={(e) => onSongTypeChange(e.target.value)}
            style={{
              borderRadius: "60px",
              border: "0px solid #d1d5db",
              fontSize: "12px",
              height: "50px",
            }}
          >
            <option value="all">All Types</option>
            <option value="single">Single</option>
            <option value="album">Album</option>
          </Select>
        </div>

        {/* Album Name Filter - Only show when song type is album */}
        {selectedSongType === "album" && (
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
              Album Name
              <span
                style={{
                  fontSize: "10px",
                  color: "#6b7280",
                  fontWeight: "400",
                  marginLeft: "4px",
                }}
              >
                (filtered by album type)
              </span>
            </label>
            <Select
              value={selectedAlbumName}
              onChange={(e) => onAlbumNameChange(e.target.value)}
              style={{
                borderRadius: "60px",
                border: "0px solid #d1d5db",
                fontSize: "12px",
                height: "50px",
              }}
            >
              <option value="all">All Albums</option>
              {uniqueAlbumNames.length > 0 ? (
                uniqueAlbumNames.sort().map((albumName) => (
                  <option key={albumName} value={albumName}>
                    {albumName}
                  </option>
                ))
              ) : (
                <option value="no-albums" disabled>
                  No albums found
                </option>
              )}
            </Select>
          </div>
        )}

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
            onChange={(e) => onGenreChange(e.target.value)}
            style={{
              borderRadius: "60px",
              border: "0px solid #d1d5db",
              fontSize: "12px",
              height: "50px",
            }}
          >
            <option value="all">All Genres</option>
            {uniqueGenres.sort().map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};
