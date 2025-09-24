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
  IconButton,
  Chip,
} from "@mui/material"
import { Add, KeyboardArrowDown, CloudUpload, Download } from "@mui/icons-material"
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

interface ArchivoData {
  nombre: string
  url: string
  tamaño: number
  fecha: string
}

interface EtiquetasPiensoData {
  nombre: string
  archivo: ArchivoData | null
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

export function EtiquetasPiensoSection() {
  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    archivo: null as File | null,
  })

  // Estado para la tabla de etiquetas de pienso
  const [etiquetasPiensoData, setEtiquetasPiensoData] = useState<EtiquetasPiensoData[]>([
    {
      nombre: "Pienso Iniciador Lechones - Premium Plus",
      archivo: {
        nombre: "etiqueta_iniciador_lechones.pdf",
        url: "/uploads/etiqueta_iniciador_lechones.pdf",
        tamaño: 245760,
        fecha: "2024-01-15"
      },
      fechaCreacion: "15/01/2024",
      fechaUltimaActualizacion: "16/01/2024",
    },
    {
      nombre: "Pienso Crecimiento - Fase II Engorde",
      archivo: {
        nombre: "etiqueta_crecimiento_fase2.pdf",
        url: "/uploads/etiqueta_crecimiento_fase2.pdf",
        tamaño: 187520,
        fecha: "2024-02-08"
      },
      fechaCreacion: "08/02/2024",
      fechaUltimaActualizacion: "09/02/2024",
    },
    {
      nombre: "Pienso Acabado - Terminación Premium",
      archivo: {
        nombre: "etiqueta_acabado_terminacion.pdf",
        url: "/uploads/etiqueta_acabado_terminacion.pdf",
        tamaño: 312480,
        fecha: "2023-12-20"
      },
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
    const item = etiquetasPiensoData[index]
    
    setFormData({
      nombre: item.nombre,
      archivo: null, // No se puede pre-cargar un archivo existente en input file
    })
    
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = etiquetasPiensoData[index]
    
    setFormData({
      nombre: item.nombre,
      archivo: null,
    })
    
    setEditMode(false)
    setViewMode(true)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para formatear fecha
  const formatDateToDisplay = (dateString: string) => {
    if (!dateString) return "Sin fecha"
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Función para formatear tamaño de archivo
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleClose = () => {
    setOpen(false)
    setEditMode(false)
    setViewMode(false)
    setEditIndex(null)
    setFormData({
      nombre: "",
      archivo: null,
    })
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, archivo: file }))
    }
  }

  const handleSubmit = () => {
    console.log("Datos de etiquetas de pienso:", formData)

    // Validar que los campos requeridos estén llenos
    if (!formData.nombre) {
      alert("Por favor, completa el nombre")
      return
    }

    // En modo edición, el archivo es opcional
    if (!editMode && !formData.archivo) {
      alert("Por favor, selecciona un archivo")
      return
    }

    const currentDate = new Date().toISOString().split('T')[0]
    
    const etiquetasPiensoItem = {
      nombre: formData.nombre,
      archivo: formData.archivo ? {
        nombre: formData.archivo.name,
        url: `/uploads/${formData.archivo.name}`, // URL simulada
        tamaño: formData.archivo.size,
        fecha: currentDate
      } : (editMode && editIndex !== null ? etiquetasPiensoData[editIndex].archivo : null),
      fechaCreacion: editMode 
        ? etiquetasPiensoData[editIndex!].fechaCreacion 
        : formatDateToDisplay(currentDate),
      fechaUltimaActualizacion: formatDateToDisplay(currentDate),
    }

    if (editMode && editIndex !== null) {
      // Actualizar elemento existente
      setEtiquetasPiensoData((prev) => 
        prev.map((item, index) => 
          index === editIndex ? etiquetasPiensoItem : item
        )
      )
    } else {
      // Agregar nuevo elemento
      setEtiquetasPiensoData((prev) => [...prev, etiquetasPiensoItem])
    }
    
    handleClose()
  }

  const handleDownload = (archivo: ArchivoData) => {
    // Simulación de descarga - en producción sería una llamada real al servidor
    console.log("Descargando archivo:", archivo.nombre)
    // window.open(archivo.url, '_blank')
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
                    Etiquetas de pienso
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
                          Nombre
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Archivo
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
                    {etiquetasPiensoData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell sx={{ maxWidth: 300 }}>
                          <Typography variant="body2" sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap' 
                          }}>
                            {item.nombre}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {item.archivo ? (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Chip
                                label={`${item.archivo.nombre} (${formatFileSize(item.archivo.tamaño)})`}
                                variant="outlined"
                                size="small"
                                sx={{ maxWidth: 200 }}
                              />
                              <IconButton 
                                size="small" 
                                onClick={() => handleDownload(item.archivo!)}
                                sx={{ color: "primary.main" }}
                              >
                                <Download fontSize="small" />
                              </IconButton>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Sin archivo
                            </Typography>
                          )}
                        </TableCell>
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
                      {viewMode ? "Detalle de etiqueta de pienso" : editMode ? "Editar etiqueta de pienso" : "Registro de etiqueta de pienso"}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    {/* Nombre */}
                    <TextField
                      fullWidth
                      placeholder="Nombre de la etiqueta"
                      variant="standard"
                      value={formData.nombre}
                      onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
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

                    {/* Upload de archivo */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: "text.primary" }}>
                        Archivo de etiqueta
                      </Typography>
                      
                      {!viewMode && (
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<CloudUpload />}
                          sx={{ 
                            textTransform: "none",
                            borderStyle: "dashed",
                            borderWidth: 2,
                            p: 2,
                            width: "100%",
                            height: 80,
                          }}
                        >
                          {formData.archivo ? 
                            `Archivo seleccionado: ${formData.archivo.name}` : 
                            "Seleccionar archivo PDF"
                          }
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            hidden
                            onChange={handleFileChange}
                          />
                        </Button>
                      )}

                      {viewMode && editIndex !== null && etiquetasPiensoData[editIndex].archivo && (
                        <Box sx={{ 
                          border: 1, 
                          borderColor: "grey.300", 
                          borderRadius: 1, 
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {etiquetasPiensoData[editIndex].archivo!.nombre}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatFileSize(etiquetasPiensoData[editIndex].archivo!.tamaño)} • 
                              Subido el {formatDateToDisplay(etiquetasPiensoData[editIndex].archivo!.fecha)}
                            </Typography>
                          </Box>
                          <IconButton 
                            onClick={() => handleDownload(etiquetasPiensoData[editIndex].archivo!)}
                            sx={{ color: "primary.main" }}
                          >
                            <Download />
                          </IconButton>
                        </Box>
                      )}

                      {formData.archivo && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                          Tamaño: {formatFileSize(formData.archivo.size)}
                        </Typography>
                      )}
                    </Box>

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