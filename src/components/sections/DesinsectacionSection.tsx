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

interface DesinsectacionData {
  productoEmpleado: string
  dondeSeEmpleo: string
  aplicador: string
  fecha: string
  supervisado: string
  tipoProducto: {
    lavado: boolean
    desinfectante: boolean
  }
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

export function DesinsectacionSection() {
  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    productoEmpleado: "",
    dondeSeEmpleo: "",
    aplicador: "",
    fecha: "",
    supervisado: "",
    tipoProducto: {
      lavado: false,
      desinfectante: false,
    },
  })

  // Estado para la tabla de desinsectación - ACTUALIZADO CON NUEVOS CAMPOS
  const [desinsectacionData, setDesinsectacionData] = useState<DesinsectacionData[]>([
    {
      productoEmpleado: "Cipermetrina 10%",
      dondeSeEmpleo: "Naves de animales y almacén",
      aplicador: "Carlos Manuel Rodríguez Silva",
      fecha: "2023-08-15",
      supervisado: "María Elena González",
      tipoProducto: { lavado: true, desinfectante: false },
      fechaCreacion: "15/08/2023",
      fechaUltimaActualizacion: "18/08/2023",
    },
    {
      productoEmpleado: "Deltametrina 2.5%",
      dondeSeEmpleo: "Oficinas y comedores",
      aplicador: "Ana Patricia Moreno López",
      fecha: "2024-06-10",
      supervisado: "Pedro Antonio López",
      tipoProducto: { lavado: false, desinfectante: true },
      fechaCreacion: "10/06/2024",
      fechaUltimaActualizacion: "12/06/2024",
    },
    {
      productoEmpleado: "Imidacloprid 20%",
      dondeSeEmpleo: "Zonas exteriores y silos",
      aplicador: "Roberto Alejandro Vega Torres",
      fecha: "2023-03-22",
      supervisado: "Carmen Rosa Torres",
      tipoProducto: { lavado: true, desinfectante: true },
      fechaCreacion: "22/03/2023",
      fechaUltimaActualizacion: "25/03/2023",
    },
  ])

  const handleOpen = () => {
    setEditMode(false)
    setViewMode(false)
    setEditIndex(null)
    setOpen(true)
  }

  // FUNCIÓN HANDLEEDIT ACTUALIZADA CON NUEVOS CAMPOS
  const handleEdit = (index: number) => {
    const item = desinsectacionData[index]
    
    setFormData({
      productoEmpleado: item.productoEmpleado,
      dondeSeEmpleo: item.dondeSeEmpleo,
      aplicador: item.aplicador,
      fecha: item.fecha,
      supervisado: item.supervisado,
      tipoProducto: {
        lavado: item.tipoProducto.lavado,
        desinfectante: item.tipoProducto.desinfectante,
      },
    })
    
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // FUNCIÓN VER MÁS ACTUALIZADA CON NUEVOS CAMPOS
  const handleVerMas = (index: number) => {
    const item = desinsectacionData[index]
    
    setFormData({
      productoEmpleado: item.productoEmpleado,
      dondeSeEmpleo: item.dondeSeEmpleo,
      aplicador: item.aplicador,
      fecha: item.fecha,
      supervisado: item.supervisado,
      tipoProducto: {
        lavado: item.tipoProducto.lavado,
        desinfectante: item.tipoProducto.desinfectante,
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
      dondeSeEmpleo: "",
      aplicador: "",
      fecha: "",
      supervisado: "",
      tipoProducto: {
        lavado: false,
        desinfectante: false,
      },
    })
  }

  // HANDLESUBMIT ACTUALIZADO CON NUEVOS CAMPOS
  const handleSubmit = () => {
    console.log("Datos de desinsectación:", formData)

    // Validar que los campos requeridos estén llenos
    if (!formData.aplicador || !formData.productoEmpleado || !formData.fecha) {
      alert("Por favor, completa todos los campos requeridos")
      return
    }

    const desinsectacionItem = {
      productoEmpleado: formData.productoEmpleado,
      dondeSeEmpleo: formData.dondeSeEmpleo,
      aplicador: formData.aplicador,
      fecha: formData.fecha,
      supervisado: formData.supervisado,
      tipoProducto: {
        lavado: formData.tipoProducto.lavado,
        desinfectante: formData.tipoProducto.desinfectante,
      },
      fechaCreacion: editMode 
        ? desinsectacionData[editIndex!].fechaCreacion 
        : formatDateToDisplay(formData.fecha),
      fechaUltimaActualizacion: formatDateToDisplay(formData.fecha),
    }

    if (editMode && editIndex !== null) {
      // Actualizar elemento existente
      setDesinsectacionData((prev) => 
        prev.map((item, index) => 
          index === editIndex ? desinsectacionItem : item
        )
      )
    } else {
      // Agregar nuevo elemento
      setDesinsectacionData((prev) => [...prev, desinsectacionItem])
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
                    Desinsectación
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
                          Nave
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Aplicador
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
                          Supervisado por
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
                    {desinsectacionData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>{item.productoEmpleado}</TableCell>
                        <TableCell>{item.dondeSeEmpleo}</TableCell>
                        <TableCell>{item.aplicador}</TableCell>
                        <TableCell>{formatDateToDisplay(item.fecha)}</TableCell>
                        <TableCell>{item.supervisado}</TableCell>
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
                      {viewMode ? "Detalle de desinsectación" : editMode ? "Editar desinsectación" : "Registro de desinsectación"}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    {/* NUEVO FORMULARIO CON LOS CAMPOS SOLICITADOS */}
                    
                    {/* Producto empleado y Donde se empleó */}
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
                          placeholder="Donde se empleó"
                          variant="standard"
                          value={formData.dondeSeEmpleo}
                          onChange={(e) => setFormData((prev) => ({ ...prev, dondeSeEmpleo: e.target.value }))}
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

                    {/* Aplicador (ancho completo) */}
                    <TextField
                      fullWidth
                      placeholder="Aplicador"
                      variant="standard"
                      value={formData.aplicador}
                      onChange={(e) => setFormData((prev) => ({ ...prev, aplicador: e.target.value }))}
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

                   

                    {/* Fecha y Supervisado */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
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
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          select={!viewMode}
                          label="Supervisado"
                          variant="standard"
                          value={formData.supervisado}
                          onChange={(e) => setFormData((prev) => ({ ...prev, supervisado: e.target.value }))}
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
 {/* Tipo de producto - Checkboxes */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: "text.primary" }}>
                        Tipo de producto
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Checkbox
                              checked={formData.tipoProducto.lavado}
                              onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                tipoProducto: {
                                  ...prev.tipoProducto,
                                  lavado: e.target.checked
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
                              Lavado
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Checkbox
                              checked={formData.tipoProducto.desinfectante}
                              onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                tipoProducto: {
                                  ...prev.tipoProducto,
                                  desinfectante: e.target.checked
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
                              Desinfectante
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