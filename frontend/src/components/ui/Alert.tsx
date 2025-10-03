import styled from "@emotion/styled";

// Professional Alert Component
export const Alert = styled.div<{
  variant?: "info" | "success" | "warning" | "error";
}>`
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  ${({ variant = "info" }) => {
    switch (variant) {
      case "info":
        return `
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #1e40af;
        `;
      case "success":
        return `
          background: #f0fdf4;
          border-color: #bbf7d0;
          color: #166534;
        `;
      case "warning":
        return `
          background: #fffbeb;
          border-color: #fed7aa;
          color: #92400e;
        `;
      case "error":
        return `
          background: #fef2f2;
          border-color: #fecaca;
          color: #991b1b;
        `;
    }
  }}
`;
