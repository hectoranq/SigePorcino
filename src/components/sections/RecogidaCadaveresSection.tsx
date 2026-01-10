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
  getRecogidaCadaveresByFarmId,
  createRecogidaCadaveres,
  updateRecogidaCadaveres,
  deleteRecogidaCadaveres,
  RecogidaCadaveres as APIRecogidaCadaveres,
} from "../../action/RecogidaCadaveresPocket"

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

interface RecogidaCadaveresData {
  id?: string
  conductor: string
  empresaResponsable: string
  kg: string
  fecha: string
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

export function RecogidaCadaveresSection() {
  // Stores
  const { token, record } = useUserStore()
  const { currentFarm } = useFarmFormStore()

  // Estados
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [currentRegistroId, setCurrentRegistroId] = useState<string | null>(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    conductor: "",
    empresaResponsable: "",
    kg: "",
    fecha: "",
  })

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

  // Convertir de API a formato local
  const convertAPItoLocal = (apiData: APIRecogidaCadaveres): RecogidaCadaveresData => {
    return {
      id: apiData.id,
      conductor: apiData.conductor,
      empresaResponsable: apiData.empresa_responsable,
      kg: String(apiData.kg),
      fecha: apiData.fecha,
      fechaCreacion: formatDateToDisplay(apiData.created || ""),
      fechaUltimaActualizacion: formatDateToDisplay(apiData.updated || ""),
    }
  }

  // Convertir de formato local a API
  const convertLocalToAPI = (localData: any): Partial<APIRecogidaCadaveres> => {
    return {
      conductor: localData.conductor,
      empresa_responsable: localData.empresaResponsable,
      kg: parseFloat(localData.kg) || 0,
      fecha: localData.fecha,
      farm: currentFarm!.id,
      user: record!.id,
    }
  }

  // useEffect para cargar datos de la API
  useEffect(() => {
    const loadRecogidaCadaveres = async () => {
      if (!token || !record?.id || !currentFarm?.id) return
      
      setLoading(true)
      try {
        const registros = await getRecogidaCadaveresByFarmId(currentFarm.id, token, record.id)
        if (registros.success && registros.data.items) {
          const convertedData = (registros.data.items as APIRecogidaCadaveres[]).map(convertAPItoLocal)
          setRecogidaCadaveresData(convertedData)
        }
      } catch (error) {
        console.error("Error al cargar recogida de cadáveres:", error)
        setSnackbar({ open: true, message: "Error al cargar los datos", severity: "error" })
      } finally {
        setLoading(false)
      }
    }
    loadRecogidaCadaveres()
  }, [token, record, currentFarm])

  // Función para cargar registro en el formulario
  const loadRegistroToForm = (registro: RecogidaCadaveresData) => {
    setFormData({
      conductor: registro.conductor,
      empresaResponsable: registro.empresaResponsable,
      kg: registro.kg,
      fecha: registro.fecha,
    })
  }

  // Estado para la tabla de recogida de cadáveres
  const [recogidaCadaveresData, setRecogidaCadaveresData] = useState<RecogidaCadaveresData[]>([])

  const handleOpen = () => {
    setEditMode(false)
    setViewMode(false)
    setEditIndex(null)
    setCurrentRegistroId(null)
    setOpen(true)
  }

  // Función para abrir en modo edición
  const handleEdit = (index: number) => {
    const item = recogidaCadaveresData[index]
    loadRegistroToForm(item)
    setCurrentRegistroId(item.id || null)
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = recogidaCadaveresData[index]
    
    setFormData({
      conductor: item.conductor,
      empresaResponsable: item.empresaResponsable,
      kg: item.kg,
      fecha: item.fecha,
    })
    
    setEditMode(false)
    setViewMode(true)
    setEditIndex(index)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditMode(false)
    setViewMode(false)
    setEditIndex(null)
    setCurrentRegistroId(null)
    setFormData({
      conductor: "",
      empresaResponsable: "",
      kg: "",
      fecha: "",
    })
  }

