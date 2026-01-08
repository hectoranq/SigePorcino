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
import useUserStore from "../../_store/user"
import useFarmFormStore from "../../_store/farm"
import { listStaff, Staff } from "../../action/PersonalRegisterPocket"
import {
  createDesratizacion,
  updateDesratizacion,
  deleteDesratizacion,
  getDesratizacionByFarmId,
  Desratizacion as APIDesratizacion,
} from "../../action/DesratizacionPocket"

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

interface DesratizacionData {
  id?: string
  aplicador: string
  dni: string
  rodenticida: string
  ceboAtrayente: string
  trampaAdhesiva: string
  fecha: string
  supervisado: string
  supervisadoId?: string
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

export function DesratizacionSection() {
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
  const [viewMode, setViewMode] = useState(false) // NUEVO ESTADO PARA MODO VISUALIZACIÓN
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    aplicador: "",
    dni: "",
    rodenticida: "",
    ceboAtrayente: "",
    trampaAdhesiva: "",
    fecha: "",
    supervisado: "",
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

  // Estado para la tabla de desratización
  const [desratizacionData, setDesratizacionData] = useState<DesratizacionData[]>([])

  // Función para convertir de API a formato local
  const convertAPItoLocal = (apiData: APIDesratizacion): DesratizacionData => {
    // Buscar el staff para obtener el nombre completo
    const supervisor = staff.find(s => s.id === apiData.supervisado)
    const supervisorNombre = supervisor 
      ? `${supervisor.nombre} ${supervisor.apellidos}` 
      : ""

    return {
      id: apiData.id,
      aplicador: apiData.aplicador,
      dni: apiData.dni,
      rodenticida: apiData.rodenticida,
      ceboAtrayente: apiData.cebo_atrayente,
      trampaAdhesiva: apiData.trampa_adhesiva,
      fecha: apiData.fecha,
      supervisado: supervisorNombre,
      supervisadoId: apiData.supervisado,
      fechaCreacion: apiData.created ? formatDateToDisplay(apiData.created) : "",
      fechaUltimaActualizacion: apiData.updated ? formatDateToDisplay(apiData.updated) : "",
    }
  }

  // Función para convertir de formato local a API
  const convertLocalToAPI = (localData: DesratizacionData) => {
    return {
      farm: currentFarm!.id,
      user: record!.id,
      aplicador: localData.aplicador,
      dni: localData.dni,
      rodenticida: localData.rodenticida,
      cebo_atrayente: localData.ceboAtrayente,
      trampa_adhesiva: localData.trampaAdhesiva,
      fecha: localData.fecha,
      supervisado: localData.supervisadoId || localData.supervisado || "",
    }
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

  // Cargar registros de desratización
  useEffect(() => {
    const loadDesratizacion = async () => {
      if (!currentFarm?.id || !token || !record?.id || staff.length === 0) return

      setLoading(true)
      try {
        const response = await getDesratizacionByFarmId(token, currentFarm.id, record.id)
        const registros = (response.data.items as APIDesratizacion[]).map(convertAPItoLocal)
        setDesratizacionData(registros)
      } catch (error) {
        console.error("Error loading desratizacion:", error)
        setSnackbar({
          open: true,
          message: "Error al cargar los registros de desratización",
          severity: "error",
        })
      } finally {
        setLoading(false)
      }
    }

    loadDesratizacion()
  }, [currentFarm, token, record, staff])

  const loadRegistroToForm = (registro: DesratizacionData) => {
    setFormData({
      aplicador: registro.aplicador,
      dni: registro.dni,
      rodenticida: registro.rodenticida,
      ceboAtrayente: registro.ceboAtrayente,
      trampaAdhesiva: registro.trampaAdhesiva,
      fecha: registro.fecha,
      supervisado: registro.supervisadoId || "",
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

  const handleEdit = (index: number) => {
    loadRegistroToForm(desratizacionData[index])
  }

  const handleVerMas = (index: number) => {
    const item = desratizacionData[index]
    
    setFormData({
      aplicador: item.aplicador,
      dni: item.dni,
      rodenticida: item.rodenticida,
      ceboAtrayente: item.ceboAtrayente,
      trampaAdhesiva: item.trampaAdhesiva,
      fecha: item.fecha,
      supervisado: item.supervisadoId || "",
    })
    
    setEditMode(false)
    setViewMode(true)
    setEditIndex(index)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditMode(false)
    setViewMode(false) // RESETEAR MODO VISUALIZACIÓN
    setEditIndex(null)
    setCurrentRegistroId(null)
    setFormData({
      aplicador: "",
      dni: "",
      rodenticida: "",
      ceboAtrayente: "",
      trampaAdhesiva: "",
      fecha: "",
      supervisado: "",
    })
  }

  const handleSubmit = async () => {
    if (!currentFarm?.id || !token || !record?.id) {
      setSnackbar({
        open: true,
        message: "Faltan datos necesarios para guardar el registro",
        severity: "error",
      })
      return
    }

    // Validar que los campos requeridos estén llenos
    if (!formData.aplicador || !formData.dni || !formData.fecha) {
      setSnackbar({
        open: true,
        message: "Por favor, completa todos los campos requeridos",
        severity: "error",
      })
      return
    }

    setSaving(true)
    try {
      const dataToSend = convertLocalToAPI({
        aplicador: formData.aplicador,
        dni: formData.dni,
        rodenticida: formData.rodenticida,
        ceboAtrayente: formData.ceboAtrayente,
        trampaAdhesiva: formData.trampaAdhesiva,
        fecha: formData.fecha,
        supervisado: "",
        supervisadoId: formData.supervisado,
        fechaCreacion: "",
        fechaUltimaActualizacion: "",
      })

      if (currentRegistroId) {
        // Actualizar registro existente
        await updateDesratizacion(token, currentRegistroId, dataToSend, record.id)
        setSnackbar({
          open: true,
          message: "Registro de desratización actualizado exitosamente",
          severity: "success",
        })
      } else {
        // Crear nuevo registro
        await createDesratizacion(token, dataToSend)
        setSnackbar({
          open: true,
          message: "Registro de desratización creado exitosamente",
          severity: "success",
        })
      }

      // Recargar la lista
      const response = await getDesratizacionByFarmId(token, currentFarm.id, record.id)
      const registros = (response.data.items as APIDesratizacion[]).map(convertAPItoLocal)
      setDesratizacionData(registros)

      handleClose()
    } catch (error) {
      console.error("Error al guardar el registro:", error)
      setSnackbar({
        open: true,
        message: "Error al guardar el registro de desratización",
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
                    Desratización
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
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                  <TableHead sx={{ bgcolor: "grey.100" }}>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Aplicador
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          DNI
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Rodenticida
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
                    {desratizacionData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>{item.aplicador}</TableCell>
                        <TableCell>{item.dni}</TableCell>
                        <TableCell>{item.rodenticida}</TableCell>
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
                {/* HEADER DINÁMICO SEGÚN EL MODO */}
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
                    {viewMode ? "Detalle de desratización" : currentRegistroId ? "Editar desratización" : "Registro de desratización"}
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Aplicador y DNI */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Aplicador"
                        placeholder="Nombre Completo"
                        variant="filled"
                        value={formData.aplicador}
                        onChange={(e) => setFormData((prev) => ({ ...prev, aplicador: e.target.value }))}
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
                        label="DNI"
                        placeholder="Identificador de identidad"
                        variant="filled"
                        value={formData.dni}
                        onChange={(e) => setFormData((prev) => ({ ...prev, dni: e.target.value }))}
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

                  {/* Rodenticida y Cebo atrayente */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Rodenticida"
                        placeholder="Ej: Bromadiolona 0.005%"
                        variant="filled"
                        value={formData.rodenticida}
                        onChange={(e) => setFormData((prev) => ({ ...prev, rodenticida: e.target.value }))}
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
                        label="Cebo atrayente"
                        placeholder="Cebo atrayente de roedores"
                        variant="filled"
                        value={formData.ceboAtrayente}
                        onChange={(e) => setFormData((prev) => ({ ...prev, ceboAtrayente: e.target.value }))}
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

                  {/* Trampa adhesiva */}
                  <TextField
                    fullWidth
                    label="Trampa adhesiva"
                    placeholder="Trampa adhesiva de roedores"
                    variant="filled"
                    value={formData.trampaAdhesiva}
                    onChange={(e) => setFormData((prev) => ({ ...prev, trampaAdhesiva: e.target.value }))}
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
                          value={
                            staff.find(s => s.id === formData.supervisado)
                              ? `${staff.find(s => s.id === formData.supervisado)!.nombre} ${staff.find(s => s.id === formData.supervisado)!.apellidos}`
                              : ""
                          }
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

                  {/* BOTONES DINÁMICOS SEGÚN EL MODO */}
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