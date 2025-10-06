import React from "react";
import { Card, Badge } from "../ui";
import { SongTypeDistribution } from "../../types/socket.types";

interface SongTypeBreakdownProps {
  songTypes: SongTypeDistribution[];
}

export const SongTypeBreakdown: React.FC<SongTypeBreakdownProps> = ({
  songTypes,
}) => {
  // Calculate total songs for percentage calculation
  const totalSongs = songTypes.reduce(
    (sum, type) => sum + (type.count || 0),
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
        🎵 Songs by Type
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
        {songTypes.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            No song type data available
          </div>
        ) : (
          songTypes.map((type, index) => {
            const percentage =
              totalSongs > 0 ? Math.round((type.count / totalSongs) * 100) : 0;
            const typeName = type._id || "Unknown Type";
            return (
              <div
                key={type._id || index}
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
                  <Badge variant="warning">{index + 1}</Badge>
                  <div>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "#1e293b",
                        fontSize: "14px",
                      }}
                    >
                      {typeName === "null" || typeName === null
                        ? "No Type"
                        : typeName}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#64748b",
                      }}
                    >
                      Song Type
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
                    {type.count || 0} songs
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
