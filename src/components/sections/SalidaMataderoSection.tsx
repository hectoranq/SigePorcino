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
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"
import { Add, KeyboardArrowDown } from "@mui/icons-material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { buttonStyles, headerColors, headerAccentColors } from "./buttonStyles"
import useUserStore from "../../_store/user"
import useFarmFormStore from "../../_store/farm"
import {
  listSalidaMatadero,
  createSalidaMatadero,
  updateSalidaMatadero,
  deleteSalidaMatadero,
  SalidaMatadero as APISalidaMatadero,
} from "../../action/SalidaMataderoPocket"

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

interface SalidaMataderoData {
  id?: string
  nroAnimales: string
  pesoVivo: string
  fechaSalida: string
  destino: string
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

export function SalidaMataderoSection() {
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
    nroAnimales: "",
    pesoVivo: "",
    fechaSalida: "",
    destino: "",
  })

  // Estado para la tabla de salida a matadero
  const [salidaMataderoData, setSalidaMataderoData] = useState<SalidaMataderoData[]>([])

  // Función para convertir datos de la API a formato local
  const convertAPItoLocal = (apiData: APISalidaMatadero): SalidaMataderoData => {
    return {
      id: apiData.id,
      nroAnimales: String(apiData.nro_animales),
      pesoVivo: String(apiData.peso_vivo),
      fechaSalida: apiData.fecha_salida,
      destino: apiData.destino,
      fechaCreacion: formatDateToDisplay(apiData.created || ""),
      fechaUltimaActualizacion: formatDateToDisplay(apiData.updated || ""),
    }
  }

  // Función para convertir datos locales a formato API
  const convertLocalToAPI = (localData: typeof formData): Omit<APISalidaMatadero, "id" | "created" | "updated" | "collectionId" | "collectionName"> => {
    return {
      nro_animales: parseFloat(localData.nroAnimales),
      peso_vivo: parseFloat(localData.pesoVivo),
      fecha_salida: localData.fechaSalida,
      destino: localData.destino,
      farm: currentFarm?.id || "",
      user: record?.id || "",
    }
  }

  // Función para convertir fecha ISO a formato para input date (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return ""
    // Extraer solo la parte de la fecha (YYYY-MM-DD) del ISO string
    return dateString.split('T')[0].split(' ')[0]
  }

  // Cargar datos desde la API
  useEffect(() => {
    const loadData = async () => {
      if (!token || !record?.id || !currentFarm?.id) return

      setLoading(true)
      try {
        const response = await listSalidaMatadero(token, record.id, currentFarm.id)
        if (response.success && response.data) {
          const localData = response.data.items.map(item => convertAPItoLocal(item as APISalidaMatadero))
          setSalidaMataderoData(localData)
        }
      } catch (error: any) {
        console.error("Error al cargar salidas a matadero:", error)
        setSnackbar({ open: true, message: error.message || "Error al cargar datos", severity: "error" })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [token, record?.id, currentFarm?.id])

  // Función para cargar un registro al formulario
  const loadRegistroToForm = (item: SalidaMataderoData) => {
    setFormData({
      nroAnimales: item.nroAnimales,
      pesoVivo: item.pesoVivo,
      fechaSalida: formatDateForInput(item.fechaSalida),
      destino: item.destino,
    })
  }

  const handleOpen = () => {
    setCurrentRegistroId(null)
    setEditMode(false)
    setViewMode(false)
    setEditIndex(null)
    setOpen(true)
  }

  // Función para abrir en modo edición
  const handleEdit = (index: number) => {
    const item = salidaMataderoData[index]
    
    setFormData({
      nroAnimales: item.nroAnimales,
      pesoVivo: item.pesoVivo,
      fechaSalida: formatDateForInput(item.fechaSalida),
      destino: item.destino,
    })
    
    setCurrentRegistroId(item.id || null)
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = salidaMataderoData[index]
    
    setFormData({
      nroAnimales: item.nroAnimales,
      pesoVivo: item.pesoVivo,
      fechaSalida: formatDateForInput(item.fechaSalida),
      destino: item.destino,
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
    setCurrentRegistroId(null)
    setEditMode(false)
    setViewMode(false)
    setEditIndex(null)
    setFormData({
      nroAnimales: "",
      pesoVivo: "",
      fechaSalida: "",
      destino: "",
    })
  }

  const handleSubmit = async () => {
    // Validar que los campos requeridos estén llenos
    if (!formData.nroAnimales || !formData.fechaSalida || !formData.destino) {
      setSnackbar({ open: true, message: "Por favor, completa todos los campos requeridos", severity: "error" })
      return
    }

    // Validar que sean números válidos
    const nroAnimales = parseFloat(formData.nroAnimales)
    const pesoVivo = parseFloat(formData.pesoVivo)

    if (isNaN(nroAnimales) || nroAnimales <= 0) {
      setSnackbar({ open: true, message: "El número de animales debe ser mayor a 0", severity: "error" })
      return
    }

    if (formData.pesoVivo && (isNaN(pesoVivo) || pesoVivo <= 0)) {
      setSnackbar({ open: true, message: "El peso vivo debe ser mayor a 0", severity: "error" })
      return
    }

    if (!token || !record?.id) {
      setSnackbar({ open: true, message: "Error: No hay sesión activa", severity: "error" })
      return
    }

    setSaving(true)
    try {
      const apiData = convertLocalToAPI(formData)

      if (editMode && currentRegistroId) {
        // Actualizar elemento existente
        await updateSalidaMatadero(token, currentRegistroId, apiData, record.id)
        setSnackbar({ open: true, message: "Salida a matadero actualizada exitosamente", severity: "success" })
      } else {
        // Crear nuevo elemento
        await createSalidaMatadero(token, apiData)
        setSnackbar({ open: true, message: "Salida a matadero registrada exitosamente", severity: "success" })
      }

      // Recargar datos
      const response = await listSalidaMatadero(token, record.id, currentFarm?.id)
      if (response.success && response.data) {
        const localData = response.data.items.map(item => convertAPItoLocal(item as APISalidaMatadero))
        setSalidaMataderoData(localData)
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
      await deleteSalidaMatadero(token, currentRegistroId, record.id)
      setSnackbar({ open: true, message: "Salida a matadero eliminada exitosamente", severity: "success" })

      // Recargar datos
      const response = await listSalidaMatadero(token, record.id, currentFarm?.id)
      if (response.success && response.data) {
        const localData = response.data.items.map(item => convertAPItoLocal(item as APISalidaMatadero))
        setSalidaMataderoData(localData)
      }

      handleClose()
    } catch (error: any) {
      console.error("Error al eliminar:", error)
      setSnackbar({ open: true, message: error.message || "Error al eliminar", severity: "error" })
    } finally {
      setSaving(false)
    }
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
                    Salida a matadero
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
                          Nro de animales
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Peso vivo (kg)
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Fecha de salida
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Destino
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
                    {salidaMataderoData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>{item.nroAnimales}</TableCell>
                        <TableCell>{item.pesoVivo} kg</TableCell>
                        <TableCell>{formatDateToDisplay(item.fechaSalida)}</TableCell>
                        <TableCell sx={{ maxWidth: 300 }}>
                          <Typography variant="body2" sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap' 
                          }}>
                            {item.destino}
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
                    {viewMode ? "Detalle de salida a matadero" : editMode ? `Editar salida a matadero${currentRegistroId ? ` (ID: ${currentRegistroId.slice(0, 8)}...)` : ""}` : "Registro de salida a matadero"}
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Nro de animales y Peso vivo */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Nro de animales"
                        placeholder="Nro de animales"
                        variant="standard"
                        type="number"
                        value={formData.nroAnimales}
                        onChange={(e) => setFormData((prev) => ({ ...prev, nroAnimales: e.target.value }))}
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
                        label="Peso vivo (kg)"
                        placeholder="Peso vivo (kg)"
                        variant="standard"
                        type="number"
                        value={formData.pesoVivo}
                        onChange={(e) => setFormData((prev) => ({ ...prev, pesoVivo: e.target.value }))}
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

                  {/* Fecha de salida */}
                  <TextField
                    fullWidth
                    label="Fecha de salida"
                    type="date"
                    variant="standard"
                    value={formData.fechaSalida}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fechaSalida: e.target.value }))}
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

                  {/* Destino */}
                  <TextField
                    fullWidth
                    label="Destino (matadero)"
                    placeholder="Destino (matadero)"
                    variant="standard"
                    value={formData.destino}
                    onChange={(e) => setFormData((prev) => ({ ...prev, destino: e.target.value }))}
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

                  {/* Botones dinámicos según el modo */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                    {viewMode ? (
                      <>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={handleDelete}
                          disabled={saving}
                        >
                          {saving ? "Eliminando..." : "Eliminar"}
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={handleClose}
                          sx={buttonStyles.close}
                        >
                          Cerrar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Box />
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Button
                            variant="outlined"
                            onClick={handleClose}
                            sx={buttonStyles.close}
                            disabled={saving}
                          >
                            Cancelar
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleSubmit}
                            sx={buttonStyles.save}
                            disabled={saving}
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
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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