import React from "react";
import { Button } from "../ui";

interface EmptyStateProps {
  searchTerm: string;
  onAddNewSong: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  searchTerm,
  onAddNewSong,
}) => {
  return (
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
        onClick={onAddNewSong}
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
  );
};
