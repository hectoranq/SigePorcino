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

interface SalidaMataderoData {
  nroAnimales: string
  pesoVivo: string
  fechaSalida: string
  destino: string
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

export function SalidaMataderoSection() {
  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    nroAnimales: "",
    pesoVivo: "",
    fechaSalida: "",
    destino: "",
  })

  // Estado para la tabla de salida a matadero
  const [salidaMataderoData, setSalidaMataderoData] = useState<SalidaMataderoData[]>([
    {
      nroAnimales: "45",
      pesoVivo: "110.5",
      fechaSalida: "2024-03-15",
      destino: "Matadero Industrial Guijuelo S.A. - Salamanca",
      fechaCreacion: "15/03/2024",
      fechaUltimaActualizacion: "16/03/2024",
    },
    {
      nroAnimales: "38",
      pesoVivo: "105.2",
      fechaSalida: "2024-02-28",
      destino: "Frigorífico Los Pedroches - Córdoba",
      fechaCreacion: "28/02/2024",
      fechaUltimaActualizacion: "01/03/2024",
    },
    {
      nroAnimales: "52",
      pesoVivo: "115.8",
      fechaSalida: "2024-01-20",
      destino: "Matadero Central de Extremadura - Mérida",
      fechaCreacion: "20/01/2024",
      fechaUltimaActualizacion: "22/01/2024",
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
    const item = salidaMataderoData[index]
    
    setFormData({
      nroAnimales: item.nroAnimales,
      pesoVivo: item.pesoVivo,
      fechaSalida: item.fechaSalida,
      destino: item.destino,
    })
    
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = salidaMataderoData[index]
    
    setFormData({
      nroAnimales: item.nroAnimales,
      pesoVivo: item.pesoVivo,
      fechaSalida: item.fechaSalida,
      destino: item.destino,
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
      nroAnimales: "",
      pesoVivo: "",
      fechaSalida: "",
      destino: "",
    })
  }

  const handleSubmit = () => {
    console.log("Datos de salida a matadero:", formData)

    // Validar que los campos requeridos estén llenos
    if (!formData.nroAnimales || !formData.fechaSalida || !formData.destino) {
      alert("Por favor, completa todos los campos requeridos")
      return
    }

    const salidaMataderoItem = {
      nroAnimales: formData.nroAnimales,
      pesoVivo: formData.pesoVivo,
      fechaSalida: formData.fechaSalida,
      destino: formData.destino,
      fechaCreacion: editMode 
        ? salidaMataderoData[editIndex!].fechaCreacion 
        : formatDateToDisplay(formData.fechaSalida),
      fechaUltimaActualizacion: formatDateToDisplay(formData.fechaSalida),
    }

    if (editMode && editIndex !== null) {
      // Actualizar elemento existente
      setSalidaMataderoData((prev) => 
        prev.map((item, index) => 
          index === editIndex ? salidaMataderoItem : item
        )
      )
    } else {
      // Agregar nuevo elemento
      setSalidaMataderoData((prev) => [...prev, salidaMataderoItem])
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
                    Salida a matadero
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
                          Nro de animales
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Peso vivo (kg)
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Fecha de salida
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Destino
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
                    {salidaMataderoData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>{item.nroAnimales}</TableCell>
                        <TableCell>{item.pesoVivo} kg</TableCell>
                        <TableCell>{formatDateToDisplay(item.fechaSalida)}</TableCell>
                        <TableCell sx={{ maxWidth: 300 }}>
                          <Typography variant="body2" sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap' 
                          }}>
                            {item.destino}
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
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ minHeight: "auto", bgcolor: "#f9fafb", p: 3 }}>
              <Paper sx={{ maxWidth: 1024, mx: "auto", borderRadius: 2, overflow: "hidden" }}>
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
                    {viewMode ? "Detalle de salida a matadero" : editMode ? "Editar salida a matadero" : "Registro de salida a matadero"}
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Nro de animales y Peso vivo */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        placeholder="Nro de animales"
                        variant="standard"
                        type="number"
                        value={formData.nroAnimales}
                        onChange={(e) => setFormData((prev) => ({ ...prev, nroAnimales: e.target.value }))}
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
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        placeholder="Peso vivo (kg)"
                        variant="standard"
                        type="number"
                        value={formData.pesoVivo}
                        onChange={(e) => setFormData((prev) => ({ ...prev, pesoVivo: e.target.value }))}
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

                  {/* Fecha de salida */}
                  <TextField
                    fullWidth
                    label="Fecha de salida"
                    type="date"
                    variant="standard"
                    value={formData.fechaSalida}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fechaSalida: e.target.value }))}
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

                  {/* Destino */}
                  <TextField
                    fullWidth
                    placeholder="Destino (matadero)"
                    variant="standard"
                    value={formData.destino}
                    onChange={(e) => setFormData((prev) => ({ ...prev, destino: e.target.value }))}
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