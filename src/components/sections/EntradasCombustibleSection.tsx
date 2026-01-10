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
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"
import { Add, KeyboardArrowDown } from "@mui/icons-material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { buttonStyles, headerColors, headerAccentColors} from "./buttonStyles"
import {
  listEntradasCombustible,
  createEntradasCombustible,
  updateEntradasCombustible,
  deleteEntradasCombustible,
  type EntradasCombustible,
} from "../../action/EntradasCombustiblePocket"
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

interface EntradasCombustibleData {
  id?: string
  tipoCombustible: string
  fecha: string
  cantidades: string
  unidades: string
}

const TIPOS_COMBUSTIBLE = [
  "Gasóleo A (Automoción)",
  "Gasóleo B (Calefacción)",
  "Gasóleo C (Agrícola)",
  "Gasolina 95",
  "Gasolina 98",
  "Gas Natural Licuado (GNL)",
  "Gas Licuado del Petróleo (GLP)",
  "Propano",
  "Butano",
  "Biodiésel B7",
  "Biodiésel B20",
  "Fuel Oil",
]

const UNIDADES_MEDIDA = [
  "Litros",
  "Metros cúbicos (m³)",
  "Kilogramos (kg)",
  "Toneladas (t)",
  "Garrafas",
  "Bidones",
]

