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
import { buttonStyles, headerColors, headerAccentColors, sectionHeaderStyle, headerBarStyle } from "./buttonStyles"
import {
  listConsumoAgua,
  createConsumoAgua,
  updateConsumoAgua,
  deleteConsumoAgua,
  type ConsumoAgua,
} from "../../action/ConsumoAguaPocket"
import  useUserStore  from "../../_store/user"
import  useFarmFormStore  from "../../_store/farm"

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

interface ConsumoAguaData {
  id?: string
  cantidadAguaBebida: string
  cantidadAguaLimpieza: string
  cantidadAguaTraida: string
  consumoTotalAgua: string
  fecha: string
}

export function ConsumoAguaSection() {
  // Stores
  const token = useUserStore((state) => state.token)
  const userId = useUserStore((state) => state.record?.id)
  const currentFarm = useFarmFormStore((state) => state.currentFarm)

  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [currentRegistroId, setCurrentRegistroId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    cantidadAguaBebida: "",
    cantidadAguaLimpieza: "",
    cantidadAguaTraida: "",
    consumoTotalAgua: "",
    fecha: "",
  })

  // Estados de carga
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Estado para la tabla de consumo de agua
  const [consumoAguaData, setConsumoAguaData] = useState<ConsumoAguaData[]>([])

  // Estado para Snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error" | "info" | "warning"
  }>({
    open: false,
    message: "",
    severity: "info",
  })

  // Función para convertir fecha ISO a YYYY-MM-DD
  const formatDateForInput = (isoDate: string) => {
    if (!isoDate) return ""
    return isoDate.split("T")[0].split(" ")[0]
  }

  // Función para convertir datos de la API al formato local
  const convertAPItoLocal = (apiData: ConsumoAgua): ConsumoAguaData => {
    return {
      id: apiData.id,
      cantidadAguaBebida: apiData.cantidad_agua_bebida?.toString() || "0",
      cantidadAguaLimpieza: apiData.cantidad_agua_limpieza?.toString() || "0",
      cantidadAguaTraida: apiData.cantidad_agua_traida?.toString() || "0",
      consumoTotalAgua: apiData.consumo_total_agua?.toString() || "0",
      fecha: formatDateForInput(apiData.fecha),
    }
  }

  // Función para convertir datos locales al formato de la API
  const convertLocalToAPI = (localData: typeof formData) => {
    return {
      cantidad_agua_bebida: parseFloat(localData.cantidadAguaBebida) || 0,
      cantidad_agua_limpieza: parseFloat(localData.cantidadAguaLimpieza) || 0,
      cantidad_agua_traida: parseFloat(localData.cantidadAguaTraida) || 0,
      consumo_total_agua: parseFloat(localData.consumoTotalAgua) || 0,
      fecha: localData.fecha,
      farm: currentFarm?.id || "",
      user: userId || "",
    }
  }

  // Cargar datos desde la API
  useEffect(() => {
    const fetchData = async () => {
      if (!token || !userId || !currentFarm?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await listConsumoAgua(token, userId, currentFarm.id)
        if (response.success && response.data) {
          const convertedData = response.data.items.map((item: any) =>
            convertAPItoLocal(item as ConsumoAgua)
          )
          setConsumoAguaData(convertedData)
        }
      } catch (error) {
        console.error("Error al cargar registros de consumo de agua:", error)
        setSnackbar({
          open: true,
          message: "Error al cargar los registros de consumo de agua",
          severity: "error",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token, userId, currentFarm?.id])

  const handleOpen = () => {
    setEditMode(false)
    setViewMode(false)
    setCurrentRegistroId(null)
    setFormData({
      cantidadAguaBebida: "",
      cantidadAguaLimpieza: "",
      cantidadAguaTraida: "",
      consumoTotalAgua: "",
      fecha: "",
    })
    setOpen(true)
  }

  // Función para abrir en modo edición
  const handleEdit = (index: number) => {
    const item = consumoAguaData[index]
    
    setFormData({
      cantidadAguaBebida: item.cantidadAguaBebida,
      cantidadAguaLimpieza: item.cantidadAguaLimpieza,
      cantidadAguaTraida: item.cantidadAguaTraida,
      consumoTotalAgua: item.consumoTotalAgua,
      fecha: formatDateForInput(item.fecha),
    })
    
    setEditMode(true)
    setViewMode(false)
    setCurrentRegistroId(item.id || null)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = consumoAguaData[index]
    
    setFormData({
      cantidadAguaBebida: item.cantidadAguaBebida,
      cantidadAguaLimpieza: item.cantidadAguaLimpieza,
      cantidadAguaTraida: item.cantidadAguaTraida,
      consumoTotalAgua: item.consumoTotalAgua,
      fecha: formatDateForInput(item.fecha),
    })
    
    setEditMode(false)
    setViewMode(true)
    setCurrentRegistroId(item.id || null)
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

  // Función para calcular automáticamente el consumo total
  const calculateConsumoTotal = (bebida: string, limpieza: string, traida: string) => {
    const bebidaNum = parseFloat(bebida) || 0
    const limpiezaNum = parseFloat(limpieza) || 0
    const traidaNum = parseFloat(traida) || 0
    const total = bebidaNum + limpiezaNum + traidaNum
    return total > 0 ? total.toFixed(1) : ""
  }

  const handleClose = () => {
    setOpen(false)
    setEditMode(false)
    setViewMode(false)
    setCurrentRegistroId(null)
    setFormData({
      cantidadAguaBebida: "",
      cantidadAguaLimpieza: "",
      cantidadAguaTraida: "",
      consumoTotalAgua: "",
      fecha: "",
    })
  }

  const handleSubmit = async () => {
    // Validar que los campos requeridos estén llenos
    if (!formData.cantidadAguaBebida || !formData.cantidadAguaLimpieza || !formData.fecha) {
      setSnackbar({
        open: true,
        message: "Por favor, completa todos los campos requeridos",
        severity: "warning",
      })
      return
    }

    if (!token || !userId || !currentFarm?.id) {
      setSnackbar({
        open: true,
        message: "Error: No se encontró información de autenticación",
        severity: "error",
      })
      return
    }

    try {
      setSaving(true)
      const apiData = convertLocalToAPI(formData)

      if (editMode && currentRegistroId) {
        // Actualizar registro existente
        const response = await updateConsumoAgua(token, currentRegistroId, apiData, userId)
        if (response.success) {
          setConsumoAguaData((prev) =>
            prev.map((item) =>
              item.id === currentRegistroId ? convertAPItoLocal(response.data as ConsumoAgua) : item
            )
          )
          setSnackbar({
            open: true,
            message: "Registro de consumo de agua actualizado exitosamente",
            severity: "success",
          })
        }
      } else {
        // Crear nuevo registro
        const response = await createConsumoAgua(token, apiData)
        if (response.success) {
          setConsumoAguaData((prev) => [...prev, convertAPItoLocal(response.data as ConsumoAgua)])
          setSnackbar({
            open: true,
            message: "Registro de consumo de agua creado exitosamente",
            severity: "success",
          })
        }
      }

      handleClose()
    } catch (error: any) {
      console.error("Error al guardar registro de consumo de agua:", error)
      setSnackbar({
        open: true,
        message: error?.message || "Error al guardar el registro de consumo de agua",
        severity: "error",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!currentRegistroId || !token || !userId) {
      setSnackbar({
        open: true,
        message: "Error: No se puede eliminar el registro",
        severity: "error",
      })
      return
    }

    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro de consumo de agua?")) {
      return
    }

    try {
      setSaving(true)
      const response = await deleteConsumoAgua(token, currentRegistroId, userId)
      if (response.success) {
        setConsumoAguaData((prev) => prev.filter((item) => item.id !== currentRegistroId))
        setSnackbar({
          open: true,
          message: "Registro de consumo de agua eliminado exitosamente",
          severity: "success",
        })
        handleClose()
      }
    } catch (error: any) {
      console.error("Error al eliminar registro de consumo de agua:", error)
      setSnackbar({
        open: true,
        message: error?.message || "Error al eliminar el registro de consumo de agua",
        severity: "error",
      })
    } finally {
      setSaving(false)
    }
  }

  // Manejar cambios en los campos numéricos y calcular total automáticamente
  const handleNumberChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value }
    
    // Calcular automáticamente el consumo total si se modifican los campos base
    if (['cantidadAguaBebida', 'cantidadAguaLimpieza', 'cantidadAguaTraida'].includes(field)) {
      newFormData.consumoTotalAgua = calculateConsumoTotal(
        field === 'cantidadAguaBebida' ? value : formData.cantidadAguaBebida,
        field === 'cantidadAguaLimpieza' ? value : formData.cantidadAguaLimpieza,
        field === 'cantidadAguaTraida' ? value : formData.cantidadAguaTraida
      )
    }
    
    setFormData(newFormData)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {/* Page Content */}
          <Box sx={{ flexGrow: 1, p: 3, bgcolor: "grey.50" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                <CircularProgress />
              </Box>
            ) : (
            <Paper elevation={1} sx={{ borderRadius: 2 }}>
{/* Header */}
              <Box sx={sectionHeaderStyle}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={headerBarStyle} />
                  <Typography variant="h5" fontWeight={600}>
                    Consumo de agua
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
                          Agua bebida (m³)
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Agua limpieza (m³)
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Agua traída (m³)
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Consumo total (m³)
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
                    {consumoAguaData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: "primary.main" }}>
                            {item.cantidadAguaBebida} m³
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: "secondary.main" }}>
                            {item.cantidadAguaLimpieza} m³
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {item.cantidadAguaTraida === "0" ? (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              N/A
                            </Typography>
                          ) : (
                            <Typography variant="body2" sx={{ fontWeight: 500, color: "warning.main" }}>
                              {item.cantidadAguaTraida} m³
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 600, 
                            color: "text.primary",
                            bgcolor: "grey.100",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            display: "inline-block"
                          }}>
                            {item.consumoTotalAgua} m³
                          </Typography>
                        </TableCell>
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
            )}
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
                      {viewMode ? "Detalle de consumo de agua" : editMode ? "Editar consumo de agua" : "Registro de consumo de agua"}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    {/* Cantidad de agua bebida y limpieza */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Cantidad de agua bebida (m³)"
                          placeholder="Cantidad de agua bebida (m³)"
                          variant="standard"
                          type="number"
                          inputProps={{ step: "0.1", min: "0" }}
                          value={formData.cantidadAguaBebida}
                          onChange={(e) => handleNumberChange('cantidadAguaBebida', e.target.value)}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "text.primary",
                            },
                          }}
                          helperText={!viewMode ? "Agua consumida directamente por los animales" : ""}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Cantidad de agua limpieza (m³)"
                          placeholder="Cantidad de agua limpieza (m³)"
                          variant="standard"
                          type="number"
                          inputProps={{ step: "0.1", min: "0" }}
                          value={formData.cantidadAguaLimpieza}
                          onChange={(e) => handleNumberChange('cantidadAguaLimpieza', e.target.value)}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "text.primary",
                            },
                          }}
                          helperText={!viewMode ? "Agua utilizada para limpieza de instalaciones" : ""}
                        />
                      </Grid>
                    </Grid>

                    {/* Cantidad de agua traída y fecha */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Cantidad de agua traída (m³)"
                          placeholder="Cantidad de agua traída (m³)"
                          variant="standard"
                          type="number"
                          inputProps={{ step: "0.1", min: "0" }}
                          value={formData.cantidadAguaTraida}
                          onChange={(e) => handleNumberChange('cantidadAguaTraida', e.target.value)}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "text.primary",
                            },
                          }}
                          helperText={!viewMode ? "Agua suministrada por camiones cisterna (opcional)" : ""}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Fecha de registro"
                          type={viewMode ? "text" : "date"}
                          variant="standard"
                          value={viewMode ? formatDateToDisplay(formData.fecha) : formData.fecha}
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

                    {/* Consumo total calculado automáticamente */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Consumo total de agua (m³)"
                          variant="standard"
                          type="number"
                          value={formData.consumoTotalAgua}
                          onChange={(e) => setFormData((prev) => ({ ...prev, consumoTotalAgua: e.target.value }))}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "primary.main",
                              fontWeight: 600,
                            },
                            "& .MuiInputLabel-root": {
                              color: "primary.main",
                            },
                          }}
                          helperText={!viewMode ? "Se calcula automáticamente: agua bebida + agua limpieza + agua traída" : ""}
                        />
                      </Grid>
                    </Grid>

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
                              sx={buttonStyles.cancel}
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
            </ThemeProvider>
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