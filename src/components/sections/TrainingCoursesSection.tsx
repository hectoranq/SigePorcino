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
  TableSortLabel, // <- Agregar esta línea
  Paper,
  Dialog,
  DialogContent,
  TextField,
  Grid,
  Container,
  styled,
} from "@mui/material"
import { Add } from "@mui/icons-material"
import { useState } from "react"

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

export default function TrainingCoursesPage() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombreCurso: "",
    horasLectivas: "",
    descripcion: "",
  })

  // Convertir courses en estado
  const [courses, setCourses] = useState([
    {
      name: "Recojo de residuos",
      hours: "3 Horas",
    },
    {
      name: "Limpieza de animales",
      hours: "1.5 Horas",
    },
    {
      name: "Levantamiento de cadáveres",
      hours: "2 Horas",
    },
  ])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setFormData({ nombreCurso: "", horasLectivas: "", descripcion: "" })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    console.log("Datos del curso:", formData)
    
    // Agregar el nuevo curso al array
    const newCourse = {
      name: formData.nombreCurso,
      hours: `${formData.horasLectivas} Horas`,
    }
    
    setCourses(prev => [...prev, newCourse])
    handleClose()
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
                  <TableSortLabel>Acciones</TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course, index) => (
                <TableRow key={index} sx={{ "&:hover": { bgcolor: "#fafafa" } }}>
                  <TableCell sx={{ color: "text.primary" }}>{course.name}</TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{course.hours}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          bgcolor: "#fdd835",
                          color: "text.primary",
                          "&:hover": { bgcolor: "#fbc02d" },
                          minWidth: "auto",
                          px: 2,
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          bgcolor: "#42a5f5",
                          "&:hover": { bgcolor: "#1e88e5" },
                          minWidth: "auto",
                          px: 2,
                        }}
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
                      Registro de cursos de formación
                    </Typography>
                  </HeaderBox>

                  <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <StyledTextField
                          fullWidth
                          placeholder="Nombre del curso"
                          variant="filled"
                          value={formData.nombreCurso}
                          onChange={(e) => handleInputChange("nombreCurso", e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <StyledTextField
                          fullWidth
                          placeholder="Horas lectivas"
                          variant="filled"
                          value={formData.horasLectivas}
                          onChange={(e) => handleInputChange("horasLectivas", e.target.value)}
                        />
                      </Grid>
                    </Grid>

                    <StyledTextField
                      fullWidth
                      placeholder="Descripción de contenidos"
                      multiline
                      rows={4}
                      variant="filled"
                      value={formData.descripcion}
                      onChange={(e) => handleInputChange("descripcion", e.target.value)}
                    />

                    <Box sx={{ display: "flex", gap: 2, paddingTop: 2 }}>
                      <CancelButton fullWidth variant="outlined" onClick={handleClose}>
                        Cancelar
                      </CancelButton>
                      <RegisterButton fullWidth variant="contained" onClick={handleSubmit}>
                        Registrar
                      </RegisterButton>
                    </Box>
                  </Box>
                </StyledPaper>
              </Container>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  )
}
