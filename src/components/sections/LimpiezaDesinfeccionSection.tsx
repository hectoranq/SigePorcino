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
import { buttonStyles, headerColors, headerAccentColors } from "./buttonStyles"
import useUserStore from "../../_store/user"
import useFarmFormStore from "../../_store/farm"
import { listStaff, Staff } from "../../action/PersonalRegisterPocket"
import {
  getLimpiezaDesinfeccionByFarmId,
  createLimpiezaDesinfeccion,
  updateLimpiezaDesinfeccion,
  deleteLimpiezaDesinfeccion,
  LimpiezaDesinfeccion as APILimpiezaDesinfeccion,
} from "../../action/LimpiezaDesinfeccionPocket"

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

interface LimpiezaDesinfeccionData {
  id?: string
  productoEmpleado: string
  fecha: string
  operario: string
  supervisadoPor: string
  supervisadoPorId?: string
  nroSilo: string
  observaciones: string
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

export function LimpiezaDesinfeccionSection() {
  // Zustand stores
  const { token, record } = useUserStore()
  const { currentFarm } = useFarmFormStore()

  // Estado para el personal
  const [staff, setStaff] = useState<Staff[]>([])

  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [currentRegistroId, setCurrentRegistroId] = useState<string | null>(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })
  const [formData, setFormData] = useState({
    productoEmpleado: "",
    fecha: "",
    operario: "",
    supervisadoPor: "",
    nroSilo: "",
    observaciones: "",
  })

  // Cargar personal al montar el componente
  useEffect(() => {
    const loadStaff = async () => {
      if (!currentFarm?.id || !token || !record?.id) return

      try {
        const response = await listStaff(token, record.id, currentFarm.id)
        setStaff(response.data.items as Staff[])
      } catch (error) {
        console.error("Error loading staff:", error)
      }
    }

    loadStaff()
  }, [currentFarm?.id, token, record?.id])

  // Estado para la tabla de limpieza y desinfección
  const [limpiezaDesinfeccionData, setLimpiezaDesinfeccionData] = useState<LimpiezaDesinfeccionData[]>([])

 

  // Función para convertir de API a formato local
  const convertAPItoLocal = (apiData: APILimpiezaDesinfeccion): LimpiezaDesinfeccionData => {
    const supervisorStaff = staff.find(s => s.id === apiData.supervisado_por)
    const supervisorNombre = supervisorStaff 
      ? `${supervisorStaff.nombre} ${supervisorStaff.apellidos}` 
      : ""

    return {
      id: apiData.id,
      productoEmpleado: apiData.producto_empleado,
      fecha: apiData.fecha,
      operario: apiData.operario,
      supervisadoPor: supervisorNombre,
      supervisadoPorId: apiData.supervisado_por,
      nroSilo: apiData.nro_silo,
      observaciones: apiData.observaciones,
      fechaCreacion: apiData.created ? formatDateToDisplay(apiData.created) : "",
      fechaUltimaActualizacion: apiData.updated ? formatDateToDisplay(apiData.updated) : "",
    }
  }

  // Función para convertir de formato local a API
  const convertLocalToAPI = (localData: LimpiezaDesinfeccionData) => {
    return {
      farm: currentFarm!.id,
      user: record!.id,
      producto_empleado: localData.productoEmpleado,
      fecha: localData.fecha,
      operario: localData.operario,
      supervisado_por: localData.supervisadoPor,
      nro_silo: localData.nroSilo,
      observaciones: localData.observaciones,
    }
  }

  // Cargar registros de limpieza y desinfección
  useEffect(() => {
    const loadLimpiezaDesinfeccion = async () => {
      if (!currentFarm?.id || !token || !record?.id || staff.length === 0) return

      setLoading(true)
      try {
        const response = await getLimpiezaDesinfeccionByFarmId(token, currentFarm.id, record.id)
        const registros = (response.data.items as APILimpiezaDesinfeccion[]).map(convertAPItoLocal)
        setLimpiezaDesinfeccionData(registros)
      } catch (error) {
        console.error("Error loading limpieza desinfeccion:", error)
        setSnackbar({
          open: true,
          message: "Error al cargar los registros de limpieza y desinfección",
          severity: "error",
        })
      } finally {
        setLoading(false)
      }
    }

    loadLimpiezaDesinfeccion()
  }, [currentFarm?.id, token, record?.id, staff])

