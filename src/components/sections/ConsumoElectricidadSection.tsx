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

interface ConsumoElectricidadData {
  energiaConsumida: string
  fecha: string
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

export function ConsumoElectricidadSection() {
  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    energiaConsumida: "",
    fecha: "",
  })

  // Estado para la tabla de consumo de electricidad
  const [consumoElectricidadData, setConsumoElectricidadData] = useState<ConsumoElectricidadData[]>([
    {
      energiaConsumida: "4850.5",
      fecha: "2024-01-31",
      fechaCreacion: "31/01/2024",
      fechaUltimaActualizacion: "01/02/2024",
    },
    {
      energiaConsumida: "5120.8",
      fecha: "2024-02-29",
      fechaCreacion: "29/02/2024",
      fechaUltimaActualizacion: "01/03/2024",
    },
    {
      energiaConsumida: "4675.2",
      fecha: "2023-12-31",
      fechaCreacion: "31/12/2023",
      fechaUltimaActualizacion: "02/01/2024",
    },
    {
      energiaConsumida: "5340.7",
      fecha: "2024-03-31",
      fechaCreacion: "31/03/2024",
      fechaUltimaActualizacion: "01/04/2024",
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
    const item = consumoElectricidadData[index]
    
    setFormData({
      energiaConsumida: item.energiaConsumida,
      fecha: item.fecha,
    })
    
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = consumoElectricidadData[index]
    
    setFormData({
      energiaConsumida: item.energiaConsumida,
      fecha: item.fecha,
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

  // Función para obtener el nombre del mes
  const getMonthName = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric'
    })
  }

  const handleClose = () => {
    setOpen(false)
    setEditMode(false)
    setViewMode(false)
    setEditIndex(null)
    setFormData({
      energiaConsumida: "",
      fecha: "",
    })
  }

  const handleSubmit = () => {
    console.log("Datos de consumo de electricidad:", formData)

    // Validar que los campos requeridos estén llenos
    if (!formData.energiaConsumida || !formData.fecha) {
      alert("Por favor, completa todos los campos requeridos")
      return
    }

    const consumoElectricidadItem = {
      energiaConsumida: formData.energiaConsumida,
      fecha: formData.fecha,
      fechaCreacion: editMode 
        ? consumoElectricidadData[editIndex!].fechaCreacion 
        : formatDateToDisplay(formData.fecha),
      fechaUltimaActualizacion: formatDateToDisplay(formData.fecha),
    }

    if (editMode && editIndex !== null) {
      // Actualizar elemento existente
      setConsumoElectricidadData((prev) => 
        prev.map((item, index) => 
          index === editIndex ? consumoElectricidadItem : item
        )
      )
    } else {
      // Agregar nuevo elemento
      setConsumoElectricidadData((prev) => [...prev, consumoElectricidadItem])
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
                    Consumo de electricidad
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  startIcon={<Add />} 
                  sx={{ textTransform: "none" }}
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
                          Energía consumida (kWh)
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
                          Período
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
                    {consumoElectricidadData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 600, 
                            color: "primary.main",
                            bgcolor: "primary.light",
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            display: "inline-block"
                          }}>
                            {parseFloat(item.energiaConsumida).toLocaleString('es-ES')} kWh
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDateToDisplay(item.fecha)}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            fontStyle: 'italic',
                            color: "text.secondary" 
                          }}>
                            {getMonthName(item.fecha)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              sx={{
                                bgcolor: "#facc15",
                                color: "grey.900",
                                textTransform: "none",
                                "&:hover": {
                                  bgcolor: "#eab308",
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
                                textTransform: "none",
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
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            <ThemeProvider theme={theme}>
              <Box sx={{ minHeight: "auto", bgcolor: "#f9fafb", p: 3 }}>
                <Paper sx={{ maxWidth: 800, mx: "auto", borderRadius: 2, overflow: "hidden" }}>
                  {/* Header dinámico según el modo */}
                  <Box sx={{ 
                    bgcolor: viewMode ? "#64748b" : editMode ? "#f59e0b" : "#22d3ee", 
                    px: 3, 
                    py: 2, 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 1 
                  }}>
                    <Box sx={{ 
                      width: 4, 
                      height: 24, 
                      bgcolor: viewMode ? "#94a3b8" : editMode ? "#fbbf24" : "#67e8f9", 
                      borderRadius: 0.5 
                    }} />
                    <Typography variant="h6" sx={{ color: "white", fontWeight: 500 }}>
                      {viewMode ? "Detalle de consumo eléctrico" : editMode ? "Editar consumo eléctrico" : "Registro de consumo eléctrico"}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    {/* Energía consumida */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          placeholder="Energía consumida (kWh)"
                          variant="standard"
                          type="number"
                          inputProps={{ step: "0.1", min: "0" }}
                          value={formData.energiaConsumida}
                          onChange={(e) => setFormData((prev) => ({ ...prev, energiaConsumida: e.target.value }))}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "text.primary",
                              fontSize: "1.2rem",
                              fontWeight: 500,
                            },
                          }}
                          helperText={!viewMode ? "Ingresa el consumo eléctrico total en kilovatios hora (kWh)" : ""}
                        />
                      </Grid>
                    </Grid>

                    {/* Fecha */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Fecha de registro"
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
                          helperText={!viewMode ? "Generalmente se registra al final del período de facturación (mensual)" : ""}
                        />
                      </Grid>
                    </Grid>

                    {/* Información adicional en modo ver */}
                    {viewMode && (
                      <Box sx={{ 
                        bgcolor: "grey.50", 
                        p: 2, 
                        borderRadius: 1, 
                        mb: 3,
                        border: 1,
                        borderColor: "grey.200"
                      }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
                          Información del registro:
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Período:</strong> {getMonthName(formData.fecha)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Consumo formateado:</strong> {parseFloat(formData.energiaConsumida).toLocaleString('es-ES')} kWh
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    {/* Botones dinámicos según el modo */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                      {viewMode ? (
                        <Button
                          variant="outlined"
                          onClick={handleClose}
                          sx={{ textTransform: "none", color: "#2563eb", borderColor: "#93c5fd" }}
                        >
                          Cerrar
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outlined"
                            onClick={handleClose}
                            sx={{ textTransform: "none", color: "#2563eb", borderColor: "#93c5fd" }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{ textTransform: "none" }}
                          >
                            {editMode ? "Actualizar" : "Guardar"}
                          </Button>
                        </>
                      )}
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </ThemeProvider>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  )
}