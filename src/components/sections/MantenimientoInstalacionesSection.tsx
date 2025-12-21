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
  Select,
  MenuItem,
  Divider,
} from "@mui/material"
import { Add, KeyboardArrowDown, Delete } from "@mui/icons-material"

const ASSIGNED_PERSONNEL = [
  { id: "1", name: "Juan Carlos Pérez Olguín" },
  { id: "2", name: "María Antonieta Alcázar Chavez" },
]

const WORKERS = [
  { id: "1", name: "Juan Carlos Pérez Olguín" },
  { id: "2", name: "Mario Ascarrunz Terceros" },
]

const AUTHORIZED_MANAGERS = [
  { id: "1", name: "Gestor autorizado 1" },
  { id: "2", name: "Gestor autorizado 2" },
  { id: "3", name: "Gestor autorizado 3" },
]

const REGAS = [
  { id: "1363273426", label: "1363273426" },
  { id: "855665448", label: "855665448" },
  { id: "7488965666", label: "7488965666" },
]

interface MantenimientoInstalacion {
  personalEncargado: string[]
  trabajadores: string[]
  gestoresAutorizados: string[]
  procedimientoRevision: string
  frecuenciaRevision: string
  proveedoresServicios: string
  regasAplicables: string[]
  fechaRegistro: string
}

