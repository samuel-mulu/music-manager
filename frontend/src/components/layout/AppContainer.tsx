import styled from "@emotion/styled";

// Main App Container
export const AppContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  transition: all 0.3s ease;
`;

// Header Components
export const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: ${({ theme }) => theme.space.lg} 0;
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

export const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0px auto;
  padding: 0 ${({ theme }) => theme.space.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
`;

export const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #3b82f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

export const Title = styled.h1`
  color: #1e293b;
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: 700;
  margin: 0;
`;

export const Subtitle = styled.p`
  color: #64748b;
  font-size: ${({ theme }) => theme.fontSizes.base};
  margin: 0;
  margin-top: ${({ theme }) => theme.space.xs};
`;

// Main Content
export const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space.lg};
`;

// Footer
export const Footer = styled.footer`
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: ${({ theme }) => theme.space.lg} 0;
  margin-top: ${({ theme }) => theme.space["2xl"]};
  text-align: center;
  color: #64748b;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;
