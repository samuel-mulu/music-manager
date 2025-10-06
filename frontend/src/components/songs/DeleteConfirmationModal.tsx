import React from "react";
import { Button, ModalOverlay, ModalContent, Spinner } from "../ui";
import { Song } from "../../types/song.types";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  song: Song | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal: React.FC<
  DeleteConfirmationModalProps
> = ({ isOpen, song, isDeleting, onConfirm, onCancel }) => {
  if (!isOpen || !song) return null;

  return (
    <ModalOverlay onClick={onCancel}>
      <ModalContent
        style={{ padding: "24px", maxWidth: "400px" }}
        onClick={(e) => e.stopPropagation()}
      >
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
            Are you sure you want to delete this song? This action cannot be
            undone.
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
              "{song.title}"
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#7f1d1d",
              }}
            >
              by {song.artist} • {song.genre}
              {song.songType === "album" && song.album && ` • ${song.album}`}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isDeleting}
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
            onClick={onConfirm}
            disabled={isDeleting}
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
            {isDeleting ? (
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
  );
};
