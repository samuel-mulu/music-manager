import React from "react";
import { Card } from "../ui";
import { SongStats } from "../../types/stats.types";

interface InsightsProps {
  stats: SongStats;
}

export const Insights: React.FC<InsightsProps> = ({ stats }) => (
  <Card style={{ padding: "16px" }}>
    <h3
      style={{
        fontSize: "16px",
        fontWeight: "600",
        color: "#1e293b",
        margin: "0 0 16px 0",
      }}
    >
      💡 Key Insights
    </h3>
    <div style={{ display: "grid", gap: "12px" }}>
      <div
        style={{
          padding: "12px",
          backgroundColor: "#f0f9ff",
          borderRadius: "6px",
          border: "1px solid #bae6fd",
        }}
      >
        <div
          style={{
            fontWeight: "600",
            color: "#0c4a6e",
            marginBottom: "4px",
          }}
        >
          🏆 Most Popular Genre
        </div>
        <div style={{ color: "#0369a1" }}>
          {stats.insights?.topGenre?.genre || "N/A"} (
          {stats.insights?.topGenre?.totalCount || 0} songs)
        </div>
      </div>

      <div
        style={{
          padding: "12px",
          backgroundColor: "#f0fdf4",
          borderRadius: "6px",
          border: "1px solid #bbf7d0",
        }}
      >
        <div
          style={{
            fontWeight: "600",
            color: "#166534",
            marginBottom: "4px",
          }}
        >
          🎵 Most Prolific Artist
        </div>
        <div style={{ color: "#15803d" }}>
          {stats.insights?.topArtist?.artist || "N/A"} (
          {stats.insights?.topArtist?.songCount || 0} songs)
        </div>
      </div>

      <div
        style={{
          padding: "12px",
          backgroundColor: "#fffbeb",
          borderRadius: "6px",
          border: "1px solid #fed7aa",
        }}
      >
        <div
          style={{
            fontWeight: "600",
            color: "#92400e",
            marginBottom: "4px",
          }}
        >
          📈 Average Distribution
        </div>
        <div style={{ color: "#d97706" }}>
          {stats.insights?.averageSongsPerArtist || 0} songs per artist •{" "}
          {stats.insights?.averageSongsPerGenre || 0} songs per genre
        </div>
      </div>
    </div>
  </Card>
);
