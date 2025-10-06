import React from "react";
import { Card, Badge } from "../ui";
import { GenreDistribution } from "../../types/socket.types";

interface GenreBreakdownProps {
  genres: GenreDistribution[];
}

export const GenreBreakdown: React.FC<GenreBreakdownProps> = ({ genres }) => {
  // Calculate total songs for percentage calculation
  const totalSongs = genres.reduce(
    (sum, genre) => sum + (genre.totalCount || 0),
    0
  );

  return (
    <Card style={{ padding: "16px", height: "320px" }}>
      <h3
        style={{
          fontSize: "16px",
          fontWeight: "600",
          color: "#1e293b",
          margin: "0 0 16px 0",
        }}
      >
        📊 Songs by Genre
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          height: "240px",
          overflowY: "auto",
          paddingRight: "6px",
        }}
      >
        {genres.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            No genre data available
          </div>
        ) : (
          genres.map((genre, index) => {
            const percentage =
              totalSongs > 0
                ? Math.round((genre.totalCount / totalSongs) * 100)
                : 0;
            return (
              <div
                key={genre._id || index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f1f5f9";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Badge variant="primary">{index + 1}</Badge>
                  <div>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "#1e293b",
                        fontSize: "14px",
                      }}
                    >
                      {genre._id || "Unknown Genre"}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#64748b",
                      }}
                    >
                      {genre.singleCount || 0} singles • {genre.albumCount || 0}{" "}
                      albums
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontWeight: "600",
                      color: "#1e293b",
                      fontSize: "16px",
                    }}
                  >
                    {genre.totalCount || 0} songs
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                    }}
                  >
                    {percentage}% of total
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
