import React, { useEffect, useState } from "react";
import socketService from "../services/socketService";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  fetchStatsRequest,
  fetchRecentSongsRequest,
  clearStatsError,
  connectStatsSocket,
  disconnectStatsSocket,
  fetchStatsRequestSilent,
} from "../features/stats/statsSlice";
import { Card, Spinner, Alert, Button } from "../components/ui";
import {
  StatCard,
  GenreBreakdown,
  ArtistBreakdown,
  SongTypeBreakdown,
  RecentSongs,
  Insights,
  StatsMetadata,
} from "../components/stats";

// Main Statistics Dashboard Component
export default function StatsDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: stats,
    recentSongs,
    loading,
    error,
    lastUpdated,
  } = useSelector((state: RootState) => state.stats);

  const [socketConnected, setSocketConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pollingEnabled, setPollingEnabled] = useState(true);

  useEffect(() => {
    // Fetch initial stats data
    dispatch(fetchStatsRequest());
    dispatch(fetchRecentSongsRequest());

    // Connect to Socket.IO for real-time stats updates (reuses existing connection)
    dispatch(connectStatsSocket());

    // Listen for stats refresh events
    const handleStatsRefresh = () => {
      console.log("📊 Refreshing stats due to socket event");
      setIsRefreshing(true);
      dispatch(fetchStatsRequestSilent());
      dispatch(fetchRecentSongsRequest());

      // Reset refreshing state after a short delay
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    };

    window.addEventListener("refresh-stats", handleStatsRefresh);

    // Listen for stats tab activation
    const handleStatsTabActivated = () => {
      console.log("📊 Stats tab activated, refreshing stats");
      dispatch(fetchStatsRequestSilent());
      dispatch(fetchRecentSongsRequest());
    };

    window.addEventListener("stats-tab-activated", handleStatsTabActivated);

    // Check socket connection status
    const checkSocketStatus = () => {
      setSocketConnected(socketService.isSocketConnected());
    };

    // Check immediately and then periodically
    checkSocketStatus();
    const interval = setInterval(checkSocketStatus, 2000);

    // Cleanup: only clean up listeners, don't disconnect shared socket
    return () => {
      clearInterval(interval);
      window.removeEventListener("refresh-stats", handleStatsRefresh);
      window.removeEventListener(
        "stats-tab-activated",
        handleStatsTabActivated
      );
      dispatch(disconnectStatsSocket());
    };
  }, [dispatch]);

  // Auto-refresh when component becomes visible (user navigates to stats)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("📊 Page became visible, refreshing stats");
        dispatch(fetchStatsRequestSilent());
        dispatch(fetchRecentSongsRequest());
      }
    };

    const handleFocus = () => {
      console.log("📊 Window focused, refreshing stats");
      dispatch(fetchStatsRequestSilent());
      dispatch(fetchRecentSongsRequest());
    };

    // Listen for page visibility and focus changes
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [dispatch]);

  // Polling mechanism as backup for socket events
  useEffect(() => {
    if (!pollingEnabled) return;

    console.log("📊 Starting polling for stats updates (every 30 seconds)");

    const pollInterval = setInterval(() => {
      // Only poll if page is visible and socket is not connected
      if (!document.hidden && !socketConnected) {
        console.log("📊 Polling: Refreshing stats (socket not connected)");
        dispatch(fetchStatsRequestSilent());
        dispatch(fetchRecentSongsRequest());
      } else if (!document.hidden && socketConnected) {
        console.log("📊 Polling: Socket connected, doing light refresh");
        dispatch(fetchRecentSongsRequest()); // Only refresh recent songs
      }
    }, 30000); // Poll every 30 seconds

    return () => {
      console.log("📊 Stopping polling");
      clearInterval(pollInterval);
    };
  }, [dispatch, pollingEnabled, socketConnected]);

  const handleClearError = () => {
    dispatch(clearStatsError());
  };

  const handleManualRefresh = () => {
    console.log("📊 Manual refresh triggered");
    setIsRefreshing(true);
    dispatch(fetchStatsRequest());
    dispatch(fetchRecentSongsRequest());

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const togglePolling = () => {
    setPollingEnabled(!pollingEnabled);
    console.log("📊 Polling", !pollingEnabled ? "enabled" : "disabled");
  };

  // Only show loading spinner on initial load (when no stats data exists)
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
      {/* Add CSS animation for live indicator */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>

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
      <StatsMetadata
        stats={stats}
        lastUpdated={lastUpdated}
        socketConnected={socketConnected}
        isRefreshing={isRefreshing}
        pollingEnabled={pollingEnabled}
        onManualRefresh={handleManualRefresh}
        onTogglePolling={togglePolling}
      />
    </div>
  );
}
