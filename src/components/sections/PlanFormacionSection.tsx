import React, { useState, useEffect } from "react"
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
  Container,
  Dialog,
  DialogContent,
  Grid,
  TextField,
  DialogTitle,
  DialogActions,
  FormControlLabel,
  Radio,
  RadioGroup,
  Divider,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"
import { Add, Edit, Visibility, Delete } from "@mui/icons-material"
import useUserStore from "../../_store/user"
import useFarmFormStore from "../../_store/farm"
import {
  createPlanFormacion,
  updatePlanFormacion,
  deletePlanFormacion,
  getPlanFormacionByFarmId,
  type PlanFormacion as PlanFormacionAPI,
  type CursoFormacion as CursoFormacionAPI,
} from "../../action/PlanFormacionPocket"

interface CursoFormacion {
  descripcion: string
  horasLectivas: string
}

interface PlanFormacion {
  id?: string
  // Cursos de formación
  cursosFormacion: CursoFormacion[]
  // Registros de personal
  personalConFormacion: string
  personalConExperiencia: string
  personalConTitulacion: string
}

const buttonStyles = {
  primary: {
    textTransform: "none",
    borderRadius: 1,
  },
}

export function PlanFormacionSection() {
  const { token, record } = useUserStore()
  const { currentFarm } = useFarmFormStore()

  const [registros, setRegistros] = useState<PlanFormacion[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null)

  // Snackbar states
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error" | "info" | "warning"
  }>({ open: false, message: "", severity: "success" })

  const [open, setOpen] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [indiceEdicion, setIndiceEdicion] = useState<number | null>(null)
  const [formData, setFormData] = useState<PlanFormacion>({
    cursosFormacion: [],
    personalConFormacion: "",
    personalConExperiencia: "",
    personalConTitulacion: "",
  })

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [registroToDelete, setRegistroToDelete] = useState<number | null>(null)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [selectedRegistro, setSelectedRegistro] = useState<PlanFormacion | null>(null)

  // Estados para agregar cursos
  const [nuevoCursoDescripcion, setNuevoCursoDescripcion] = useState("")
  const [nuevoCursoHoras, setNuevoCursoHoras] = useState("")
  const [mostrarInputCurso, setMostrarInputCurso] = useState(false)

  // Cargar planes al montar el componente
  useEffect(() => {
    loadPlanesFormacion()
  }, [currentFarm, token, record])

  const loadPlanesFormacion = async () => {
    if (!currentFarm || !record?.id || !token) {
      console.log("⚠️ No hay farmId o usuario disponible")
      return
    }

    setLoading(true)
    try {
      const result = await getPlanFormacionByFarmId(token, record.id, currentFarm.id)
      if (result && result.length > 0) {
        const convertedPlans = result.map(convertAPItoLocal)
        setRegistros(convertedPlans)
        console.log("✅ Planes de formación cargados:", result.length)
      } else {
        setRegistros([])
        console.log("ℹ️ No hay planes de formación para esta granja")
      }
    } catch (error) {
      console.error("❌ Error al cargar planes de formación:", error)
      setSnackbar({
        open: true,
        message: "Error al cargar los planes de formación",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // Convertir de formato API (snake_case) a formato local (camelCase)
  const convertAPItoLocal = (apiData: PlanFormacionAPI): PlanFormacion => {
    return {
      id: apiData.id,
      cursosFormacion: apiData.cursos_formacion || [],
      personalConFormacion: apiData.personal_con_formacion || "",
      personalConExperiencia: apiData.personal_con_experiencia || "",
      personalConTitulacion: apiData.personal_con_titulacion || "",
    }
  }

  // Convertir de formato local (camelCase) a formato API (snake_case)
  const convertLocalToAPI = (localData: PlanFormacion) => {
    return {
      cursos_formacion: localData.cursosFormacion,
      personal_con_formacion: localData.personalConFormacion,
      personal_con_experiencia: localData.personalConExperiencia,
      personal_con_titulacion: localData.personalConTitulacion,
      farm: currentFarm!.id!,
    }
  }

  const loadPlanToForm = (plan: PlanFormacion) => {
    setFormData({
      cursosFormacion: plan.cursosFormacion,
      personalConFormacion: plan.personalConFormacion,
      personalConExperiencia: plan.personalConExperiencia,
      personalConTitulacion: plan.personalConTitulacion,
    })
    if (plan.id) {
      setCurrentPlanId(plan.id)
    }
    setModoEdicion(true)
    setOpen(true)
  }

  const handleAgregarNuevo = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setModoEdicion(false)
    setIndiceEdicion(null)
    setCurrentPlanId(null)
    setFormData({
      cursosFormacion: [],
      personalConFormacion: "",
      personalConExperiencia: "",
      personalConTitulacion: "",
    })
    setMostrarInputCurso(false)
    setNuevoCursoDescripcion("")
    setNuevoCursoHoras("")
  }

  const handleInputChange = (field: keyof PlanFormacion, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAgregarCurso = () => {
    if (nuevoCursoDescripcion.trim() && nuevoCursoHoras.trim()) {
      setFormData((prev) => ({
        ...prev,
        cursosFormacion: [
          ...prev.cursosFormacion,
          {
            descripcion: nuevoCursoDescripcion.trim(),
            horasLectivas: nuevoCursoHoras.trim(),
          },
        ],
      }))
      setNuevoCursoDescripcion("")
      setNuevoCursoHoras("")
      setMostrarInputCurso(false)
    }
  }

  const handleEliminarCurso = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      cursosFormacion: prev.cursosFormacion.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token || !record?.id || !currentFarm?.id) {
      setSnackbar({
        open: true,
        message: "Error: No hay información de usuario o granja",
        severity: "error",
      })
      return
    }

    setSaving(true)
    try {
      const apiData = convertLocalToAPI(formData)

      if (currentPlanId) {
        // Actualizar plan existente
        await updatePlanFormacion(token, currentPlanId, record.id, apiData)
        setSnackbar({
          open: true,
          message: "Plan de formación actualizado exitosamente",
          severity: "success",
        })
      } else {
        // Crear nuevo plan
        await createPlanFormacion(token, record.id, apiData)
        setSnackbar({
          open: true,
          message: "Plan de formación creado exitosamente",
          severity: "success",
        })
      }

      // Recargar la lista de planes
      await loadPlanesFormacion()
      handleClose()
    } catch (error: any) {
      console.error("❌ Error al guardar plan de formación:", error)
      setSnackbar({
        open: true,
        message: error?.message || "Error al guardar el plan de formación",
        severity: "error",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancelar = () => {
    handleClose()
  }

  const handleEditar = (index: number) => {
    const plan = registros[index]
    loadPlanToForm(plan)
    setIndiceEdicion(index)
    console.log("Editar plan:", plan)
  }

  const handleVerMas = (index: number) => {
    setSelectedRegistro(registros[index])
    setOpenViewDialog(true)
  }

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false)
    setSelectedRegistro(null)
  }

  const handleEliminarClick = (index: number) => {
    setRegistroToDelete(index)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (registroToDelete === null || !token || !record?.id) {
      return
    }

    const plan = registros[registroToDelete]
    if (!plan.id) {
      setSnackbar({
        open: true,
        message: "Error: No se puede eliminar un plan sin ID",
        severity: "error",
      })
      return
    }

    setSaving(true)
    try {
      await deletePlanFormacion(token, plan.id, record.id)
      setSnackbar({
        open: true,
        message: "Plan de formación eliminado exitosamente",
        severity: "success",
      })
      await loadPlanesFormacion()
    } catch (error: any) {
      console.error("❌ Error al eliminar plan de formación:", error)
      setSnackbar({
        open: true,
        message: error?.message || "Error al eliminar el plan de formación",
        severity: "error",
      })
    } finally {
      setSaving(false)
      setOpenDeleteDialog(false)
      setRegistroToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false)
    setRegistroToDelete(null)
  }

  const getCursosResumen = (registro: PlanFormacion) => {
    if (registro.cursosFormacion.length === 0) return "Sin cursos registrados"
    return registro.cursosFormacion
      .map((curso) => `${curso.descripcion} (${curso.horasLectivas}h)`)
      .join(", ")
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", p: 3 }}>
      <Container maxWidth="xl">
        <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid #e0e0e0" }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 3,
              bgcolor: "white",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#1a1a1a",
              }}
            >
              Plan de Formación
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAgregarNuevo}
              sx={{
                bgcolor: "#00bcd4",
                "&:hover": { bgcolor: "#00acc1" },
                borderRadius: 1,
                px: 3,
              }}
            >
              Agregar nuevo
            </Button>
          </Box>

          {/* Table */}
          <TableContainer>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#666", fontSize: "0.875rem", py: 2 }}>
                    Cursos de formación recibidos
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: "#666", fontSize: "0.875rem", py: 2 }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registros.map((registro, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": {
                        bgcolor: "#fafafa",
                      },
                      borderBottom: "1px solid #e0e0e0",
                    }}
                  >
                    <TableCell sx={{ color: "#333", fontSize: "0.875rem", py: 2.5 }}>
                      {getCursosResumen(registro)}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditar(index)}
                          sx={{
                            color: "#666",
                            "&:hover": {
                              bgcolor: "#f5f5f5",
                              color: "#333",
                            },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleVerMas(index)}
                          sx={{
                            color: "#666",
                            "&:hover": {
                              bgcolor: "#f5f5f5",
                              color: "#333",
                            },
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEliminarClick(index)}
                          sx={{
                            color: "#666",
                            "&:hover": {
                              bgcolor: "#ffebee",
                              color: "#d32f2f",
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </TableContainer>
        </Paper>

        {/* Dialog de confirmación de eliminación */}
        <Dialog open={openDeleteDialog} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
          <DialogTitle>¿Confirmar eliminación?</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que deseas eliminar este registro del plan de formación? Esta acción no se puede
              deshacer.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCancelDelete} variant="outlined" sx={buttonStyles.primary}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
              startIcon={<Delete />}
              sx={buttonStyles.primary}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Ver Más */}
        <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="lg" fullWidth>
          <DialogTitle sx={{ bgcolor: "#00bcd4", color: "white", fontWeight: 600 }}>
            Detalles del Plan de Formación
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedRegistro && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                      Cursos de formación recibidos
                    </Typography>
                  </Divider>
                </Grid>

                <Grid item xs={12}>
                  {selectedRegistro.cursosFormacion.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                            <TableCell sx={{ fontWeight: 600 }}>Descripción del curso</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="center">
                              Horas lectivas
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedRegistro.cursosFormacion.map((curso, index) => (
                            <TableRow key={index}>
                              <TableCell>{curso.descripcion}</TableCell>
                              <TableCell align="center">{curso.horasLectivas}h</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      Sin cursos registrados
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                      Registro de personal
                    </Typography>
                  </Divider>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Personal que recibe formación con identificación y fecha
                  </Typography>
                  <Typography variant="body1">
                    {selectedRegistro.personalConFormacion === "si" ? "Sí" : "No"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Personal con mínimo 3 años de experiencia en ganado porcino
                  </Typography>
                  <Typography variant="body1">
                    {selectedRegistro.personalConExperiencia === "si" ? "Sí" : "No"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Personal con titulación técnica (producción agropecuaria o ganadería)
                  </Typography>
                  <Typography variant="body1">
                    {selectedRegistro.personalConTitulacion === "si" ? "Sí" : "No"}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseViewDialog} variant="contained" sx={buttonStyles.primary}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog/Popup de registro */}
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
          <DialogTitle sx={{ bgcolor: "#00bcd4", color: "white", fontWeight: 600 }}>
            {modoEdicion ? "Editar Plan de Formación" : "Agregar Plan de Formación"}
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Sección 1: Cursos de formación */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: "#00bcd4", borderRadius: "50%" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00bcd4" }}>
                      Cursos de formación recibidos por los trabajadores
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Descripción de los contenidos así como las horas lectivas. Puede incluir varios registros por
                    trabajador.
                  </Typography>
                </Grid>

                {/* Lista de cursos agregados */}
                {formData.cursosFormacion.length > 0 && (
                  <Grid item xs={12}>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                            <TableCell sx={{ fontWeight: 600 }}>Descripción del curso</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="center">
                              Horas lectivas
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="center">
                              Acciones
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {formData.cursosFormacion.map((curso, index) => (
                            <TableRow key={index}>
                              <TableCell>{curso.descripcion}</TableCell>
                              <TableCell align="center">{curso.horasLectivas}h</TableCell>
                              <TableCell align="center">
                                <IconButton size="small" onClick={() => handleEliminarCurso(index)} color="error">
                                  <Delete fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )}

                {/* Formulario para agregar curso */}
                <Grid item xs={12}>
                  {!mostrarInputCurso ? (
                    <Button
                      startIcon={<Add />}
                      onClick={() => setMostrarInputCurso(true)}
                      variant="outlined"
                      sx={{
                        color: "#00bcd4",
                        borderColor: "#00bcd4",
                        "&:hover": {
                          borderColor: "#00acc1",
                          bgcolor: "#f0f9fa",
                        },
                      }}
                    >
                      Agregar curso de formación
                    </Button>
                  ) : (
                    <Paper elevation={0} sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                          <TextField
                            fullWidth
                            label="Descripción del curso"
                            variant="outlined"
                            size="small"
                            placeholder="Ej: Bienestar animal en explotaciones porcinas"
                            value={nuevoCursoDescripcion}
                            onChange={(e) => setNuevoCursoDescripcion(e.target.value)}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Horas lectivas"
                            variant="outlined"
                            size="small"
                            type="number"
                            placeholder="20"
                            value={nuevoCursoHoras}
                            onChange={(e) => setNuevoCursoHoras(e.target.value)}
                            required
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setMostrarInputCurso(false)
                                setNuevoCursoDescripcion("")
                                setNuevoCursoHoras("")
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={handleAgregarCurso}
                              disabled={!nuevoCursoDescripcion.trim() || !nuevoCursoHoras.trim()}
                            >
                              Agregar curso
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Sección 2: Registro de personal */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: "#00bcd4", borderRadius: "50%" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00bcd4" }}>
                      Registro de personal
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Registro de personal que recibe la formación con identificación y fecha para valorar la necesidad
                    de cursos de reciclado
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: "0.875rem" }}>
                    Lo solicitado en este apartado deberá marcarse al dar de alta un trabajador (Cursos, fecha
                    realización, 3 años de experiencia demostrada, o los títulos citados).
                  </Typography>
                  <RadioGroup
                    row
                    value={formData.personalConFormacion}
                    onChange={(e) => handleInputChange("personalConFormacion", e.target.value)}
                  >
                    <FormControlLabel value="si" control={<Radio />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Registro de personal que haya demostrado un mínimo de 3 años de experiencia práctica en trabajos
                    relacionados con la cría de ganado porcino
                  </Typography>
                  <RadioGroup
                    row
                    value={formData.personalConExperiencia}
                    onChange={(e) => handleInputChange("personalConExperiencia", e.target.value)}
                  >
                    <FormControlLabel value="si" control={<Radio />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Registro de personal en posesión de algunas de las siguientes titulaciones:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: "0.875rem" }}>
                    • Título de técnico en producción agropecuaria
                    <br />• Título de técnico superior en ganadería y asistencia en sanidad animal
                  </Typography>
                  <RadioGroup
                    row
                    value={formData.personalConTitulacion}
                    onChange={(e) => handleInputChange("personalConTitulacion", e.target.value)}
                  >
                    <FormControlLabel value="si" control={<Radio />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCancelar} variant="outlined" sx={buttonStyles.primary} disabled={saving}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={formData.cursosFormacion.length === 0 || saving}
              sx={buttonStyles.primary}
            >
              {saving ? <CircularProgress size={24} /> : (modoEdicion ? "Actualizar" : "Registrar")}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  )
}