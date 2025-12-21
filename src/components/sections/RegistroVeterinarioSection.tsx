import React, { useState } from "react"
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
  Container,
  Dialog,
  DialogContent,
  Grid,
  TextField,
  DialogTitle,
  DialogActions,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material"
import { Add, KeyboardArrowDown, Delete } from "@mui/icons-material"

interface Veterinario {
  numeroColegiado: string
  dni: string
  nombres: string
  apellidos: string
  telefono: string
  correo: string
  fechaInicio: string
  fechaFinalizacion: string
  redaccionPlanes: boolean
  revisionAnimales: boolean
  instruccionManejo: boolean
  informacionBioseguridad: boolean
  planEjecucionTareas: string
  planVisitasZoonotarias: string
}

export function RegistroVeterinarioSection() {
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([
    {
      numeroColegiado: "VET-2023-001",
      dni: "12345678A",
      nombres: "Carlos",
      apellidos: "García López",
      telefono: "612345678",
      correo: "carlos.garcia@vet.com",
      fechaInicio: "15/01/2023",
      fechaFinalizacion: "15/01/2024",
      redaccionPlanes: true,
      revisionAnimales: true,
      instruccionManejo: false,
      informacionBioseguridad: true,
      planEjecucionTareas: "Plan trimestral de vacunación",
      planVisitasZoonotarias: "Visitas mensuales programadas",
    },
    {
      numeroColegiado: "VET-2023-002",
      dni: "87654321B",
      nombres: "María",
      apellidos: "Rodríguez Pérez",
      telefono: "698765432",
      correo: "maria.rodriguez@vet.com",
      fechaInicio: "20/03/2023",
      fechaFinalizacion: "20/03/2024",
      redaccionPlanes: true,
      revisionAnimales: true,
      instruccionManejo: true,
      informacionBioseguridad: true,
      planEjecucionTareas: "Control sanitario semanal",
      planVisitasZoonotarias: "Revisión quincenal",
    },
  ])

  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Veterinario>({
    numeroColegiado: "",
    dni: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    correo: "",
    fechaInicio: "",
    fechaFinalizacion: "",
    redaccionPlanes: false,
    revisionAnimales: false,
    instruccionManejo: false,
    informacionBioseguridad: false,
    planEjecucionTareas: "",
    planVisitasZoonotarias: "",
  })

  // Estados para el diálogo de confirmación de eliminación
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [veterinarioToDelete, setVeterinarioToDelete] = useState<number | null>(null)

  // Estados para el diálogo de ver más
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [selectedVeterinario, setSelectedVeterinario] = useState<Veterinario | null>(null)

  const handleAgregarNuevo = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    // Resetear formulario
    setFormData({
      numeroColegiado: "",
      dni: "",
      nombres: "",
      apellidos: "",
      telefono: "",
      correo: "",
      fechaInicio: "",
      fechaFinalizacion: "",
      redaccionPlanes: false,
      revisionAnimales: false,
      instruccionManejo: false,
      informacionBioseguridad: false,
      planEjecucionTareas: "",
      planVisitasZoonotarias: "",
    })
  }

  const handleInputChange = (field: keyof Veterinario, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Función para convertir fecha YYYY-MM-DD a DD/MM/YYYY
  const formatDateToDisplay = (dateString: string) => {
    if (!dateString) return "Sin fecha"
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const nuevoVeterinario: Veterinario = {
      ...formData,
      fechaInicio: formatDateToDisplay(formData.fechaInicio),
      fechaFinalizacion: formatDateToDisplay(formData.fechaFinalizacion),
    }

    setVeterinarios(prev => [...prev, nuevoVeterinario])
    handleClose()
    console.log("Veterinario agregado:", nuevoVeterinario)
  }

  const handleCancelar = () => {
    handleClose()
  }

  const handleEditar = (index: number) => {
    console.log("Editar veterinario:", veterinarios[index])
    // Aquí puedes implementar la lógica de edición
  }

  const handleVerMas = (index: number) => {
    setSelectedVeterinario(veterinarios[index])
    setOpenViewDialog(true)
  }

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false)
    setSelectedVeterinario(null)
  }

  // Funciones para eliminar
  const handleEliminarClick = (index: number) => {
    setVeterinarioToDelete(index)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    if (veterinarioToDelete !== null) {
      setVeterinarios(prev => prev.filter((_, index) => index !== veterinarioToDelete))
      console.log("Veterinario eliminado:", veterinarios[veterinarioToDelete])
    }
    setOpenDeleteDialog(false)
    setVeterinarioToDelete(null)
  }

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false)
    setVeterinarioToDelete(null)
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", p: 3 }}>
      <Container maxWidth="xl">
        <Paper elevation={1} sx={{ borderRadius: 2, overflow: "hidden" }}>
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
                  bgcolor: "#00bcd4",
                  borderRadius: 2,
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  color: "#00bcd4",
                }}
              >
                Registro Veterinario
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAgregarNuevo}
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
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>
                      Nº Colegiado
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>
                      DNI
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>
                      Nombres
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>
                      Apellidos
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>
                      Teléfono
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>
                      Correo
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>
                      Acciones
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {veterinarios.map((veterinario, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(even)": {
                        bgcolor: "#fafafa",
                      },
                      "&:hover": {
                        bgcolor: "#f5f5f5",
                      },
                    }}
                  >
                    <TableCell sx={{ color: "text.primary" }}>
                      {veterinario.numeroColegiado}
                    </TableCell>
                    <TableCell sx={{ color: "text.primary" }}>
                      {veterinario.dni}
                    </TableCell>
                    <TableCell sx={{ color: "text.primary" }}>
                      {veterinario.nombres}
                    </TableCell>
                    <TableCell sx={{ color: "text.primary" }}>
                      {veterinario.apellidos}
                    </TableCell>
                    <TableCell sx={{ color: "text.primary" }}>
                      {veterinario.telefono}
                    </TableCell>
                    <TableCell sx={{ color: "text.primary" }}>
                      {veterinario.correo}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleEditar(index)}
                          sx={{
                            bgcolor: "#ffeb3b",
                            color: "#333",
                            fontSize: "0.75rem",
                            "&:hover": {
                              bgcolor: "#fdd835",
                            },
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleVerMas(index)}
                          sx={{
                            borderColor: "#64b5f6",
                            color: "#1976d2",
                            fontSize: "0.75rem",
                            "&:hover": {
                              bgcolor: "#e3f2fd",
                              borderColor: "#42a5f5",
                            },
                          }}
                        >
                          Ver más
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<Delete />}
                          onClick={() => handleEliminarClick(index)}
                          sx={{
                            bgcolor: "#f44336",
                            color: "white",
                            fontSize: "0.75rem",
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

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
              ¿Estás seguro de que deseas eliminar al veterinario{" "}
              <strong>
                {veterinarioToDelete !== null
                  ? `${veterinarios[veterinarioToDelete]?.nombres} ${veterinarios[veterinarioToDelete]?.apellidos}`
                  : ""}
              </strong>
              ? Esta acción no se puede deshacer.
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

        {/* Dialog Ver Más */}
        <Dialog
          open={openViewDialog}
          onClose={handleCloseViewDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: "#00bcd4", color: "white" }}>
            Detalles del Veterinario
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedVeterinario && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Número de Colegiado
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedVeterinario.numeroColegiado}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    DNI
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedVeterinario.dni}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Nombres
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedVeterinario.nombres}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Apellidos
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedVeterinario.apellidos}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Teléfono
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedVeterinario.telefono}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Correo Electrónico
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedVeterinario.correo}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fecha de Inicio
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedVeterinario.fechaInicio}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fecha de Finalización
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedVeterinario.fechaFinalizacion}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Aparatos y productos que se utilizan en el proceso de limpieza y desinfección
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={selectedVeterinario.redaccionPlanes} disabled />}
                      label="Redacción y actualización de planes"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={selectedVeterinario.revisionAnimales} disabled />}
                      label="Revisión de animales"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={selectedVeterinario.instruccionManejo} disabled />}
                      label="Instrucción para mejorar el manejo"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={selectedVeterinario.informacionBioseguridad} disabled />}
                      label="Información sobre bioseguridad"
                    />
                  </FormGroup>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Plan de ejecución de tareas
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedVeterinario.planEjecucionTareas || "No especificado"}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Plan de visitas zoonotarias
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedVeterinario.planVisitasZoonotarias || "No especificado"}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseViewDialog} variant="contained">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog/Popup de registro */}
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ bgcolor: "#00bcd4", color: "white" }}>
            Agregar Veterinario
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* Información Personal */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, color: "#00bcd4" }}>
                    Información Personal
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Número de Colegiado"
                    variant="filled"
                    value={formData.numeroColegiado}
                    onChange={(e) => handleInputChange("numeroColegiado", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="DNI"
                    variant="filled"
                    value={formData.dni}
                    onChange={(e) => handleInputChange("dni", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nombres"
                    variant="filled"
                    value={formData.nombres}
                    onChange={(e) => handleInputChange("nombres", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Apellidos"
                    variant="filled"
                    value={formData.apellidos}
                    onChange={(e) => handleInputChange("apellidos", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    variant="filled"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange("telefono", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Correo Electrónico"
                    variant="filled"
                    type="email"
                    value={formData.correo}
                    onChange={(e) => handleInputChange("correo", e.target.value)}
                    required
                  />
                </Grid>

                {/* Fechas */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, mt: 2, color: "#00bcd4" }}>
                    Periodo de Trabajo
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Fecha de Inicio"
                    variant="filled"
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) => handleInputChange("fechaInicio", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Fecha de Finalización"
                    variant="filled"
                    type="date"
                    value={formData.fechaFinalizacion}
                    onChange={(e) => handleInputChange("fechaFinalizacion", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>

                {/* Aparatos y productos */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, mt: 2, color: "#00bcd4" }}>
                    Aparatos y productos que se utilizan en el proceso de limpieza y desinfección
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.redaccionPlanes}
                          onChange={(e) => handleInputChange("redaccionPlanes", e.target.checked)}
                        />
                      }
                      label="Redacción y actualización de planes"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.revisionAnimales}
                          onChange={(e) => handleInputChange("revisionAnimales", e.target.checked)}
                        />
                      }
                      label="Revisión de animales"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.instruccionManejo}
                          onChange={(e) => handleInputChange("instruccionManejo", e.target.checked)}
                        />
                      }
                      label="Instrucción para mejorar el manejo"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.informacionBioseguridad}
                          onChange={(e) => handleInputChange("informacionBioseguridad", e.target.checked)}
                        />
                      }
                      label="Información sobre bioseguridad"
                    />
                  </FormGroup>
                </Grid>

                {/* Planes */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, mt: 2, color: "#00bcd4" }}>
                    Planes de Trabajo
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Plan de ejecución de tareas"
                    variant="filled"
                    multiline
                    rows={3}
                    value={formData.planEjecucionTareas}
                    onChange={(e) => handleInputChange("planEjecucionTareas", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Plan de visitas zoonotarias"
                    variant="filled"
                    multiline
                    rows={3}
                    value={formData.planVisitasZoonotarias}
                    onChange={(e) => handleInputChange("planVisitasZoonotarias", e.target.value)}
                  />
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCancelar} variant="outlined" color="inherit">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}