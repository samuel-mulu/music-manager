import React from "react";
import {
  Button,
  Input,
  Select,
  ModalOverlay,
  ModalContent,
  Spinner,
} from "../ui";
import { CreateSongRequest } from "../../types/song.types";

interface SongFormProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: CreateSongRequest;
  loading: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const SongForm: React.FC<SongFormProps> = ({
  isOpen,
  isEditing,
  formData,
  loading,
  onInputChange,
  onSubmit,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onCancel}>
      <ModalContent
        style={{ padding: "24px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#1e293b",
            margin: "0 0 20px 0",
          }}
        >
          {isEditing ? "Edit Song" : "Add New Song"}
        </h3>

        <form onSubmit={onSubmit}>
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
            >
              <option value="single">Single</option>
              <option value="album">Album</option>
            </Select>
          </div>

          {/* Album Name Field - Only show when song type is album */}
          {formData.songType === "album" && (
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
                Album Name <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <Input
                type="text"
                name="album"
                value={formData.album || ""}
                onChange={onInputChange}
                placeholder="Enter album name (required for album songs)"
                required={formData.songType === "album"}
                style={{
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                  height: "36px",
                }}
              />
              <div
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  marginTop: "4px",
                }}
              >
                💡 Album name is required when song type is "album"
              </div>
            </div>
          )}

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
              onChange={onInputChange}
              required
            />
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? (
                <>
                  <Spinner />
                  <span style={{ marginLeft: "8px" }}>
                    {isEditing ? "Updating..." : "Creating..."}
                  </span>
                </>
              ) : isEditing ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};
