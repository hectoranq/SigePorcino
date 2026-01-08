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
  createDesinsectacion,
  updateDesinsectacion,
  deleteDesinsectacion,
  getDesinsectacionByFarmId,
  Desinsectacion as APIDesinsectacion,
} from "../../action/DesinsectacionPocket"

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

interface DesinsectacionData {
  id?: string
  productoEmpleado: string
  dondeSeEmpleo: string
  aplicador: string
  fecha: string
  supervisado: string
  supervisadoId?: string
  tipoProducto: {
    lavado: boolean
    desinfectante: boolean
  }
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

export function DesinsectacionSection() {
  const { token, record } = useUserStore()
  const { currentFarm } = useFarmFormStore()
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [currentRegistroId, setCurrentRegistroId] = useState<string | null>(null)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error" | "info" | "warning"
  }>({ open: false, message: "", severity: "info" })

  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    productoEmpleado: "",
    dondeSeEmpleo: "",
    aplicador: "",
    fecha: "",
    supervisado: "",
    tipoProducto: {
      lavado: false,
      desinfectante: false,
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
  }, [currentFarm, token, record])

  // Estado para la tabla de desinsectación - ACTUALIZADO CON NUEVOS CAMPOS
  const [desinsectacionData, setDesinsectacionData] = useState<DesinsectacionData[]>([])

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

  // Función para convertir de API a formato local
  const convertAPItoLocal = (apiData: APIDesinsectacion): DesinsectacionData => {
    const supervisor = staff.find(s => s.id === apiData.supervisado)
    const supervisorNombre = supervisor 
      ? `${supervisor.nombre} ${supervisor.apellidos}` 
      : ""

    return {
      id: apiData.id,
      productoEmpleado: apiData.producto_empleado,
      dondeSeEmpleo: apiData.donde_se_empleo,
      aplicador: apiData.aplicador,
      fecha: apiData.fecha,
      supervisado: supervisorNombre,
      supervisadoId: apiData.supervisado,
      tipoProducto: {
        lavado: apiData.tipo_producto_lavado,
        desinfectante: apiData.tipo_producto_desinfectante,
      },
      fechaCreacion: apiData.created ? formatDateToDisplay(apiData.created) : "",
      fechaUltimaActualizacion: apiData.updated ? formatDateToDisplay(apiData.updated) : "",
    }
  }

  // Función para convertir de formato local a API
  const convertLocalToAPI = (localData: DesinsectacionData) => {
    return {
      farm: currentFarm!.id,
      user: record!.id,
      producto_empleado: localData.productoEmpleado,
      donde_se_empleo: localData.dondeSeEmpleo,
      aplicador: localData.aplicador,
      fecha: localData.fecha,
      supervisado: localData.supervisado,
      tipo_producto_lavado: localData.tipoProducto.lavado,
      tipo_producto_desinfectante: localData.tipoProducto.desinfectante,
    }
  }

  // Cargar registros de desinsectación
  useEffect(() => {
    const loadDesinsectacion = async () => {
      if (!currentFarm?.id || !token || !record?.id || staff.length === 0) return

      setLoading(true)
      try {
        const response = await getDesinsectacionByFarmId(token, currentFarm.id, record.id)
        const registros = (response.data.items as APIDesinsectacion[]).map(convertAPItoLocal)
        setDesinsectacionData(registros)
      } catch (error) {
        console.error("Error loading desinsectacion:", error)
        setSnackbar({
          open: true,
          message: "Error al cargar los registros de desinsectación",
          severity: "error",
        })
      } finally {
        setLoading(false)
      }
    }

    loadDesinsectacion()
  }, [currentFarm, token, record, staff])

  const loadRegistroToForm = (registro: DesinsectacionData) => {
    setFormData({
      productoEmpleado: registro.productoEmpleado,
      dondeSeEmpleo: registro.dondeSeEmpleo,
      aplicador: registro.aplicador,
      fecha: registro.fecha,
      supervisado: registro.supervisadoId || "",
      tipoProducto: {
        lavado: registro.tipoProducto.lavado,
        desinfectante: registro.tipoProducto.desinfectante,
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

  // FUNCIÓN HANDLEEDIT ACTUALIZADA CON NUEVOS CAMPOS
  const handleEdit = (index: number) => {
    loadRegistroToForm(desinsectacionData[index])
  }

  // FUNCIÓN VER MÁS ACTUALIZADA CON NUEVOS CAMPOS
  const handleVerMas = (index: number) => {
    const item = desinsectacionData[index]
    
    setFormData({
      productoEmpleado: item.productoEmpleado,
      dondeSeEmpleo: item.dondeSeEmpleo,
      aplicador: item.aplicador,
      fecha: item.fecha,
      supervisado: item.supervisadoId || "",
      tipoProducto: {
        lavado: item.tipoProducto.lavado,
        desinfectante: item.tipoProducto.desinfectante,
      },
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
      productoEmpleado: "",
      dondeSeEmpleo: "",
      aplicador: "",
      fecha: "",
      supervisado: "",
      tipoProducto: {
        lavado: false,
        desinfectante: false,
      },
    })
  }

  // HANDLESUBMIT ACTUALIZADO CON NUEVOS CAMPOS Y API
  const handleSubmit = async () => {
    // Validar que los campos requeridos estén llenos
    if (!formData.aplicador || !formData.productoEmpleado || !formData.fecha) {
      setSnackbar({ open: true, message: "Por favor, completa todos los campos requeridos", severity: "error" })
      return
    }

    if (!formData.supervisado) {
      setSnackbar({ open: true, message: "Por favor, selecciona un supervisor", severity: "error" })
      return
    }

    setSaving(true)

    try {
      const dataToSend = convertLocalToAPI(formData as DesinsectacionData)

      if (currentRegistroId) {
        // Actualizar registro existente
        await updateDesinsectacion(token, currentRegistroId, dataToSend, record.id)
        
        setSnackbar({ open: true, message: "Registro actualizado exitosamente", severity: "success" })
      } else {
        // Crear nuevo registro
        await createDesinsectacion(token, dataToSend)
        setSnackbar({ open: true, message: "Registro creado exitosamente", severity: "success" })
      }

      // Recargar los datos
      const registros = await getDesinsectacionByFarmId( token, currentFarm.id, record.id).then(res => res.data.items as APIDesinsectacion[])
      const convertedData = registros.map(convertAPItoLocal)
      setDesinsectacionData(convertedData)

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
                    Desinsectación
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
                          Nave
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Aplicador
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
                          Supervisado por
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
                    {desinsectacionData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>{item.productoEmpleado}</TableCell>
                        <TableCell>{item.dondeSeEmpleo}</TableCell>
                        <TableCell>{item.aplicador}</TableCell>
                        <TableCell>{formatDateToDisplay(item.fecha)}</TableCell>
                        <TableCell>{item.supervisado}</TableCell>
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
                      {viewMode ? "Detalle de desinsectación" : currentRegistroId ? "Editar desinsectación" : "Registro de desinsectación"}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    {/* NUEVO FORMULARIO CON LOS CAMPOS SOLICITADOS */}
                    
                    {/* Producto empleado y Donde se empleó */}
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
                          label="Donde se empleó"
                          placeholder="Donde se empleó"
                          variant="filled"
                          value={formData.dondeSeEmpleo}
                          onChange={(e) => setFormData((prev) => ({ ...prev, dondeSeEmpleo: e.target.value }))}
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

                    {/* Aplicador (ancho completo) */}
                    <TextField
                      fullWidth
                      label="Aplicador"
                      placeholder="Aplicador"
                      variant="filled"
                      value={formData.aplicador}
                      onChange={(e) => setFormData((prev) => ({ ...prev, aplicador: e.target.value }))}
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

                   

                    {/* Fecha y Supervisado */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
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
                      <Grid item xs={6}>
                        {viewMode ? (
                          <TextField
                            fullWidth
                            label="Supervisado"
                            variant="filled"
                            value={formData.supervisado}
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
                            label="Supervisado"
                            variant="filled"
                            value={formData.supervisado}
                            onChange={(e) => setFormData((prev) => ({ ...prev, supervisado: e.target.value }))}
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
 {/* Tipo de producto - Checkboxes */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: "text.primary" }}>
                        Tipo de producto
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Checkbox
                              checked={formData.tipoProducto.lavado}
                              onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                tipoProducto: {
                                  ...prev.tipoProducto,
                                  lavado: e.target.checked
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
                              Lavado
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Checkbox
                              checked={formData.tipoProducto.desinfectante}
                              onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                tipoProducto: {
                                  ...prev.tipoProducto,
                                  desinfectante: e.target.checked
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
                              Desinfectante
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