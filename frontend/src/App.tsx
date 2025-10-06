import React, { useState } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import { css } from "@emotion/css";
import store from "./store";
import { SongsList, StatsDashboard } from "./pages";
import {
  AppContainer,
  MainContent,
  Footer,
  Navigation,
} from "./components/layout";

// Theme type definition
interface CustomTheme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    background: {
      light: string;
      dark: string;
    };
    text: {
      light: string;
      dark: string;
    };
    border: {
      light: string;
      dark: string;
    };
  };
  space: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };
  fontSizes: {
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Extend Emotion's theme type
declare module "@emotion/react" {
  export interface Theme extends CustomTheme {}
}

// Theme configuration
const theme: CustomTheme = {
  colors: {
    primary: "#3b82f6",
    secondary: "#6b7280",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    background: {
      light: "#ffffff",
      dark: "#1f2937",
    },
    text: {
      light: "#1f2937",
      dark: "#f9fafb",
    },
    border: {
      light: "#e5e7eb",
      dark: "#374151",
    },
  },
  space: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  fontSizes: {
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
};

// CSS-in-JS styles using Emotion
const globalStyles = css`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }
`;

function App() {
  const [activeTab, setActiveTab] = useState<"songs" | "stats">("songs");

  const handleTabChange = (tab: "songs" | "stats") => {
    setActiveTab(tab);

    // Trigger stats refresh when switching to stats tab
    if (tab === "stats") {
      console.log("📊 Switching to stats tab, triggering refresh");
      // Dispatch a custom event that StatsDashboard will listen to
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("stats-tab-activated"));
      }, 100);
    }
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <div className={globalStyles}>
          <AppContainer>
            <MainContent>
              <Navigation activeTab={activeTab} onTabChange={handleTabChange} />

              {activeTab === "songs" && <SongsList />}
              {activeTab === "stats" && <StatsDashboard />}
            </MainContent>

            <Footer>
              <p>
                Built with React, Redux Toolkit, Redux-Saga, Emotion & Styled
                System
              </p>
            </Footer>
          </AppContainer>
        </div>
      </ThemeProvider>
    </Provider>
  );
}

// Re-export components for backward compatibility
export {
  Button,
  Card,
  Input,
  Select,
  Badge,
  ModalOverlay,
  ModalContent,
  Spinner,
  Alert,
} from "./components/ui";

export default App;