export function MantenimientoInstalacionesSection() {
  const [registros, setRegistros] = useState<MantenimientoInstalacion[]>([
    {
      personalEncargado: ["Juan Carlos Pérez Olguín"],
      trabajadores: ["Mario Ascarrunz Terceros"],
      gestoresAutorizados: ["Gestor autorizado 1"],
      procedimientoRevision: "Revisión completa de instalaciones eléctricas y estructurales",
      frecuenciaRevision: "Mensual",
      proveedoresServicios: "Servicios Técnicos SA",
      regasAplicables: ["1363273426", "855665448"],
      fechaRegistro: "15/01/2024",
    },
  ])

  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<MantenimientoInstalacion>({
    personalEncargado: [],
    trabajadores: [],
    gestoresAutorizados: [],
    procedimientoRevision: "",
    frecuenciaRevision: "",
    proveedoresServicios: "",
    regasAplicables: [],
    fechaRegistro: "",
  })

  // Estados para diálogo de eliminación
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [registroToDelete, setRegistroToDelete] = useState<number | null>(null)

  // Estados para diálogo de ver más
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [selectedRegistro, setSelectedRegistro] = useState<MantenimientoInstalacion | null>(null)

  const handleAgregarNuevo = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setFormData({
      personalEncargado: [],
      trabajadores: [],
      gestoresAutorizados: [],
      procedimientoRevision: "",
      frecuenciaRevision: "",
      proveedoresServicios: "",
      regasAplicables: [],
      fechaRegistro: "",
    })
  }

  const handlePersonnelChange = (type: keyof Pick<MantenimientoInstalacion, "personalEncargado" | "trabajadores" | "gestoresAutorizados">, personId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [type]: checked
        ? [...prev[type], personId]
        : prev[type].filter((id) => id !== personId),
    }))
  }

  const handleRegaChange = (regaId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      regasAplicables: checked
        ? [...prev.regasAplicables, regaId]
        : prev.regasAplicables.filter((id) => id !== regaId),
    }))
  }

  const handleInputChange = (field: keyof MantenimientoInstalacion, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const formatDateToDisplay = (dateString: string) => {
    if (!dateString) return "Sin fecha"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const nuevoRegistro: MantenimientoInstalacion = {
      ...formData,
      fechaRegistro: formatDateToDisplay(formData.fechaRegistro),
    }

    setRegistros((prev) => [...prev, nuevoRegistro])
    handleClose()
    console.log("Plan de mantenimiento registrado:", nuevoRegistro)
  }

  const handleCancelar = () => {
    handleClose()
  }

  const handleEditar = (index: number) => {
    console.log("Editar registro:", registros[index])
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

  const handleConfirmDelete = () => {
    if (registroToDelete !== null) {
      setRegistros((prev) => prev.filter((_, index) => index !== registroToDelete))
      console.log("Registro eliminado:", registros[registroToDelete])
    }
    setOpenDeleteDialog(false)
    setRegistroToDelete(null)
  }

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false)
    setRegistroToDelete(null)
  }

  const getPersonNameById = (id: string, list: typeof ASSIGNED_PERSONNEL) => {
    return list.find((p) => p.id === id)?.name || id
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
                Plan de Mantenimiento de Instalaciones
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
                      Personal Encargado
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>
                      Procedimiento
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>
                      Frecuencia
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>
                      REGAs
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>
                      Fecha Registro
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
                {registros.map((registro, index) => (
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
                      {registro.personalEncargado.join(", ")}
                    </TableCell>
                    <TableCell sx={{ color: "text.primary" }}>
                      {registro.procedimientoRevision.substring(0, 50)}...
                    </TableCell>
                    <TableCell sx={{ color: "text.primary" }}>
                      {registro.frecuenciaRevision}
                    </TableCell>
                    <TableCell sx={{ color: "text.primary" }}>
                      {registro.regasAplicables.length} REGAs
                    </TableCell>
                    <TableCell sx={{ color: "text.primary" }}>
                      {registro.fechaRegistro}
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
        <Dialog open={openDeleteDialog} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
          <DialogTitle>¿Confirmar eliminación?</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que deseas eliminar este registro de mantenimiento? Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCancelDelete} variant="outlined" color="inherit">
              Cancelar
            </Button>
            <Button onClick={handleConfirmDelete} variant="contained" color="error" startIcon={<Delete />}>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Ver Más */}
        <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: "#00bcd4", color: "white" }}>
            Detalles del Plan de Mantenimiento
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedRegistro && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Personal Encargado
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRegistro.personalEncargado.map((id) => getPersonNameById(id, ASSIGNED_PERSONNEL)).join(", ")}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Lista de Trabajadores
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRegistro.trabajadores.map((id) => getPersonNameById(id, WORKERS)).join(", ")}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Gestores Autorizados
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRegistro.gestoresAutorizados.map((id) => getPersonNameById(id, AUTHORIZED_MANAGERS)).join(", ")}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Procedimiento de Revisión
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRegistro.procedimientoRevision}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Frecuencia de Revisión
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRegistro.frecuenciaRevision}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Proveedores y Servicios
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRegistro.proveedoresServicios || "No especificado"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    REGAs Aplicables
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRegistro.regasAplicables.join(", ")}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fecha de Registro
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRegistro.fechaRegistro}
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
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
          <DialogTitle sx={{ bgcolor: "#00bcd4", color: "white" }}>
            Agregar Plan de Mantenimiento de Instalaciones
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Personal Encargado */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: "#00bcd4", borderRadius: "50%" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00bcd4" }}>
                      Personal encargado
                    </Typography>
                  </Box>
                  <FormGroup sx={{ pl: 2 }}>
                    {ASSIGNED_PERSONNEL.map((person) => (
                      <FormControlLabel
                        key={person.id}
                        control={
                          <Checkbox
                            checked={formData.personalEncargado.includes(person.id)}
                            onChange={(e) => handlePersonnelChange("personalEncargado", person.id, e.target.checked)}
                          />
                        }
                        label={person.name}
                      />
                    ))}
                  </FormGroup>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Lista de Trabajadores */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: "#2196f3", borderRadius: "50%" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#2196f3" }}>
                      Lista de trabajadores
                    </Typography>
                  </Box>
                  <FormGroup sx={{ pl: 2 }}>
                    {WORKERS.map((person) => (
                      <FormControlLabel
                        key={person.id}
                        control={
                          <Checkbox
                            checked={formData.trabajadores.includes(person.id)}
                            onChange={(e) => handlePersonnelChange("trabajadores", person.id, e.target.checked)}
                          />
                        }
                        label={person.name}
                      />
                    ))}
                  </FormGroup>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Gestores Autorizados */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: "#4caf50", borderRadius: "50%" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#4caf50" }}>
                      Lista de gestores autorizados
                    </Typography>
                  </Box>
                  <FormGroup sx={{ pl: 2 }}>
                    {AUTHORIZED_MANAGERS.map((person) => (
                      <FormControlLabel
                        key={person.id}
                        control={
                          <Checkbox
                            checked={formData.gestoresAutorizados.includes(person.id)}
                            onChange={(e) => handlePersonnelChange("gestoresAutorizados", person.id, e.target.checked)}
                          />
                        }
                        label={person.name}
                      />
                    ))}
                  </FormGroup>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Procedimiento de Revisión */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: "#00bcd4", borderRadius: "50%" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00bcd4" }}>
                      Procedimiento de revisión
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Procedimiento de revisión de las instalaciones"
                    variant="filled"
                    multiline
                    rows={3}
                    value={formData.procedimientoRevision}
                    onChange={(e) => handleInputChange("procedimientoRevision", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Select
                    fullWidth
                    variant="filled"
                    value={formData.frecuenciaRevision}
                    onChange={(e) => handleInputChange("frecuenciaRevision", e.target.value)}
                    displayEmpty
                    required
                  >
                    <MenuItem value="">
                      <em>Seleccionar frecuencia</em>
                    </MenuItem>
                    <MenuItem value="Semanal">Semanal</MenuItem>
                    <MenuItem value="Quincenal">Quincenal</MenuItem>
                    <MenuItem value="Mensual">Mensual</MenuItem>
                    <MenuItem value="Trimestral">Trimestral</MenuItem>
                    <MenuItem value="Semestral">Semestral</MenuItem>
                    <MenuItem value="Anual">Anual</MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Proveedores y Servicios */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: "#00bcd4", borderRadius: "50%" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00bcd4" }}>
                      Lista de proveedores y servicios de mantenimiento
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    variant="filled"
                    multiline
                    rows={2}
                    placeholder="Proveedores encargados de subsanar las deficiencias detectadas"
                    value={formData.proveedoresServicios}
                    onChange={(e) => handleInputChange("proveedoresServicios", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* REGAs */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: "#00bcd4", borderRadius: "50%" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00bcd4" }}>
                      ¿A qué REGAs aplicará el plan?
                    </Typography>
                  </Box>
                  <FormGroup sx={{ pl: 2 }}>
                    {REGAS.map((rega) => (
                      <FormControlLabel
                        key={rega.id}
                        control={
                          <Checkbox
                            checked={formData.regasAplicables.includes(rega.id)}
                            onChange={(e) => handleRegaChange(rega.id, e.target.checked)}
                          />
                        }
                        label={rega.label}
                      />
                    ))}
                  </FormGroup>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Fecha de Registro */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Fecha de Registro"
                    variant="filled"
                    type="date"
                    value={formData.fechaRegistro}
                    onChange={(e) => handleInputChange("fechaRegistro", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
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