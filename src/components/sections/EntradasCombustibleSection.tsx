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

interface EntradasCombustibleData {
  tipoCombustible: string
  fecha: string
  cantidades: string
  unidades: string
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

const TIPOS_COMBUSTIBLE = [
  "Gasóleo A (Automoción)",
  "Gasóleo B (Calefacción)",
  "Gasóleo C (Agrícola)",
  "Gasolina 95",
  "Gasolina 98",
  "Gas Natural Licuado (GNL)",
  "Gas Licuado del Petróleo (GLP)",
  "Propano",
  "Butano",
  "Biodiésel B7",
  "Biodiésel B20",
  "Fuel Oil",
]

const UNIDADES_MEDIDA = [
  "Litros",
  "Metros cúbicos (m³)",
  "Kilogramos (kg)",
  "Toneladas (t)",
  "Garrafas",
  "Bidones",
]

export function EntradasCombustibleSection() {
  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    tipoCombustible: "",
    fecha: "",
    cantidades: "",
    unidades: "",
  })

  // Estado para la tabla de entradas de combustible
  const [entradasCombustibleData, setEntradasCombustibleData] = useState<EntradasCombustibleData[]>([
    {
      tipoCombustible: "Gasóleo C (Agrícola)",
      fecha: "2024-01-15",
      cantidades: "2500",
      unidades: "Litros",
      fechaCreacion: "15/01/2024",
      fechaUltimaActualizacion: "16/01/2024",
    },
    {
      tipoCombustible: "Gasóleo B (Calefacción)",
      fecha: "2024-02-08",
      cantidades: "1800",
      unidades: "Litros",
      fechaCreacion: "08/02/2024",
      fechaUltimaActualizacion: "09/02/2024",
    },
    {
      tipoCombustible: "Propano",
      fecha: "2023-12-20",
      cantidades: "12",
      unidades: "Garrafas",
      fechaCreacion: "20/12/2023",
      fechaUltimaActualizacion: "22/12/2023",
    },
    {
      tipoCombustible: "Biodiésel B7",
      fecha: "2024-01-28",
      cantidades: "3200",
      unidades: "Litros",
      fechaCreacion: "28/01/2024",
      fechaUltimaActualizacion: "30/01/2024",
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
    const item = entradasCombustibleData[index]
    
    setFormData({
      tipoCombustible: item.tipoCombustible,
      fecha: item.fecha,
      cantidades: item.cantidades,
      unidades: item.unidades,
    })
    
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = entradasCombustibleData[index]
    
    setFormData({
      tipoCombustible: item.tipoCombustible,
      fecha: item.fecha,
      cantidades: item.cantidades,
      unidades: item.unidades,
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
      tipoCombustible: "",
      fecha: "",
      cantidades: "",
      unidades: "",
    })
  }

  const handleSubmit = () => {
    console.log("Datos de entradas de combustible:", formData)

    // Validar que los campos requeridos estén llenos
    if (!formData.tipoCombustible || !formData.fecha || !formData.cantidades || !formData.unidades) {
      alert("Por favor, completa todos los campos requeridos")
      return
    }

    const entradasCombustibleItem = {
      tipoCombustible: formData.tipoCombustible,
      fecha: formData.fecha,
      cantidades: formData.cantidades,
      unidades: formData.unidades,
      fechaCreacion: editMode 
        ? entradasCombustibleData[editIndex!].fechaCreacion 
        : formatDateToDisplay(formData.fecha),
      fechaUltimaActualizacion: formatDateToDisplay(formData.fecha),
    }

    if (editMode && editIndex !== null) {
      // Actualizar elemento existente
      setEntradasCombustibleData((prev) => 
        prev.map((item, index) => 
          index === editIndex ? entradasCombustibleItem : item
        )
      )
    } else {
      // Agregar nuevo elemento
      setEntradasCombustibleData((prev) => [...prev, entradasCombustibleItem])
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
                    Entradas de combustible
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
                          Tipo de combustible
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
                          Cantidades
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
                          Acciones
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entradasCombustibleData.map((item, index) => (
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
                            whiteSpace: 'nowrap',
                            fontWeight: 500
                          }}>
                            {item.tipoCombustible}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDateToDisplay(item.fecha)}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 600, 
                            color: "primary.main"
                          }}>
                            {parseFloat(item.cantidades).toLocaleString('es-ES')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            color: "text.secondary",
                            fontStyle: 'italic'
                          }}>
                            {item.unidades}
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
              <Paper sx={{ maxWidth: 1000, mx: "auto", borderRadius: 2, overflow: "hidden" }}>
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
                    {viewMode ? "Detalle de entrada de combustible" : editMode ? "Editar entrada de combustible" : "Registro de entrada de combustible"}
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Tipo de combustible y Fecha */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        select={!viewMode}
                        label="Tipo de combustible"
                        variant="standard"
                        value={formData.tipoCombustible}
                        onChange={(e) => setFormData((prev) => ({ ...prev, tipoCombustible: e.target.value }))}
                        InputProps={{
                          readOnly: viewMode,
                        }}
                        sx={{
                          "& .MuiInputBase-input": {
                            color: viewMode ? "text.secondary" : "text.primary",
                          },
                        }}
                      >
                        {!viewMode && TIPOS_COMBUSTIBLE.map((tipo) => (
                          <MenuItem key={tipo} value={tipo}>
                            {tipo}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Fecha de entrada"
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

                  {/* Cantidades y Unidades */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        placeholder="Cantidad recibida"
                        variant="standard"
                        type="number"
                        inputProps={{ step: "0.1", min: "0" }}
                        value={formData.cantidades}
                        onChange={(e) => setFormData((prev) => ({ ...prev, cantidades: e.target.value }))}
                        InputProps={{
                          readOnly: viewMode,
                        }}
                        sx={{
                          "& .MuiInputBase-input": {
                            color: viewMode ? "text.secondary" : "text.primary",
                            fontSize: "1.1rem",
                            fontWeight: 500,
                          },
                        }}
                        helperText={!viewMode ? "Cantidad numérica del combustible recibido" : ""}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        select={!viewMode}
                        label="Unidad de medida"
                        variant="standard"
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
                        helperText={!viewMode ? "Selecciona la unidad correspondiente al tipo de combustible" : ""}
                      >
                        {!viewMode && UNIDADES_MEDIDA.map((unidad) => (
                          <MenuItem key={unidad} value={unidad}>
                            {unidad}
                          </MenuItem>
                        ))}
                      </TextField>
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
                        Resumen de la entrada:
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Combustible:</strong> {formData.tipoCombustible}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Cantidad total:</strong> {parseFloat(formData.cantidades).toLocaleString('es-ES')} {formData.unidades}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Fecha de recepción:</strong> {formatDateToDisplay(formData.fecha)}
                      </Typography>
                    </Box>
                  )}

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