  const loadRegistroToForm = (registro: LimpiezaDesinfeccionData) => {
    setFormData({
      productoEmpleado: registro.productoEmpleado,
      fecha: registro.fecha,
      operario: registro.operario,
      supervisadoPor: registro.supervisadoPorId || "",
      nroSilo: registro.nroSilo,
      observaciones: registro.observaciones,
    })
    setCurrentRegistroId(registro.id || null)
    setEditMode(true)
    setViewMode(false)
    setOpen(true)
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
    loadRegistroToForm(limpiezaDesinfeccionData[index])
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = limpiezaDesinfeccionData[index]
    
    setFormData({
      productoEmpleado: item.productoEmpleado,
      fecha: item.fecha,
      operario: item.operario,
      supervisadoPor: item.supervisadoPorId || "",
      nroSilo: item.nroSilo,
      observaciones: item.observaciones,
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
    setEditMode(false)
    setViewMode(false)
    setEditIndex(null)
    setCurrentRegistroId(null)
    setFormData({
      productoEmpleado: "",
      fecha: "",
      operario: "",
      supervisadoPor: "",
      nroSilo: "",
      observaciones: "",
    })
  }

  const handleSubmit = async () => {
    // Validar que los campos requeridos estén llenos
    if (!formData.productoEmpleado || !formData.operario || !formData.fecha || !formData.nroSilo) {
      setSnackbar({ open: true, message: "Por favor, completa todos los campos requeridos", severity: "error" })
      return
    }

    if (!formData.supervisadoPor) {
      setSnackbar({ open: true, message: "Por favor, selecciona un supervisor", severity: "error" })
      return
    }

    setSaving(true)

    try {
      const dataToSend = convertLocalToAPI(formData as LimpiezaDesinfeccionData)

      if (currentRegistroId) {
        // Actualizar registro existente
        await updateLimpiezaDesinfeccion(token, currentRegistroId, dataToSend, record!.id)
        setSnackbar({ open: true, message: "Registro actualizado exitosamente", severity: "success" })
      } else {
        // Crear nuevo registro
        await createLimpiezaDesinfeccion(token, dataToSend)
        setSnackbar({ open: true, message: "Registro creado exitosamente", severity: "success" })
      }

      // Recargar los datos
      const registros = await getLimpiezaDesinfeccionByFarmId(currentFarm!.id, token, record!.id)
      const convertedData = (registros.data.items as APILimpiezaDesinfeccion[]).map(convertAPItoLocal)
      setLimpiezaDesinfeccionData(convertedData)

      handleClose()
    } catch (error) {
      console.error("Error al guardar:", error)
      setSnackbar({
        open: true,
        message: `Error al guardar el registro: ${error instanceof Error ? error.message : "Error desconocido"}`,
        severity: "error",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (index: number) => {
    const item = limpiezaDesinfeccionData[index]
    
    if (!item.id) {
      setSnackbar({ open: true, message: "Error: No se puede eliminar el registro", severity: "error" })
      return
    }

    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      return
    }

    setLoading(true)
    try {
      await deleteLimpiezaDesinfeccion(token, item.id, record!.id)
      setSnackbar({ open: true, message: "Registro eliminado exitosamente", severity: "success" })
      
      // Recargar los datos
      const registros = await getLimpiezaDesinfeccionByFarmId(currentFarm!.id, token, record!.id)
      const convertedData = (registros.data.items as APILimpiezaDesinfeccion[]).map(convertAPItoLocal)
      setLimpiezaDesinfeccionData(convertedData)
    } catch (error) {
      console.error("Error al eliminar:", error)
      setSnackbar({
        open: true,
        message: `Error al eliminar el registro: ${error instanceof Error ? error.message : "Error desconocido"}`,
        severity: "error",
      })
    } finally {
      setLoading(false)
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
                    Limpieza y desinfección silos de pienso
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
                          Producto empleado
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
                          Operario
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Supervisado por
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Nro de Silo
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
                    {limpiezaDesinfeccionData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>{item.productoEmpleado}</TableCell>
                        <TableCell>{formatDateToDisplay(item.fecha)}</TableCell>
                        <TableCell>{item.operario}</TableCell>
                        <TableCell>{item.supervisadoPor}</TableCell>
                        <TableCell>{item.nroSilo}</TableCell>
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
                    {viewMode ? "Detalle de limpieza y desinfección" : currentRegistroId ? "Editar limpieza y desinfección" : "Registro de limpieza y desinfección"}
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Producto empleado y Fecha */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Producto empleado"
                        placeholder="Producto empleado"
                        variant="filled"
                        value={formData.productoEmpleado}
                        onChange={(e) => setFormData((prev) => ({ ...prev, productoEmpleado: e.target.value }))}
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

                  {/* Operario y Supervisado por */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Operario"
                        placeholder="Operario"
                        variant="filled"
                        value={formData.operario}
                        onChange={(e) => setFormData((prev) => ({ ...prev, operario: e.target.value }))}
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
                      {viewMode ? (
                        <TextField
                          fullWidth
                          label="Supervisado por"
                          variant="filled"
                          value={formData.supervisadoPor}
                          InputProps={{
                            readOnly: true,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: "text.secondary",
                            },
                          }}
                        />
                      ) : (
                        <TextField
                          fullWidth
                          select
                          label="Supervisado por"
                          variant="filled"
                          value={formData.supervisadoPor}
                          onChange={(e) => setFormData((prev) => ({ ...prev, supervisadoPor: e.target.value }))}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: "text.primary",
                            },
                          }}
                        >
                          {staff.map((person) => (
                            <MenuItem key={person.id} value={person.id}>
                              {person.nombre} {person.apellidos}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    </Grid>
                  </Grid>

                  {/* Nro de Silo */}
                  <TextField
                    fullWidth
                    placeholder="Nro de Silo"
                    variant="filled"
                    label="Nro de Silo"
                    value={formData.nroSilo}
                    onChange={(e) => setFormData((prev) => ({ ...prev, nroSilo: e.target.value }))}
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
                    placeholder="Observaciones"
                    variant="filled"
                    label="Observaciones"
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