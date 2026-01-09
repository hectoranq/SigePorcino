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
import { buttonStyles, headerColors, headerAccentColors} from "./buttonStyles"
import useUserStore from "../../_store/user"
import useFarmFormStore from "../../_store/farm"
import {
  getEntradaLechonesByFarmId,
  createEntradaLechones,
  updateEntradaLechones,
  deleteEntradaLechones,
  EntradaLechones as APIEntradaLechones,
} from "../../action/EntradaLechonesPocket"

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

interface EntradaLechonesData {
  id?: string
  nroAnimales: string
  pesoVivo: string
  fechaEntrada: string
  fechaNacimiento: string
  procedencia: string
  observaciones: string
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

export function EntradaLechonesSection() {
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
    fechaEntrada: "",
    fechaNacimiento: "",
    procedencia: "",
    observaciones: "",
  })

  // Estado para la tabla de entrada de lechones
  const [entradaLechonesData, setEntradaLechonesData] = useState<EntradaLechonesData[]>([])

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

  // Función para formatear fecha a YYYY-MM-DD para input type="date"
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return ""
    // Extraer solo la parte YYYY-MM-DD del formato ISO
    return dateString.split('T')[0].split(' ')[0]
  }

  // Convertir de API a formato local
  const convertAPItoLocal = (apiData: APIEntradaLechones): EntradaLechonesData => {
    return {
      id: apiData.id,
      nroAnimales: String(apiData.nro_animales),
      pesoVivo: String(apiData.peso_vivo),
      fechaEntrada: apiData.fecha_entrada,
      fechaNacimiento: apiData.fecha_nacimiento,
      procedencia: apiData.procedencia,
      observaciones: apiData.observaciones || "",
      fechaCreacion: formatDateToDisplay(apiData.created || ""),
      fechaUltimaActualizacion: formatDateToDisplay(apiData.updated || ""),
    }
  }

  // Convertir de formato local a API
  const convertLocalToAPI = (localData: any): Partial<APIEntradaLechones> => {
    return {
      nro_animales: parseFloat(localData.nroAnimales) || 0,
      peso_vivo: parseFloat(localData.pesoVivo) || 0,
      fecha_entrada: localData.fechaEntrada,
      fecha_nacimiento: localData.fechaNacimiento,
      procedencia: localData.procedencia,
      observaciones: localData.observaciones,
      farm: currentFarm!.id,
      user: record!.id,
    }
  }

  // useEffect para cargar registros de entrada de lechones
  useEffect(() => {
    const loadEntradaLechones = async () => {
      if (!token || !record?.id || !currentFarm?.id) return
      
      setLoading(true)
      try {
        const registros = await getEntradaLechonesByFarmId(currentFarm.id, token, record.id)
        if (registros.success && registros.data.items) {
          const convertedData = (registros.data.items as APIEntradaLechones[]).map(convertAPItoLocal)
          setEntradaLechonesData(convertedData)
        }
      } catch (error: any) {
        console.error("Error al cargar registros:", error)
        setSnackbar({ open: true, message: error.message || "Error al cargar los registros", severity: "error" })
      } finally {
        setLoading(false)
      }
    }
    loadEntradaLechones()
  }, [token, record, currentFarm])

  const loadRegistroToForm = (registro: EntradaLechonesData) => {
    setFormData({
      nroAnimales: registro.nroAnimales,
      pesoVivo: registro.pesoVivo,
      fechaEntrada: formatDateForInput(registro.fechaEntrada),
      fechaNacimiento: formatDateForInput(registro.fechaNacimiento),
      procedencia: registro.procedencia,
      observaciones: registro.observaciones,
    })
  }

  const handleOpen = () => {
    setEditMode(false)
    setViewMode(false)
    setEditIndex(null)
    setCurrentRegistroId(null)
    setOpen(true)
  }

  // Función para abrir en modo edición
  const handleEdit = (index: number) => {
    const item = entradaLechonesData[index]
    
    setFormData({
      nroAnimales: item.nroAnimales,
      pesoVivo: item.pesoVivo,
      fechaEntrada: formatDateForInput(item.fechaEntrada),
      fechaNacimiento: formatDateForInput(item.fechaNacimiento),
      procedencia: item.procedencia,
      observaciones: item.observaciones,
    })
    
    setCurrentRegistroId(item.id || null)
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = entradaLechonesData[index]
    
    setFormData({
      nroAnimales: item.nroAnimales,
      pesoVivo: item.pesoVivo,
      fechaEntrada: formatDateForInput(item.fechaEntrada),
      fechaNacimiento: formatDateForInput(item.fechaNacimiento),
      procedencia: item.procedencia,
      observaciones: item.observaciones,
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
      nroAnimales: "",
      pesoVivo: "",
      fechaEntrada: "",
      fechaNacimiento: "",
      procedencia: "",
      observaciones: "",
    })
  }

  const handleSubmit = async () => {
    // Validar que los campos requeridos estén llenos
    if (!formData.nroAnimales || !formData.pesoVivo || !formData.fechaEntrada || !formData.fechaNacimiento || !formData.procedencia) {
      setSnackbar({ open: true, message: "Por favor, completa todos los campos requeridos", severity: "error" })
      return
    }

    if (parseFloat(formData.nroAnimales) <= 0 || parseFloat(formData.pesoVivo) <= 0) {
      setSnackbar({ open: true, message: "Número de animales y peso deben ser mayores a 0", severity: "error" })
      return
    }

    setSaving(true)
    try {
      const dataToSend = convertLocalToAPI(formData)

      if (currentRegistroId) {
        // Actualizar registro existente
        await updateEntradaLechones(token!, currentRegistroId, dataToSend, record!.id)
        setSnackbar({ open: true, message: "Registro actualizado exitosamente", severity: "success" })
      } else {
        // Crear nuevo registro
        await createEntradaLechones(token!, dataToSend as any)
        setSnackbar({ open: true, message: "Registro creado exitosamente", severity: "success" })
      }

      // Recargar datos
      const registros = await getEntradaLechonesByFarmId(currentFarm!.id, token!, record!.id)
      if (registros.success && registros.data.items) {
        const convertedData = (registros.data.items as APIEntradaLechones[]).map(convertAPItoLocal)
        setEntradaLechonesData(convertedData)
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
    const item = entradaLechonesData[index]
    
    if (!item.id) {
      setSnackbar({ open: true, message: "No se puede eliminar: ID no encontrado", severity: "error" })
      return
    }

    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      return
    }

    try {
      await deleteEntradaLechones(token!, item.id, record!.id)
      setSnackbar({ open: true, message: "Registro eliminado exitosamente", severity: "success" })
      
      // Recargar datos
      const registros = await getEntradaLechonesByFarmId(currentFarm!.id, token!, record!.id)
      if (registros.success && registros.data.items) {
        const convertedData = (registros.data.items as APIEntradaLechones[]).map(convertAPItoLocal)
        setEntradaLechonesData(convertedData)
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
                    Entrada de lechones
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
                          Fecha de entrada
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Fecha de nacimiento
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Procedencia
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Observaciones
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
                    {entradaLechonesData.map((item, index) => (
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
                        <TableCell>{formatDateToDisplay(item.fechaEntrada)}</TableCell>
                        <TableCell>{formatDateToDisplay(item.fechaNacimiento)}</TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography variant="body2" sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap' 
                          }}>
                            {item.procedencia}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography variant="body2" sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap' 
                          }}>
                            {item.observaciones}
                          </Typography>
                        </TableCell>
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
          maxWidth="lg" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ minHeight: "auto", bgcolor: "#f9fafb", p: 3 }}>
              <Paper sx={{ maxWidth: 1200, mx: "auto", borderRadius: 2, overflow: "hidden" }}>
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
                    {viewMode ? "Detalle de entrada de lechones" : currentRegistroId ? "Editar entrada de lechones" : "Registro de entrada de lechones"}
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
                        variant="filled"
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
                        variant="filled"
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

                  {/* Fecha de entrada y Fecha de nacimiento */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Fecha de entrada"
                        type="date"
                        variant="filled"
                        value={formData.fechaEntrada}
                        onChange={(e) => setFormData((prev) => ({ ...prev, fechaEntrada: e.target.value }))}
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
                        label="Fecha de nacimiento"
                        type="date"
                        variant="filled"
                        value={formData.fechaNacimiento}
                        onChange={(e) => setFormData((prev) => ({ ...prev, fechaNacimiento: e.target.value }))}
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

                  {/* Procedencia */}
                  <TextField
                    fullWidth
                    label="Procedencia"
                    placeholder="Procedencia"
                    variant="filled"
                    value={formData.procedencia}
                    onChange={(e) => setFormData((prev) => ({ ...prev, procedencia: e.target.value }))}
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

                  {/* Observaciones */}
                  <TextField
                    fullWidth
                    label="Observaciones"
                    placeholder="Observaciones"
                    variant="filled"
                    multiline
                    rows={3}
                    value={formData.observaciones}
                    onChange={(e) => setFormData((prev) => ({ ...prev, observaciones: e.target.value }))}
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