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
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material"
import { Add, KeyboardArrowDown, Delete } from "@mui/icons-material"
import {
  listVeterinarians,
  createVeterinarian,
  updateVeterinarian,
  deleteVeterinarian,
  Veterinarian,
} from "../../action/RegistroVeterinarioPocket"

interface RegistroVeterinarioSectionProps {
  token: string;
  userId: string;
  farmId?: string;
}

interface FormData {
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

export function RegistroVeterinarioSection({ token, userId, farmId }: RegistroVeterinarioSectionProps) {
  const [veterinarios, setVeterinarios] = useState<Veterinarian[]>([])
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })

  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
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
  const [veterinarioToDelete, setVeterinarioToDelete] = useState<string | null>(null)

  // Estados para el diálogo de ver más
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [selectedVeterinario, setSelectedVeterinario] = useState<Veterinarian | null>(null)

  // Cargar veterinarios al montar el componente
  useEffect(() => {
    loadVeterinarios()
  }, [token, userId, farmId])

  const loadVeterinarios = async () => {
    if (!token || !userId) {
      console.error("❌ Token o userId no disponibles")
      return
    }

    setLoading(true)
    try {
      const response = await listVeterinarians(token, userId, farmId)
      if (response.success) {
        setVeterinarios(response.data.items as Veterinarian[] || [])
        console.log("✅ Veterinarios cargados:", response.data.items.length)
      }
    } catch (error: any) {
      console.error("❌ Error al cargar veterinarios:", error)
      setSnackbar({
        open: true,
        message: error.message || "Error al cargar veterinarios",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAgregarNuevo = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingId(null)
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

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token || !userId || !farmId) {
      setSnackbar({
        open: true,
        message: "Faltan datos de sesión (token, userId o farmId)",
        severity: "error",
      })
      return
    }

    const data = {
      numero_colegiado: formData.numeroColegiado,
      dni: formData.dni,
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      telefono: formData.telefono,
      correo: formData.correo,
      fecha_inicio: formData.fechaInicio,
      fecha_finalizacion: formData.fechaFinalizacion,
      redaccion_planes: formData.redaccionPlanes,
      revision_animales: formData.revisionAnimales,
      instruccion_manejo: formData.instruccionManejo,
      informacion_bioseguridad: formData.informacionBioseguridad,
      plan_ejecucion_tareas: formData.planEjecucionTareas,
      plan_visitas_zoonotarias: formData.planVisitasZoonotarias,
      farm: farmId,
      user: userId,
    }

    setLoading(true)
    try {
      if (editingId) {
        // Actualizar veterinario existente
        const response = await updateVeterinarian(token, editingId, data, userId)
        if (response.success) {
          setSnackbar({
            open: true,
            message: "Veterinario actualizado exitosamente",
            severity: "success",
          })
          await loadVeterinarios()
          handleClose()
        }
      } else {
        // Crear nuevo veterinario
        const response = await createVeterinarian(token, data)
        if (response.success) {
          setSnackbar({
            open: true,
            message: "Veterinario registrado exitosamente",
            severity: "success",
          })
          await loadVeterinarios()
          handleClose()
        }
      }
    } catch (error: any) {
      console.error("❌ Error al guardar veterinario:", error)
      setSnackbar({
        open: true,
        message: error.message || "Error al guardar el veterinario",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelar = () => {
    handleClose()
  }

  const handleEditar = (id: string) => {
    const vet = veterinarios.find(v => v.id === id)
    if (!vet) return

    console.log("Editar veterinario:", vet)
    
    setFormData({
      numeroColegiado: vet.numero_colegiado,
      dni: vet.dni,
      nombres: vet.nombres,
      apellidos: vet.apellidos,
      telefono: vet.telefono,
      correo: vet.correo,
      fechaInicio: vet.fecha_inicio,
      fechaFinalizacion: vet.fecha_finalizacion,
      redaccionPlanes: vet.redaccion_planes,
      revisionAnimales: vet.revision_animales,
      instruccionManejo: vet.instruccion_manejo,
      informacionBioseguridad: vet.informacion_bioseguridad,
      planEjecucionTareas: vet.plan_ejecucion_tareas || "",
      planVisitasZoonotarias: vet.plan_visitas_zoonotarias || "",
    })
    
    setEditingId(id)
    setOpen(true)
  }

  const handleVerMas = (id: string) => {
    const vet = veterinarios.find(v => v.id === id)
    if (vet) {
      setSelectedVeterinario(vet)
      setOpenViewDialog(true)
    }
  }

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false)
    setSelectedVeterinario(null)
  }

  // Funciones para eliminar
  const handleEliminarClick = (id: string) => {
    setVeterinarioToDelete(id)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!veterinarioToDelete || !token || !userId) return

    setLoading(true)
    try {
      const response = await deleteVeterinarian(token, veterinarioToDelete, userId)
      if (response.success) {
        setSnackbar({
          open: true,
          message: "Veterinario eliminado exitosamente",
          severity: "success",
        })
        await loadVeterinarios()
      }
    } catch (error: any) {
      console.error("❌ Error al eliminar veterinario:", error)
      setSnackbar({
        open: true,
        message: error.message || "Error al eliminar el veterinario",
        severity: "error",
      })
    } finally {
      setLoading(false)
      setOpenDeleteDialog(false)
      setVeterinarioToDelete(null)
    }
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
                {loading && veterinarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={40} />
                      <Typography sx={{ mt: 2 }}>Cargando veterinarios...</Typography>
                    </TableCell>
                  </TableRow>
                ) : veterinarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No hay veterinarios registrados
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  veterinarios.map((veterinario) => (
                    <TableRow
                      key={veterinario.id}
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
                        {veterinario.numero_colegiado}
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
                            onClick={() => handleEditar(veterinario.id!)}
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
                            onClick={() => handleVerMas(veterinario.id!)}
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
                            onClick={() => handleEliminarClick(veterinario.id!)}
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
                  ))
                )}
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
                {veterinarioToDelete
                  ? veterinarios.find(v => v.id === veterinarioToDelete)?.nombres + " " +
                    veterinarios.find(v => v.id === veterinarioToDelete)?.apellidos
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
                    {selectedVeterinario.numero_colegiado}
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
                    {formatDateToDisplay(selectedVeterinario.fecha_inicio)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fecha de Finalización
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formatDateToDisplay(selectedVeterinario.fecha_finalizacion)}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Aparatos y productos que se utilizan en el proceso de limpieza y desinfección
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={selectedVeterinario.redaccion_planes} disabled />}
                      label="Redacción y actualización de planes"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={selectedVeterinario.revision_animales} disabled />}
                      label="Revisión de animales"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={selectedVeterinario.instruccion_manejo} disabled />}
                      label="Instrucción para mejorar el manejo"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={selectedVeterinario.informacion_bioseguridad} disabled />}
                      label="Información sobre bioseguridad"
                    />
                  </FormGroup>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Plan de ejecución de tareas
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedVeterinario.plan_ejecucion_tareas || "No especificado"}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Plan de visitas zoonotarias
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedVeterinario.plan_visitas_zoonotarias || "No especificado"}
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
      </Container>
    </Box>
  )
}