  const handleSubmit = async () => {
    // Validar que los campos requeridos estén llenos
    if (!formData.conductor || !formData.empresaResponsable || !formData.fecha) {
      setSnackbar({ open: true, message: "Por favor, completa todos los campos requeridos", severity: "error" })
      return
    }

    if (!formData.kg || parseFloat(formData.kg) <= 0) {
      setSnackbar({ open: true, message: "Por favor, ingresa un peso válido", severity: "error" })
      return
    }

    setSaving(true)
    try {
      const dataToSend = convertLocalToAPI(formData)

      if (currentRegistroId) {
        // Actualizar registro existente
        await updateRecogidaCadaveres(token!, currentRegistroId, dataToSend, record!.id)
        setSnackbar({ open: true, message: "Registro actualizado exitosamente", severity: "success" })
      } else {
        // Crear nuevo registro
        await createRecogidaCadaveres(token!, dataToSend as any)
        setSnackbar({ open: true, message: "Registro creado exitosamente", severity: "success" })
      }

      // Recargar datos
      const registros = await getRecogidaCadaveresByFarmId(currentFarm!.id, token!, record!.id)
      if (registros.success && registros.data.items) {
        const convertedData = (registros.data.items as APIRecogidaCadaveres[]).map(convertAPItoLocal)
        setRecogidaCadaveresData(convertedData)
      }

      handleClose()
    } catch (error: any) {
      console.error("Error al guardar:", error)
      setSnackbar({ open: true, message: error.message || "Error al guardar el registro", severity: "error" })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (index: number) => {
    const item = recogidaCadaveresData[index]
    
    if (!item.id) {
      setSnackbar({ open: true, message: "No se puede eliminar: ID no encontrado", severity: "error" })
      return
    }

    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      return
    }

    try {
      await deleteRecogidaCadaveres(token!, item.id, record!.id)
      setSnackbar({ open: true, message: "Registro eliminado exitosamente", severity: "success" })
      
      // Recargar datos
      const registros = await getRecogidaCadaveresByFarmId(currentFarm!.id, token!, record!.id)
      if (registros.success && registros.data.items) {
        const convertedData = (registros.data.items as APIRecogidaCadaveres[]).map(convertAPItoLocal)
        setRecogidaCadaveresData(convertedData)
      }
    } catch (error: any) {
      console.error("Error al eliminar:", error)
      setSnackbar({ open: true, message: error.message || "Error al eliminar el registro", severity: "error" })
    }
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
                    Recogida de cadáveres y SANDACH
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

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "grey.100" }}>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Conductor
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Empresa responsable
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
                    {recogidaCadaveresData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>{item.conductor}</TableCell>
                        <TableCell>{item.empresaResponsable}</TableCell>
                        <TableCell>{item.kg} kg</TableCell>
                        <TableCell>{formatDateToDisplay(item.fecha)}</TableCell>
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
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleDelete(index)}
                            >
                              Eliminar
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              )}
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
                {/* Header dinámico según el modo */}
                <Box sx={{ 
                  bgcolor: viewMode ? headerColors.view : currentRegistroId ? headerColors.edit : headerColors.create, 
                  px: 3, 
                  py: 2, 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1 
                }}>
                  <Box sx={{ 
                    width: 4, 
                    height: 24, 
                    bgcolor: viewMode ? headerAccentColors.view : currentRegistroId ? headerAccentColors.edit : headerAccentColors.create, 
                    borderRadius: 0.5 
                  }} />
                  <Typography variant="h6" sx={{ color: "white", fontWeight: 500 }}>
                    {viewMode ? "Detalle de recogida de cadáveres" : currentRegistroId ? "Editar recogida de cadáveres" : "Registro de recogida de cadáveres"}
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Conductor y Empresa responsable */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label = "Conductor"
                        placeholder="Conductor"
                        variant="filled"
                        value={formData.conductor}
                        onChange={(e) => setFormData((prev) => ({ ...prev, conductor: e.target.value }))}
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
                        label = "Empresa responsable"
                        placeholder="Empresa responsable"
                        variant="filled"
                        value={formData.empresaResponsable}
                        onChange={(e) => setFormData((prev) => ({ ...prev, empresaResponsable: e.target.value }))}
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

                  {/* Kg y Fecha */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label = "Kg"
                        placeholder="Kg (kilogramos)"
                        variant="filled"
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
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Fecha"
                        type="date"
                        variant="filled"
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
                          disabled={saving}
                          sx={buttonStyles.close}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleSubmit}
                          disabled={saving}
                          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : undefined}
                          sx={buttonStyles.save}
                        >
                          {saving ? "Guardando..." : (currentRegistroId ? "Actualizar" : "Guardar")}
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

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  )
}