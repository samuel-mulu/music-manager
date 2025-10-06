import React from "react";
import { Button } from "../ui";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  total,
  limit,
  hasNext,
  hasPrev,
  onPageChange,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        padding: "16px 20px",
        marginBottom: "24px",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              color: "#64748b",
              fontWeight: "500",
            }}
          >
            Showing {(currentPage - 1) * limit + 1} to{" "}
            {Math.min(currentPage * limit, total || 0)} of {total || 0} songs
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Button
            variant="secondary"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrev}
            style={{
              padding: "6px 12px",
              fontSize: "13px",
              fontWeight: "500",
              borderRadius: "4px",
              opacity: !hasPrev ? 0.5 : 1,
            }}
          >
            ← Previous
          </Button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              backgroundColor: "#f8fafc",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                color: "#1e293b",
                fontWeight: "600",
              }}
            >
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <Button
            variant="secondary"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNext}
            style={{
              padding: "6px 12px",
              fontSize: "13px",
              fontWeight: "500",
              borderRadius: "4px",
              opacity: !hasNext ? 0.5 : 1,
            }}
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
};