export function EntradasCombustibleSection() {
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
    tipoCombustible: "",
    fecha: "",
    cantidades: "",
    unidades: "",
  })

  // Estados de carga
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Estado para la tabla de entradas de combustible
  const [entradasCombustibleData, setEntradasCombustibleData] = useState<EntradasCombustibleData[]>([])

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
  const convertAPItoLocal = (apiData: EntradasCombustible): EntradasCombustibleData => {
    return {
      id: apiData.id,
      tipoCombustible: apiData.tipo_combustible || "",
      fecha: formatDateForInput(apiData.fecha),
      cantidades: apiData.cantidades?.toString() || "0",
      unidades: apiData.unidades || "",
    }
  }

  // Función para convertir datos locales al formato de la API
  const convertLocalToAPI = (localData: typeof formData) => {
    return {
      tipo_combustible: localData.tipoCombustible,
      fecha: localData.fecha,
      cantidades: parseFloat(localData.cantidades) || 0,
      unidades: localData.unidades,
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
        const response = await listEntradasCombustible(token, userId, currentFarm.id)
        if (response.success && response.data) {
          const convertedData = response.data.items.map((item: any) =>
            convertAPItoLocal(item as EntradasCombustible)
          )
          setEntradasCombustibleData(convertedData)
        }
      } catch (error) {
        console.error("Error al cargar registros de entradas de combustible:", error)
        setSnackbar({
          open: true,
          message: "Error al cargar los registros de entradas de combustible",
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
      tipoCombustible: "",
      fecha: "",
      cantidades: "",
      unidades: "",
    })
    setOpen(true)
  }

  // Función para abrir en modo edición
  const handleEdit = (index: number) => {
    const item = entradasCombustibleData[index]
    
    setFormData({
      tipoCombustible: item.tipoCombustible,
      fecha: formatDateForInput(item.fecha),
      cantidades: item.cantidades,
      unidades: item.unidades,
    })
    
    setEditMode(true)
    setViewMode(false)
    setCurrentRegistroId(item.id || null)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = entradasCombustibleData[index]
    
    setFormData({
      tipoCombustible: item.tipoCombustible,
      fecha: formatDateForInput(item.fecha),
      cantidades: item.cantidades,
      unidades: item.unidades,
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

  const handleClose = () => {
    setOpen(false)
    setEditMode(false)
    setViewMode(false)
    setCurrentRegistroId(null)
    setFormData({
      tipoCombustible: "",
      fecha: "",
      cantidades: "",
      unidades: "",
    })
  }

  const handleSubmit = async () => {
    // Validar que los campos requeridos estén llenos
    if (!formData.tipoCombustible || !formData.fecha || !formData.cantidades || !formData.unidades) {
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
        const response = await updateEntradasCombustible(token, currentRegistroId, apiData, userId)
        if (response.success) {
          setEntradasCombustibleData((prev) =>
            prev.map((item) =>
              item.id === currentRegistroId ? convertAPItoLocal(response.data as EntradasCombustible) : item
            )
          )
          setSnackbar({
            open: true,
            message: "Registro de entrada de combustible actualizado exitosamente",
            severity: "success",
          })
        }
      } else {
        // Crear nuevo registro
        const response = await createEntradasCombustible(token, apiData)
        if (response.success) {
          setEntradasCombustibleData((prev) => [...prev, convertAPItoLocal(response.data as EntradasCombustible)])
          setSnackbar({
            open: true,
            message: "Registro de entrada de combustible creado exitosamente",
            severity: "success",
          })
        }
      }

      handleClose()
    } catch (error: any) {
      console.error("Error al guardar registro de entrada de combustible:", error)
      setSnackbar({
        open: true,
        message: error?.message || "Error al guardar el registro de entrada de combustible",
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

    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro de entrada de combustible?")) {
      return
    }

    try {
      setSaving(true)
      const response = await deleteEntradasCombustible(token, currentRegistroId, userId)
      if (response.success) {
        setEntradasCombustibleData((prev) => prev.filter((item) => item.id !== currentRegistroId))
        setSnackbar({
          open: true,
          message: "Registro de entrada de combustible eliminado exitosamente",
          severity: "success",
        })
        handleClose()
      }
    } catch (error: any) {
      console.error("Error al eliminar registro de entrada de combustible:", error)
      setSnackbar({
        open: true,
        message: error?.message || "Error al eliminar el registro de entrada de combustible",
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
                    Entradas de combustible
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
                          Tipo de combustible
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
                          Cantidades
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Unidades
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
                    {entradasCombustibleData.map((item, index) => (
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
                            whiteSpace: 'nowrap',
                            fontWeight: 500
                          }}>
                            {item.tipoCombustible}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDateToDisplay(item.fecha)}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 600, 
                            color: "primary.main"
                          }}>
                            {parseFloat(item.cantidades).toLocaleString('es-ES')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            color: "text.secondary",
                            fontStyle: 'italic'
                          }}>
                            {item.unidades}
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
          maxWidth="lg" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ minHeight: "auto", bgcolor: "#f9fafb", p: 3 }}>
              <Paper sx={{ maxWidth: 1000, mx: "auto", borderRadius: 2, overflow: "hidden" }}>
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
                    {viewMode ? "Detalle de entrada de combustible" : editMode ? "Editar entrada de combustible" : "Registro de entrada de combustible"}
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Tipo de combustible y Fecha */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        select={!viewMode}
                        label="Tipo de combustible"
                        variant="standard"
                        value={formData.tipoCombustible}
                        onChange={(e) => setFormData((prev) => ({ ...prev, tipoCombustible: e.target.value }))}
                        InputProps={{
                          readOnly: viewMode,
                        }}
                        sx={{
                          "& .MuiInputBase-input": {
                            color: viewMode ? "text.secondary" : "text.primary",
                          },
                        }}
                      >
                        {!viewMode && TIPOS_COMBUSTIBLE.map((tipo) => (
                          <MenuItem key={tipo} value={tipo}>
                            {tipo}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Fecha de entrada"
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

                  {/* Cantidades y Unidades */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Cantidad recibida"
                        placeholder="Cantidad recibida"
                        variant="standard"
                        type="number"
                        inputProps={{ step: "0.1", min: "0" }}
                        value={formData.cantidades}
                        onChange={(e) => setFormData((prev) => ({ ...prev, cantidades: e.target.value }))}
                        InputProps={{
                          readOnly: viewMode,
                        }}
                        sx={{
                          "& .MuiInputBase-input": {
                            color: viewMode ? "text.secondary" : "text.primary",
                            fontSize: "1.1rem",
                            fontWeight: 500,
                          },
                        }}
                        helperText={!viewMode ? "Cantidad numérica del combustible recibido" : ""}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        select={!viewMode}
                        label="Unidad de medida"
                        variant="standard"
                        value={formData.unidades}
                        onChange={(e) => setFormData((prev) => ({ ...prev, unidades: e.target.value }))}
                        InputProps={{
                          readOnly: viewMode,
                        }}
                        sx={{
                          "& .MuiInputBase-input": {
                            color: viewMode ? "text.secondary" : "text.primary",
                          },
                        }}
                        helperText={!viewMode ? "Selecciona la unidad correspondiente al tipo de combustible" : ""}
                      >
                        {!viewMode && UNIDADES_MEDIDA.map((unidad) => (
                          <MenuItem key={unidad} value={unidad}>
                            {unidad}
                          </MenuItem>
                        ))}
                      </TextField>
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
                        Resumen de la entrada:
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Combustible:</strong> {formData.tipoCombustible}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Cantidad total:</strong> {parseFloat(formData.cantidades).toLocaleString('es-ES')} {formData.unidades}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Fecha de recepción:</strong> {formatDateToDisplay(formData.fecha)}
                      </Typography>
                    </Box>
                  )}

                  {/* Botones dinámicos según el modo */}
                  <Box sx={{ display: "flex", justifyContent: viewMode ? "space-between" : "flex-end", gap: 2 }}>
                    {viewMode ? (
                      <>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={handleDelete}
                          disabled={saving}
                          sx={buttonStyles.delete}
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
                          {saving ? "Guardando..." : (editMode ? "Actualizar" : "Guardar")}
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

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  )
}