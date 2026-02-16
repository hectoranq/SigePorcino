"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogContent,
  TextField,
  Grid,
  FormControlLabel,
  FormGroup,
  Checkbox,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
  DialogTitle,
  DialogActions,
  Radio,
  RadioGroup,
  Link,
  IconButton,
} from "@mui/material"
import {
  Add,
  KeyboardArrowDown,
  CalendarToday,
  Delete,
  AttachFile,
} from "@mui/icons-material"
import {
  listStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  Staff,
  CreateStaffData,
  UpdateStaffData,
} from "../../action/PersonalRegisterPocket"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { buttonStyles } from "./buttonStyles"
import useUserStore from "../../_store/user"
import useFarmFormStore from "../../_store/farm"

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

interface PersonalRegisterSectionProps {
  farmId?: string;
}

export function PersonalRegisterSection({ farmId }: PersonalRegisterSectionProps) {
  // Obtener datos de los stores de Zustand
  const token = useUserStore(state => state.token)
  const userId = useUserStore(state => state.record.id)
  const currentFarm = useFarmFormStore(state => state.currentFarm)
  const allFarms = useFarmFormStore(state => state.farms)
  
  // Usar farmId del currentFarm si no se proporciona
  const activeFarmId = farmId || currentFarm?.id
  
  const [staffData, setStaffData] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })
  
  // Debug: Mostrar los valores de los stores
  useEffect(() => {
    console.log("🔍 PersonalRegisterSection Stores:", {
      hasToken: !!token,
      hasUserId: !!userId,
      userId: userId || "No disponible",
      hasFarmId: !!activeFarmId,
      farmId: activeFarmId || "No seleccionada",
      farmName: currentFarm?.farm_name || "Sin nombre",
      currentFarmComplete: currentFarm,
      allFarmsCount: allFarms.length,
      firstFarmId: allFarms[0]?.id || "No hay granjas"
    })
    
    // Log adicional para ver todo el store de farms
    console.log("🗄️ Estado completo del store de farms:", useFarmFormStore.getState())
  }, [token, userId, activeFarmId, currentFarm, allFarms])
  

  // Estado para el popup
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  
  // Estados para el diálogo de confirmación de eliminación
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    dni: "",
    nombre: "",
    apellidos: "",
    telefono: "",
    correo: "",
    fechaInicio: "",
    fechaFinalizacion: "",
    experiencia: "",
    certificado: null as File | null,
    certificadoNombre: "",
    titulaciones: [] as string[],
    tareas: [] as string[],
    otraTitulacion: "",
    otraTarea: "",
  })

  // Cargar personal al montar el componente
  useEffect(() => {
    if (token && userId) {
      loadStaff()
    }
  }, [token, userId, activeFarmId])

  const loadStaff = async () => {
    if (!token || !userId) {
      console.error("❌ Token o userId no disponibles en el store")
      return
    }

    setLoading(true)
    try {
      const response = await listStaff(token, userId, activeFarmId)
      if (response.success) {
        setStaffData(response.data.items as Staff[] || [])
        console.log("✅ Personal cargado:", response.data.items.length)
      }
    } catch (error: any) {
      console.error("❌ Error al cargar personal:", error)
      setSnackbar({
        open: true,
        message: error.message || "Error al cargar personal",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCheckboxChange = (value: string, category: "titulaciones" | "tareas") => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }))
  }

  const handleOpen = () => {
    // Validar token y userId del store
    if (!token || !userId) {
      setSnackbar({
        open: true,
        message: "No hay sesión activa. Por favor, inicia sesión nuevamente.",
        severity: "error",
      })
      return
    }
    
    // Validar que haya una granja seleccionada
    if (!activeFarmId) {
      setSnackbar({
        open: true,
        message: "Por favor, selecciona una granja antes de agregar personal",
        severity: "error",
      })
      return
    }
    
    setEditMode(false)
    setEditId(null)
    setOpen(true)
  }

  // Función para abrir en modo edición
  const handleEdit = (id: string) => {
    const person = staffData.find(p => p.id === id)
    if (!person) return

    console.log("Editar personal:", person)
    
    setFormData({
      dni: person.dni,
      nombre: person.nombre,
      apellidos: person.apellidos,
      telefono: person.telefono,
      correo: person.correo,
      fechaInicio: person.fecha_inicio,
      fechaFinalizacion: person.fecha_finalizacion,
      experiencia: person.experiencia || "",
      certificado: null,
      certificadoNombre: "",
      titulaciones: person.titulaciones || [],
      tareas: person.tareas || [],
      otraTitulacion: "",
      otraTarea: "",
    })
    
    setEditMode(true)
    setEditId(id)
    setOpen(true)
  }

  // Función para convertir fecha de DD/MM/YYYY a YYYY-MM-DD
  const convertDateFormat = (dateString: string) => {
    if (dateString === "Sin fecha" || !dateString) return ""
    const [day, month, year] = dateString.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
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
    setEditId(null)
    setFormData({
      dni: "",
      nombre: "",
      apellidos: "",
      telefono: "",
      correo: "",
      fechaInicio: "",
      fechaFinalizacion: "",
      experiencia: "",
      certificado: null,
      certificadoNombre: "",
      titulaciones: [],
      tareas: [],
      otraTitulacion: "",
      otraTarea: "",
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        certificado: file,
        certificadoNombre: file.name,
      }))
    }
  }

  const handleAddTitulacion = () => {
    if (formData.otraTitulacion.trim()) {
      setFormData(prev => ({
        ...prev,
        titulaciones: [...prev.titulaciones, prev.otraTitulacion.trim()],
        otraTitulacion: "",
      }))
    }
  }

  const handleAddTarea = () => {
    if (formData.otraTarea.trim()) {
      setFormData(prev => ({
        ...prev,
        tareas: [...prev.tareas, prev.otraTarea.trim()],
        otraTarea: "",
      }))
    }
  }

  const handleSubmit = async () => {
    // Validar token
    if (!token) {
      setSnackbar({
        open: true,
        message: "No hay sesión activa. Por favor, inicia sesión nuevamente.",
        severity: "error",
      })
      return
    }

    // Validar userId
    if (!userId) {
      setSnackbar({
        open: true,
        message: "Usuario no identificado. Por favor, inicia sesión nuevamente.",
        severity: "error",
      })
      return
    }

    // Validar farmId
    if (!activeFarmId) {
      setSnackbar({
        open: true,
        message: "No hay granja seleccionada. Por favor, selecciona una granja.",
        severity: "error",
      })
      return
    }

    // Validar campos requeridos
    if (!formData.dni || !formData.nombre || !formData.apellidos || !formData.telefono || !formData.correo) {
      setSnackbar({
        open: true,
        message: "Por favor, completa todos los campos requeridos",
        severity: "error",
      })
      return
    }

    setLoading(true)
    try {
      if (editMode && editId) {
        // Actualizar personal existente
        const updateData: UpdateStaffData = {
          dni: formData.dni,
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          telefono: formData.telefono,
          correo: formData.correo,
          fecha_inicio: formData.fechaInicio,
          fecha_finalizacion: formData.fechaFinalizacion,
          experiencia: formData.experiencia,
          titulaciones: formData.titulaciones,
          tareas: formData.tareas,
          farm: activeFarmId,
        }

        // Agregar certificado si existe
        if (formData.certificado) {
          updateData.certificado = formData.certificado
        }

        const response = await updateStaff(token, editId, updateData, userId)
        if (response.success) {
          setSnackbar({
            open: true,
            message: "Personal actualizado exitosamente",
            severity: "success",
          })
          await loadStaff()
          handleClose()
        }
      } else {
        // Crear nuevo personal
        const createData: CreateStaffData = {
          dni: formData.dni,
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          telefono: formData.telefono,
          correo: formData.correo,
          fecha_inicio: formData.fechaInicio,
          fecha_finalizacion: formData.fechaFinalizacion,
          experiencia: formData.experiencia,
          titulaciones: formData.titulaciones,
          tareas: formData.tareas,
          farm: activeFarmId,
          user: userId,
        }

        // Agregar certificado si existe
        if (formData.certificado) {
          createData.certificado = formData.certificado
        }

        const response = await createStaff(token, createData)
        if (response.success) {
          setSnackbar({
            open: true,
            message: "Personal registrado exitosamente",
            severity: "success",
          })
          await loadStaff()
          handleClose()
        }
      }
    } catch (error: any) {
      console.error("❌ Error al guardar personal:", error)
      setSnackbar({
        open: true,
        message: error.message || "Error al guardar el personal",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // Funciones para eliminar
  const handleEliminarClick = (id: string) => {
    setStaffToDelete(id)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!staffToDelete || !token || !userId) return

    setLoading(true)
    try {
      const response = await deleteStaff(token, staffToDelete, userId)
      if (response.success) {
        setSnackbar({
          open: true,
          message: "Personal eliminado exitosamente",
          severity: "success",
        })
        await loadStaff()
      }
    } catch (error: any) {
      console.error("❌ Error al eliminar personal:", error)
      setSnackbar({
        open: true,
        message: error.message || "Error al eliminar el personal",
        severity: "error",
      })
    } finally {
      setLoading(false)
      setOpenDeleteDialog(false)
      setStaffToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false)
    setStaffToDelete(null)
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
                    Registro de personal
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<Add />}
                  sx={buttonStyles.save}
                  onClick={handleOpen}
                  disabled={!activeFarmId || !token || !userId}
                >
                  Agregar nuevo
                </Button>
              </Box>

              {/* Alerta cuando no hay granja seleccionada */}
              {!activeFarmId && (
                <Box sx={{ p: 3, bgcolor: "#fff3cd", borderBottom: 1, borderColor: "divider" }}>
                  <Alert severity="warning" sx={{ bgcolor: "transparent", p: 0 }}>
                    <Typography variant="body2">
                      <strong>No hay granja seleccionada.</strong> Por favor, selecciona una granja del menú superior para poder agregar personal.
                    </Typography>
                  </Alert>
                </Box>
              )}

              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "grey.100" }}>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          DNI
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Nombre
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Teléfono
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Fecha de inicio
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Fecha de finalización
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
                    {loading && staffData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <CircularProgress size={40} />
                          <Typography sx={{ mt: 2 }}>Cargando personal...</Typography>
                        </TableCell>
                      </TableRow>
                    ) : staffData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            No hay personal registrado
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      staffData.map((person) => (
                        <TableRow
                          key={person.id}
                          sx={{
                            "&:hover": {
                              bgcolor: "grey.50",
                            },
                          }}
                        >
                          <TableCell>{person.dni}</TableCell>
                          <TableCell>{person.nombre} {person.apellidos}</TableCell>
                          <TableCell>{person.telefono}</TableCell>
                          <TableCell>{formatDateToDisplay(person.fecha_inicio)}</TableCell>
                          <TableCell>{formatDateToDisplay(person.fecha_finalizacion)}</TableCell>
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
                                onClick={() => handleEdit(person.id!)}
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
                              >
                                Ver más
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<Delete />}
                                onClick={() => handleEliminarClick(person.id!)}
                                sx={{
                                  bgcolor: "#f44336",
                                  color: "white",
                                  "&:hover": {
                                    bgcolor: "#d32f2f",
                                  },
                                }}
                              >
                                Eliminar
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
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
            sx: { borderRadius: 2 },
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ minHeight: "auto", bgcolor: "#f9fafb", p: 3 }}>
              <Paper sx={{ maxWidth: 1024, mx: "auto", borderRadius: 2, overflow: "hidden" }}>
                <Box
                  sx={{
                    bgcolor: "#22d3ee",
                    px: 3,
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box sx={{ width: 4, height: 24, bgcolor: "#67e8f9", borderRadius: 0.5 }} />
                  <Typography variant="h6" sx={{ color: "white", fontWeight: 500 }}>
                    {editMode ? "Editar personal" : "Registro de personal"}
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* DNI */}
                  <TextField
                    fullWidth
                    placeholder="DNI"
                    variant="standard"
                    value={formData.dni}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dni: e.target.value }))}
                    sx={{ mb: 3 }}
                  />

                  {/* Name and Surnames */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        placeholder="Nombre"
                        variant="standard"
                        value={formData.nombre}
                        onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        placeholder="Apellidos"
                        variant="standard"
                        value={formData.apellidos}
                        onChange={(e) => setFormData((prev) => ({ ...prev, apellidos: e.target.value }))}
                      />
                    </Grid>
                  </Grid>

                  {/* Phone and Email */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        placeholder="Teléfono"
                        variant="standard"
                        value={formData.telefono}
                        onChange={(e) => setFormData((prev) => ({ ...prev, telefono: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        placeholder="Correo electrónico"
                        type="email"
                        variant="standard"
                        value={formData.correo}
                        onChange={(e) => setFormData((prev) => ({ ...prev, correo: e.target.value }))}
                      />
                    </Grid>
                  </Grid>

                  {/* Dates */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        placeholder="Fecha de inicio"
                        type="date"
                        variant="standard"
                        value={formData.fechaInicio}
                        onChange={(e) => setFormData((prev) => ({ ...prev, fechaInicio: e.target.value }))}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <CalendarToday sx={{ color: "#6b7280", fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        placeholder="Fecha de finalización"
                        type="date"
                        variant="standard"
                        value={formData.fechaFinalizacion}
                        onChange={(e) => setFormData((prev) => ({ ...prev, fechaFinalizacion: e.target.value }))}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <CalendarToday sx={{ color: "#6b7280", fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Experience */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
                      Tiene 3 años de experiencia en trabajos relacionados con la cría de ganado porcino
                    </Typography>
                    <RadioGroup
                      row
                      value={formData.experiencia}
                      onChange={(e) => setFormData((prev) => ({ ...prev, experiencia: e.target.value }))}
                      sx={{ mb: 2 }}
                    >
                      <FormControlLabel
                        value="si"
                        control={<Radio sx={{ "&.Mui-checked": { color: "#0d9488" } }} />}
                        label="Sí"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio sx={{ "&.Mui-checked": { color: "#0d9488" } }} />}
                        label="No"
                      />
                    </RadioGroup>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<AttachFile />}
                      sx={{
                        borderColor: "#d1d5db",
                        color: "text.secondary",
                        textTransform: "none",
                        "&:hover": {
                          borderColor: "#9ca3af",
                          bgcolor: "grey.50",
                        },
                      }}
                    >
                      {formData.certificadoNombre || "Cargar certificado"}
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                      />
                    </Button>
                  </Box>

                  {/* Qualifications and Tasks */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                        Titulaciones
                      </Typography>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.titulaciones.includes("Título de técnico en producción agropecuaria")}
                              onChange={() => handleCheckboxChange("Título de técnico en producción agropecuaria", "titulaciones")}
                              sx={{ "&.Mui-checked": { color: "#22c55e" } }}
                            />
                          }
                          label="Título de técnico en producción agropecuaria"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.titulaciones.includes("Título de técnico superior en ganadería y asistencia en sanidad animal")}
                              onChange={() => handleCheckboxChange("Título de técnico superior en ganadería y asistencia en sanidad animal", "titulaciones")}
                              sx={{ "&.Mui-checked": { color: "#22c55e" } }}
                            />
                          }
                          label="Título de técnico superior en ganadería y asistencia en sanidad animal"
                        />
                        {formData.titulaciones
                          .filter(t => 
                            t !== "Título de técnico en producción agropecuaria" && 
                            t !== "Título de técnico superior en ganadería y asistencia en sanidad animal"
                          )
                          .map((titulacion, index) => (
                            <FormControlLabel
                              key={index}
                              control={
                                <Checkbox
                                  checked={true}
                                  onChange={() => handleCheckboxChange(titulacion, "titulaciones")}
                                  sx={{ "&.Mui-checked": { color: "#22c55e" } }}
                                />
                              }
                              label={titulacion}
                            />
                          ))}
                      </FormGroup>
                      <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}>
                        <TextField
                          size="small"
                          placeholder="Nueva titulación"
                          variant="standard"
                          value={formData.otraTitulacion}
                          onChange={(e) => setFormData(prev => ({ ...prev, otraTitulacion: e.target.value }))}
                          sx={{ flexGrow: 1 }}
                        />
                        <Link
                          component="button"
                          type="button"
                          onClick={handleAddTitulacion}
                          sx={{
                            color: "#22d3ee",
                            textDecoration: "none",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          Añadir otra opción
                        </Link>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                        Tareas a cargo
                      </Typography>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.tareas.includes("Cuidado de animales")}
                              onChange={() => handleCheckboxChange("Cuidado de animales", "tareas")}
                              sx={{ "&.Mui-checked": { color: "#22c55e" } }}
                            />
                          }
                          label="Cuidado de animales"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.tareas.includes("Manejo de animales")}
                              onChange={() => handleCheckboxChange("Manejo de animales", "tareas")}
                              sx={{ "&.Mui-checked": { color: "#22c55e" } }}
                            />
                          }
                          label="Manejo de animales"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.tareas.includes("Revisión de animales")}
                              onChange={() => handleCheckboxChange("Revisión de animales", "tareas")}
                              sx={{ "&.Mui-checked": { color: "#22c55e" } }}
                            />
                          }
                          label="Revisión de animales"
                        />
                        {formData.tareas
                          .filter(t => 
                            t !== "Cuidado de animales" && 
                            t !== "Manejo de animales" && 
                            t !== "Revisión de animales"
                          )
                          .map((tarea, index) => (
                            <FormControlLabel
                              key={index}
                              control={
                                <Checkbox
                                  checked={true}
                                  onChange={() => handleCheckboxChange(tarea, "tareas")}
                                  sx={{ "&.Mui-checked": { color: "#22c55e" } }}
                                />
                              }
                              label={tarea}
                            />
                          ))}
                      </FormGroup>
                      <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}>
                        <TextField
                          size="small"
                          placeholder="Nueva tarea"
                          variant="standard"
                          value={formData.otraTarea}
                          onChange={(e) => setFormData(prev => ({ ...prev, otraTarea: e.target.value }))}
                          sx={{ flexGrow: 1 }}
                        />
                        <Link
                          component="button"
                          type="button"
                          onClick={handleAddTarea}
                          sx={{
                            color: "#22d3ee",
                            textDecoration: "none",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          Añadir otra opción
                        </Link>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Buttons */}
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={handleClose}
                      sx={buttonStyles.close}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      sx={buttonStyles.save}
                    >
                      {editMode ? "Actualizar" : "Guardar"}
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Dialog de confirmación de eliminación */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleCancelDelete}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            ¿Confirmar eliminación?
          </DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que deseas eliminar a{" "}
              <strong>
                {staffToDelete
                  ? staffData.find(s => s.id === staffToDelete)?.nombre
                  : ""}
              </strong>?
              Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handleCancelDelete}
              variant="outlined"
              color="inherit"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
              startIcon={<Delete />}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar para mensajes */}
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
