import React from "react";
import { Card } from "../ui";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: string;
  color?: "primary" | "success" | "warning" | "info";
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
}) => {
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
