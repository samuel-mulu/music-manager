import React from "react";
import { Card, Badge } from "../ui";
import { RecentSong } from "../../types/stats.types";

interface RecentSongsProps {
  songs: RecentSong[];
}

export const RecentSongs: React.FC<RecentSongsProps> = ({ songs }) => (
  <Card style={{ padding: "16px" }}>
    <h3
      style={{
        fontSize: "16px",
        fontWeight: "600",
        color: "#1e293b",
        margin: "0 0 16px 0",
      }}
    >
      🆕 Recent Songs
    </h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {songs.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            color: "#64748b",
            fontSize: "13px",
          }}
        >
          No recent songs found
        </div>
      ) : (
        songs.map((song, index) => (
          <div
            key={song._id}
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Badge variant="primary">{index + 1}</Badge>
              <div>
                <div
                  style={{
                    fontWeight: "600",
                    color: "#1e293b",
                    fontSize: "14px",
                  }}
                >
                  {song.title}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  {song.artist} • {song.genre}
                  {song.songType === "album" &&
                    song.album &&
                    ` • ${song.album}`}
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                }}
              >
                {new Date(song.createdAt).toLocaleDateString()}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                }}
              >
                {song.duration && typeof song.duration === "number"
                  ? `${Math.floor(song.duration / 60)}:${(song.duration % 60)
                      .toString()
                      .padStart(2, "0")}`
                  : "--:--"}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </Card>
);
