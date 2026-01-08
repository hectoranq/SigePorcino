"use client"

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
  TableSortLabel,
  Paper,
  Dialog,
  DialogContent,
  TextField,
  Grid,
  Container,
  styled,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material"
import { Add, Delete, Edit, Visibility } from "@mui/icons-material"
import { useState, useEffect } from "react"
import {
  listTrainingCourses,
  createTrainingCourse,
  updateTrainingCourse,
  deleteTrainingCourse,
  getTrainingCourseById,
  type TrainingCourse,
  type CreateTrainingCourseData,
} from "../../action/TrainingCoursesPocket"

interface TrainingCoursesSectionProps {
  token: string;
  userId: string;
  farmId?: string;
}

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
}))

const HeaderBox = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  paddingBottom: theme.spacing(2),
  marginBottom: theme.spacing(3),
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1),
  },
}))

const CancelButton = styled(Button)(() => ({
  borderColor: "#d1d5db",
  color: "#6b7280",
  "&:hover": {
    borderColor: "#9ca3af",
    backgroundColor: "#f9fafb",
  },
}))

const RegisterButton = styled(Button)(() => ({
  backgroundColor: "#10b981",
  "&:hover": {
    backgroundColor: "#059669",
  },
}))

export function TrainingCoursesSection({ token, userId, farmId }: TrainingCoursesSectionProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombreCurso: "",
    horasLectivas: "",
    descripcion: "",
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null)
  
  // Estados de la API
  const [courses, setCourses] = useState<TrainingCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Cargar cursos al montar el componente
  useEffect(() => {
    loadCourses()
  }, [farmId])

  const loadCourses = async () => {
    if (!token || !userId) {
      setError("No hay sesión activa")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await listTrainingCourses(
        token,
        userId,
        farmId
      )

      if (result) {
        setCourses(result.items)
      } else {
        setError("Error al cargar los cursos")
      }
    } catch (err) {
      setError("Error al cargar los cursos")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setFormData({ nombreCurso: "", horasLectivas: "", descripcion: "" })
    setEditingId(null)
    setError(null)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!token || !userId) {
      setError("No hay sesión activa")
      return
    }

    if (!formData.nombreCurso || !formData.horasLectivas) {
      setError("Complete los campos requeridos")
      return
    }

    if (!farmId) {
      setError("Debe seleccionar una granja")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      if (editingId) {
        // Actualizar curso existente
        const result = await updateTrainingCourse(
          token,
          userId,
          editingId,
          {
            nombreCurso: formData.nombreCurso,
            horasLectivas: parseFloat(formData.horasLectivas),
            descripcion: formData.descripcion || undefined,
          }
        )

        if (result) {
          await loadCourses()
          handleClose()
        } else {
          setError("Error al actualizar el curso")
        }
      } else {
        // Crear nuevo curso
        const courseData: CreateTrainingCourseData = {
          nombreCurso: formData.nombreCurso,
          horasLectivas: parseFloat(formData.horasLectivas),
          descripcion: formData.descripcion || undefined,
          farm: farmId,
          createdBy: userId,
        }

        const result = await createTrainingCourse(
          token,
          userId,
          courseData,
          farmId
        )

        if (result) {
          await loadCourses()
          handleClose()
        } else {
          setError("Error al crear el curso")
        }
      }
    } catch (err) {
      setError("Error al guardar el curso")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (course: TrainingCourse) => {
    setEditingId(course.id)
    setFormData({
      nombreCurso: course.nombreCurso,
      horasLectivas: course.horasLectivas.toString(),
      descripcion: course.descripcion || "",
    })
    setOpen(true)
  }

  const handleView = async (course: TrainingCourse) => {
    if (!token || !userId) return

    try {
      const result = await getTrainingCourseById(token, userId, course.id)
      if (result) {
        setSelectedCourse(result)
        setViewDialogOpen(true)
      }
    } catch (err) {
      console.error("Error al obtener detalles del curso:", err)
    }
  }

  const handleDelete = async (courseId: string) => {
    if (!token || !userId) return

    if (!confirm("¿Está seguro de eliminar este curso?")) return

    try {
      const result = await deleteTrainingCourse(token, userId, courseId)
      if (result) {
        await loadCourses()
      } else {
        setError("Error al eliminar el curso")
      }
    } catch (err) {
      setError("Error al eliminar el curso")
      console.error(err)
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", p: 3 }}>
      <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ width: 4, height: 32, bgcolor: "#00bcd4", borderRadius: 0.5 }} />
            <Typography variant="h5" sx={{ fontWeight: 500, color: "text.primary" }}>
              Cursos de formación
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpen}
            sx={{
              bgcolor: "#4caf50",
              "&:hover": { bgcolor: "#45a049" },
              borderRadius: 1,
            }}
          >
            Agregar nuevo
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Table */}
        <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
          <Table>
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                  <TableSortLabel>Curso</TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                  <TableSortLabel>Horas lectivas</TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: "center", py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="text.secondary">
                      No hay cursos registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id} sx={{ "&:hover": { bgcolor: "#fafafa" } }}>
                    <TableCell sx={{ color: "text.primary" }}>{course.nombreCurso}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{course.horasLectivas} Horas</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(course)}
                          sx={{
                            bgcolor: "#fdd835",
                            color: "text.primary",
                            "&:hover": { bgcolor: "#fbc02d" },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleView(course)}
                          sx={{
                            bgcolor: "#42a5f5",
                            color: "white",
                            "&:hover": { bgcolor: "#1e88e5" },
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(course.id)}
                          sx={{
                            bgcolor: "#f44336",
                            color: "white",
                            "&:hover": { bgcolor: "#d32f2f" },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

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
            <Box sx={{ minHeight: "auto", backgroundColor: "#f9fafb", padding: 4 }}>
              <Container maxWidth="md">
                <StyledPaper>
                  <HeaderBox>
                    <Typography variant="h6" sx={{ fontWeight: 500, color: "#1f2937" }}>
                      {editingId ? "Editar curso de formación" : "Registro de cursos de formación"}
                    </Typography>
                  </HeaderBox>

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                      {error}
                    </Alert>
                  )}

                  <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <StyledTextField
                          fullWidth
                          label="Nombre del curso"
                          placeholder="Nombre del curso"
                          variant="filled"
                          required
                          value={formData.nombreCurso}
                          onChange={(e) => handleInputChange("nombreCurso", e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <StyledTextField
                          fullWidth
                          label="Horas lectivas"
                          placeholder="Horas lectivas"
                          variant="filled"
                          type="number"
                          required
                          inputProps={{ min: 0, step: 0.5 }}
                          value={formData.horasLectivas}
                          onChange={(e) => handleInputChange("horasLectivas", e.target.value)}
                        />
                      </Grid>
                    </Grid>

                    <StyledTextField
                      fullWidth
                      label="Descripción de contenidos"
                      placeholder="Descripción de contenidos"
                      multiline
                      rows={4}
                      variant="filled"
                      value={formData.descripcion}
                      onChange={(e) => handleInputChange("descripcion", e.target.value)}
                    />

                    <Box sx={{ display: "flex", gap: 2, paddingTop: 2 }}>
                      <CancelButton 
                        fullWidth 
                        variant="outlined" 
                        onClick={handleClose}
                        disabled={submitting}
                      >
                        Cancelar
                      </CancelButton>
                      <RegisterButton 
                        fullWidth 
                        variant="contained" 
                        onClick={handleSubmit}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : editingId ? (
                          "Actualizar"
                        ) : (
                          "Registrar"
                        )}
                      </RegisterButton>
                    </Box>
                  </Box>
                </StyledPaper>
              </Container>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Dialog Ver Más */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <DialogContent sx={{ p: 4 }}>
            {selectedCourse && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {selectedCourse.nombreCurso}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Horas lectivas
                    </Typography>
                    <Typography variant="body1">
                      {selectedCourse.horasLectivas} horas
                    </Typography>
                  </Box>
                  {selectedCourse.descripcion && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Descripción
                      </Typography>
                      <Typography variant="body1">
                        {selectedCourse.descripcion}
                      </Typography>
                    </Box>
                  )}
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Fecha de creación
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedCourse.created).toLocaleDateString("es-ES")}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    onClick={() => setViewDialogOpen(false)}
                    sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#45a049" } }}
                  >
                    Cerrar
                  </Button>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  )
}
