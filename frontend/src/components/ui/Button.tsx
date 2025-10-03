import styled from "@emotion/styled";

// Professional Button Component
export const Button = styled.button<{
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "ghost";
  size?: "sm" | "md" | "lg";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  text-decoration: none;
  font-family: inherit;

  /* Size variants */
  ${({ size = "md" }) => {
    switch (size) {
      case "sm":
        return `
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          min-height: 2rem;
        `;
      case "lg":
        return `
          padding: 0.875rem 1.5rem;
          font-size: 1.125rem;
          min-height: 3rem;
        `;
      default:
        return `
          padding: 0.75rem 1rem;
          font-size: 1rem;
          min-height: 2.5rem;
        `;
    }
  }}

  /* Color variants */
  ${({ variant = "primary" }) => {
    switch (variant) {
      case "primary":
        return `
          background: #3b82f6;
          color: white;
          &:hover:not(:disabled) {
            background: #2563eb;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          }
        `;
      case "secondary":
        return `
          background: #6b7280;
          color: white;
          &:hover:not(:disabled) {
            background: #4b5563;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(107, 114, 128, 0.4);
          }
        `;
      case "success":
        return `
          background: #10b981;
          color: white;
          &:hover:not(:disabled) {
            background: #059669;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          }
        `;
      case "warning":
        return `
          background: #f59e0b;
          color: white;
          &:hover:not(:disabled) {
            background: #d97706;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
          }
        `;
      case "danger":
        return `
          background: #ef4444;
          color: white;
          &:hover:not(:disabled) {
            background: #dc2626;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
          }
        `;
      case "ghost":
        return `
          background: transparent;
          color: #6b7280;
          border: 1px solid #d1d5db;
          &:hover:not(:disabled) {
            background: #f9fafb;
            color: #374151;
            border-color: #9ca3af;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;
