// Estilos unificados para botones en todos los componentes Section
import { SxProps, Theme } from "@mui/material/styles"

export const buttonStyles = {
  // Botón principal de agregar (verde)
  primary: {
    textTransform: "none" as const,
    bgcolor: "#22c55e", // green-500
    color: "white",
    fontWeight: 500,
    px: 2,
    py: 1,
    borderRadius: 1,
    "&:hover": {
      bgcolor: "#16a34a", // green-600
    },
  },

  // Botón de editar (amarillo)
  edit: {
    textTransform: "none" as const,
    bgcolor: "#facc15", // yellow-400
    color: "#1f2937", // gray-800
    fontWeight: 500,
    px: 2,
    py: 0.75,
    borderRadius: 1,
    "&:hover": {
      bgcolor: "#eab308", // yellow-500
    },
  },

  // Botón de ver más/ver detalles (azul outline)
  secondary: {
    textTransform: "none" as const,
    borderColor: "#93c5fd", // blue-300
    color: "#2563eb", // blue-600
    fontWeight: 500,
    px: 2,
    py: 0.75,
    borderRadius: 1,
    "&:hover": {
      bgcolor: "#eff6ff", // blue-50
      borderColor: "#60a5fa", // blue-400
    },
  },

  // Botón de cancelar (gris outline)
  cancel: {
    textTransform: "none" as const,
    borderColor: "#d1d5db", // gray-300
    color: "#6b7280", // gray-500
    fontWeight: 500,
    px: 2,
    py: 0.75,
    borderRadius: 1,
    "&:hover": {
      bgcolor: "#f9fafb", // gray-50
      borderColor: "#9ca3af", // gray-400
    },
  },

  // Botón de guardar/actualizar (verde)
  save: {
    textTransform: "none" as const,
    bgcolor: "#22c55e", // green-500
    color: "white",
    fontWeight: 500,
    px: 3,
    py: 1,
    borderRadius: 1,
    "&:hover": {
      bgcolor: "#16a34a", // green-600
    },
  },

  // Botón de cerrar (azul)
  close: {
    textTransform: "none" as const,
    borderColor: "#93c5fd", // blue-300
    color: "#2563eb", // blue-600
    fontWeight: 500,
    px: 2,
    py: 0.75,
    borderRadius: 1,
    "&:hover": {
      bgcolor: "#eff6ff", // blue-50
      borderColor: "#60a5fa", // blue-400
    },
  },

  // Botón de siguiente (verde)
  next: {
    textTransform: "none" as const,
    bgcolor: "#22c55e", // green-500
    color: "white",
    fontWeight: 600,
    px: 4,
    py: 1.5,
    borderRadius: 1,
    "&:hover": {
      bgcolor: "#16a34a", // green-600
    },
    "&:disabled": {
      bgcolor: "#d1d5db", // gray-300
      color: "#9ca3af", // gray-400
    },
  },

  // Botón de atrás (gris outline)
  back: {
    textTransform: "none" as const,
    borderColor: "#d1d5db", // gray-300
    color: "#6b7280", // gray-500
    fontWeight: 500,
    px: 4,
    py: 1.5,
    borderRadius: 1,
    mr: 2,
    "&:hover": {
      bgcolor: "#f9fafb", // gray-50
      borderColor: "#9ca3af", // gray-400
    },
  },
}

// Colores unificados para headers de diálogos
export const headerColors = {
  create: "#22d3ee", // cyan-500
  edit: "#f59e0b", // amber-500
  view: "#64748b", // slate-500
}

// Colores unificados para acentos en headers
export const headerAccentColors = {
  create: "#67e8f9", // cyan-400
  edit: "#fbbf24", // amber-400
  view: "#94a3b8", // slate-400
}

// Estilo unificado para headers de sección
export const sectionHeaderStyle: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  p: 3,
  borderBottom: 1,
  borderColor: "divider",
}

// Estilo unificado para la barra decorativa de headers
export const headerBarStyle: SxProps<Theme> = {
  width: 4,
  height: 32,
  bgcolor: "primary.main",
  borderRadius: 2,
}

// Estilo unificado para títulos de sección
export const sectionTitleStyle: SxProps<Theme> = {
  variant: "h5",
  fontWeight: 600,
  color: "text.primary",
}