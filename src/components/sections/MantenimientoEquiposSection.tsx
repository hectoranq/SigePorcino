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
  getMantenimientoEquiposByFarmId,
  createMantenimientoEquipos,
  updateMantenimientoEquipos,
  deleteMantenimientoEquipos,
  MantenimientoEquipos as APIMantenimientoEquipos,
} from "../../action/MantenimientoEquiposPocket"

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

interface MantenimientoEquiposData {
  id?: string
  nombreEquipo: string
  fecha: string
  revision: string
  proximaRevision: string
  observaciones: string
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

export function MantenimientoEquiposSection() {
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
    nombreEquipo: "",
    fecha: "",
    revision: "",
    proximaRevision: "",
    observaciones: "",
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
  const convertAPItoLocal = (apiData: APIMantenimientoEquipos): MantenimientoEquiposData => {
    return {
      id: apiData.id,
      nombreEquipo: apiData.nombre_equipo,
      fecha: apiData.fecha,
      revision: apiData.revision,
      proximaRevision: apiData.proxima_revision,
      observaciones: apiData.observaciones || "",
      fechaCreacion: formatDateToDisplay(apiData.created || ""),
      fechaUltimaActualizacion: formatDateToDisplay(apiData.updated || ""),
    }
  }

  // Convertir de formato local a API
  const convertLocalToAPI = (localData: any): Partial<APIMantenimientoEquipos> => {
    return {
      nombre_equipo: localData.nombreEquipo,
      fecha: localData.fecha,
      revision: localData.revision,
      proxima_revision: localData.proximaRevision,
      observaciones: localData.observaciones,
      farm: currentFarm!.id,
      user: record!.id,
    }
  }

  // useEffect para cargar datos de la API
  useEffect(() => {
    const loadMantenimientoEquipos = async () => {
      if (!token || !record?.id || !currentFarm?.id) return
      
      setLoading(true)
      try {
        const registros = await getMantenimientoEquiposByFarmId(currentFarm.id, token, record.id)
        if (registros.success && registros.data.items) {
          const convertedData = (registros.data.items as APIMantenimientoEquipos[]).map(convertAPItoLocal)
          setMantenimientoEquiposData(convertedData)
        }
      } catch (error) {
        console.error("Error al cargar mantenimiento de equipos:", error)
        setSnackbar({ open: true, message: "Error al cargar los datos", severity: "error" })
      } finally {
        setLoading(false)
      }
    }
    loadMantenimientoEquipos()
  }, [token, record, currentFarm])

  // Función para cargar registro en el formulario
  const loadRegistroToForm = (registro: MantenimientoEquiposData) => {
    setFormData({
      nombreEquipo: registro.nombreEquipo,
      fecha: registro.fecha,
      revision: registro.revision,
      proximaRevision: registro.proximaRevision,
      observaciones: registro.observaciones,
    })
  }

  // Estado para la tabla de mantenimiento de equipos
  const [mantenimientoEquiposData, setMantenimientoEquiposData] = useState<MantenimientoEquiposData[]>([])

  const handleOpen = () => {
    setEditMode(false)
    setViewMode(false)
    setEditIndex(null)
    setCurrentRegistroId(null)
    setOpen(true)
  }

  // Función para abrir en modo edición
  const handleEdit = (index: number) => {
    const item = mantenimientoEquiposData[index]
    loadRegistroToForm(item)
    setCurrentRegistroId(item.id || null)
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = mantenimientoEquiposData[index]
    
    setFormData({
      nombreEquipo: item.nombreEquipo,
      fecha: item.fecha,
      revision: item.revision,
      proximaRevision: item.proximaRevision,
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
      nombreEquipo: "",
      fecha: "",
      revision: "",
      proximaRevision: "",
      observaciones: "",
    })
  }

  const handleSubmit = async () => {
    // Validar que los campos requeridos estén llenos
    if (!formData.nombreEquipo || !formData.fecha || !formData.revision) {
      setSnackbar({ open: true, message: "Por favor, completa todos los campos requeridos", severity: "error" })
      return
    }

    if (!formData.proximaRevision) {
      setSnackbar({ open: true, message: "Por favor, completa la fecha de próxima revisión", severity: "error" })
      return
    }

    setSaving(true)
    try {
      const dataToSend = convertLocalToAPI(formData)

      if (currentRegistroId) {
        // Actualizar registro existente
        await updateMantenimientoEquipos(token!, currentRegistroId, dataToSend, record!.id)
        setSnackbar({ open: true, message: "Registro actualizado exitosamente", severity: "success" })
      } else {
        // Crear nuevo registro
        await createMantenimientoEquipos(token!, dataToSend as any)
        setSnackbar({ open: true, message: "Registro creado exitosamente", severity: "success" })
      }

      // Recargar datos
      const registros = await getMantenimientoEquiposByFarmId(currentFarm!.id, token!, record!.id)
      if (registros.success && registros.data.items) {
        const convertedData = (registros.data.items as APIMantenimientoEquipos[]).map(convertAPItoLocal)
        setMantenimientoEquiposData(convertedData)
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
    const item = mantenimientoEquiposData[index]
    
    if (!item.id) {
      setSnackbar({ open: true, message: "No se puede eliminar: ID no encontrado", severity: "error" })
      return
    }

    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      return
    }

    try {
      await deleteMantenimientoEquipos(token!, item.id, record!.id)
      setSnackbar({ open: true, message: "Registro eliminado exitosamente", severity: "success" })
      
      // Recargar datos
      const registros = await getMantenimientoEquiposByFarmId(currentFarm!.id, token!, record!.id)
      if (registros.success && registros.data.items) {
        const convertedData = (registros.data.items as APIMantenimientoEquipos[]).map(convertAPItoLocal)
        setMantenimientoEquiposData(convertedData)
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
                    Mantenimiento de equipos
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
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "grey.100" }}>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Nombre del equipo
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
                          Revisión
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Próxima revisión
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
                    {mantenimientoEquiposData.map((item, index) => (
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
                            {item.nombreEquipo}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDateToDisplay(item.fecha)}</TableCell>
                        <TableCell sx={{ maxWidth: 250 }}>
                          <Typography variant="body2" sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap' 
                          }}>
                            {item.revision}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDateToDisplay(item.proximaRevision)}</TableCell>
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
                    {viewMode ? "Detalle de mantenimiento de equipo" : currentRegistroId ? "Editar mantenimiento de equipo" : "Registro de mantenimiento de equipo"}
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Nombre del equipo y Fecha */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        label="Nombre del equipo"
                        placeholder="Nombre del equipo"
                        variant="filled"
                        value={formData.nombreEquipo}
                        onChange={(e) => setFormData((prev) => ({ ...prev, nombreEquipo: e.target.value }))}
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

                  {/* Revisión */}
                  <TextField
                    fullWidth
                    label="Revisión"
                    placeholder="Revisión realizada"
                    variant="filled"
                    multiline
                    rows={3}
                    value={formData.revision}
                    onChange={(e) => setFormData((prev) => ({ ...prev, revision: e.target.value }))}
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

                  {/* Próxima revisión */}
                  <TextField
                    fullWidth
                    label="Próxima revisión"
                    type="date"
                    variant="filled"
                    value={formData.proximaRevision}
                    onChange={(e) => setFormData((prev) => ({ ...prev, proximaRevision: e.target.value }))}
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
                          startIcon={saving ? <CircularProgress size={20} /> : undefined}
                        >
                          {saving ? "Guardando..." : currentRegistroId ? "Actualizar" : "Guardar"}
                        </Button>
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