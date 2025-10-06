import React from "react";
import { Button, ModalOverlay, ModalContent } from "../ui";
import { Song } from "../../types/song.types";

interface SongDetailsModalProps {
  song: Song | null;
  onClose: () => void;
}

export const SongDetailsModal: React.FC<SongDetailsModalProps> = ({
  song,
  onClose,
}) => {
  if (!song) return null;

  // Debug logging for song data
  console.log("🎵 Song Details Modal - Song data:", song);
  console.log("🎵 Song Details Modal - Environment:", process.env.NODE_ENV);

  return (
    <ModalOverlay onClick={onClose}>
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
              {song.title}
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
              {song.artist}
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
              {song.songType}
            </span>
          </div>

          {song.songType === "album" && song.album && (
            <div style={{ marginBottom: "16px" }}>
              <span
                style={{
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Album:
              </span>
              <span
                style={{
                  marginLeft: "8px",
                  color: "#1e293b",
                }}
              >
                {song.album}
              </span>
            </div>
          )}

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
              {song.genre}
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
              {new Date(song.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <Button variant="secondary" onClick={onClose} style={{ width: "100%" }}>
          Close
        </Button>
      </ModalContent>
    </ModalOverlay>
  );
};
