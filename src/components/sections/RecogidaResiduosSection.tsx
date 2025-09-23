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

interface RecogidaResiduosData {
  codigos: string
  responsable: string
  unidades: string
  kg: string
  fecha: string
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

const CODIGOS = [
  "18 02 01 - Objetos cortantes",
  "18 02 02 - Residuos anatomopatológicos",
  "18 02 03 - Residuos de medicamentos citotóxicos",
  "15 01 10 - Envases con restos peligrosos",
  "18 01 03 - Residuos infecciosos",
  "16 05 06 - Productos químicos de laboratorio",
  "18 02 05 - Productos químicos peligrosos",
  "15 02 02 - Absorbentes contaminados"
]

const RESPONSABLES = [
  "Juan Carlos Martínez",
  "María Elena González",
  "Pedro Antonio López",
  "Ana Isabel Rodríguez",
  "José Manuel Fernández",
  "Carmen Rosa Torres",
  "Francisco Javier Silva"
]

export function RecogidaResiduosSection() {
  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    codigos: "",
    responsable: "",
    unidades: "",
    kg: "",
    fecha: "",
  })

  // Estado para la tabla de recogida de residuos
  const [recogidaResiduosData, setRecogidaResiduosData] = useState<RecogidaResiduosData[]>([
    {
      codigos: "18 02 01 - Objetos cortantes",
      responsable: "Juan Carlos Martínez",
      unidades: "15",
      kg: "25",
      fecha: "2023-12-12",
      fechaCreacion: "12/12/2023",
      fechaUltimaActualizacion: "13/12/2023",
    },
    {
      codigos: "18 02 02 - Residuos anatomopatológicos",
      responsable: "María Elena González",
      unidades: "8",
      kg: "120",
      fecha: "2024-02-08",
      fechaCreacion: "08/02/2024",
      fechaUltimaActualizacion: "09/02/2024",
    },
    {
      codigos: "15 01 10 - Envases con restos peligrosos",
      responsable: "Pedro Antonio López",
      unidades: "22",
      kg: "45",
      fecha: "2023-11-28",
      fechaCreacion: "28/11/2023",
      fechaUltimaActualizacion: "30/11/2023",
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
    const item = recogidaResiduosData[index]
    
    setFormData({
      codigos: item.codigos,
      responsable: item.responsable,
      unidades: item.unidades,
      kg: item.kg,
      fecha: item.fecha,
    })
    
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = recogidaResiduosData[index]
    
    setFormData({
      codigos: item.codigos,
      responsable: item.responsable,
      unidades: item.unidades,
      kg: item.kg,
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

  const handleClose = () => {
    setOpen(false)
    setEditMode(false)
    setViewMode(false)
    setEditIndex(null)
    setFormData({
      codigos: "",
      responsable: "",
      unidades: "",
      kg: "",
      fecha: "",
    })
  }

  const handleSubmit = () => {
    console.log("Datos de recogida de residuos:", formData)

    // Validar que los campos requeridos estén llenos
    if (!formData.codigos || !formData.responsable || !formData.fecha) {
      alert("Por favor, completa todos los campos requeridos")
      return
    }

    const recogidaResiduosItem = {
      codigos: formData.codigos,
      responsable: formData.responsable,
      unidades: formData.unidades,
      kg: formData.kg,
      fecha: formData.fecha,
      fechaCreacion: editMode 
        ? recogidaResiduosData[editIndex!].fechaCreacion 
        : formatDateToDisplay(formData.fecha),
      fechaUltimaActualizacion: formatDateToDisplay(formData.fecha),
    }

    if (editMode && editIndex !== null) {
      // Actualizar elemento existente
      setRecogidaResiduosData((prev) => 
        prev.map((item, index) => 
          index === editIndex ? recogidaResiduosItem : item
        )
      )
    } else {
      // Agregar nuevo elemento
      setRecogidaResiduosData((prev) => [...prev, recogidaResiduosItem])
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
                    Recogida de residuos peligrosos
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
                          Códigos
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Responsable
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Unidades
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Kg
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
                          Acciones
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recogidaResiduosData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>{item.codigos}</TableCell>
                        <TableCell>{item.responsable}</TableCell>
                        <TableCell>{item.unidades}</TableCell>
                        <TableCell>{item.kg} kg</TableCell>
                        <TableCell>{formatDateToDisplay(item.fecha)}</TableCell>
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
                <Paper sx={{ maxWidth: 1024, mx: "auto", borderRadius: 2, overflow: "hidden" }}>
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
                      {viewMode ? "Detalle de recogida de residuos" : editMode ? "Editar recogida de residuos" : "Registro de recogida de residuos"}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    {/* Códigos y Responsable */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          select={!viewMode}
                          label="Códigos"
                          variant="standard"
                          value={formData.codigos}
                          onChange={(e) => setFormData((prev) => ({ ...prev, codigos: e.target.value }))}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "text.primary",
                            },
                          }}
                        >
                          {!viewMode && CODIGOS.map((codigo) => (
                            <MenuItem key={codigo} value={codigo}>
                              {codigo}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          select={!viewMode}
                          label="Responsable"
                          variant="standard"
                          value={formData.responsable}
                          onChange={(e) => setFormData((prev) => ({ ...prev, responsable: e.target.value }))}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "text.primary",
                            },
                          }}
                        >
                          {!viewMode && RESPONSABLES.map((responsable) => (
                            <MenuItem key={responsable} value={responsable}>
                              {responsable}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>

                    {/* Unidades y Kg */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          placeholder="Unidades"
                          variant="standard"
                          type="number"
                          value={formData.unidades}
                          onChange={(e) => setFormData((prev) => ({ ...prev, unidades: e.target.value }))}
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
                          placeholder="Kg (kilogramos)"
                          variant="standard"
                          type="number"
                          value={formData.kg}
                          onChange={(e) => setFormData((prev) => ({ ...prev, kg: e.target.value }))}
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

                    {/* Fecha */}
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
                        mb: 3,
                        "& .MuiInputBase-input": {
                          color: viewMode ? "text.secondary" : "text.primary",
                        },
                      }}
                    />

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