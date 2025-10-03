import React from "react";
import { Button } from "../ui";

interface NavigationProps {
  activeTab: "songs" | "stats";
  onTabChange: (tab: "songs" | "stats") => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        marginBottom: "24px",
        padding: "8px",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
      }}
    >
      <Button
        variant={activeTab === "songs" ? "primary" : "ghost"}
        onClick={() => onTabChange("songs")}
        style={{ flex: 1 }}
      >
        🎵 Songs
      </Button>
      <Button
        variant={activeTab === "stats" ? "primary" : "ghost"}
        onClick={() => onTabChange("stats")}
        style={{ flex: 1 }}
      >
        📊 Statistics
      </Button>
    </div>
  );
};
