import React from "react";
import { css } from "@emotion/css";

// Example component showing how to use Emotion CSS-in-JS (alternative to styled-system)
const StyledSystemExample: React.FC = () => {
  // Using Emotion CSS-in-JS (similar to styled-system approach)
  const cardStyles = css({
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    padding: "1.5rem",
    marginBottom: "1rem",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
  });

  const buttonStyles = css({
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: "0.875rem",
    fontWeight: "500",
    "&:hover": {
      backgroundColor: "#2563eb",
    },
    "&:disabled": {
      backgroundColor: "#d1d5db",
      cursor: "not-allowed",
    },
  });

  const titleStyles = css({
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "0.5rem",
  });

  const textStyles = css({
    color: "#6b7280",
    marginBottom: "1rem",
    lineHeight: "1.5",
  });

  return (
    <div className={cardStyles}>
      <h3 className={titleStyles}>Emotion CSS-in-JS Example</h3>
      <p className={textStyles}>
        This component demonstrates how to use Emotion CSS-in-JS utility, which
        provides similar functionality to styled-system/css.
      </p>
      <button className={buttonStyles}>Emotion CSS Button</button>
    </div>
  );
};

export default StyledSystemExample;
