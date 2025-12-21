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
  Select,
  MenuItem,
  Divider,
} from "@mui/material"
import { Add, KeyboardArrowDown, Delete } from "@mui/icons-material"

const ENCARGADOS = [
  { id: "1", name: "Juan Carlos Pérez" },
  { id: "2", name: "María García López" },
  { id: "3", name: "Pedro Martínez" },
]

const GESTORES = [
  { id: "1", name: "Gestor Residuos A" },
  { id: "2", name: "Gestor Residuos B" },
  { id: "3", name: "Gestor Residuos C" },
]

const PERIODICIDADES = ["Diaria", "Semanal", "Quincenal", "Mensual", "Trimestral", "Semestral", "Anual"]

interface GestionResiduos {
  // Medicamentos
  ubicacionMedicamentos: string
  descripcionMedicamentos: string
  encargadoMedicamentos: string
  gestorMedicamentos: string
  protocoloMedicamentos: string
  periodicidadMedicamentos: string
  // Piensos medicamentosos
  ubicacionPiensos: string
  descripcionPiensos: string
  encargadoPiensos: string
  gestorPiensos: string
  protocoloPiensos: string
  periodicidadPiensos: string
  // Material sanitario
  ubicacionMaterial: string
  descripcionMaterial: string
  encargadoMaterial: string
  gestorMaterial: string
  protocoloMaterial: string
  periodicidadMaterial: string
  // Envases residuales
  ubicacionEnvases: string
  descripcionEnvases: string
  encargadoEnvases: string
  gestorEnvases: string
  protocoloEnvases: string
  periodicidadEnvases: string
}

