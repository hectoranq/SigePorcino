"use client"

import { useState, useEffect } from "react"
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
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"
import { Add, KeyboardArrowDown, CloudUpload, Download } from "@mui/icons-material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { buttonStyles, headerColors, headerAccentColors } from "./buttonStyles"
import useUserStore from "../../_store/user"
import useFarmFormStore from "../../_store/farm"
import {
  listEtiquetasPienso,
  createEtiquetasPienso,
  updateEtiquetasPienso,
  deleteEtiquetasPienso,
  getFileUrl,
  EtiquetasPienso as APIEtiquetasPienso,
} from "../../action/EtiquetasPiensoPocket"

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
  id?: string
  nombre: string
  archivo: ArchivoData | null
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

export function EtiquetasPiensoSection() {
  // Stores
  const { token, record } = useUserStore()
  const { currentFarm } = useFarmFormStore()

  // Estados
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [currentRegistroId, setCurrentRegistroId] = useState<string | null>(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })

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
  const [etiquetasPiensoData, setEtiquetasPiensoData] = useState<EtiquetasPiensoData[]>([])
  
  // Estado para almacenar el archivo actual en modo ver/editar
  const [currentArchivoData, setCurrentArchivoData] = useState<ArchivoData | null>(null)

  // Función para convertir datos de la API a formato local
  const convertAPItoLocal = (apiData: APIEtiquetasPienso): EtiquetasPiensoData => {
    return {
      id: apiData.id,
      nombre: apiData.nombre,
      archivo: apiData.archivo ? {
        nombre: apiData.archivo,
        url: getFileUrl(apiData, apiData.archivo),
        tamaño: 0, // PocketBase no devuelve el tamaño en la respuesta
        fecha: apiData.created || ""
      } : null,
      fechaCreacion: formatDateToDisplay(apiData.created || ""),
      fechaUltimaActualizacion: formatDateToDisplay(apiData.updated || ""),
    }
  }

  // Cargar datos desde la API
  useEffect(() => {
    const loadData = async () => {
      if (!token || !record?.id || !currentFarm?.id) return

      setLoading(true)
      try {
        const response = await listEtiquetasPienso(token, record.id, currentFarm.id)
        if (response.success && response.data) {
          const localData = response.data.items.map(item => convertAPItoLocal(item as APIEtiquetasPienso))
          setEtiquetasPiensoData(localData)
        }
      } catch (error: any) {
        console.error("Error al cargar etiquetas de pienso:", error)
        setSnackbar({ open: true, message: error.message || "Error al cargar datos", severity: "error" })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [token, record?.id, currentFarm?.id])

  const handleOpen = () => {
    setCurrentRegistroId(null)
    setCurrentArchivoData(null)
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
    
    setCurrentRegistroId(item.id || null)
    setCurrentArchivoData(item.archivo)
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
    
    setCurrentRegistroId(item.id || null)
    setCurrentArchivoData(item.archivo)
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
    setCurrentRegistroId(null)
    setCurrentArchivoData(null)
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

  const handleSubmit = async () => {
    // Validar que los campos requeridos estén llenos
    if (!formData.nombre) {
      setSnackbar({ open: true, message: "Por favor, completa el nombre", severity: "error" })
      return
    }

    // En modo creación, el archivo es obligatorio
    if (!editMode && !formData.archivo) {
      setSnackbar({ open: true, message: "Por favor, selecciona un archivo", severity: "error" })
      return
    }

    if (!token || !record?.id || !currentFarm?.id) {
      setSnackbar({ open: true, message: "Error: No hay sesión activa", severity: "error" })
      return
    }

    setSaving(true)
    try {
      if (editMode && currentRegistroId) {
        // Actualizar elemento existente
        await updateEtiquetasPienso(
          token,
          currentRegistroId,
          { nombre: formData.nombre },
          record.id,
          formData.archivo || undefined
        )
        setSnackbar({ open: true, message: "Etiqueta de pienso actualizada exitosamente", severity: "success" })
      } else {
        // Crear nuevo elemento
        if (!formData.archivo) {
          setSnackbar({ open: true, message: "El archivo es requerido", severity: "error" })
          return
        }
        await createEtiquetasPienso(
          token,
          {
            nombre: formData.nombre,
            farm: currentFarm.id,
            user: record.id,
          },
          formData.archivo
        )
        setSnackbar({ open: true, message: "Etiqueta de pienso registrada exitosamente", severity: "success" })
      }

      // Recargar datos
      const response = await listEtiquetasPienso(token, record.id, currentFarm.id)
      if (response.success && response.data) {
        const localData = response.data.items.map(item => convertAPItoLocal(item as APIEtiquetasPienso))
        setEtiquetasPiensoData(localData)
      }

      handleClose()
    } catch (error: any) {
      console.error("Error al guardar:", error)
      setSnackbar({ open: true, message: error.message || "Error al guardar", severity: "error" })
    } finally {
      setSaving(false)
    }
  }

  // Función para eliminar un registro
  const handleDelete = async () => {
    if (!currentRegistroId || !token || !record?.id) return

    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      return
    }

    setSaving(true)
    try {
      await deleteEtiquetasPienso(token, currentRegistroId, record.id)
      setSnackbar({ open: true, message: "Etiqueta de pienso eliminada exitosamente", severity: "success" })

      // Recargar datos
      const response = await listEtiquetasPienso(token, record.id, currentFarm?.id)
      if (response.success && response.data) {
        const localData = response.data.items.map(item => convertAPItoLocal(item as APIEtiquetasPienso))
        setEtiquetasPiensoData(localData)
      }

      handleClose()
    } catch (error: any) {
      console.error("Error al eliminar:", error)
      setSnackbar({ open: true, message: error.message || "Error al eliminar", severity: "error" })
    } finally {
      setSaving(false)
    }
  }

  const handleDownload = (archivo: ArchivoData) => {
    // Abrir el archivo en una nueva pestaña
    window.open(archivo.url, '_blank')
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {/* Page Content */}
          <Box sx={{ flexGrow: 1, p: 3, bgcolor: "grey.50" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                <CircularProgress />
              </Box>
            ) : (
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
            )}
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
                    {viewMode ? "Detalle de etiqueta de pienso" : editMode ? "Editar etiqueta de pienso" : "Registro de etiqueta de pienso"}
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Nombre */}
                  <TextField
                    fullWidth
                    label="Nombre de la etiqueta"
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

                    {viewMode && currentArchivoData && (
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
                            {currentArchivoData.nombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatFileSize(currentArchivoData.tamaño)} • 
                            Subido el {formatDateToDisplay(currentArchivoData.fecha)}
                          </Typography>
                        </Box>
                        <IconButton 
                          onClick={() => handleDownload(currentArchivoData)}
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
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                    {viewMode && currentRegistroId ? (
                      <>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={handleDelete}
                          disabled={saving}
                        >
                          {saving ? "Eliminando..." : "Eliminar"}
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={handleClose}
                          disabled={saving}
                          sx={buttonStyles.close}
                        >
                          Cerrar
                        </Button>
                      </>
                    ) : (
                      <>
                        <div />
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Button
                            variant="outlined"
                            onClick={handleClose}
                            disabled={saving}
                            sx={buttonStyles.close}
                          >
                            Cancelar
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={saving}
                            sx={buttonStyles.save}
                          >
                            {saving ? "Guardando..." : editMode ? "Actualizar" : "Guardar"}
                          </Button>
                        </Box>
                      </>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  )
}