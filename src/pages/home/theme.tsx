import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
  palette: {
    primary: {
      main: "#0d9488", // teal-600
      light: "#14b8a6", // teal-500
      dark: "#0f766e", // teal-700
    },
    secondary: {
      main: "#06b6d4", // cyan-500
      light: "#22d3ee", // cyan-400
      dark: "#0891b2", // cyan-600
    },
    success: {
      main: "#22c55e", // green-500
      dark: "#16a34a", // green-600
    },
    warning: {
      main: "#facc15", // yellow-400
      dark: "#eab308", // yellow-500
    },
    background: {
      default: "#f9fafb", // gray-50
      paper: "#ffffff",
    },
    grey: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },
  },
})
