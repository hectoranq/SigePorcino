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

interface DesratizacionData {
  aplicador: string
  dni: string
  rodenticida: string
  ceboAtrayente: string
  trampaAdhesiva: string
  fecha: string
  supervisado: string
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

export function DesratizacionSection() {
  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false) // NUEVO ESTADO PARA MODO VISUALIZACIÓN
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    aplicador: "",
    dni: "",
    rodenticida: "",
    ceboAtrayente: "",
    trampaAdhesiva: "",
    fecha: "",
    supervisado: "",
  })

  // Estado para la tabla de desratización
  const [desratizacionData, setDesratizacionData] = useState<DesratizacionData[]>([
    {
      aplicador: "Jose Antonio Capdevilla Torrejon",
      dni: "12345678A",
      rodenticida: "Warfarina 0.005%",
      ceboAtrayente: "Cebo granulado",
      trampaAdhesiva: "Trampa adhesiva XL",
      fecha: "2023-07-12",
      supervisado: "Juan Carlos Martínez",
      fechaCreacion: "12/07/2023",
      fechaUltimaActualizacion: "15/07/2023",
    },
    {
      aplicador: "Mario Antonio Alvarez Peredo",
      dni: "87654321B",
      rodenticida: "Brodifacoum 0.005%",
      ceboAtrayente: "Cebo en bloque",
      trampaAdhesiva: "Trampa adhesiva estándar",
      fecha: "2024-05-30",
      supervisado: "María Elena González",
      fechaCreacion: "30/05/2024",
      fechaUltimaActualizacion: "02/06/2024",
    },
    {
      aplicador: "Juana Adriana Obregon",
      dni: "11223344C",
      rodenticida: "Difenacoum 0.005%",
      ceboAtrayente: "Cebo líquido",
      trampaAdhesiva: "Trampa adhesiva grande",
      fecha: "2023-02-01",
      supervisado: "Pedro Antonio López",
      fechaCreacion: "01/02/2023",
      fechaUltimaActualizacion: "05/02/2023",
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
    const item = desratizacionData[index]
    
    setFormData({
      aplicador: item.aplicador,
      dni: item.dni,
      rodenticida: item.rodenticida,
      ceboAtrayente: item.ceboAtrayente,
      trampaAdhesiva: item.trampaAdhesiva,
      fecha: item.fecha,
      supervisado: item.supervisado,
    })
    
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // NUEVA FUNCIÓN PARA "VER MÁS"
  const handleVerMas = (index: number) => {
    const item = desratizacionData[index]
    
    setFormData({
      aplicador: item.aplicador,
      dni: item.dni,
      rodenticida: item.rodenticida,
      ceboAtrayente: item.ceboAtrayente,
      trampaAdhesiva: item.trampaAdhesiva,
      fecha: item.fecha,
      supervisado: item.supervisado,
    })
    
    setEditMode(false)
    setViewMode(true) // ACTIVAR MODO VISUALIZACIÓN
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
    setViewMode(false) // RESETEAR MODO VISUALIZACIÓN
    setEditIndex(null)
    setFormData({
      aplicador: "",
      dni: "",
      rodenticida: "",
      ceboAtrayente: "",
      trampaAdhesiva: "",
      fecha: "",
      supervisado: "",
    })
  }

  const handleSubmit = () => {
    console.log("Datos de desratización:", formData)

    // Validar que los campos requeridos estén llenos
    if (!formData.aplicador || !formData.dni || !formData.fecha) {
      alert("Por favor, completa todos los campos requeridos")
      return
    }

    const desratizacionItem = {
      aplicador: formData.aplicador,
      dni: formData.dni,
      rodenticida: formData.rodenticida,
      ceboAtrayente: formData.ceboAtrayente,
      trampaAdhesiva: formData.trampaAdhesiva,
      fecha: formData.fecha,
      supervisado: formData.supervisado,
      fechaCreacion: editMode 
        ? desratizacionData[editIndex!].fechaCreacion 
        : formatDateToDisplay(formData.fecha),
      fechaUltimaActualizacion: formatDateToDisplay(formData.fecha),
    }

    if (editMode && editIndex !== null) {
      // Actualizar elemento existente
      setDesratizacionData((prev) => 
        prev.map((item, index) => 
          index === editIndex ? desratizacionItem : item
        )
      )
    } else {
      // Agregar nuevo elemento
      setDesratizacionData((prev) => [...prev, desratizacionItem])
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
                    Desratización
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
                          Aplicador
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          DNI
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Rodenticida
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
                    {desratizacionData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>{item.aplicador}</TableCell>
                        <TableCell>{item.dni}</TableCell>
                        <TableCell>{item.rodenticida}</TableCell>
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
                {/* HEADER DINÁMICO SEGÚN EL MODO */}
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
                    {viewMode ? "Detalle de desratización" : editMode ? "Editar desratización" : "Registro de desratización"}
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Aplicador y DNI */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        placeholder="Aplicador"
                        variant="standard"
                        value={formData.aplicador}
                        onChange={(e) => setFormData((prev) => ({ ...prev, aplicador: e.target.value }))}
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
                        placeholder="DNI"
                        variant="standard"
                        value={formData.dni}
                        onChange={(e) => setFormData((prev) => ({ ...prev, dni: e.target.value }))}
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

                  {/* Rodenticida y Cebo atrayente */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        placeholder="Rodenticida"
                        variant="standard"
                        value={formData.rodenticida}
                        onChange={(e) => setFormData((prev) => ({ ...prev, rodenticida: e.target.value }))}
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
                        placeholder="Cebo atrayente de roedores"
                        variant="standard"
                        value={formData.ceboAtrayente}
                        onChange={(e) => setFormData((prev) => ({ ...prev, ceboAtrayente: e.target.value }))}
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

                  {/* Trampa adhesiva */}
                  <TextField
                    fullWidth
                    placeholder="Trampa adhesiva de roedores"
                    variant="standard"
                    value={formData.trampaAdhesiva}
                    onChange={(e) => setFormData((prev) => ({ ...prev, trampaAdhesiva: e.target.value }))}
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

                  {/* BOTONES DINÁMICOS SEGÚN EL MODO */}
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