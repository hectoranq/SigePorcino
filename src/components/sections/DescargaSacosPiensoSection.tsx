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

interface DescargaSacosPiensoData {
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

const TIPOS_PIENSO = [
  "Pienso Iniciador Lechones",
  "Pienso Crecimiento Fase I",
  "Pienso Crecimiento Fase II",
  "Pienso Acabado Premium",
  "Pienso Terminación",
  "Pienso Reproductoras",
  "Pienso Gestantes",
  "Pienso Lactación",
]

export function DescargaSacosPiensoSection() {
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

  // Estado para la tabla de descarga de sacos de pienso
  const [descargaSacosPiensoData, setDescargaSacosPiensoData] = useState<DescargaSacosPiensoData[]>([
    {
      transportista: "Transportes Ganaderos del Norte S.L.",
      matricula: "3456-JKL",
      fechaFinalizacion: "2024-01-15",
      tipoPienso: "Pienso Iniciador Lechones",
      nroSacos: "120",
      nroLote: "240115",
      kg: "3000",
      fechaCreacion: "15/01/2024",
      fechaUltimaActualizacion: "16/01/2024",
    },
    {
      transportista: "Logística Piensos Ibérica S.A.",
      matricula: "7890-MNO",
      fechaFinalizacion: "2024-02-08",
      tipoPienso: "Pienso Crecimiento Fase II",
      nroSacos: "200",
      nroLote: "240208",
      kg: "5000",
      fechaCreacion: "08/02/2024",
      fechaUltimaActualizacion: "09/02/2024",
    },
    {
      transportista: "Distribuciones Agropecuarias del Centro",
      matricula: "2468-PQR",
      fechaFinalizacion: "2023-12-20",
      tipoPienso: "Pienso Acabado Premium",
      nroSacos: "150",
      nroLote: "231220",
      kg: "3750",
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
    const item = descargaSacosPiensoData[index]
    
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
    const item = descargaSacosPiensoData[index]
    
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
    console.log("Datos de descarga de sacos de pienso:", formData)

    // Validar que los campos requeridos estén llenos
    if (!formData.transportista || !formData.matricula || !formData.fechaFinalizacion || !formData.tipoPienso) {
      alert("Por favor, completa todos los campos requeridos")
      return
    }

    const descargaSacosPiensoItem = {
      transportista: formData.transportista,
      matricula: formData.matricula,
      fechaFinalizacion: formData.fechaFinalizacion,
      tipoPienso: formData.tipoPienso,
      nroSacos: formData.nroSacos,
      nroLote: formData.nroLote,
      kg: formData.kg,
      fechaCreacion: editMode 
        ? descargaSacosPiensoData[editIndex!].fechaCreacion 
        : formatDateToDisplay(formData.fechaFinalizacion),
      fechaUltimaActualizacion: formatDateToDisplay(formData.fechaFinalizacion),
    }

    if (editMode && editIndex !== null) {
      // Actualizar elemento existente
      setDescargaSacosPiensoData((prev) => 
        prev.map((item, index) => 
          index === editIndex ? descargaSacosPiensoItem : item
        )
      )
    } else {
      // Agregar nuevo elemento
      setDescargaSacosPiensoData((prev) => [...prev, descargaSacosPiensoItem])
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
                    Descarga de sacos de pienso
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
                    {descargaSacosPiensoData.map((item, index) => (
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
                        <TableCell>{item.tipoPienso}</TableCell>
                        <TableCell>{item.nroSacos}</TableCell>
                        <TableCell>{item.nroLote}</TableCell>
                        <TableCell>{item.kg} kg</TableCell>
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
                      {viewMode ? "Detalle de descarga de sacos de pienso" : editMode ? "Editar descarga de sacos de pienso" : "Registro de descarga de sacos de pienso"}
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
                          placeholder="Matrícula del vehículo"
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
                          label="Tipo de pienso"
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
                          {!viewMode && TIPOS_PIENSO.map((tipo) => (
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
                          placeholder="Número de sacos"
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
                          placeholder="Kilogramos"
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