import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import {
  fetchStatsRequest,
  fetchRecentSongsRequest,
  clearStatsError,
} from "./statsSlice";
import {
  SongStats,
  GenreStats,
  ArtistStats,
  RecentSong,
} from "../../types/stats.types";
import { Card, Button, Spinner, Alert, Badge } from "../../components/ui";

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
    <Card style={{ padding: "24px", textAlign: "center" }}>
      <div style={{ marginBottom: "16px" }}>
        {icon && (
          <div
            style={{
              fontSize: "32px",
              marginBottom: "8px",
            }}
          >
            {icon}
          </div>
        )}
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#64748b",
            margin: "0 0 8px 0",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {title}
        </h3>
        <div
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: colors.text,
            margin: "0 0 8px 0",
          }}
        >
          {value}
        </div>
        {subtitle && (
          <p
            style={{
              fontSize: "12px",
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
const GenreBreakdown: React.FC<{ genres: GenreStats[] }> = ({ genres }) => (
  <Card style={{ padding: "24px" }}>
    <h3
      style={{
        fontSize: "20px",
        fontWeight: "600",
        color: "#1e293b",
        margin: "0 0 20px 0",
      }}
    >
      📊 Songs by Genre
    </h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
        genres.map((genre, index) => (
          <div
            key={genre.genre}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Badge variant="primary">{index + 1}</Badge>
              <div>
                <div
                  style={{
                    fontWeight: "600",
                    color: "#1e293b",
                    fontSize: "16px",
                  }}
                >
                  {genre.genre}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  {genre.uniqueArtists} artists • {genre.singleCount} singles •{" "}
                  {genre.albumCount} albums
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontWeight: "600",
                  color: "#1e293b",
                  fontSize: "18px",
                }}
              >
                {genre.totalCount} songs
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                {genre.percentage}% of total
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </Card>
);

// Artist Breakdown Component
const ArtistBreakdown: React.FC<{ artists: ArtistStats[] }> = ({ artists }) => (
  <Card style={{ padding: "24px" }}>
    <h3
      style={{
        fontSize: "20px",
        fontWeight: "600",
        color: "#1e293b",
        margin: "0 0 20px 0",
      }}
    >
      🎤 Artists & Their Songs/Albums
    </h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
        artists.slice(0, 15).map((artist, index) => (
          <div
            key={artist.artist}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Badge variant="success">{index + 1}</Badge>
              <div>
                <div
                  style={{
                    fontWeight: "600",
                    color: "#1e293b",
                    fontSize: "16px",
                  }}
                >
                  {artist.artist}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  {artist.uniqueGenres} genres • {artist.singleCount} singles •{" "}
                  {artist.albumCount} albums
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontWeight: "600",
                  color: "#1e293b",
                  fontSize: "18px",
                }}
              >
                {artist.songCount} songs
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                {artist.percentage}% of total
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </Card>
);

// Recent Songs Component
const RecentSongs: React.FC<{ songs: RecentSong[] }> = ({ songs }) => (
  <Card style={{ padding: "24px" }}>
    <h3
      style={{
        fontSize: "20px",
        fontWeight: "600",
        color: "#1e293b",
        margin: "0 0 20px 0",
      }}
    >
      🆕 Recent Songs
    </h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {songs.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "24px",
            color: "#64748b",
            fontSize: "14px",
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
              padding: "12px",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Badge variant="primary">{index + 1}</Badge>
              <div>
                <div
                  style={{
                    fontWeight: "600",
                    color: "#1e293b",
                    fontSize: "16px",
                  }}
                >
                  {song.title}
                </div>
                <div
                  style={{
                    fontSize: "12px",
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
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                {new Date(song.createdAt).toLocaleDateString()}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                {Math.floor(song.duration / 60)}:
                {(song.duration % 60).toString().padStart(2, "0")}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </Card>
);

// Album Breakdown Component
const AlbumBreakdown: React.FC<{ stats: SongStats }> = ({ stats }) => {
  // Extract album data from the stats
  const albumData =
    stats.distribution?.songsPerArtist?.reduce(
      (acc: any[], artist: ArtistStats) => {
        // Group songs by album for each artist
        const albumGroups: { [key: string]: any[] } = {};

        artist.songs?.forEach((song: any) => {
          if (song.type === "album" && song.album) {
            if (!albumGroups[song.album]) {
              albumGroups[song.album] = [];
            }
            albumGroups[song.album].push(song);
          }
        });

        // Convert to album entries
        Object.entries(albumGroups).forEach(([albumName, songs]) => {
          acc.push({
            album: albumName,
            artist: artist.artist,
            songCount: songs.length,
            songs: songs,
            genre: songs[0]?.genre || "Unknown",
          });
        });

        return acc;
      },
      []
    ) || [];

  // Sort by song count descending
  const sortedAlbums = albumData.sort((a, b) => b.songCount - a.songCount);

  return (
    <Card style={{ padding: "24px" }}>
      <h3
        style={{
          fontSize: "20px",
          fontWeight: "600",
          color: "#1e293b",
          margin: "0 0 20px 0",
        }}
      >
        💿 Albums & Their Songs
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {sortedAlbums.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            No album data available
          </div>
        ) : (
          sortedAlbums.slice(0, 15).map((album, index) => (
            <div
              key={`${album.artist}-${album.album}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Badge variant="warning">{index + 1}</Badge>
                <div>
                  <div
                    style={{
                      fontWeight: "600",
                      color: "#1e293b",
                      fontSize: "16px",
                    }}
                  >
                    {album.album}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                    }}
                  >
                    {album.artist} • {album.genre}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontWeight: "600",
                    color: "#1e293b",
                    fontSize: "18px",
                  }}
                >
                  {album.songCount} songs
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  Album
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

// Insights Component
const Insights: React.FC<{ stats: SongStats }> = ({ stats }) => (
  <Card style={{ padding: "24px" }}>
    <h3
      style={{
        fontSize: "20px",
        fontWeight: "600",
        color: "#1e293b",
        margin: "0 0 20px 0",
      }}
    >
      💡 Key Insights
    </h3>
    <div style={{ display: "grid", gap: "16px" }}>
      <div
        style={{
          padding: "16px",
          backgroundColor: "#f0f9ff",
          borderRadius: "8px",
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
          padding: "16px",
          backgroundColor: "#f0fdf4",
          borderRadius: "8px",
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
          padding: "16px",
          backgroundColor: "#fffbeb",
          borderRadius: "8px",
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

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchStatsRequest());
    dispatch(fetchRecentSongsRequest());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    dispatch(fetchStatsRequest());
    dispatch(fetchRecentSongsRequest());
    setRefreshing(false);
  };

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

  // Debug logging
  console.log("Stats data:", stats);
  console.log("Stats distribution:", stats.distribution);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>📊</span>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#1e293b",
              margin: 0,
            }}
          >
            Statistics Dashboard
          </h2>
        </div>
        <Button variant="primary" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? <Spinner /> : "🔄 Refresh"}
        </Button>
      </div>

      {/* Total Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "24px",
          marginBottom: "32px",
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
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        <GenreBreakdown genres={stats.distribution?.songsPerGenre || []} />
        <ArtistBreakdown artists={stats.distribution?.songsPerArtist || []} />
      </div>

      {/* Album Breakdown Section */}
      <div style={{ marginBottom: "32px" }}>
        <AlbumBreakdown stats={stats} />
      </div>

      {/* Recent Songs Section */}
      <div style={{ marginBottom: "32px" }}>
        <RecentSongs songs={recentSongs} />
      </div>

      {/* Insights */}
      <Insights stats={stats} />

      {/* Metadata */}
      <Card style={{ padding: "16px", marginTop: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "12px",
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
