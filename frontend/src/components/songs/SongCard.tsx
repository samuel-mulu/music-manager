import React from "react";
import { Button, Badge, Spinner } from "../ui";
import { Song } from "../../types/song.types";

interface SongCardProps {
  song: Song;
  onView: (song: Song) => void;
  onEdit: (song: Song) => void;
  onDelete: (song: Song) => void;
  isDeleting: boolean;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  onView,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  return (
    <div
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
        e.currentTarget.style.boxShadow = "0 4px 12px 0 rgba(0, 0, 0, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
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
            variant={song.songType === "single" ? "primary" : "success"}
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
          {song.songType === "album" && song.album && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              <span>💿</span>
              <span>{song.album}</span>
            </div>
          )}
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
            <span>{new Date(song.createdAt).toLocaleDateString()}</span>
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
            onClick={() => onView(song)}
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
            onClick={() => onEdit(song)}
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
            onClick={() => onDelete(song)}
            disabled={isDeleting}
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
              opacity: isDeleting ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.backgroundColor = "#fef2f2";
                e.currentTarget.style.borderColor = "#fecaca";
                e.currentTarget.style.color = "#dc2626";
              }
            }}
            onMouseLeave={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.color = "#64748b";
              }
            }}
          >
            {isDeleting ? <Spinner /> : "🗑️ Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};
