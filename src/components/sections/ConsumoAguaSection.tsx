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

interface ConsumoAguaData {
  cantidadAguaBebida: string
  cantidadAguaLimpieza: string
  cantidadAguaTraida: string
  consumoTotalAgua: string
  fecha: string
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

export function ConsumoAguaSection() {
  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    cantidadAguaBebida: "",
    cantidadAguaLimpieza: "",
    cantidadAguaTraida: "",
    consumoTotalAgua: "",
    fecha: "",
  })

  // Estado para la tabla de consumo de agua
  const [consumoAguaData, setConsumoAguaData] = useState<ConsumoAguaData[]>([
    {
      cantidadAguaBebida: "1250.5",
      cantidadAguaLimpieza: "875.2",
      cantidadAguaTraida: "0",
      consumoTotalAgua: "2125.7",
      fecha: "2024-01-15",
      fechaCreacion: "15/01/2024",
      fechaUltimaActualizacion: "16/01/2024",
    },
    {
      cantidadAguaBebida: "1380.8",
      cantidadAguaLimpieza: "920.3",
      cantidadAguaTraida: "500.0",
      consumoTotalAgua: "2801.1",
      fecha: "2024-02-08",
      fechaCreacion: "08/02/2024",
      fechaUltimaActualizacion: "09/02/2024",
    },
    {
      cantidadAguaBebida: "1195.6",
      cantidadAguaLimpieza: "750.8",
      cantidadAguaTraida: "250.0",
      consumoTotalAgua: "2196.4",
      fecha: "2023-12-20",
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
    const item = consumoAguaData[index]
    
    setFormData({
      cantidadAguaBebida: item.cantidadAguaBebida,
      cantidadAguaLimpieza: item.cantidadAguaLimpieza,
      cantidadAguaTraida: item.cantidadAguaTraida,
      consumoTotalAgua: item.consumoTotalAgua,
      fecha: item.fecha,
    })
    
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = consumoAguaData[index]
    
    setFormData({
      cantidadAguaBebida: item.cantidadAguaBebida,
      cantidadAguaLimpieza: item.cantidadAguaLimpieza,
      cantidadAguaTraida: item.cantidadAguaTraida,
      consumoTotalAgua: item.consumoTotalAgua,
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

  // Función para calcular automáticamente el consumo total
  const calculateConsumoTotal = (bebida: string, limpieza: string, traida: string) => {
    const bebidaNum = parseFloat(bebida) || 0
    const limpiezaNum = parseFloat(limpieza) || 0
    const traidaNum = parseFloat(traida) || 0
    const total = bebidaNum + limpiezaNum + traidaNum
    return total > 0 ? total.toFixed(1) : ""
  }

  const handleClose = () => {
    setOpen(false)
    setEditMode(false)
    setViewMode(false)
    setEditIndex(null)
    setFormData({
      cantidadAguaBebida: "",
      cantidadAguaLimpieza: "",
      cantidadAguaTraida: "",
      consumoTotalAgua: "",
      fecha: "",
    })
  }

  const handleSubmit = () => {
    console.log("Datos de consumo de agua:", formData)

    // Validar que los campos requeridos estén llenos
    if (!formData.cantidadAguaBebida || !formData.cantidadAguaLimpieza || !formData.fecha) {
      alert("Por favor, completa todos los campos requeridos")
      return
    }

    const consumoAguaItem = {
      cantidadAguaBebida: formData.cantidadAguaBebida,
      cantidadAguaLimpieza: formData.cantidadAguaLimpieza,
      cantidadAguaTraida: formData.cantidadAguaTraida || "0",
      consumoTotalAgua: formData.consumoTotalAgua || calculateConsumoTotal(
        formData.cantidadAguaBebida,
        formData.cantidadAguaLimpieza,
        formData.cantidadAguaTraida
      ),
      fecha: formData.fecha,
      fechaCreacion: editMode 
        ? consumoAguaData[editIndex!].fechaCreacion 
        : formatDateToDisplay(formData.fecha),
      fechaUltimaActualizacion: formatDateToDisplay(formData.fecha),
    }

    if (editMode && editIndex !== null) {
      // Actualizar elemento existente
      setConsumoAguaData((prev) => 
        prev.map((item, index) => 
          index === editIndex ? consumoAguaItem : item
        )
      )
    } else {
      // Agregar nuevo elemento
      setConsumoAguaData((prev) => [...prev, consumoAguaItem])
    }
    
    handleClose()
  }

  // Manejar cambios en los campos numéricos y calcular total automáticamente
  const handleNumberChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value }
    
    // Calcular automáticamente el consumo total si se modifican los campos base
    if (['cantidadAguaBebida', 'cantidadAguaLimpieza', 'cantidadAguaTraida'].includes(field)) {
      newFormData.consumoTotalAgua = calculateConsumoTotal(
        field === 'cantidadAguaBebida' ? value : formData.cantidadAguaBebida,
        field === 'cantidadAguaLimpieza' ? value : formData.cantidadAguaLimpieza,
        field === 'cantidadAguaTraida' ? value : formData.cantidadAguaTraida
      )
    }
    
    setFormData(newFormData)
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
              <Box sx={sectionHeaderStyle}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={headerBarStyle} />
                  <Typography variant="h5" fontWeight={600}>
                    Consumo de agua
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  startIcon={<Add />} 
                  sx={buttonStyles.primary}
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
                          Agua bebida (m³)
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Agua limpieza (m³)
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Agua traída (m³)
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Consumo total (m³)
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
                    {consumoAguaData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: "primary.main" }}>
                            {item.cantidadAguaBebida} m³
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: "secondary.main" }}>
                            {item.cantidadAguaLimpieza} m³
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {item.cantidadAguaTraida === "0" ? (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              N/A
                            </Typography>
                          ) : (
                            <Typography variant="body2" sx={{ fontWeight: 500, color: "warning.main" }}>
                              {item.cantidadAguaTraida} m³
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 600, 
                            color: "text.primary",
                            bgcolor: "grey.100",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            display: "inline-block"
                          }}>
                            {item.consumoTotalAgua} m³
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDateToDisplay(item.fecha)}</TableCell>
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
                              sx={buttonStyles.secondary}
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
            <ThemeProvider theme={theme}>
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
                      {viewMode ? "Detalle de consumo de agua" : editMode ? "Editar consumo de agua" : "Registro de consumo de agua"}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    {/* Cantidad de agua bebida y limpieza */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          placeholder="Cantidad de agua bebida (m³)"
                          variant="standard"
                          type="number"
                          inputProps={{ step: "0.1", min: "0" }}
                          value={formData.cantidadAguaBebida}
                          onChange={(e) => handleNumberChange('cantidadAguaBebida', e.target.value)}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "text.primary",
                            },
                          }}
                          helperText={!viewMode ? "Agua consumida directamente por los animales" : ""}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          placeholder="Cantidad de agua limpieza (m³)"
                          variant="standard"
                          type="number"
                          inputProps={{ step: "0.1", min: "0" }}
                          value={formData.cantidadAguaLimpieza}
                          onChange={(e) => handleNumberChange('cantidadAguaLimpieza', e.target.value)}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "text.primary",
                            },
                          }}
                          helperText={!viewMode ? "Agua utilizada para limpieza de instalaciones" : ""}
                        />
                      </Grid>
                    </Grid>

                    {/* Cantidad de agua traída y fecha */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          placeholder="Cantidad de agua traída (m³)"
                          variant="standard"
                          type="number"
                          inputProps={{ step: "0.1", min: "0" }}
                          value={formData.cantidadAguaTraida}
                          onChange={(e) => handleNumberChange('cantidadAguaTraida', e.target.value)}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "text.primary",
                            },
                          }}
                          helperText={!viewMode ? "Agua suministrada por camiones cisterna (opcional)" : ""}
                        />
                      </Grid>
                      <Grid item xs={6}>
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
                        />
                      </Grid>
                    </Grid>

                    {/* Consumo total calculado automáticamente */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Consumo total de agua (m³)"
                          variant="standard"
                          type="number"
                          value={formData.consumoTotalAgua}
                          onChange={(e) => setFormData((prev) => ({ ...prev, consumoTotalAgua: e.target.value }))}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "primary.main",
                              fontWeight: 600,
                            },
                            "& .MuiInputLabel-root": {
                              color: "primary.main",
                            },
                          }}
                          helperText={!viewMode ? "Se calcula automáticamente: agua bebida + agua limpieza + agua traída" : ""}
                        />
                      </Grid>
                    </Grid>

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
                            sx={buttonStyles.cancel}
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
            </ThemeProvider>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  )
}