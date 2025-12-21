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

interface ArcoDesinfeccionData {
  productoEmpleado: string
  cantidadEmpleada: string
  responsable: string
  fecha: string
  sistemaEmpleado: {
    arco: boolean
    vado: boolean
    mochila: boolean
  }
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

const RESPONSABLES = [
  "Juan Carlos Martínez",
  "María Elena González",
  "Pedro Antonio López",
  "Ana Isabel Rodríguez",
  "José Manuel Fernández",
  "Carmen Rosa Torres",
  "Francisco Javier Silva"
]

export function ArcoDesinfeccionSection() {
  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    productoEmpleado: "",
    cantidadEmpleada: "",
    responsable: "",
    fecha: "",
    sistemaEmpleado: {
      arco: false,
      vado: false,
      mochila: false,
    },
  })

  // Estado para la tabla de arco de desinfección
  const [arcoDesinfeccionData, setArcoDesinfeccionData] = useState<ArcoDesinfeccionData[]>([
    {
      productoEmpleado: "Solución desinfectante vehicular",
      cantidadEmpleada: "5000",
      responsable: "Juan Carlos Martínez",
      fecha: "2023-11-14",
      sistemaEmpleado: { arco: true, vado: false, mochila: false },
      fechaCreacion: "14/11/2023",
      fechaUltimaActualizacion: "15/11/2023",
    },
    {
      productoEmpleado: "Desinfectante de amplio espectro",
      cantidadEmpleada: "3500",
      responsable: "Pedro Antonio López",
      fecha: "2024-09-08",
      sistemaEmpleado: { arco: false, vado: true, mochila: false },
      fechaCreacion: "08/09/2024",
      fechaUltimaActualizacion: "09/09/2024",
    },
    {
      productoEmpleado: "Hipoclorito de sodio al 12%",
      cantidadEmpleada: "1200",
      responsable: "Ana Isabel Rodríguez",
      fecha: "2023-06-25",
      sistemaEmpleado: { arco: false, vado: false, mochila: true },
      fechaCreacion: "25/06/2023",
      fechaUltimaActualizacion: "27/06/2023",
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
    const item = arcoDesinfeccionData[index]
    
    setFormData({
      productoEmpleado: item.productoEmpleado,
      cantidadEmpleada: item.cantidadEmpleada,
      responsable: item.responsable,
      fecha: item.fecha,
      sistemaEmpleado: {
        arco: item.sistemaEmpleado.arco,
        vado: item.sistemaEmpleado.vado,
        mochila: item.sistemaEmpleado.mochila,
      },
    })
    
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = arcoDesinfeccionData[index]
    
    setFormData({
      productoEmpleado: item.productoEmpleado,
      cantidadEmpleada: item.cantidadEmpleada,
      responsable: item.responsable,
      fecha: item.fecha,
      sistemaEmpleado: {
        arco: item.sistemaEmpleado.arco,
        vado: item.sistemaEmpleado.vado,
        mochila: item.sistemaEmpleado.mochila,
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
      productoEmpleado: "",
      cantidadEmpleada: "",
      responsable: "",
      fecha: "",
      sistemaEmpleado: {
        arco: false,
        vado: false,
        mochila: false,
      },
    })
  }

  const handleSubmit = () => {
    console.log("Datos de arco de desinfección:", formData)

    // Validar que los campos requeridos estén llenos
    if (!formData.productoEmpleado || !formData.responsable || !formData.fecha) {
      alert("Por favor, completa todos los campos requeridos")
      return
    }

    const arcoDesinfeccionItem = {
      productoEmpleado: formData.productoEmpleado,
      cantidadEmpleada: formData.cantidadEmpleada,
      responsable: formData.responsable,
      fecha: formData.fecha,
      sistemaEmpleado: {
        arco: formData.sistemaEmpleado.arco,
        vado: formData.sistemaEmpleado.vado,
        mochila: formData.sistemaEmpleado.mochila,
      },
      fechaCreacion: editMode 
        ? arcoDesinfeccionData[editIndex!].fechaCreacion 
        : formatDateToDisplay(formData.fecha),
      fechaUltimaActualizacion: formatDateToDisplay(formData.fecha),
    }

    if (editMode && editIndex !== null) {
      // Actualizar elemento existente
      setArcoDesinfeccionData((prev) => 
        prev.map((item, index) => 
          index === editIndex ? arcoDesinfeccionItem : item
        )
      )
    } else {
      // Agregar nuevo elemento
      setArcoDesinfeccionData((prev) => [...prev, arcoDesinfeccionItem])
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
                    Arco de desinfección
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
                          Producto empleado
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Cantidad empleada (ml)
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
                    {arcoDesinfeccionData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>{item.productoEmpleado}</TableCell>
                        <TableCell>{item.cantidadEmpleada} ml</TableCell>
                        <TableCell>{item.responsable}</TableCell>
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
                      {viewMode ? "Detalle de arco de desinfección" : editMode ? "Editar arco de desinfección" : "Registro de arco de desinfección"}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    {/* Producto empleado y Cantidad empleada */}
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
                          placeholder="Cantidad empleada (ml)"
                          variant="standard"
                          type="number"
                          value={formData.cantidadEmpleada}
                          onChange={(e) => setFormData((prev) => ({ ...prev, cantidadEmpleada: e.target.value }))}
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

                    {/* Responsable y Fecha */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
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

                    {/* Sistema empleado - Checkboxes */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: "text.primary" }}>
                        Sistema empleado
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Checkbox
                              checked={formData.sistemaEmpleado.arco}
                              onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                sistemaEmpleado: {
                                  ...prev.sistemaEmpleado,
                                  arco: e.target.checked
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
                              Arco
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Checkbox
                              checked={formData.sistemaEmpleado.vado}
                              onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                sistemaEmpleado: {
                                  ...prev.sistemaEmpleado,
                                  vado: e.target.checked
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
                              Vado
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Checkbox
                              checked={formData.sistemaEmpleado.mochila}
                              onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                sistemaEmpleado: {
                                  ...prev.sistemaEmpleado,
                                  mochila: e.target.checked
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
                              Mochila
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