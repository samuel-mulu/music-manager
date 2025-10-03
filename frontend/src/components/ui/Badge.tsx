import styled from "@emotion/styled";

// Professional Badge Component
export const Badge = styled.span<{
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
}>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${({ variant = "primary" }) => {
    switch (variant) {
      case "primary":
        return `
          background: #dbeafe;
          color: #1e40af;
        `;
      case "secondary":
        return `
          background: #f3f4f6;
          color: #374151;
        `;
      case "success":
        return `
          background: #d1fae5;
          color: #065f46;
        `;
      case "warning":
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case "danger":
        return `
          background: #fee2e2;
          color: #991b1b;
        `;
    }
  }}
`;
