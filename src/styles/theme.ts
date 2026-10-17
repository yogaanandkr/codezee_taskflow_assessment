export const theme = {
  colors: {
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
    background: "#f8fafc",
    surface: "#ffffff",
    text: "#0f172a",
    textSecondary: "#64748b",
    border: "#e2e8f0",
    success: "#16a34a",
    danger: "#dc2626",
  },
  borderRadius: {
    sm: "6px",
    md: "10px",
    lg: "16px",
  },
} as const;

export type AppTheme = typeof theme;
