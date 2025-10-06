import React from "react";
import { Card, Button } from "../ui";
import { SongStats } from "../../types/stats.types";

interface StatsMetadataProps {
  stats: SongStats;
  lastUpdated: string | null;
  socketConnected: boolean;
  isRefreshing: boolean;
  pollingEnabled: boolean;
  onManualRefresh: () => void;
  onTogglePolling: () => void;
}

export const StatsMetadata: React.FC<StatsMetadataProps> = ({
  stats,
  lastUpdated,
  socketConnected,
  isRefreshing,
  pollingEnabled,
  onManualRefresh,
  onTogglePolling,
}) => (
  <Card style={{ padding: "12px", marginTop: "20px" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "11px",
        color: "#64748b",
        marginBottom: "8px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onManualRefresh}
          disabled={isRefreshing}
          style={{
            fontSize: "10px",
            padding: "4px 8px",
            height: "auto",
            minWidth: "auto",
          }}
        >
          {isRefreshing ? "🔄" : "↻"} Refresh
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onTogglePolling}
          style={{
            fontSize: "10px",
            padding: "4px 8px",
            height: "auto",
            minWidth: "auto",
            color: pollingEnabled ? "#10b981" : "#64748b",
          }}
        >
          {pollingEnabled ? "⏰" : "⏸️"} Polling
        </Button>
      </div>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "11px",
        color: "#64748b",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span>
          Last updated:{" "}
          {lastUpdated
            ? new Date(lastUpdated).toLocaleString()
            : stats.metadata?.generatedAt
            ? new Date(stats.metadata.generatedAt).toLocaleString()
            : "N/A"}
        </span>
        {lastUpdated && (
          <div
            className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#10b981",
              fontSize: "10px",
            }}
          >
            <div
              className="bg-green-600 dark:bg-green-400"
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                animation: "pulse 2s infinite",
              }}
            />
            Live
          </div>
        )}
        {socketConnected && (
          <div
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#3b82f6",
              fontSize: "10px",
            }}
          >
            <div
              className="bg-blue-600 dark:bg-blue-400"
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#3b82f6",
              }}
            />
            Connected
          </div>
        )}
        {isRefreshing && (
          <div
            className="flex items-center gap-1 text-orange-600 dark:text-orange-400 text-xs"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#ea580c",
              fontSize: "10px",
            }}
          >
            <div
              className="bg-orange-600 dark:bg-orange-400"
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#ea580c",
                animation: "pulse 1s infinite",
              }}
            />
            Updating...
          </div>
        )}
      </div>
      <span>
        Data range:{" "}
        {stats.metadata?.dataRange?.from?.createdAt
          ? new Date(
              stats.metadata.dataRange.from.createdAt
            ).toLocaleDateString()
          : "N/A"}{" "}
        -{" "}
        {stats.metadata?.dataRange?.to?.createdAt
          ? new Date(stats.metadata.dataRange.to.createdAt).toLocaleDateString()
          : "N/A"}
      </span>
    </div>
  </Card>
);
