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
  Checkbox,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"
import { Add, KeyboardArrowDown } from "@mui/icons-material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { buttonStyles, headerColors, headerAccentColors, sectionHeaderStyle, headerBarStyle } from "./buttonStyles"
import useUserStore from "../../_store/user"
import useFarmFormStore from "../../_store/farm"
import {
  listBajaAnimales,
  createBajaAnimales,
  updateBajaAnimales,
  deleteBajaAnimales,
  BajaAnimales as APIBajaAnimales,
} from "../../action/BajaAnimalesPocket"

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

interface BajaAnimalesData {
  id?: string
  nroCrotal: string
  causa: string
  fechaFallecimiento: string
  tipoFallecimiento: {
    muerte: boolean
    sacrificio: boolean
  }
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

export function BajaAnimalesSection() {
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
    nroCrotal: "",
    causa: "",
    fechaFallecimiento: "",
    tipoFallecimiento: {
      muerte: false,
      sacrificio: false,
    },
  })

  // Estado para la tabla de baja de animales
  const [bajaAnimalesData, setBajaAnimalesData] = useState<BajaAnimalesData[]>([])

  // Función para convertir datos de la API a formato local
  const convertAPItoLocal = (apiData: APIBajaAnimales): BajaAnimalesData => {
    return {
      id: apiData.id,
      nroCrotal: apiData.nro_crotal,
      causa: apiData.causa,
      fechaFallecimiento: apiData.fecha_fallecimiento,
      tipoFallecimiento: {
        muerte: apiData.es_muerte,
        sacrificio: apiData.es_sacrificio,
      },
      fechaCreacion: formatDateToDisplay(apiData.created || ""),
      fechaUltimaActualizacion: formatDateToDisplay(apiData.updated || ""),
    }
  }

  // Función para convertir datos locales a formato API
  const convertLocalToAPI = (localData: typeof formData): Omit<APIBajaAnimales, "id" | "created" | "updated" | "collectionId" | "collectionName"> => {
    return {
      nro_crotal: localData.nroCrotal,
      causa: localData.causa,
      fecha_fallecimiento: localData.fechaFallecimiento,
      es_muerte: localData.tipoFallecimiento.muerte,
      es_sacrificio: localData.tipoFallecimiento.sacrificio,
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
        const response = await listBajaAnimales(token, record.id, currentFarm.id)
        if (response.success && response.data) {
          const localData = response.data.items.map(item => convertAPItoLocal(item as APIBajaAnimales))
          setBajaAnimalesData(localData)
        }
      } catch (error: any) {
        console.error("Error al cargar bajas de animales:", error)
        setSnackbar({ open: true, message: error.message || "Error al cargar datos", severity: "error" })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [token, record?.id, currentFarm?.id])

  const handleOpen = () => {
    setCurrentRegistroId(null)
    setEditMode(false)
    setViewMode(false)
    setEditIndex(null)
    setOpen(true)
  }

  // Función para abrir en modo edición
  const handleEdit = (index: number) => {
    const item = bajaAnimalesData[index]
    
    setFormData({
      nroCrotal: item.nroCrotal,
      causa: item.causa,
      fechaFallecimiento: formatDateForInput(item.fechaFallecimiento),
      tipoFallecimiento: {
        muerte: item.tipoFallecimiento.muerte,
        sacrificio: item.tipoFallecimiento.sacrificio,
      },
    })
    
    setCurrentRegistroId(item.id || null)
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = bajaAnimalesData[index]
    
    setFormData({
      nroCrotal: item.nroCrotal,
      causa: item.causa,
      fechaFallecimiento: formatDateForInput(item.fechaFallecimiento),
      tipoFallecimiento: {
        muerte: item.tipoFallecimiento.muerte,
        sacrificio: item.tipoFallecimiento.sacrificio,
      },
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
      nroCrotal: "",
      causa: "",
      fechaFallecimiento: "",
      tipoFallecimiento: {
        muerte: false,
        sacrificio: false,
      },
    })
  }

  const handleSubmit = async () => {
    // Validar que los campos requeridos estén llenos
    if (!formData.nroCrotal || !formData.causa || !formData.fechaFallecimiento) {
      setSnackbar({ open: true, message: "Por favor, completa todos los campos requeridos", severity: "error" })
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
        await updateBajaAnimales(token, currentRegistroId, apiData, record.id)
        setSnackbar({ open: true, message: "Baja de animales actualizada exitosamente", severity: "success" })
      } else {
        // Crear nuevo elemento
        await createBajaAnimales(token, apiData)
        setSnackbar({ open: true, message: "Baja de animales registrada exitosamente", severity: "success" })
      }

      // Recargar datos
      const response = await listBajaAnimales(token, record.id, currentFarm?.id)
      if (response.success && response.data) {
        const localData = response.data.items.map(item => convertAPItoLocal(item as APIBajaAnimales))
        setBajaAnimalesData(localData)
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
      await deleteBajaAnimales(token, currentRegistroId, record.id)
      setSnackbar({ open: true, message: "Baja de animales eliminada exitosamente", severity: "success" })

      // Recargar datos
      const response = await listBajaAnimales(token, record.id, currentFarm?.id)
      if (response.success && response.data) {
        const localData = response.data.items.map(item => convertAPItoLocal(item as APIBajaAnimales))
        setBajaAnimalesData(localData)
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
              <Box sx={sectionHeaderStyle}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={headerBarStyle} />
                  <Typography variant="h5" fontWeight={600}>
                    Baja de animales
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
                          Nro de crotal
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Causa
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Fecha de fallecimiento
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
                    {bajaAnimalesData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>{item.nroCrotal}</TableCell>
                        <TableCell sx={{ maxWidth: 300 }}>
                          <Typography variant="body2" sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap' 
                          }}>
                            {item.causa}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDateToDisplay(item.fechaFallecimiento)}</TableCell>
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
                      {viewMode ? "Detalle de baja de animal" : editMode ? `Editar baja de animal${currentRegistroId ? ` (ID: ${currentRegistroId.slice(0, 8)}...)` : ""}` : "Registro de baja de animal"}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    {/* Nro de crotal */}
                    <TextField
                      fullWidth
                      label="Nro de crotal"
                      placeholder="Nro de crotal"
                      variant="standard"
                      value={formData.nroCrotal}
                      onChange={(e) => setFormData((prev) => ({ ...prev, nroCrotal: e.target.value }))}
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

                    {/* Causa */}
                    <TextField
                      fullWidth
                      label="Causa"
                      placeholder="Causa"
                      variant="standard"
                      multiline
                      rows={3}
                      value={formData.causa}
                      onChange={(e) => setFormData((prev) => ({ ...prev, causa: e.target.value }))}
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

                    {/* Fecha de fallecimiento */}
                    <TextField
                      fullWidth
                      label="Fecha de fallecimiento"
                      type="date"
                      variant="standard"
                      value={formData.fechaFallecimiento}
                      onChange={(e) => setFormData((prev) => ({ ...prev, fechaFallecimiento: e.target.value }))}
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

                    {/* Tipo de fallecimiento - Checkboxes */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: "text.primary" }}>
                        Tipo de fallecimiento
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Checkbox
                              checked={formData.tipoFallecimiento.muerte}
                              onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                tipoFallecimiento: {
                                  ...prev.tipoFallecimiento,
                                  muerte: e.target.checked
                                }
                              }))}
                              disabled={viewMode}
                              sx={{ 
                                color: "primary.main",
                                "&.Mui-checked": {
                                  color: "primary.main",
                                },
                              }}
                            />
                            <Typography variant="body2" sx={{ color: viewMode ? "text.secondary" : "text.primary" }}>
                              Muerte
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Checkbox
                              checked={formData.tipoFallecimiento.sacrificio}
                              onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                tipoFallecimiento: {
                                  ...prev.tipoFallecimiento,
                                  sacrificio: e.target.checked
                                }
                              }))}
                              disabled={viewMode}
                              sx={{ 
                                color: "primary.main",
                                "&.Mui-checked": {
                                  color: "primary.main",
                                },
                              }}
                            />
                            <Typography variant="body2" sx={{ color: viewMode ? "text.secondary" : "text.primary" }}>
                              Sacrificio
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

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
                              sx={buttonStyles.cancel}
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
            </ThemeProvider>
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