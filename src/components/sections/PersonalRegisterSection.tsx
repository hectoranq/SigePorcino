"use client"

import { useState } from "react"
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
} from "@mui/material"
import {
  Add,
  KeyboardArrowDown,
  CalendarToday,
} from "@mui/icons-material"
import { createTheme, ThemeProvider } from "@mui/material/styles"

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

export function PersonalRegisterSection() {
  

  // Estado para el popup
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false) // Nuevo estado para modo edición
  const [editIndex, setEditIndex] = useState<number | null>(null) // Índice del elemento a editar
  
  const [formData, setFormData] = useState({
    dni: "",
    nombre: "",
    apellidos: "",
    telefono: "",
    correo: "",
    fechaInicio: "",
    fechaFinalizacion: "",
    experiencia: "",
    titulaciones: [] as string[],
    tareas: [] as string[],
  })

  // Estado para la tabla de personal
  const [staffData, setStaffData] = useState([
    {
      dni: "2566113",
      nombre: "Jose Antonio Capdevilla Torrejon",
      telefono: "75266312",
      fechaInicio: "12/07/2023",
      fechaFinalizacion: "12/07/2025",
    },
    {
      dni: "2566113",
      nombre: "Mario Antonio Alvarez Peredo",
      telefono: "60547811",
      fechaInicio: "30/05/2024",
      fechaFinalizacion: "31/12/2024",
    },
    {
      dni: "2566113",
      nombre: "Juana Adriana Obregon",
      telefono: "70142889",
      fechaInicio: "01/02/2023",
      fechaFinalizacion: "31/12/2024",
    },
  ])

  const handleCheckboxChange = (value: string, category: "titulaciones" | "tareas") => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }))
  }

  const handleOpen = () => {
    setEditMode(false)
    setEditIndex(null)
    setOpen(true)
  }

  // Nueva función para abrir en modo edición
  const handleEdit = (index: number) => {
    const person = staffData[index]
    const [nombre, ...apellidos] = person.nombre.split(' ')
    
    setFormData({
      dni: person.dni,
      nombre: nombre,
      apellidos: apellidos.join(' '),
      telefono: person.telefono,
      correo: "", // Si no tienes este dato, déjalo vacío
      fechaInicio: convertDateFormat(person.fechaInicio),
      fechaFinalizacion: convertDateFormat(person.fechaFinalizacion),
      experiencia: "",
      titulaciones: [],
      tareas: [],
    })
    
    setEditMode(true)
    setEditIndex(index)
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
    setEditIndex(null)
    setFormData({
      dni: "",
      nombre: "",
      apellidos: "",
      telefono: "",
      correo: "",
      fechaInicio: "",
      fechaFinalizacion: "",
      experiencia: "",
      titulaciones: [],
      tareas: [],
    })
  }

  const handleSubmit = () => {
    console.log("Datos del personal:", formData)

    // Validar que los campos requeridos estén llenos
    if (!formData.dni || !formData.nombre || !formData.apellidos || !formData.telefono) {
      alert("Por favor, completa todos los campos requeridos")
      return
    }

    const personData = {
      dni: formData.dni,
      nombre: `${formData.nombre} ${formData.apellidos}`,
      telefono: formData.telefono,
      fechaInicio: formatDateToDisplay(formData.fechaInicio),
      fechaFinalizacion: formatDateToDisplay(formData.fechaFinalizacion),
    }

    if (editMode && editIndex !== null) {
      // Actualizar persona existente
      setStaffData((prev) => 
        prev.map((person, index) => 
          index === editIndex ? personData : person
        )
      )
    } else {
      // Agregar nueva persona
      setStaffData((prev) => [...prev, personData])
    }
    
    handleClose()
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
                  sx={{ textTransform: "none" }}
                  onClick={handleOpen}
                >
                  Agregar nuevo
                </Button>
              </Box>

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
                    {staffData.map((person, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>{person.dni}</TableCell>
                        <TableCell>{person.nombre}</TableCell>
                        <TableCell>{person.telefono}</TableCell>
                        <TableCell>{person.fechaInicio}</TableCell>
                        <TableCell>{person.fechaFinalizacion}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              sx={{
                                bgcolor: "#facc15", // yellow-400
                                color: "grey.900",
                                textTransform: "none",
                                "&:hover": {
                                  bgcolor: "#eab308", // yellow-500
                                },
                              }}
                              onClick={() => handleEdit(index)} // Agregar onClick
                            >
                              Editar
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: "#93c5fd", // blue-300
                                color: "#2563eb", // blue-600
                                textTransform: "none",
                                "&:hover": {
                                  bgcolor: "#eff6ff", // blue-50
                                  borderColor: "#93c5fd",
                                },
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
            <ThemeProvider theme={theme}>
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
                    <TextField
                      fullWidth
                      placeholder="Experiencia previa"
                      variant="standard"
                      value={formData.experiencia}
                      onChange={(e) => setFormData((prev) => ({ ...prev, experiencia: e.target.value }))}
                      sx={{ mb: 3 }}
                    />

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
                                checked={formData.titulaciones.includes("Bachillerato")}
                                onChange={() => handleCheckboxChange("Bachillerato", "titulaciones")}
                                sx={{ "&.Mui-checked": { color: "#22c55e" } }}
                              />
                            }
                            label="Bachillerato"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.titulaciones.includes("FP Agraria")}
                                onChange={() => handleCheckboxChange("FP Agraria", "titulaciones")}
                                sx={{ "&.Mui-checked": { color: "#22c55e" } }}
                              />
                            }
                            label="FP Agraria"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.titulaciones.includes("Licenciatura")}
                                onChange={() => handleCheckboxChange("Licenciatura", "titulaciones")}
                                sx={{ "&.Mui-checked": { color: "#22c55e" } }}
                              />
                            }
                            label="Licenciatura"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.titulaciones.includes("Doctorado")}
                                onChange={() => handleCheckboxChange("Doctorado", "titulaciones")}
                                sx={{ "&.Mui-checked": { color: "#22c55e" } }}
                              />
                            }
                            label="Doctorado"
                          />
                        </FormGroup>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                          Tareas
                        </Typography>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.tareas.includes("Manejo de personal")}
                                onChange={() => handleCheckboxChange("Manejo de personal", "tareas")}
                                sx={{ "&.Mui-checked": { color: "#22c55e" } }}
                              />
                            }
                            label="Manejo de personal"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.tareas.includes("Control de calidad")}
                                onChange={() => handleCheckboxChange("Control de calidad", "tareas")}
                                sx={{ "&.Mui-checked": { color: "#22c55e" } }}
                              />
                            }
                            label="Control de calidad"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.tareas.includes("Planificación")}
                                onChange={() => handleCheckboxChange("Planificación", "tareas")}
                                sx={{ "&.Mui-checked": { color: "#22c55e" } }}
                              />
                            }
                            label="Planificación"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.tareas.includes("Gestión de recursos")}
                                onChange={() => handleCheckboxChange("Gestión de recursos", "tareas")}
                                sx={{ "&.Mui-checked": { color: "#22c55e" } }}
                              />
                            }
                            label="Gestión de recursos"
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>

                    {/* Buttons */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={handleClose}
                        sx={{ textTransform: "none", color: "#2563eb", borderColor: "#93c5fd" }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{ textTransform: "none" }}
                      >
                        {editMode ? "Actualizar" : "Guardar"}
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </ThemeProvider>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  )
}
