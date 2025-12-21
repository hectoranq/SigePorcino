"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  TextField,
  Grid,
} from "@mui/material"
import { Add, KeyboardArrowDown } from "@mui/icons-material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { buttonStyles, headerColors, headerAccentColors, sectionHeaderStyle, headerBarStyle } from "./buttonStyles"

const theme = createTheme({
  palette: {
    primary: {
      main: "#0d9488", // teal-600
      light: "#f0fdfa", // teal-50
    },
    secondary: {
      main: "#22c55e", // green-500
    },
  },
})

interface MantenimientoEquiposData {
  nombreEquipo: string
  fecha: string
  revision: string
  proximaRevision: string
  observaciones: string
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

export function MantenimientoEquiposSection() {
  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    nombreEquipo: "",
    fecha: "",
    revision: "",
    proximaRevision: "",
    observaciones: "",
  })

  // Estado para la tabla de mantenimiento de equipos
  const [mantenimientoEquiposData, setMantenimientoEquiposData] = useState<MantenimientoEquiposData[]>([
    {
      nombreEquipo: "Sistema de alimentación automática - Línea A",
      fecha: "2023-11-20",
      revision: "Mantenimiento preventivo completo, limpieza de tolvas y calibración",
      proximaRevision: "2024-05-20",
      observaciones: "Funcionamiento óptimo, se reemplazaron dos sensores de nivel",
      fechaCreacion: "20/11/2023",
      fechaUltimaActualizacion: "21/11/2023",
    },
    {
      nombreEquipo: "Bomba de agua principal - Sector Norte",
      fecha: "2024-01-15",
      revision: "Inspección de sellos, cambio de filtros y verificación de presión",
      proximaRevision: "2024-07-15",
      observaciones: "Se detectó ligera vibración, programar revisión de rodamientos",
      fechaCreacion: "15/01/2024",
      fechaUltimaActualizacion: "16/01/2024",
    },
    {
      nombreEquipo: "Ventiladores nave 3 - Sistema de climatización",
      fecha: "2023-09-10",
      revision: "Limpieza de aspas, engrase de motores y verificación eléctrica",
      proximaRevision: "2024-03-10",
      observaciones: "Rendimiento adecuado, se ajustó la velocidad de dos unidades",
      fechaCreacion: "10/09/2023",
      fechaUltimaActualizacion: "12/09/2023",
    },
  ])

  const handleOpen = () => {
    setEditMode(false)
    setViewMode(false)
    setEditIndex(null)
    setOpen(true)
  }

  // Función para abrir en modo edición
  const handleEdit = (index: number) => {
    const item = mantenimientoEquiposData[index]
    
    setFormData({
      nombreEquipo: item.nombreEquipo,
      fecha: item.fecha,
      revision: item.revision,
      proximaRevision: item.proximaRevision,
      observaciones: item.observaciones,
    })
    
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = mantenimientoEquiposData[index]
    
    setFormData({
      nombreEquipo: item.nombreEquipo,
      fecha: item.fecha,
      revision: item.revision,
      proximaRevision: item.proximaRevision,
      observaciones: item.observaciones,
    })
    
    setEditMode(false)
    setViewMode(true)
    setEditIndex(index)
    setOpen(true)
  }



  // Función para convertir fecha de YYYY-MM-DD a DD/MM/YYYY
  const formatDateToDisplay = (dateString: string) => {
    if (!dateString) return "Sin fecha"
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handleClose = () => {
    setOpen(false)
    setEditMode(false)
    setViewMode(false)
    setEditIndex(null)
    setFormData({
      nombreEquipo: "",
      fecha: "",
      revision: "",
      proximaRevision: "",
      observaciones: "",
    })
  }

  const handleSubmit = () => {
    console.log("Datos de mantenimiento de equipos:", formData)

    // Validar que los campos requeridos estén llenos
    if (!formData.nombreEquipo || !formData.fecha || !formData.revision) {
      alert("Por favor, completa todos los campos requeridos")
      return
    }

    const mantenimientoEquiposItem = {
      nombreEquipo: formData.nombreEquipo,
      fecha: formData.fecha,
      revision: formData.revision,
      proximaRevision: formData.proximaRevision,
      observaciones: formData.observaciones,
      fechaCreacion: editMode 
        ? mantenimientoEquiposData[editIndex!].fechaCreacion 
        : formatDateToDisplay(formData.fecha),
      fechaUltimaActualizacion: formatDateToDisplay(formData.fecha),
    }

    if (editMode && editIndex !== null) {
      // Actualizar elemento existente
      setMantenimientoEquiposData((prev) => 
        prev.map((item, index) => 
          index === editIndex ? mantenimientoEquiposItem : item
        )
      )
    } else {
      // Agregar nuevo elemento
      setMantenimientoEquiposData((prev) => [...prev, mantenimientoEquiposItem])
    }
    
    handleClose()
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {/* Page Content */}
          <Box sx={{ flexGrow: 1, p: 3, bgcolor: "grey.50" }}>
            <Paper elevation={1} sx={{ borderRadius: 2 }}>
              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 3,
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 4,
                      height: 32,
                      bgcolor: "primary.main",
                      borderRadius: 2,
                    }}
                  />
                  <Typography variant="h5" fontWeight={600}>
                    Mantenimiento de equipos
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  startIcon={<Add />} 
                  sx={buttonStyles.save}
                  onClick={handleOpen}
                >
                  Agregar nuevo
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "grey.100" }}>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Nombre del equipo
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Fecha
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Revisión
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Próxima revisión
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Observaciones
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Acciones
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mantenimientoEquiposData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography variant="body2" sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap' 
                          }}>
                            {item.nombreEquipo}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDateToDisplay(item.fecha)}</TableCell>
                        <TableCell sx={{ maxWidth: 250 }}>
                          <Typography variant="body2" sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap' 
                          }}>
                            {item.revision}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDateToDisplay(item.proximaRevision)}</TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography variant="body2" sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap' 
                          }}>
                            {item.observaciones}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              sx={{
                                bgcolor: "#eab308",
                                color: "grey.900",
                                "&:hover": {
                                  bgcolor: "#ca8a04",
                                },
                              }}
                              onClick={() => handleEdit(index)}
                            >
                              Editar
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: "#93c5fd",
                                color: "#2563eb",
                                "&:hover": {
                                  bgcolor: "#eff6ff",
                                  borderColor: "#93c5fd",
                                },
                              }}
                              onClick={() => handleVerMas(index)}
                            >
                              Ver más
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Box>

        {/* Dialog/Popup */}
        <Dialog 
          open={open} 
          onClose={handleClose} 
          maxWidth="lg" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ minHeight: "auto", bgcolor: "#f9fafb", p: 3 }}>
              <Paper sx={{ maxWidth: 1200, mx: "auto", borderRadius: 2, overflow: "hidden" }}>
                {/* Header dinámico según el modo */}
                <Box sx={{ 
                  bgcolor: viewMode ? headerColors.view : editMode ? headerColors.edit : headerColors.create, 
                  px: 3, 
                  py: 2, 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1 
                }}>
                  <Box sx={{ 
                    width: 4, 
                    height: 24, 
                    bgcolor: viewMode ? headerAccentColors.view : editMode ? headerAccentColors.edit : headerAccentColors.create, 
                    borderRadius: 0.5 
                  }} />
                  <Typography variant="h6" sx={{ color: "white", fontWeight: 500 }}>
                    {viewMode ? "Detalle de mantenimiento de equipo" : editMode ? "Editar mantenimiento de equipo" : "Registro de mantenimiento de equipo"}
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Nombre del equipo y Fecha */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        placeholder="Nombre del equipo"
                        variant="standard"
                        value={formData.nombreEquipo}
                        onChange={(e) => setFormData((prev) => ({ ...prev, nombreEquipo: e.target.value }))}
                        InputProps={{
                          readOnly: viewMode,
                        }}
                        sx={{
                          "& .MuiInputBase-input": {
                            color: viewMode ? "text.secondary" : "text.primary",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Fecha"
                        type="date"
                        variant="standard"
                        value={formData.fecha}
                        onChange={(e) => setFormData((prev) => ({ ...prev, fecha: e.target.value }))}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          readOnly: viewMode,
                        }}
                        sx={{
                          "& .MuiInputBase-input": {
                            color: viewMode ? "text.secondary" : "text.primary",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Revisión */}
                  <TextField
                    fullWidth
                    placeholder="Revisión realizada"
                    variant="standard"
                    multiline
                    rows={3}
                    value={formData.revision}
                    onChange={(e) => setFormData((prev) => ({ ...prev, revision: e.target.value }))}
                    sx={{ 
                      mb: 3,
                      "& .MuiInputBase-input": {
                        color: viewMode ? "text.secondary" : "text.primary",
                      },
                    }}
                    InputProps={{
                      readOnly: viewMode,
                    }}
                  />

                  {/* Próxima revisión */}
                  <TextField
                    fullWidth
                    label="Próxima revisión"
                    type="date"
                    variant="standard"
                    value={formData.proximaRevision}
                    onChange={(e) => setFormData((prev) => ({ ...prev, proximaRevision: e.target.value }))}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: viewMode,
                    }}
                    sx={{
                      mb: 3,
                      "& .MuiInputBase-input": {
                        color: viewMode ? "text.secondary" : "text.primary",
                      },
                    }}
                  />

                  {/* Observaciones */}
                  <TextField
                    fullWidth
                    placeholder="Observaciones"
                    variant="standard"
                    multiline
                    rows={3}
                    value={formData.observaciones}
                    onChange={(e) => setFormData((prev) => ({ ...prev, observaciones: e.target.value }))}
                    sx={{ 
                      mb: 3,
                      "& .MuiInputBase-input": {
                        color: viewMode ? "text.secondary" : "text.primary",
                      },
                    }}
                    InputProps={{
                      readOnly: viewMode,
                    }}
                  />

                  {/* Botones dinámicos según el modo */}
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    {viewMode ? (
                      <Button
                        variant="outlined"
                        onClick={handleClose}
                        sx={buttonStyles.close}
                      >
                        Cerrar
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outlined"
                          onClick={handleClose}
                          sx={buttonStyles.close}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleSubmit}
                          sx={buttonStyles.save}
                        >
                          {editMode ? "Actualizar" : "Guardar"}
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  )
}