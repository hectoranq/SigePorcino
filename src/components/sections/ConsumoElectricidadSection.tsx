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
  listConsumoElectricidad,
  createConsumoElectricidad,
  updateConsumoElectricidad,
  deleteConsumoElectricidad,
  type ConsumoElectricidad,
} from "../../action/ConsumoElectricidadPocket"
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

interface ConsumoElectricidadData {
  id?: string
  energiaConsumida: string
  fecha: string
}

export function ConsumoElectricidadSection() {
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
    energiaConsumida: "",
    fecha: "",
  })

  // Estados de carga
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Estado para la tabla de consumo de electricidad
  const [consumoElectricidadData, setConsumoElectricidadData] = useState<ConsumoElectricidadData[]>([])

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
  const convertAPItoLocal = (apiData: ConsumoElectricidad): ConsumoElectricidadData => {
    return {
      id: apiData.id,
      energiaConsumida: apiData.energia_consumida?.toString() || "0",
      fecha: formatDateForInput(apiData.fecha),
    }
  }

  // Función para convertir datos locales al formato de la API
  const convertLocalToAPI = (localData: typeof formData) => {
    return {
      energia_consumida: parseFloat(localData.energiaConsumida) || 0,
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
        const response = await listConsumoElectricidad(token, userId, currentFarm.id)
        if (response.success && response.data) {
          const convertedData = response.data.items.map((item: any) =>
            convertAPItoLocal(item as ConsumoElectricidad)
          )
          setConsumoElectricidadData(convertedData)
        }
      } catch (error) {
        console.error("Error al cargar registros de consumo de electricidad:", error)
        setSnackbar({
          open: true,
          message: "Error al cargar los registros de consumo de electricidad",
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
      energiaConsumida: "",
      fecha: "",
    })
    setOpen(true)
  }

  // Función para abrir en modo edición
  const handleEdit = (index: number) => {
    const item = consumoElectricidadData[index]
    
    setFormData({
      energiaConsumida: item.energiaConsumida,
      fecha: formatDateForInput(item.fecha),
    })
    
    setEditMode(true)
    setViewMode(false)
    setCurrentRegistroId(item.id || null)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = consumoElectricidadData[index]
    
    setFormData({
      energiaConsumida: item.energiaConsumida,
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

  // Función para obtener el nombre del mes
  const getMonthName = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric'
    })
  }

  const handleClose = () => {
    setOpen(false)
    setEditMode(false)
    setViewMode(false)
    setCurrentRegistroId(null)
    setFormData({
      energiaConsumida: "",
      fecha: "",
    })
  }

  const handleSubmit = async () => {
    // Validar que los campos requeridos estén llenos
    if (!formData.energiaConsumida || !formData.fecha) {
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
        const response = await updateConsumoElectricidad(token, currentRegistroId, apiData, userId)
        if (response.success) {
          setConsumoElectricidadData((prev) =>
            prev.map((item) =>
              item.id === currentRegistroId ? convertAPItoLocal(response.data as ConsumoElectricidad) : item
            )
          )
          setSnackbar({
            open: true,
            message: "Registro de consumo de electricidad actualizado exitosamente",
            severity: "success",
          })
        }
      } else {
        // Crear nuevo registro
        const response = await createConsumoElectricidad(token, apiData)
        if (response.success) {
          setConsumoElectricidadData((prev) => [...prev, convertAPItoLocal(response.data as ConsumoElectricidad)])
          setSnackbar({
            open: true,
            message: "Registro de consumo de electricidad creado exitosamente",
            severity: "success",
          })
        }
      }

      handleClose()
    } catch (error: any) {
      console.error("Error al guardar registro de consumo de electricidad:", error)
      setSnackbar({
        open: true,
        message: error?.message || "Error al guardar el registro de consumo de electricidad",
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

    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro de consumo de electricidad?")) {
      return
    }

    try {
      setSaving(true)
      const response = await deleteConsumoElectricidad(token, currentRegistroId, userId)
      if (response.success) {
        setConsumoElectricidadData((prev) => prev.filter((item) => item.id !== currentRegistroId))
        setSnackbar({
          open: true,
          message: "Registro de consumo de electricidad eliminado exitosamente",
          severity: "success",
        })
        handleClose()
      }
    } catch (error: any) {
      console.error("Error al eliminar registro de consumo de electricidad:", error)
      setSnackbar({
        open: true,
        message: error?.message || "Error al eliminar el registro de consumo de electricidad",
        severity: "error",
      })
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
                    Consumo de electricidad
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
                          Energía consumida (kWh)
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
                          Período
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
                    {consumoElectricidadData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 600, 
                            color: "primary.main",
                            bgcolor: "primary.light",
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            display: "inline-block"
                          }}>
                            {parseFloat(item.energiaConsumida).toLocaleString('es-ES')} kWh
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDateToDisplay(item.fecha)}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            fontStyle: 'italic',
                            color: "text.secondary" 
                          }}>
                            {getMonthName(item.fecha)}
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
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            <ThemeProvider theme={theme}>
              <Box sx={{ minHeight: "auto", bgcolor: "#f9fafb", p: 3 }}>
                <Paper sx={{ maxWidth: 800, mx: "auto", borderRadius: 2, overflow: "hidden" }}>
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
                      {viewMode ? "Detalle de consumo eléctrico" : editMode ? "Editar consumo eléctrico" : "Registro de consumo eléctrico"}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    {/* Energía consumida */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Energía consumida"
                          placeholder="Energía consumida (kWh)"
                          variant="standard"
                          type="number"
                          inputProps={{ step: "0.1", min: "0" }}
                          value={formData.energiaConsumida}
                          onChange={(e) => setFormData((prev) => ({ ...prev, energiaConsumida: e.target.value }))}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "text.primary",
                              fontSize: "1.2rem",
                              fontWeight: 500,
                            },
                          }}
                          helperText={!viewMode ? "Ingresa el consumo eléctrico total en kilovatios hora (kWh)" : ""}
                        />
                      </Grid>
                    </Grid>

                    {/* Fecha */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={12}>
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
                          helperText={!viewMode ? "Generalmente se registra al final del período de facturación (mensual)" : ""}
                        />
                      </Grid>
                    </Grid>

                    {/* Información adicional en modo ver */}
                    {viewMode && (
                      <Box sx={{ 
                        bgcolor: "grey.50", 
                        p: 2, 
                        borderRadius: 1, 
                        mb: 3,
                        border: 1,
                        borderColor: "grey.200"
                      }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
                          Información del registro:
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Período:</strong> {getMonthName(formData.fecha)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Consumo formateado:</strong> {parseFloat(formData.energiaConsumida).toLocaleString('es-ES')} kWh
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    )}

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