export function PlanGestionResiduosSection() {
  const [registros, setRegistros] = useState<GestionResiduos[]>([
    {
      ubicacionMedicamentos: "Almacén principal, sección A",
      descripcionMedicamentos: "Contenedor especial para residuos farmacéuticos",
      encargadoMedicamentos: "Juan Carlos Pérez",
      gestorMedicamentos: "Gestor Residuos A",
      protocoloMedicamentos: "Protocolo de gestión según normativa vigente",
      periodicidadMedicamentos: "Mensual",
      ubicacionPiensos: "Almacén de piensos",
      descripcionPiensos: "Contenedor sellado para piensos no utilizados",
      encargadoPiensos: "María García López",
      gestorPiensos: "Gestor Residuos B",
      protocoloPiensos: "Protocolo específico para piensos medicamentosos",
      periodicidadPiensos: "Quincenal",
      ubicacionMaterial: "Enfermería",
      descripcionMaterial: "Contenedor de bioseguridad",
      encargadoMaterial: "Pedro Martínez",
      gestorMaterial: "Gestor Residuos A",
      protocoloMaterial: "Protocolo de material sanitario fungible",
      periodicidadMaterial: "Semanal",
      ubicacionEnvases: "Zona de reciclaje",
      descripcionEnvases: "Contenedor de envases plásticos y metálicos",
      encargadoEnvases: "Juan Carlos Pérez",
      gestorEnvases: "Gestor Residuos C",
      protocoloEnvases: "Protocolo de separación y reciclaje",
      periodicidadEnvases: "Semanal",
    },
  ])

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<GestionResiduos>({
    ubicacionMedicamentos: "",
    descripcionMedicamentos: "",
    encargadoMedicamentos: "",
    gestorMedicamentos: "",
    protocoloMedicamentos: "",
    periodicidadMedicamentos: "",
    ubicacionPiensos: "",
    descripcionPiensos: "",
    encargadoPiensos: "",
    gestorPiensos: "",
    protocoloPiensos: "",
    periodicidadPiensos: "",
    ubicacionMaterial: "",
    descripcionMaterial: "",
    encargadoMaterial: "",
    gestorMaterial: "",
    protocoloMaterial: "",
    periodicidadMaterial: "",
    ubicacionEnvases: "",
    descripcionEnvases: "",
    encargadoEnvases: "",
    gestorEnvases: "",
    protocoloEnvases: "",
    periodicidadEnvases: "",
  })

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [registroToDelete, setRegistroToDelete] = useState<number | null>(null)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [selectedRegistro, setSelectedRegistro] = useState<GestionResiduos | null>(null)

  const handleAgregarNuevo = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setFormData({
      ubicacionMedicamentos: "",
      descripcionMedicamentos: "",
      encargadoMedicamentos: "",
      gestorMedicamentos: "",
      protocoloMedicamentos: "",
      periodicidadMedicamentos: "",
      ubicacionPiensos: "",
      descripcionPiensos: "",
      encargadoPiensos: "",
      gestorPiensos: "",
      protocoloPiensos: "",
      periodicidadPiensos: "",
      ubicacionMaterial: "",
      descripcionMaterial: "",
      encargadoMaterial: "",
      gestorMaterial: "",
      protocoloMaterial: "",
      periodicidadMaterial: "",
      ubicacionEnvases: "",
      descripcionEnvases: "",
      encargadoEnvases: "",
      gestorEnvases: "",
      protocoloEnvases: "",
      periodicidadEnvases: "",
    })
  }

  const handleInputChange = (field: keyof GestionResiduos, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const nuevoRegistro: GestionResiduos = {
      ...formData,
    }

    setRegistros((prev) => [...prev, nuevoRegistro])
    handleClose()
    console.log("Plan de gestión de residuos registrado:", nuevoRegistro)
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
                Plan de Gestión de Residuos
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
                    <TableSortLabel IconComponent={KeyboardArrowDown}>Medicamentos</TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>Piensos</TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>Material Sanitario</TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>Envases</TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>Acciones</TableSortLabel>
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
                    <TableCell sx={{ color: "text.primary" }}>{registro.periodicidadMedicamentos}</TableCell>
                    <TableCell sx={{ color: "text.primary" }}>{registro.periodicidadPiensos}</TableCell>
                    <TableCell sx={{ color: "text.primary" }}>{registro.periodicidadMaterial}</TableCell>
                    <TableCell sx={{ color: "text.primary" }}>{registro.periodicidadEnvases}</TableCell>
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
              ¿Estás seguro de que deseas eliminar este registro del plan de gestión de residuos? Esta acción no se
              puede deshacer.
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
            Detalles del Plan de Gestión de Residuos
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedRegistro && (
              <Grid container spacing={2}>
                {/* Gestión de residuos de medicamentos */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                      Gestión de residuos de medicamentos
                    </Typography>
                  </Divider>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ubicación de contenedores
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.ubicacionMedicamentos}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Descripción
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.descripcionMedicamentos}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Encargado
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.encargadoMedicamentos}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Gestor
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.gestorMedicamentos}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Protocolo
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.protocoloMedicamentos}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Periodicidad
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRegistro.periodicidadMedicamentos}
                  </Typography>
                </Grid>

                {/* Piensos medicamentosos */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                      Gestión de residuos piensos medicamentosos no utilizados
                    </Typography>
                  </Divider>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ubicación de contenedores
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.ubicacionPiensos}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Descripción
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.descripcionPiensos}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Encargado
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.encargadoPiensos}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Gestor
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.gestorPiensos}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Protocolo
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.protocoloPiensos}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Periodicidad
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRegistro.periodicidadPiensos}
                  </Typography>
                </Grid>

                {/* Material sanitario fungible */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                      Gestión de residuos de material sanitario fungible
                    </Typography>
                  </Divider>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ubicación de contenedores
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.ubicacionMaterial}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Descripción
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.descripcionMaterial}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Encargado
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.encargadoMaterial}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Gestor
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.gestorMaterial}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Protocolo
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.protocoloMaterial}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Periodicidad
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRegistro.periodicidadMaterial}
                  </Typography>
                </Grid>

                {/* Envases residuales */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                      Gestión de residuos de envases residuales
                    </Typography>
                  </Divider>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ubicación de contenedores
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.ubicacionEnvases}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Descripción
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.descripcionEnvases}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Encargado
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.encargadoEnvases}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Gestor
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.gestorEnvases}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Protocolo
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.protocoloEnvases}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Periodicidad
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRegistro.periodicidadEnvases}
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
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
          <DialogTitle sx={{ bgcolor: "#00bcd4", color: "white" }}>
            Agregar Plan de Gestión de Residuos
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Gestión de residuos de medicamentos */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: "#00bcd4", borderRadius: "50%" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00bcd4" }}>
                      Gestión de residuos de medicamentos
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ubicación de los contenedores de almacenamiento"
                    variant="filled"
                    value={formData.ubicacionMedicamentos}
                    onChange={(e) => handleInputChange("ubicacionMedicamentos", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Descripción de los contenedores de almacenamiento"
                    variant="filled"
                    multiline
                    rows={2}
                    value={formData.descripcionMedicamentos}
                    onChange={(e) => handleInputChange("descripcionMedicamentos", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Select
                    fullWidth
                    variant="filled"
                    value={formData.encargadoMedicamentos}
                    onChange={(e) => handleInputChange("encargadoMedicamentos", e.target.value)}
                    displayEmpty
                    required
                  >
                    <MenuItem value="">
                      <em>Seleccionar encargado</em>
                    </MenuItem>
                    {ENCARGADOS.map((encargado) => (
                      <MenuItem key={encargado.id} value={encargado.name}>
                        {encargado.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Select
                    fullWidth
                    variant="filled"
                    value={formData.gestorMedicamentos}
                    onChange={(e) => handleInputChange("gestorMedicamentos", e.target.value)}
                    displayEmpty
                    required
                  >
                    <MenuItem value="">
                      <em>Seleccionar gestor</em>
                    </MenuItem>
                    {GESTORES.map((gestor) => (
                      <MenuItem key={gestor.id} value={gestor.name}>
                        {gestor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Protocolo"
                    variant="filled"
                    value={formData.protocoloMedicamentos}
                    onChange={(e) => handleInputChange("protocoloMedicamentos", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Select
                    fullWidth
                    variant="filled"
                    value={formData.periodicidadMedicamentos}
                    onChange={(e) => handleInputChange("periodicidadMedicamentos", e.target.value)}
                    displayEmpty
                    required
                  >
                    <MenuItem value="">
                      <em>Periodicidad</em>
                    </MenuItem>
                    {PERIODICIDADES.map((per) => (
                      <MenuItem key={per} value={per}>
                        {per}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Gestión de residuos piensos medicamentosos */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: "#00bcd4", borderRadius: "50%" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00bcd4" }}>
                      Gestión de residuos piensos medicamentosos no utilizados
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ubicación de los contenedores de almacenamiento"
                    variant="filled"
                    value={formData.ubicacionPiensos}
                    onChange={(e) => handleInputChange("ubicacionPiensos", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Descripción de los contenedores de almacenamiento"
                    variant="filled"
                    multiline
                    rows={2}
                    value={formData.descripcionPiensos}
                    onChange={(e) => handleInputChange("descripcionPiensos", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Select
                    fullWidth
                    variant="filled"
                    value={formData.encargadoPiensos}
                    onChange={(e) => handleInputChange("encargadoPiensos", e.target.value)}
                    displayEmpty
                    required
                  >
                    <MenuItem value="">
                      <em>Seleccionar encargado</em>
                    </MenuItem>
                    {ENCARGADOS.map((encargado) => (
                      <MenuItem key={encargado.id} value={encargado.name}>
                        {encargado.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Select
                    fullWidth
                    variant="filled"
                    value={formData.gestorPiensos}
                    onChange={(e) => handleInputChange("gestorPiensos", e.target.value)}
                    displayEmpty
                    required
                  >
                    <MenuItem value="">
                      <em>Seleccionar gestor</em>
                    </MenuItem>
                    {GESTORES.map((gestor) => (
                      <MenuItem key={gestor.id} value={gestor.name}>
                        {gestor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Protocolo"
                    variant="filled"
                    value={formData.protocoloPiensos}
                    onChange={(e) => handleInputChange("protocoloPiensos", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Select
                    fullWidth
                    variant="filled"
                    value={formData.periodicidadPiensos}
                    onChange={(e) => handleInputChange("periodicidadPiensos", e.target.value)}
                    displayEmpty
                    required
                  >
                    <MenuItem value="">
                      <em>Periodicidad</em>
                    </MenuItem>
                    {PERIODICIDADES.map((per) => (
                      <MenuItem key={per} value={per}>
                        {per}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Gestión de residuos de material sanitario fungible */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: "#00bcd4", borderRadius: "50%" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00bcd4" }}>
                      Gestión de residuos de material sanitario fungible
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ubicación de los contenedores de almacenamiento"
                    variant="filled"
                    value={formData.ubicacionMaterial}
                    onChange={(e) => handleInputChange("ubicacionMaterial", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Descripción de los contenedores de almacenamiento"
                    variant="filled"
                    multiline
                    rows={2}
                    value={formData.descripcionMaterial}
                    onChange={(e) => handleInputChange("descripcionMaterial", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Select
                    fullWidth
                    variant="filled"
                    value={formData.encargadoMaterial}
                    onChange={(e) => handleInputChange("encargadoMaterial", e.target.value)}
                    displayEmpty
                    required
                  >
                    <MenuItem value="">
                      <em>Seleccionar encargado</em>
                    </MenuItem>
                    {ENCARGADOS.map((encargado) => (
                      <MenuItem key={encargado.id} value={encargado.name}>
                        {encargado.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Select
                    fullWidth
                    variant="filled"
                    value={formData.gestorMaterial}
                    onChange={(e) => handleInputChange("gestorMaterial", e.target.value)}
                    displayEmpty
                    required
                  >
                    <MenuItem value="">
                      <em>Seleccionar gestor</em>
                    </MenuItem>
                    {GESTORES.map((gestor) => (
                      <MenuItem key={gestor.id} value={gestor.name}>
                        {gestor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Protocolo"
                    variant="filled"
                    value={formData.protocoloMaterial}
                    onChange={(e) => handleInputChange("protocoloMaterial", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Select
                    fullWidth
                    variant="filled"
                    value={formData.periodicidadMaterial}
                    onChange={(e) => handleInputChange("periodicidadMaterial", e.target.value)}
                    displayEmpty
                    required
                  >
                    <MenuItem value="">
                      <em>Periodicidad</em>
                    </MenuItem>
                    {PERIODICIDADES.map((per) => (
                      <MenuItem key={per} value={per}>
                        {per}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Gestión de residuos de envases residuales */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: "#00bcd4", borderRadius: "50%" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00bcd4" }}>
                      Gestión de residuos de envases residuales
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ubicación de los contenedores de almacenamiento"
                    variant="filled"
                    value={formData.ubicacionEnvases}
                    onChange={(e) => handleInputChange("ubicacionEnvases", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Descripción de los contenedores de almacenamiento"
                    variant="filled"
                    multiline
                    rows={2}
                    value={formData.descripcionEnvases}
                    onChange={(e) => handleInputChange("descripcionEnvases", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Select
                    fullWidth
                    variant="filled"
                    value={formData.encargadoEnvases}
                    onChange={(e) => handleInputChange("encargadoEnvases", e.target.value)}
                    displayEmpty
                    required
                  >
                    <MenuItem value="">
                      <em>Seleccionar encargado</em>
                    </MenuItem>
                    {ENCARGADOS.map((encargado) => (
                      <MenuItem key={encargado.id} value={encargado.name}>
                        {encargado.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Select
                    fullWidth
                    variant="filled"
                    value={formData.gestorEnvases}
                    onChange={(e) => handleInputChange("gestorEnvases", e.target.value)}
                    displayEmpty
                    required
                  >
                    <MenuItem value="">
                      <em>Seleccionar gestor</em>
                    </MenuItem>
                    {GESTORES.map((gestor) => (
                      <MenuItem key={gestor.id} value={gestor.name}>
                        {gestor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Protocolo"
                    variant="filled"
                    value={formData.protocoloEnvases}
                    onChange={(e) => handleInputChange("protocoloEnvases", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Select
                    fullWidth
                    variant="filled"
                    value={formData.periodicidadEnvases}
                    onChange={(e) => handleInputChange("periodicidadEnvases", e.target.value)}
                    displayEmpty
                    required
                  >
                    <MenuItem value="">
                      <em>Periodicidad</em>
                    </MenuItem>
                    {PERIODICIDADES.map((per) => (
                      <MenuItem key={per} value={per}>
                        {per}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCancelar} variant="outlined" color="inherit">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Registrar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}