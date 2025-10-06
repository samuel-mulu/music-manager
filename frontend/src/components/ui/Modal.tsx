import React, { useEffect } from "react";

// Professional Modal Components with inline styles for better production compatibility
export const ModalOverlay: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick }) => {
  // Prevent body scroll when modal is open (production-safe)
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999, // Increased z-index for production
        padding: "1rem",
        backdropFilter: "blur(4px)", // Modern backdrop blur
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const ModalContent: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ children, style, onClick }) => (
  <div
    style={{
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      maxWidth: "32rem",
      width: "100%",
      maxHeight: "90vh",
      overflowY: "auto",
      position: "relative",
      ...style,
    }}
    onClick={onClick}
  >
    {children}
  </div>
);
