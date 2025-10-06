import React from "react";
import { Card, Badge } from "../ui";
import { ArtistDistribution } from "../../types/socket.types";

interface ArtistBreakdownProps {
  artists: ArtistDistribution[];
}

export const ArtistBreakdown: React.FC<ArtistBreakdownProps> = ({
  artists,
}) => {
  // Calculate total songs for percentage calculation
  const totalSongs = artists.reduce(
    (sum, artist) => sum + (artist.songCount || 0),
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
        🎤 Artists & Their Songs/Albums
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
        {artists.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            No artist data available
          </div>
        ) : (
          artists.map((artist, index) => {
            const percentage =
              totalSongs > 0
                ? Math.round(((artist.songCount || 0) / totalSongs) * 100)
                : 0;
            return (
              <div
                key={artist._id || artist.artist || index}
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
                  <Badge variant="success">{index + 1}</Badge>
                  <div>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "#1e293b",
                        fontSize: "14px",
                      }}
                    >
                      {artist.artist || artist._id || "Unknown Artist"}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#64748b",
                      }}
                    >
                      {artist.singleCount || 0} singles •{" "}
                      {artist.albumCount || 0} albums
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
                    {artist.songCount || 0} songs
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
