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
  MenuItem,
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

interface LimpiezaDesinfeccionData {
  productoEmpleado: string
  fecha: string
  operario: string
  supervisadoPor: string
  nroSilo: string
  observaciones: string
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

const SUPERVISORES = [
  "Juan Carlos Martínez",
  "María Elena González",
  "Pedro Antonio López",
  "Ana Isabel Rodríguez",
  "José Manuel Fernández",
  "Carmen Rosa Torres",
  "Francisco Javier Silva"
]

export function LimpiezaDesinfeccionSection() {
  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    productoEmpleado: "",
    fecha: "",
    operario: "",
    supervisadoPor: "",
    nroSilo: "",
    observaciones: "",
  })

  // Estado para la tabla de limpieza y desinfección
  const [limpiezaDesinfeccionData, setLimpiezaDesinfeccionData] = useState<LimpiezaDesinfeccionData[]>([
    {
      productoEmpleado: "Desinfectante clorado al 2%",
      fecha: "2023-09-20",
      operario: "Luis Fernando García Morales",
      supervisadoPor: "Juan Carlos Martínez",
      nroSilo: "SILO-001",
      observaciones: "Limpieza completa realizada según protocolo",
      fechaCreacion: "20/09/2023",
      fechaUltimaActualizacion: "22/09/2023",
    },
    {
      productoEmpleado: "Detergente enzimático",
      fecha: "2024-07-15",
      operario: "Claudia Patricia Herrera Silva",
      supervisadoPor: "María Elena González",
      nroSilo: "SILO-002",
      observaciones: "Se realizó doble enjuague por acumulación de residuos",
      fechaCreacion: "15/07/2024",
      fechaUltimaActualizacion: "16/07/2024",
    },
    {
      productoEmpleado: "Amonio cuaternario 1%",
      fecha: "2023-04-10",
      operario: "Fernando José Ramírez Torres",
      supervisadoPor: "Pedro Antonio López",
      nroSilo: "SILO-003",
      observaciones: "Proceso estándar, sin incidencias",
      fechaCreacion: "10/04/2023",
      fechaUltimaActualizacion: "12/04/2023",
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
    const item = limpiezaDesinfeccionData[index]
    
    setFormData({
      productoEmpleado: item.productoEmpleado,
      fecha: item.fecha,
      operario: item.operario,
      supervisadoPor: item.supervisadoPor,
      nroSilo: item.nroSilo,
      observaciones: item.observaciones,
    })
    
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = limpiezaDesinfeccionData[index]
    
    setFormData({
      productoEmpleado: item.productoEmpleado,
      fecha: item.fecha,
      operario: item.operario,
      supervisadoPor: item.supervisadoPor,
      nroSilo: item.nroSilo,
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
      productoEmpleado: "",
      fecha: "",
      operario: "",
      supervisadoPor: "",
      nroSilo: "",
      observaciones: "",
    })
  }

  const handleSubmit = () => {
    console.log("Datos de limpieza y desinfección:", formData)

    // Validar que los campos requeridos estén llenos
    if (!formData.productoEmpleado || !formData.operario || !formData.fecha) {
      alert("Por favor, completa todos los campos requeridos")
      return
    }

    const limpiezaDesinfeccionItem = {
      productoEmpleado: formData.productoEmpleado,
      fecha: formData.fecha,
      operario: formData.operario,
      supervisadoPor: formData.supervisadoPor,
      nroSilo: formData.nroSilo,
      observaciones: formData.observaciones,
      fechaCreacion: editMode 
        ? limpiezaDesinfeccionData[editIndex!].fechaCreacion 
        : formatDateToDisplay(formData.fecha),
      fechaUltimaActualizacion: formatDateToDisplay(formData.fecha),
    }

    if (editMode && editIndex !== null) {
      // Actualizar elemento existente
      setLimpiezaDesinfeccionData((prev) => 
        prev.map((item, index) => 
          index === editIndex ? limpiezaDesinfeccionItem : item
        )
      )
    } else {
      // Agregar nuevo elemento
      setLimpiezaDesinfeccionData((prev) => [...prev, limpiezaDesinfeccionItem])
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
                    Limpieza y desinfección silos de pienso
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
                          Producto empleado
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
                          Operario
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Supervisado por
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Nro de Silo
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
                    {limpiezaDesinfeccionData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>{item.productoEmpleado}</TableCell>
                        <TableCell>{formatDateToDisplay(item.fecha)}</TableCell>
                        <TableCell>{item.operario}</TableCell>
                        <TableCell>{item.supervisadoPor}</TableCell>
                        <TableCell>{item.nroSilo}</TableCell>
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
                    {viewMode ? "Detalle de limpieza y desinfección" : editMode ? "Editar limpieza y desinfección" : "Registro de limpieza y desinfección"}
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Producto empleado y Fecha */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        placeholder="Producto empleado"
                        variant="standard"
                        value={formData.productoEmpleado}
                        onChange={(e) => setFormData((prev) => ({ ...prev, productoEmpleado: e.target.value }))}
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

                  {/* Operario y Supervisado por */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        placeholder="Operario"
                        variant="standard"
                        value={formData.operario}
                        onChange={(e) => setFormData((prev) => ({ ...prev, operario: e.target.value }))}
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
                        select={!viewMode}
                        label="Supervisado por"
                        variant="standard"
                        value={formData.supervisadoPor}
                        onChange={(e) => setFormData((prev) => ({ ...prev, supervisadoPor: e.target.value }))}
                        InputProps={{
                          readOnly: viewMode,
                        }}
                        sx={{
                          "& .MuiInputBase-input": {
                            color: viewMode ? "text.secondary" : "text.primary",
                          },
                        }}
                      >
                        {!viewMode && SUPERVISORES.map((supervisor) => (
                          <MenuItem key={supervisor} value={supervisor}>
                            {supervisor}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>

                  {/* Nro de Silo */}
                  <TextField
                    fullWidth
                    placeholder="Nro de Silo"
                    variant="standard"
                    value={formData.nroSilo}
                    onChange={(e) => setFormData((prev) => ({ ...prev, nroSilo: e.target.value }))}
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