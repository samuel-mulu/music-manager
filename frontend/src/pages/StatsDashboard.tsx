import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  fetchStatsRequest,
  fetchRecentSongsRequest,
  clearStatsError,
} from "../features/stats/statsSlice";
import {
  SongStats,
  GenreStats,
  ArtistStats,
  RecentSong,
} from "../types/stats.types";
import { Card, Button, Spinner, Alert, Badge } from "../components/ui";

// Statistics Card Component
const StatCard: React.FC<{
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: string;
  color?: "primary" | "success" | "warning" | "info";
}> = ({ title, value, subtitle, icon, color = "primary" }) => {
  const colorClasses = {
    primary: { bg: "#dbeafe", text: "#1e40af", border: "#3b82f6" },
    success: { bg: "#d1fae5", text: "#065f46", border: "#10b981" },
    warning: { bg: "#fef3c7", text: "#92400e", border: "#f59e0b" },
    info: { bg: "#e0f2fe", text: "#0c4a6e", border: "#06b6d4" },
  };

  const colors = colorClasses[color];

  return (
    <Card style={{ padding: "12px", textAlign: "center" }}>
      <div style={{ marginBottom: "8px" }}>
        {icon && (
          <div
            style={{
              fontSize: "18px",
              marginBottom: "4px",
            }}
          >
            {icon}
          </div>
        )}
        <h3
          style={{
            fontSize: "10px",
            fontWeight: "500",
            color: "#64748b",
            margin: "0 0 4px 0",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {title}
        </h3>
        <div
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: colors.text,
            margin: "0 0 4px 0",
          }}
        >
          {value}
        </div>
        {subtitle && (
          <p
            style={{
              fontSize: "9px",
              color: "#64748b",
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  );
};

// Genre Breakdown Component
const GenreBreakdown: React.FC<{ genres: any[] }> = ({ genres }) => {
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

// Artist Breakdown Component
const ArtistBreakdown: React.FC<{ artists: any[] }> = ({ artists }) => {
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

// Recent Songs Component
const RecentSongs: React.FC<{ songs: RecentSong[] }> = ({ songs }) => (
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
                  {song.album && ` • ${song.album}`}
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

// Song Type Breakdown Component (since we have songsPerType data)
const SongTypeBreakdown: React.FC<{ songTypes: any[] }> = ({ songTypes }) => {
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

// Insights Component
const Insights: React.FC<{ stats: SongStats }> = ({ stats }) => (
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

// Main Statistics Dashboard Component
export default function StatsDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: stats,
    recentSongs,
    loading,
    error,
  } = useSelector((state: RootState) => state.stats);

  useEffect(() => {
    dispatch(fetchStatsRequest());
    dispatch(fetchRecentSongsRequest());
  }, [dispatch]);

  const handleClearError = () => {
    dispatch(clearStatsError());
  };

  if (loading && !stats) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Spinner />
          <span style={{ fontSize: "18px", color: "#64748b" }}>
            Loading statistics...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" style={{ marginBottom: "24px" }}>
        <span>{error}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearError}
          style={{ marginLeft: "auto" }}
        >
          ✕
        </Button>
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Card style={{ padding: "48px", textAlign: "center" }}>
        <p style={{ fontSize: "18px", color: "#64748b", margin: 0 }}>
          No statistics available
        </p>
        <p style={{ fontSize: "14px", color: "#9ca3af", margin: "8px 0 0 0" }}>
          Loading statistics from server...
        </p>
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
      {/* Total Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <StatCard
          title="Total Songs"
          value={stats.totals?.songs || 0}
          icon="🎵"
          color="primary"
        />
        <StatCard
          title="Total Artists"
          value={stats.totals?.artists || 0}
          icon="🎤"
          color="success"
        />
        <StatCard
          title="Total Genres"
          value={stats.totals?.genres || 0}
          icon="🎭"
          color="warning"
        />
        <StatCard
          title="Single Songs"
          value={stats.totals?.singleSongs || 0}
          subtitle={
            stats.totals?.songs
              ? `${Math.round(
                  (stats.totals.singleSongs / stats.totals.songs) * 100
                )}% of total`
              : "0% of total"
          }
          icon="🎶"
          color="info"
        />
        <StatCard
          title="Album Songs"
          value={stats.totals?.albumSongs || 0}
          subtitle={
            stats.totals?.songs
              ? `${Math.round(
                  (stats.totals.albumSongs / stats.totals.songs) * 100
                )}% of total`
              : "0% of total"
          }
          icon="💿"
          color="info"
        />
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <GenreBreakdown genres={stats.distribution?.songsPerGenre || []} />
        <ArtistBreakdown artists={stats.distribution?.songsPerArtist || []} />
      </div>

      {/* Song Type and Recent Songs Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <SongTypeBreakdown songTypes={stats.distribution?.songsPerType || []} />
        <RecentSongs songs={recentSongs} />
      </div>

      {/* Insights */}
      <Insights stats={stats} />

      {/* Metadata */}
      <Card style={{ padding: "12px", marginTop: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "11px",
            color: "#64748b",
          }}
        >
          <span>
            Last updated:{" "}
            {stats.metadata?.generatedAt
              ? new Date(stats.metadata.generatedAt).toLocaleString()
              : "N/A"}
          </span>
          <span>
            Data range:{" "}
            {stats.metadata?.dataRange?.from?.createdAt
              ? new Date(
                  stats.metadata.dataRange.from.createdAt
                ).toLocaleDateString()
              : "N/A"}{" "}
            -{" "}
            {stats.metadata?.dataRange?.to?.createdAt
              ? new Date(
                  stats.metadata.dataRange.to.createdAt
                ).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
      </Card>
    </div>
  );
}
