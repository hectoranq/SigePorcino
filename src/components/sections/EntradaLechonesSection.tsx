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
import { buttonStyles, headerColors, headerAccentColors} from "./buttonStyles"

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

interface EntradaLechonesData {
  nroAnimales: string
  pesoVivo: string
  fechaEntrada: string
  fechaNacimiento: string
  procedencia: string
  observaciones: string
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

export function EntradaLechonesSection() {
  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    nroAnimales: "",
    pesoVivo: "",
    fechaEntrada: "",
    fechaNacimiento: "",
    procedencia: "",
    observaciones: "",
  })

  // Estado para la tabla de entrada de lechones
  const [entradaLechonesData, setEntradaLechonesData] = useState<EntradaLechonesData[]>([
    {
      nroAnimales: "25",
      pesoVivo: "8.5",
      fechaEntrada: "2024-01-15",
      fechaNacimiento: "2023-11-20",
      procedencia: "Granja San Miguel - Salamanca",
      observaciones: "Lote en excelente estado sanitario, vacunados según protocolo",
      fechaCreacion: "15/01/2024",
      fechaUltimaActualizacion: "16/01/2024",
    },
    {
      nroAnimales: "30",
      pesoVivo: "9.2",
      fechaEntrada: "2024-02-08",
      fechaNacimiento: "2023-12-10",
      procedencia: "Explotación La Dehesa - Cáceres",
      observaciones: "Animales con buen desarrollo, documentación sanitaria completa",
      fechaCreacion: "08/02/2024",
      fechaUltimaActualizacion: "09/02/2024",
    },
    {
      nroAnimales: "18",
      pesoVivo: "7.8",
      fechaEntrada: "2023-12-20",
      fechaNacimiento: "2023-09-28",
      procedencia: "Cooperativa Ganadera Los Robles - Badajoz",
      observaciones: "Lote homogéneo, adaptación satisfactoria al nuevo ambiente",
      fechaCreacion: "20/12/2023",
      fechaUltimaActualizacion: "22/12/2023",
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
    const item = entradaLechonesData[index]
    
    setFormData({
      nroAnimales: item.nroAnimales,
      pesoVivo: item.pesoVivo,
      fechaEntrada: item.fechaEntrada,
      fechaNacimiento: item.fechaNacimiento,
      procedencia: item.procedencia,
      observaciones: item.observaciones,
    })
    
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = entradaLechonesData[index]
    
    setFormData({
      nroAnimales: item.nroAnimales,
      pesoVivo: item.pesoVivo,
      fechaEntrada: item.fechaEntrada,
      fechaNacimiento: item.fechaNacimiento,
      procedencia: item.procedencia,
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
      nroAnimales: "",
      pesoVivo: "",
      fechaEntrada: "",
      fechaNacimiento: "",
      procedencia: "",
      observaciones: "",
    })
  }

  const handleSubmit = () => {
    console.log("Datos de entrada de lechones:", formData)

    // Validar que los campos requeridos estén llenos
    if (!formData.nroAnimales || !formData.fechaEntrada || !formData.procedencia) {
      alert("Por favor, completa todos los campos requeridos")
      return
    }

    const entradaLechonesItem = {
      nroAnimales: formData.nroAnimales,
      pesoVivo: formData.pesoVivo,
      fechaEntrada: formData.fechaEntrada,
      fechaNacimiento: formData.fechaNacimiento,
      procedencia: formData.procedencia,
      observaciones: formData.observaciones,
      fechaCreacion: editMode 
        ? entradaLechonesData[editIndex!].fechaCreacion 
        : formatDateToDisplay(formData.fechaEntrada),
      fechaUltimaActualizacion: formatDateToDisplay(formData.fechaEntrada),
    }

    if (editMode && editIndex !== null) {
      // Actualizar elemento existente
      setEntradaLechonesData((prev) => 
        prev.map((item, index) => 
          index === editIndex ? entradaLechonesItem : item
        )
      )
    } else {
      // Agregar nuevo elemento
      setEntradaLechonesData((prev) => [...prev, entradaLechonesItem])
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
                    Entrada de lechones
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
                          Fecha de entrada
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Fecha de nacimiento
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Procedencia
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
                    {entradaLechonesData.map((item, index) => (
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
                        <TableCell>{formatDateToDisplay(item.fechaEntrada)}</TableCell>
                        <TableCell>{formatDateToDisplay(item.fechaNacimiento)}</TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography variant="body2" sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap' 
                          }}>
                            {item.procedencia}
                          </Typography>
                        </TableCell>
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
                              sx={buttonStyles.edit}
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
                    {viewMode ? "Detalle de entrada de lechones" : editMode ? "Editar entrada de lechones" : "Registro de entrada de lechones"}
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

                  {/* Fecha de entrada y Fecha de nacimiento */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Fecha de entrada"
                        type="date"
                        variant="standard"
                        value={formData.fechaEntrada}
                        onChange={(e) => setFormData((prev) => ({ ...prev, fechaEntrada: e.target.value }))}
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
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Fecha de nacimiento"
                        type="date"
                        variant="standard"
                        value={formData.fechaNacimiento}
                        onChange={(e) => setFormData((prev) => ({ ...prev, fechaNacimiento: e.target.value }))}
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

                  {/* Procedencia */}
                  <TextField
                    fullWidth
                    placeholder="Procedencia"
                    variant="standard"
                    value={formData.procedencia}
                    onChange={(e) => setFormData((prev) => ({ ...prev, procedencia: e.target.value }))}
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