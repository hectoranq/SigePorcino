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

const GESTORES_AUTORIZADOS = [
  { id: "1", name: "Gestor autorizado 1" },
  { id: "2", name: "Gestor autorizado 2" },
  { id: "3", name: "Gestor autorizado 3" },
]

interface PlanRecogidaCadaveres {
  sistemaRecogidaCadaveres: string
  gestorAutorizadoCadaveres: string
  ubicacionContenedoresCadaveres: string
  sistemaRecogidaSandach: string
  gestorAutorizadoSandach: string
  ubicacionContenedoresSandach: string
}

export function PlanRecogidaCadaveresSection() {
  const [registros, setRegistros] = useState<PlanRecogidaCadaveres[]>([
    {
      sistemaRecogidaCadaveres: "Contenedores refrigerados con recogida semanal",
      gestorAutorizadoCadaveres: "Gestor autorizado 1",
      ubicacionContenedoresCadaveres: "Zona norte de la granja, junto al almacén",
      sistemaRecogidaSandach: "Contenedores específicos SANDACH categoría 2",
      gestorAutorizadoSandach: "Gestor autorizado 2",
      ubicacionContenedoresSandach: "Área de almacenamiento sanitario, zona este",
    },
  ])

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<PlanRecogidaCadaveres>({
    sistemaRecogidaCadaveres: "",
    gestorAutorizadoCadaveres: "",
    ubicacionContenedoresCadaveres: "",
    sistemaRecogidaSandach: "",
    gestorAutorizadoSandach: "",
    ubicacionContenedoresSandach: "",
  })

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [registroToDelete, setRegistroToDelete] = useState<number | null>(null)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [selectedRegistro, setSelectedRegistro] = useState<PlanRecogidaCadaveres | null>(null)

  const handleAgregarNuevo = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setFormData({
      sistemaRecogidaCadaveres: "",
      gestorAutorizadoCadaveres: "",
      ubicacionContenedoresCadaveres: "",
      sistemaRecogidaSandach: "",
      gestorAutorizadoSandach: "",
      ubicacionContenedoresSandach: "",
    })
  }

  const handleInputChange = (field: keyof PlanRecogidaCadaveres, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const nuevoRegistro: PlanRecogidaCadaveres = {
      ...formData,
    }

    setRegistros((prev) => [...prev, nuevoRegistro])
    handleClose()
    console.log("Plan de recogida de cadáveres registrado:", nuevoRegistro)
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
                Plan de Recogida de Cadáveres
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
                      Sistema Recogida Cadáveres
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>
                      Gestor Cadáveres
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>
                      Sistema SANDACH
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>
                      Gestor SANDACH
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
                      {registro.sistemaRecogidaCadaveres.substring(0, 40)}...
                    </TableCell>
                    <TableCell sx={{ color: "text.primary" }}>
                      {registro.gestorAutorizadoCadaveres}
                    </TableCell>
                    <TableCell sx={{ color: "text.primary" }}>
                      {registro.sistemaRecogidaSandach.substring(0, 40)}...
                    </TableCell>
                    <TableCell sx={{ color: "text.primary" }}>
                      {registro.gestorAutorizadoSandach}
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
              ¿Estás seguro de que deseas eliminar este registro del plan de recogida de cadáveres? Esta acción no se
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
            Detalles del Plan de Recogida de Cadáveres
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedRegistro && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                      Recogida y almacenamiento de cadáveres
                    </Typography>
                  </Divider>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Sistema de Recogida
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRegistro.sistemaRecogidaCadaveres}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Gestor Autorizado
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRegistro.gestorAutorizadoCadaveres}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ubicación de Contenedores
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRegistro.ubicacionContenedoresCadaveres}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                      SANDACH
                    </Typography>
                  </Divider>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Sistema de Recogida SANDACH
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRegistro.sistemaRecogidaSandach}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Gestor Autorizado SANDACH
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRegistro.gestorAutorizadoSandach}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ubicación de Contenedores SANDACH
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRegistro.ubicacionContenedoresSandach}
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
            Agregar Plan de Recogida de Cadáveres
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Recogida y almacenamiento de cadáveres */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: "#00bcd4", borderRadius: "50%" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00bcd4" }}>
                      Recogida y almacenamiento de cadáveres
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Describa el sistema de recogida"
                    variant="filled"
                    multiline
                    rows={3}
                    value={formData.sistemaRecogidaCadaveres}
                    onChange={(e) => handleInputChange("sistemaRecogidaCadaveres", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Select
                    fullWidth
                    variant="filled"
                    value={formData.gestorAutorizadoCadaveres}
                    onChange={(e) => handleInputChange("gestorAutorizadoCadaveres", e.target.value)}
                    displayEmpty
                    required
                  >
                    <MenuItem value="">
                      <em>Seleccionar gestor autorizado</em>
                    </MenuItem>
                    {GESTORES_AUTORIZADOS.map((gestor) => (
                      <MenuItem key={gestor.id} value={gestor.name}>
                        {gestor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ubicación de los contenedores de almacenamiento"
                    variant="filled"
                    value={formData.ubicacionContenedoresCadaveres}
                    onChange={(e) => handleInputChange("ubicacionContenedoresCadaveres", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* SANDACH */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: "#00bcd4", borderRadius: "50%" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00bcd4" }}>
                      SANDACH
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Describa el sistema de recogida"
                    variant="filled"
                    multiline
                    rows={3}
                    value={formData.sistemaRecogidaSandach}
                    onChange={(e) => handleInputChange("sistemaRecogidaSandach", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Select
                    fullWidth
                    variant="filled"
                    value={formData.gestorAutorizadoSandach}
                    onChange={(e) => handleInputChange("gestorAutorizadoSandach", e.target.value)}
                    displayEmpty
                    required
                  >
                    <MenuItem value="">
                      <em>Seleccionar gestor autorizado</em>
                    </MenuItem>
                    {GESTORES_AUTORIZADOS.map((gestor) => (
                      <MenuItem key={gestor.id} value={gestor.name}>
                        {gestor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ubicación de los contenedores de almacenamiento"
                    variant="filled"
                    value={formData.ubicacionContenedoresSandach}
                    onChange={(e) => handleInputChange("ubicacionContenedoresSandach", e.target.value)}
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
              Registrar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}