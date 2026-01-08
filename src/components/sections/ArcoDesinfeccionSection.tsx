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
import { listStaff, Staff } from "../../action/PersonalRegisterPocket"
import {
  getArcoDesinfeccionByFarmId,
  createArcoDesinfeccion,
  updateArcoDesinfeccion,
  deleteArcoDesinfeccion,
  ArcoDesinfeccion as APIArcoDesinfeccion,
} from "../../action/ArcoDesinfeccionPocket"

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

interface ArcoDesinfeccionData {
  id?: string
  productoEmpleado: string
  cantidadEmpleada: string
  responsable: string
  responsableId?: string
  fecha: string
  sistemaEmpleado: {
    arco: boolean
    vado: boolean
    mochila: boolean
  }
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

export function ArcoDesinfeccionSection() {
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
    cantidadEmpleada: "",
    responsable: "",
    fecha: "",
    sistemaEmpleado: {
      arco: false,
      vado: false,
      mochila: false,
    },
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

  // Estado para la tabla de arco de desinfección
  const [arcoDesinfeccionData, setArcoDesinfeccionData] = useState<ArcoDesinfeccionData[]>([])

  

  // Función para convertir de API a formato local
  const convertAPItoLocal = (apiData: APIArcoDesinfeccion): ArcoDesinfeccionData => {
    const responsableStaff = staff.find(s => s.id === apiData.responsable)
    const responsableNombre = responsableStaff 
      ? `${responsableStaff.nombre} ${responsableStaff.apellidos}` 
      : ""

    return {
      id: apiData.id,
      productoEmpleado: apiData.producto_empleado,
      cantidadEmpleada: apiData.cantidad_empleada.toString(),
      responsable: responsableNombre,
      responsableId: apiData.responsable,
      fecha: apiData.fecha,
      sistemaEmpleado: {
        arco: apiData.sistema_arco,
        vado: apiData.sistema_vado,
        mochila: apiData.sistema_mochila,
      },
      fechaCreacion: apiData.created ? formatDateToDisplay(apiData.created) : "",
      fechaUltimaActualizacion: apiData.updated ? formatDateToDisplay(apiData.updated) : "",
    }
  }

  // Función para convertir de formato local a API
  const convertLocalToAPI = (localData: ArcoDesinfeccionData) => {
    return {
      farm: currentFarm!.id,
      user: record!.id,
      producto_empleado: localData.productoEmpleado,
      cantidad_empleada: parseFloat(localData.cantidadEmpleada) || 0,
      fecha: localData.fecha,
      responsable: localData.responsable,
      sistema_arco: localData.sistemaEmpleado.arco,
      sistema_vado: localData.sistemaEmpleado.vado,
      sistema_mochila: localData.sistemaEmpleado.mochila,
    }
  }

  // Cargar registros de arco de desinfección
  useEffect(() => {
    const loadArcoDesinfeccion = async () => {
      if (!currentFarm?.id || !token || !record?.id || staff.length === 0) return

      setLoading(true)
      try {
        const response = await getArcoDesinfeccionByFarmId(token, currentFarm.id, record.id)
        const registros = (response.data.items as APIArcoDesinfeccion[]).map(convertAPItoLocal)
        setArcoDesinfeccionData(registros)
      } catch (error) {
        console.error("Error loading arco desinfeccion:", error)
        setSnackbar({
          open: true,
          message: "Error al cargar los registros de arco de desinfección",
          severity: "error",
        })
      } finally {
        setLoading(false)
      }
    }

    loadArcoDesinfeccion()
  }, [currentFarm?.id, token, record?.id, staff])

  const loadRegistroToForm = (registro: ArcoDesinfeccionData) => {
    setFormData({
      productoEmpleado: registro.productoEmpleado,
      cantidadEmpleada: registro.cantidadEmpleada,
      responsable: registro.responsableId || "",
      fecha: registro.fecha,
      sistemaEmpleado: {
        arco: registro.sistemaEmpleado.arco,
        vado: registro.sistemaEmpleado.vado,
        mochila: registro.sistemaEmpleado.mochila,
      },
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
    loadRegistroToForm(arcoDesinfeccionData[index])
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = arcoDesinfeccionData[index]
    
    setFormData({
      productoEmpleado: item.productoEmpleado,
      cantidadEmpleada: item.cantidadEmpleada,
      responsable: item.responsableId || "",
      fecha: item.fecha,
      sistemaEmpleado: {
        arco: item.sistemaEmpleado.arco,
        vado: item.sistemaEmpleado.vado,
        mochila: item.sistemaEmpleado.mochila,
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
    setEditMode(false)
    setViewMode(false)
    setEditIndex(null)
    setCurrentRegistroId(null)
    setFormData({
      productoEmpleado: "",
      cantidadEmpleada: "",
      responsable: "",
      fecha: "",
      sistemaEmpleado: {
        arco: false,
        vado: false,
        mochila: false,
      },
    })
  }

  const handleSubmit = async () => {
    // Validar que los campos requeridos estén llenos
    if (!formData.productoEmpleado || !formData.responsable || !formData.fecha) {
      setSnackbar({ open: true, message: "Por favor, completa todos los campos requeridos", severity: "error" })
      return
    }

    setSaving(true)

    try {
      const dataToSend = convertLocalToAPI(formData as ArcoDesinfeccionData)

      if (currentRegistroId) {
        // Actualizar registro existente
        await updateArcoDesinfeccion(token, currentRegistroId, dataToSend, record!.id)
        setSnackbar({ open: true, message: "Registro actualizado exitosamente", severity: "success" })
      } else {
        // Crear nuevo registro
        await createArcoDesinfeccion(token, dataToSend)
        setSnackbar({ open: true, message: "Registro creado exitosamente", severity: "success" })
      }

      // Recargar los datos
      const registros = await getArcoDesinfeccionByFarmId(currentFarm!.id, token, record!.id)
      const convertedData = (registros.data.items as APIArcoDesinfeccion[]).map(convertAPItoLocal)
      setArcoDesinfeccionData(convertedData)

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
    const item = arcoDesinfeccionData[index]
    
    if (!item.id) {
      setSnackbar({ open: true, message: "Error: No se puede eliminar el registro", severity: "error" })
      return
    }

    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      return
    }

    setLoading(true)
    try {
      await deleteArcoDesinfeccion(token, item.id, record!.id)
      setSnackbar({ open: true, message: "Registro eliminado exitosamente", severity: "success" })
      
      // Recargar los datos
      const registros = await getArcoDesinfeccionByFarmId(currentFarm!.id, token, record!.id)
      const convertedData = (registros.data.items as APIArcoDesinfeccion[]).map(convertAPItoLocal)
      setArcoDesinfeccionData(convertedData)
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
              <Box sx={sectionHeaderStyle}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={headerBarStyle} />
                  <Typography variant="h5" fontWeight={600}>
                    Arco de desinfección
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

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
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
                          Cantidad empleada (ml)
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Responsable
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
                    {arcoDesinfeccionData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>{item.productoEmpleado}</TableCell>
                        <TableCell>{item.cantidadEmpleada} ml</TableCell>
                        <TableCell>{item.responsable}</TableCell>
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
                      {viewMode ? "Detalle de arco de desinfección" : currentRegistroId ? "Editar arco de desinfección" : "Registro de arco de desinfección"}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    {/* Producto empleado y Cantidad empleada */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          placeholder="Producto empleado"
                          variant="standard"
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
                          placeholder="Cantidad empleada (ml)"
                          variant="standard"
                          type="number"
                          value={formData.cantidadEmpleada}
                          onChange={(e) => setFormData((prev) => ({ ...prev, cantidadEmpleada: e.target.value }))}
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

                    {/* Responsable y Fecha */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        {viewMode ? (
                          <TextField
                            fullWidth
                            label="Responsable"
                            variant="standard"
                            value={formData.responsable}
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
                            label="Responsable"
                            variant="standard"
                            value={formData.responsable}
                            onChange={(e) => setFormData((prev) => ({ ...prev, responsable: e.target.value }))}
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
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Fecha"
                          type="date"
                          variant="standard"
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

                    {/* Sistema empleado - Checkboxes */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: "text.primary" }}>
                        Sistema empleado
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Checkbox
                              checked={formData.sistemaEmpleado.arco}
                              onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                sistemaEmpleado: {
                                  ...prev.sistemaEmpleado,
                                  arco: e.target.checked
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
                              Arco
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Checkbox
                              checked={formData.sistemaEmpleado.vado}
                              onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                sistemaEmpleado: {
                                  ...prev.sistemaEmpleado,
                                  vado: e.target.checked
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
                              Vado
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Checkbox
                              checked={formData.sistemaEmpleado.mochila}
                              onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                sistemaEmpleado: {
                                  ...prev.sistemaEmpleado,
                                  mochila: e.target.checked
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
                              Mochila
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Botones dinámicos según el modo */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                      {viewMode ? (
                        <Button
                          variant="outlined"
                          onClick={handleClose}
                          sx={buttonStyles.close}
                          disabled={saving}
                        >
                          Cerrar
                        </Button>
                      ) : (
                        <>
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