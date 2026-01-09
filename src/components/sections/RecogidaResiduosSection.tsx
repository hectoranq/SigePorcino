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
  getRecogidaResiduosByFarmId,
  createRecogidaResiduos,
  updateRecogidaResiduos,
  deleteRecogidaResiduos,
  RecogidaResiduos as APIRecogidaResiduos,
} from "../../action/RecogidaResiduosPocket"

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

interface RecogidaResiduosData {
  id?: string
  codigos: string
  responsable: string
  responsableId?: string
  unidades: string
  kg: string
  fecha: string
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

const CODIGOS = [
  "18 02 01 - Objetos cortantes",
  "18 02 02 - Residuos anatomopatológicos",
  "18 02 03 - Residuos de medicamentos citotóxicos",
  "15 01 10 - Envases con restos peligrosos",
  "18 01 03 - Residuos infecciosos",
  "16 05 06 - Productos químicos de laboratorio",
  "18 02 05 - Productos químicos peligrosos",
  "15 02 02 - Absorbentes contaminados"
]

export function RecogidaResiduosSection() {
  // Stores
  const { token, record } = useUserStore()
  const { currentFarm } = useFarmFormStore()

  // Estado para staff
  const [staff, setStaff] = useState<Staff[]>([])

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
    codigos: "",
    responsable: "",
    unidades: "",
    kg: "",
    fecha: "",
  })

  // Estado para la tabla de recogida de residuos
  const [recogidaResiduosData, setRecogidaResiduosData] = useState<RecogidaResiduosData[]>([])

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
  const convertAPItoLocal = (apiData: APIRecogidaResiduos): RecogidaResiduosData => {
    const responsableStaff = staff.find(s => s.id === apiData.responsable)
    const responsableNombre = responsableStaff ? `${responsableStaff.nombre} ${responsableStaff.apellidos}` : "Sin responsable"
    
    return {
      id: apiData.id,
      codigos: apiData.codigos,
      responsable: responsableNombre,
      responsableId: apiData.responsable,
      unidades: String(apiData.unidades || ""),
      kg: String(apiData.kg || ""),
      fecha: apiData.fecha,
      fechaCreacion: formatDateToDisplay(apiData.created || ""),
      fechaUltimaActualizacion: formatDateToDisplay(apiData.updated || ""),
    }
  }

  // Convertir de formato local a API
  const convertLocalToAPI = (localData: any): Partial<APIRecogidaResiduos> => {
    return {
      codigos: localData.codigos,
      responsable: localData.responsable, // Este es el ID del staff member
      unidades: localData.unidades ? parseFloat(localData.unidades) : undefined,
      kg: localData.kg ? parseFloat(localData.kg) : undefined,
      fecha: localData.fecha,
      farm: currentFarm!.id,
      user: record!.id,
    }
  }

  // useEffect para cargar staff
  useEffect(() => {
    const loadStaff = async () => {
      if (!token || !record?.id) return
      try {
        const staffData = await listStaff(token, record.id)
        if (staffData.success && staffData.data.items) {
          setStaff(staffData.data.items as Staff[])
        }
      } catch (error) {
        console.error("Error al cargar staff:", error)
      }
    }
    loadStaff()
  }, [token, record])

  // useEffect para cargar registros de recogida de residuos
  useEffect(() => {
    const loadRecogidaResiduos = async () => {
      if (!token || !record?.id || !currentFarm?.id || staff.length === 0) return
      
      setLoading(true)
      try {
        const registros = await getRecogidaResiduosByFarmId(currentFarm.id, token, record.id)
        if (registros.success && registros.data.items) {
          const convertedData = (registros.data.items as APIRecogidaResiduos[]).map(convertAPItoLocal)
          setRecogidaResiduosData(convertedData)
        }
      } catch (error: any) {
        console.error("Error al cargar registros:", error)
        setSnackbar({ open: true, message: error.message || "Error al cargar los registros", severity: "error" })
      } finally {
        setLoading(false)
      }
    }
    loadRecogidaResiduos()
  }, [token, record, currentFarm, staff])

  // Función para formatear fecha a YYYY-MM-DD para input type="date"
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return ""
    // Extraer solo la parte YYYY-MM-DD del formato ISO
    return dateString.split('T')[0].split(' ')[0]
  }

  const loadRegistroToForm = (registro: RecogidaResiduosData) => {
    setFormData({
      codigos: registro.codigos,
      responsable: registro.responsableId || "",
      unidades: registro.unidades,
      kg: registro.kg,
      fecha: formatDateForInput(registro.fecha),
    })
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
    const item = recogidaResiduosData[index]
    loadRegistroToForm(item)
    setCurrentRegistroId(item.id || null)
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = recogidaResiduosData[index]
    
    setFormData({
      codigos: item.codigos,
      responsable: item.responsableId || "",
      unidades: item.unidades,
      kg: item.kg,
      fecha: formatDateForInput(item.fecha),
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
      codigos: "",
      responsable: "",
      unidades: "",
      kg: "",
      fecha: "",
    })
  }

  const handleSubmit = async () => {
    // Validar que los campos requeridos estén llenos
    if (!formData.codigos || !formData.responsable || !formData.fecha) {
      setSnackbar({ open: true, message: "Por favor, completa todos los campos requeridos", severity: "error" })
      return
    }

    setSaving(true)
    try {
      const dataToSend = convertLocalToAPI(formData)

      if (currentRegistroId) {
        // Actualizar registro existente
        await updateRecogidaResiduos(token!, currentRegistroId, dataToSend, record!.id)
        setSnackbar({ open: true, message: "Registro actualizado exitosamente", severity: "success" })
      } else {
        // Crear nuevo registro
        await createRecogidaResiduos(token!, dataToSend as any)
        setSnackbar({ open: true, message: "Registro creado exitosamente", severity: "success" })
      }

      // Recargar datos
      const registros = await getRecogidaResiduosByFarmId(currentFarm!.id, token!, record!.id)
      if (registros.success && registros.data.items) {
        const convertedData = (registros.data.items as APIRecogidaResiduos[]).map(convertAPItoLocal)
        setRecogidaResiduosData(convertedData)
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
    const item = recogidaResiduosData[index]
    
    if (!item.id) {
      setSnackbar({ open: true, message: "No se puede eliminar: ID no encontrado", severity: "error" })
      return
    }

    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      return
    }

    try {
      await deleteRecogidaResiduos(token!, item.id, record!.id)
      setSnackbar({ open: true, message: "Registro eliminado exitosamente", severity: "success" })
      
      // Recargar datos
      const registros = await getRecogidaResiduosByFarmId(currentFarm!.id, token!, record!.id)
      if (registros.success && registros.data.items) {
        const convertedData = (registros.data.items as APIRecogidaResiduos[]).map(convertAPItoLocal)
        setRecogidaResiduosData(convertedData)
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
                    Recogida de residuos peligrosos
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
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "grey.100" }}>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Códigos
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
                          Unidades
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Kg
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
                    {recogidaResiduosData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>{item.codigos}</TableCell>
                        <TableCell>{item.responsable}</TableCell>
                        <TableCell>{item.unidades}</TableCell>
                        <TableCell>{item.kg} kg</TableCell>
                        <TableCell>{formatDateToDisplay(item.fecha)}</TableCell>
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
                    {viewMode ? "Detalle de recogida de residuos" : currentRegistroId ? "Editar recogida de residuos" : "Registro de recogida de residuos"}
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Códigos y Responsable */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        select={!viewMode}
                        label="Códigos"
                        variant="standard"
                        value={formData.codigos}
                        onChange={(e) => setFormData((prev) => ({ ...prev, codigos: e.target.value }))}
                        InputProps={{
                          readOnly: viewMode,
                        }}
                        sx={{
                          "& .MuiInputBase-input": {
                            color: viewMode ? "text.secondary" : "text.primary",
                          },
                        }}
                      >
                        {!viewMode && CODIGOS.map((codigo) => (
                          <MenuItem key={codigo} value={codigo}>
                            {codigo}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      {viewMode ? (
                        <TextField
                          fullWidth
                          label="Responsable"
                          variant="standard"
                          value={recogidaResiduosData[editIndex!]?.responsable || "Sin responsable"}
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
                  </Grid>

                  {/* Unidades y Kg */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Unidades"
                        placeholder="Unidades"
                        variant="standard"
                        type="number"
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
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Kg"
                        placeholder="Kg (kilogramos)"
                        variant="standard"
                        type="number"
                        value={formData.kg}
                        onChange={(e) => setFormData((prev) => ({ ...prev, kg: e.target.value }))}
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

                  {/* Fecha */}
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
                      mb: 3,
                      "& .MuiInputBase-input": {
                        color: viewMode ? "text.secondary" : "text.primary",
                      },
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
                          disabled={saving}
                          sx={buttonStyles.close}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleSubmit}
                          disabled={saving}
                          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : undefined}
                          sx={buttonStyles.save}
                        >
                          {saving ? "Guardando..." : (currentRegistroId ? "Actualizar" : "Guardar")}
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

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  )
}