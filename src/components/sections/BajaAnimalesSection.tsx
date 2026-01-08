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
  Checkbox,
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

interface BajaAnimalesData {
  nroCrotal: string
  causa: string
  fechaFallecimiento: string
  tipoFallecimiento: {
    muerte: boolean
    sacrificio: boolean
  }
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

export function BajaAnimalesSection() {
  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    nroCrotal: "",
    causa: "",
    fechaFallecimiento: "",
    tipoFallecimiento: {
      muerte: false,
      sacrificio: false,
    },
  })

  // Estado para la tabla de baja de animales
  const [bajaAnimalesData, setBajaAnimalesData] = useState<BajaAnimalesData[]>([
    {
      nroCrotal: "ES140520001234",
      causa: "Enfermedad respiratoria crónica, sin respuesta al tratamiento veterinario",
      fechaFallecimiento: "2024-01-15",
      tipoFallecimiento: { muerte: true, sacrificio: false },
      fechaCreacion: "15/01/2024",
      fechaUltimaActualizacion: "16/01/2024",
    },
    {
      nroCrotal: "ES140520005678",
      causa: "Sacrificio de emergencia por lesión grave en extremidad posterior",
      fechaFallecimiento: "2024-02-28",
      tipoFallecimiento: { muerte: false, sacrificio: true },
      fechaCreacion: "28/02/2024",
      fechaUltimaActualizacion: "01/03/2024",
    },
    {
      nroCrotal: "ES140520009876",
      causa: "Muerte súbita, posible problema cardíaco según necropsia",
      fechaFallecimiento: "2023-12-10",
      tipoFallecimiento: { muerte: true, sacrificio: false },
      fechaCreacion: "10/12/2023",
      fechaUltimaActualizacion: "12/12/2023",
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
    const item = bajaAnimalesData[index]
    
    setFormData({
      nroCrotal: item.nroCrotal,
      causa: item.causa,
      fechaFallecimiento: item.fechaFallecimiento,
      tipoFallecimiento: {
        muerte: item.tipoFallecimiento.muerte,
        sacrificio: item.tipoFallecimiento.sacrificio,
      },
    })
    
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = bajaAnimalesData[index]
    
    setFormData({
      nroCrotal: item.nroCrotal,
      causa: item.causa,
      fechaFallecimiento: item.fechaFallecimiento,
      tipoFallecimiento: {
        muerte: item.tipoFallecimiento.muerte,
        sacrificio: item.tipoFallecimiento.sacrificio,
      },
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
      nroCrotal: "",
      causa: "",
      fechaFallecimiento: "",
      tipoFallecimiento: {
        muerte: false,
        sacrificio: false,
      },
    })
  }

  const handleSubmit = () => {
    console.log("Datos de baja de animales:", formData)

    // Validar que los campos requeridos estén llenos
    if (!formData.nroCrotal || !formData.causa || !formData.fechaFallecimiento) {
      alert("Por favor, completa todos los campos requeridos")
      return
    }

    const bajaAnimalesItem = {
      nroCrotal: formData.nroCrotal,
      causa: formData.causa,
      fechaFallecimiento: formData.fechaFallecimiento,
      tipoFallecimiento: {
        muerte: formData.tipoFallecimiento.muerte,
        sacrificio: formData.tipoFallecimiento.sacrificio,
      },
      fechaCreacion: editMode 
        ? bajaAnimalesData[editIndex!].fechaCreacion 
        : formatDateToDisplay(formData.fechaFallecimiento),
      fechaUltimaActualizacion: formatDateToDisplay(formData.fechaFallecimiento),
    }

    if (editMode && editIndex !== null) {
      // Actualizar elemento existente
      setBajaAnimalesData((prev) => 
        prev.map((item, index) => 
          index === editIndex ? bajaAnimalesItem : item
        )
      )
    } else {
      // Agregar nuevo elemento
      setBajaAnimalesData((prev) => [...prev, bajaAnimalesItem])
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
              <Box sx={sectionHeaderStyle}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={headerBarStyle} />
                  <Typography variant="h5" fontWeight={600}>
                    Baja de animales
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
                          Nro de crotal
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Causa
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Fecha de fallecimiento
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
                    {bajaAnimalesData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>{item.nroCrotal}</TableCell>
                        <TableCell sx={{ maxWidth: 300 }}>
                          <Typography variant="body2" sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap' 
                          }}>
                            {item.causa}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDateToDisplay(item.fechaFallecimiento)}</TableCell>
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
                      {viewMode ? "Detalle de baja de animal" : editMode ? "Editar baja de animal" : "Registro de baja de animal"}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    {/* Nro de crotal */}
                    <TextField
                      fullWidth
                      placeholder="Nro de crotal"
                      variant="standard"
                      value={formData.nroCrotal}
                      onChange={(e) => setFormData((prev) => ({ ...prev, nroCrotal: e.target.value }))}
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

                    {/* Causa */}
                    <TextField
                      fullWidth
                      placeholder="Causa"
                      variant="standard"
                      multiline
                      rows={3}
                      value={formData.causa}
                      onChange={(e) => setFormData((prev) => ({ ...prev, causa: e.target.value }))}
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

                    {/* Fecha de fallecimiento */}
                    <TextField
                      fullWidth
                      label="Fecha de fallecimiento"
                      type="date"
                      variant="standard"
                      value={formData.fechaFallecimiento}
                      onChange={(e) => setFormData((prev) => ({ ...prev, fechaFallecimiento: e.target.value }))}
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

                    {/* Tipo de fallecimiento - Checkboxes */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: "text.primary" }}>
                        Tipo de fallecimiento
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Checkbox
                              checked={formData.tipoFallecimiento.muerte}
                              onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                tipoFallecimiento: {
                                  ...prev.tipoFallecimiento,
                                  muerte: e.target.checked
                                }
                              }))}
                              disabled={viewMode}
                              sx={{ 
                                color: "primary.main",
                                "&.Mui-checked": {
                                  color: "primary.main",
                                },
                              }}
                            />
                            <Typography variant="body2" sx={{ color: viewMode ? "text.secondary" : "text.primary" }}>
                              Muerte
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Checkbox
                              checked={formData.tipoFallecimiento.sacrificio}
                              onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                tipoFallecimiento: {
                                  ...prev.tipoFallecimiento,
                                  sacrificio: e.target.checked
                                }
                              }))}
                              disabled={viewMode}
                              sx={{ 
                                color: "primary.main",
                                "&.Mui-checked": {
                                  color: "primary.main",
                                },
                              }}
                            />
                            <Typography variant="body2" sx={{ color: viewMode ? "text.secondary" : "text.primary" }}>
                              Sacrificio
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

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