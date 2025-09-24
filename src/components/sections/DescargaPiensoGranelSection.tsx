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

interface DescargaPiensoGranelData {
  transportista: string
  matricula: string
  fechaFinalizacion: string
  tipoPienso: string
  nroSacos: string
  nroLote: string
  kg: string
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

const TIPOS_PIENSO_GRANEL = [
  "Pienso Iniciador Lechones - Granel",
  "Pienso Crecimiento Fase I - Granel",
  "Pienso Crecimiento Fase II - Granel",
  "Pienso Acabado Premium - Granel",
  "Pienso Terminación - Granel",
  "Pienso Reproductoras - Granel",
  "Pienso Gestantes - Granel",
  "Pienso Lactación - Granel",
  "Concentrado Proteico - Granel",
  "Premezcla Vitamínica - Granel",
]

export function DescargaPiensoGranelSection() {
  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    transportista: "",
    matricula: "",
    fechaFinalizacion: "",
    tipoPienso: "",
    nroSacos: "",
    nroLote: "",
    kg: "",
  })

  // Estado para la tabla de descarga de pienso a granel
  const [descargaPiensoGranelData, setDescargaPiensoGranelData] = useState<DescargaPiensoGranelData[]>([
    {
      transportista: "Transportes Graneles Ibéricos S.A.",
      matricula: "5678-ABC",
      fechaFinalizacion: "2024-01-20",
      tipoPienso: "Pienso Iniciador Lechones - Granel",
      nroSacos: "0",
      nroLote: "240120",
      kg: "15000",
      fechaCreacion: "20/01/2024",
      fechaUltimaActualizacion: "21/01/2024",
    },
    {
      transportista: "Logística Agroalimentaria del Sur",
      matricula: "9012-DEF",
      fechaFinalizacion: "2024-02-15",
      tipoPienso: "Pienso Crecimiento Fase II - Granel",
      nroSacos: "0",
      nroLote: "240215",
      kg: "22000",
      fechaCreacion: "15/02/2024",
      fechaUltimaActualizacion: "16/02/2024",
    },
    {
      transportista: "Distribuidora de Piensos a Granel S.L.",
      matricula: "3456-GHI",
      fechaFinalizacion: "2024-01-05",
      tipoPienso: "Concentrado Proteico - Granel",
      nroSacos: "0",
      nroLote: "240105",
      kg: "8500",
      fechaCreacion: "05/01/2024",
      fechaUltimaActualizacion: "06/01/2024",
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
    const item = descargaPiensoGranelData[index]
    
    setFormData({
      transportista: item.transportista,
      matricula: item.matricula,
      fechaFinalizacion: item.fechaFinalizacion,
      tipoPienso: item.tipoPienso,
      nroSacos: item.nroSacos,
      nroLote: item.nroLote,
      kg: item.kg,
    })
    
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = descargaPiensoGranelData[index]
    
    setFormData({
      transportista: item.transportista,
      matricula: item.matricula,
      fechaFinalizacion: item.fechaFinalizacion,
      tipoPienso: item.tipoPienso,
      nroSacos: item.nroSacos,
      nroLote: item.nroLote,
      kg: item.kg,
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
      transportista: "",
      matricula: "",
      fechaFinalizacion: "",
      tipoPienso: "",
      nroSacos: "",
      nroLote: "",
      kg: "",
    })
  }

  const handleSubmit = () => {
    console.log("Datos de descarga de pienso a granel:", formData)

    // Validar que los campos requeridos estén llenos
    if (!formData.transportista || !formData.matricula || !formData.fechaFinalizacion || !formData.tipoPienso) {
      alert("Por favor, completa todos los campos requeridos")
      return
    }

    const descargaPiensoGranelItem = {
      transportista: formData.transportista,
      matricula: formData.matricula,
      fechaFinalizacion: formData.fechaFinalizacion,
      tipoPienso: formData.tipoPienso,
      nroSacos: formData.nroSacos || "0", // Por defecto 0 para granel
      nroLote: formData.nroLote,
      kg: formData.kg,
      fechaCreacion: editMode 
        ? descargaPiensoGranelData[editIndex!].fechaCreacion 
        : formatDateToDisplay(formData.fechaFinalizacion),
      fechaUltimaActualizacion: formatDateToDisplay(formData.fechaFinalizacion),
    }

    if (editMode && editIndex !== null) {
      // Actualizar elemento existente
      setDescargaPiensoGranelData((prev) => 
        prev.map((item, index) => 
          index === editIndex ? descargaPiensoGranelItem : item
        )
      )
    } else {
      // Agregar nuevo elemento
      setDescargaPiensoGranelData((prev) => [...prev, descargaPiensoGranelItem])
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
                    Descarga de pienso a granel
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
                          Transportista
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Matrícula
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Fecha finalización
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Tipo de pienso
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Nro sacos
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Nro lote
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
                          Acciones
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {descargaPiensoGranelData.map((item, index) => (
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
                            whiteSpace: 'nowrap' 
                          }}>
                            {item.transportista}
                          </Typography>
                        </TableCell>
                        <TableCell>{item.matricula}</TableCell>
                        <TableCell>{formatDateToDisplay(item.fechaFinalizacion)}</TableCell>
                        <TableCell sx={{ maxWidth: 180 }}>
                          <Typography variant="body2" sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap' 
                          }}>
                            {item.tipoPienso}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {item.nroSacos === "0" ? (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              N/A (Granel)
                            </Typography>
                          ) : (
                            item.nroSacos
                          )}
                        </TableCell>
                        <TableCell>{item.nroLote}</TableCell>
                        <TableCell>{item.kg} kg</TableCell>
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
                      {viewMode ? "Detalle de descarga de pienso a granel" : editMode ? "Editar descarga de pienso a granel" : "Registro de descarga de pienso a granel"}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    {/* Transportista y Matrícula */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          placeholder="Transportista"
                          variant="standard"
                          value={formData.transportista}
                          onChange={(e) => setFormData((prev) => ({ ...prev, transportista: e.target.value }))}
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
                          placeholder="Matrícula del vehículo cisterna"
                          variant="standard"
                          value={formData.matricula}
                          onChange={(e) => setFormData((prev) => ({ ...prev, matricula: e.target.value }))}
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

                    {/* Fecha de finalización y Tipo de pienso */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Fecha de finalización"
                          type="date"
                          variant="standard"
                          value={formData.fechaFinalizacion}
                          onChange={(e) => setFormData((prev) => ({ ...prev, fechaFinalizacion: e.target.value }))}
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
                          label="Tipo de pienso a granel"
                          variant="standard"
                          value={formData.tipoPienso}
                          onChange={(e) => setFormData((prev) => ({ ...prev, tipoPienso: e.target.value }))}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "text.primary",
                            },
                          }}
                        >
                          {!viewMode && TIPOS_PIENSO_GRANEL.map((tipo) => (
                            <MenuItem key={tipo} value={tipo}>
                              {tipo}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>

                    {/* Número de sacos, Número de lote y Kg */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          placeholder="Número de sacos (0 para granel)"
                          variant="standard"
                          type="number"
                          value={formData.nroSacos}
                          onChange={(e) => setFormData((prev) => ({ ...prev, nroSacos: e.target.value }))}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "text.primary",
                            },
                          }}
                          helperText={!viewMode ? "Generalmente 0 para entregas a granel" : ""}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          placeholder="Número de lote"
                          variant="standard"
                          type="number"
                          value={formData.nroLote}
                          onChange={(e) => setFormData((prev) => ({ ...prev, nroLote: e.target.value }))}
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
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          placeholder="Kilogramos totales"
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
                          helperText={!viewMode ? "Peso total de la descarga" : ""}
                        />
                      </Grid>
                    </Grid>

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