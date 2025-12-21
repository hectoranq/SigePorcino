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
  Paper,
  Container,
  Dialog,
  DialogContent,
  Grid,
  TextField,
  DialogTitle,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
} from "@mui/material"
import { Add, Edit, Visibility, Delete, AttachFile, Close } from "@mui/icons-material"

interface PlanSanitario {
  planVacunacion: string
  planVacunacionArchivo: File | null
  planVacunacionObservaciones: string
  planDesparasitacion: string
  planDesparasitacionArchivo: File | null
  planDesparasitacionObservaciones: string
  protocoloVigilancia: string
  protocoloVigilanciaArchivo: File | null
  protocoloVigilanciaObservaciones: string
  programaMuestreo: string
  programaMuestreoArchivo: File | null
  programaMuestreoObservaciones: string
}

const buttonStyles = {
  primary: {
    textTransform: "none",
    borderRadius: 1,
  },
}

export function PlanSanitarioSection() {
  const [registros, setRegistros] = useState<PlanSanitario[]>([
    {
      planVacunacion: "si",
      planVacunacionArchivo: null,
      planVacunacionObservaciones: "Plan actualizado 2024",
      planDesparasitacion: "si",
      planDesparasitacionArchivo: null,
      planDesparasitacionObservaciones: "Desparasitación trimestral",
      protocoloVigilancia: "si",
      protocoloVigilanciaArchivo: null,
      protocoloVigilanciaObservaciones: "Revisión diaria por veterinario",
      programaMuestreo: "si",
      programaMuestreoArchivo: null,
      programaMuestreoObservaciones: "Muestreo según normativa ADS",
    },
  ])

  const [open, setOpen] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [indiceEdicion, setIndiceEdicion] = useState<number | null>(null)
  const [formData, setFormData] = useState<PlanSanitario>({
    planVacunacion: "",
    planVacunacionArchivo: null,
    planVacunacionObservaciones: "",
    planDesparasitacion: "",
    planDesparasitacionArchivo: null,
    planDesparasitacionObservaciones: "",
    protocoloVigilancia: "",
    protocoloVigilanciaArchivo: null,
    protocoloVigilanciaObservaciones: "",
    programaMuestreo: "",
    programaMuestreoArchivo: null,
    programaMuestreoObservaciones: "",
  })

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [registroToDelete, setRegistroToDelete] = useState<number | null>(null)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [selectedRegistro, setSelectedRegistro] = useState<PlanSanitario | null>(null)

  const handleAgregarNuevo = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setModoEdicion(false)
    setIndiceEdicion(null)
    setFormData({
      planVacunacion: "",
      planVacunacionArchivo: null,
      planVacunacionObservaciones: "",
      planDesparasitacion: "",
      planDesparasitacionArchivo: null,
      planDesparasitacionObservaciones: "",
      protocoloVigilancia: "",
      protocoloVigilanciaArchivo: null,
      protocoloVigilanciaObservaciones: "",
      programaMuestreo: "",
      programaMuestreoArchivo: null,
      programaMuestreoObservaciones: "",
    })
  }

  const handleInputChange = (field: keyof PlanSanitario, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileChange = (field: keyof PlanSanitario, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }))
  }

  const handleRemoveFile = (field: keyof PlanSanitario) => {
    setFormData((prev) => ({
      ...prev,
      [field]: null,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (modoEdicion && indiceEdicion !== null) {
      setRegistros((prev) => prev.map((reg, index) => (index === indiceEdicion ? formData : reg)))
      console.log("Plan sanitario actualizado:", formData)
    } else {
      setRegistros((prev) => [...prev, formData])
      console.log("Plan sanitario registrado:", formData)
    }

    handleClose()
  }

  const handleCancelar = () => {
    handleClose()
  }

  const handleEditar = (index: number) => {
    setModoEdicion(true)
    setIndiceEdicion(index)
    setFormData({ ...registros[index] })
    setOpen(true)
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

  const getResumenPlanSanitario = (registro: PlanSanitario) => {
    const items = []
    if (registro.planVacunacion === "si") items.push("Vacunación")
    if (registro.planDesparasitacion === "si") items.push("Desparasitación")
    if (registro.protocoloVigilancia === "si") items.push("Vigilancia")
    if (registro.programaMuestreo === "si") items.push("Muestreo")

    return items.length > 0 ? items.join(" | ") : "Sin planes activos"
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
              Plan Sanitario
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
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#666", fontSize: "0.875rem", py: 2 }}>
                    Resumen del Plan Sanitario
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
                      {getResumenPlanSanitario(registro)}
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
          </TableContainer>
        </Paper>

        {/* Dialog de confirmación de eliminación */}
        <Dialog open={openDeleteDialog} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
          <DialogTitle>¿Confirmar eliminación?</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que deseas eliminar este registro del plan sanitario? Esta acción no se puede deshacer.
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
        <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: "#00bcd4", color: "white", fontWeight: 600 }}>
            Detalles del Plan Sanitario
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedRegistro && (
              <Grid container spacing={3}>
                {/* Plan de vacunación */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                    Plan de vacunación
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {selectedRegistro.planVacunacion === "si" ? "Sí" : "No"}
                  </Typography>
                  {selectedRegistro.planVacunacionArchivo && (
                    <Typography variant="body2" color="primary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AttachFile fontSize="small" />
                      {selectedRegistro.planVacunacionArchivo.name}
                    </Typography>
                  )}
                  {selectedRegistro.planVacunacionObservaciones && (
                    <Typography variant="body2" color="text.secondary">
                      Observaciones: {selectedRegistro.planVacunacionObservaciones}
                    </Typography>
                  )}
                </Grid>

                {/* Plan de desparasitación */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                    Plan de desparasitación
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {selectedRegistro.planDesparasitacion === "si" ? "Sí" : "No"}
                  </Typography>
                  {selectedRegistro.planDesparasitacionArchivo && (
                    <Typography variant="body2" color="primary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AttachFile fontSize="small" />
                      {selectedRegistro.planDesparasitacionArchivo.name}
                    </Typography>
                  )}
                  {selectedRegistro.planDesparasitacionObservaciones && (
                    <Typography variant="body2" color="text.secondary">
                      Observaciones: {selectedRegistro.planDesparasitacionObservaciones}
                    </Typography>
                  )}
                </Grid>

                {/* Protocolo de vigilancia */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                    Protocolo de vigilancia del estado sanitario de los animales
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {selectedRegistro.protocoloVigilancia === "si" ? "Sí" : "No"}
                  </Typography>
                  {selectedRegistro.protocoloVigilanciaArchivo && (
                    <Typography variant="body2" color="primary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AttachFile fontSize="small" />
                      {selectedRegistro.protocoloVigilanciaArchivo.name}
                    </Typography>
                  )}
                  {selectedRegistro.protocoloVigilanciaObservaciones && (
                    <Typography variant="body2" color="text.secondary">
                      Observaciones: {selectedRegistro.protocoloVigilanciaObservaciones}
                    </Typography>
                  )}
                </Grid>

                {/* Programa de muestreo */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                    Programa de muestreo rutinario ADS
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {selectedRegistro.programaMuestreo === "si" ? "Sí" : "No"}
                  </Typography>
                  {selectedRegistro.programaMuestreoArchivo && (
                    <Typography variant="body2" color="primary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AttachFile fontSize="small" />
                      {selectedRegistro.programaMuestreoArchivo.name}
                    </Typography>
                  )}
                  {selectedRegistro.programaMuestreoObservaciones && (
                    <Typography variant="body2" color="text.secondary">
                      Observaciones: {selectedRegistro.programaMuestreoObservaciones}
                    </Typography>
                  )}
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
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
          <DialogTitle sx={{ bgcolor: "#00bcd4", color: "white", fontWeight: 600 }}>
            {modoEdicion ? "Editar Plan Sanitario" : "Agregar Plan Sanitario"}
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Plan de vacunación */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Plan de vacunación
                  </Typography>
                  <RadioGroup
                    row
                    value={formData.planVacunacion}
                    onChange={(e) => handleInputChange("planVacunacion", e.target.value)}
                  >
                    <FormControlLabel value="si" control={<Radio />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </Grid>

                {formData.planVacunacion === "si" && (
                  <>
                    <Grid item xs={12}>
                      <Button variant="outlined" component="label" startIcon={<AttachFile />} sx={buttonStyles.primary}>
                        Subir archivo
                        <input
                          type="file"
                          hidden
                          onChange={(e) => handleFileChange("planVacunacionArchivo", e.target.files?.[0] || null)}
                        />
                      </Button>
                      {formData.planVacunacionArchivo && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                          <Typography variant="body2">{formData.planVacunacionArchivo.name}</Typography>
                          <IconButton size="small" onClick={() => handleRemoveFile("planVacunacionArchivo")}>
                            <Close fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Observaciones"
                        variant="filled"
                        multiline
                        rows={2}
                        value={formData.planVacunacionObservaciones}
                        onChange={(e) => handleInputChange("planVacunacionObservaciones", e.target.value)}
                      />
                    </Grid>
                  </>
                )}

                {/* Plan de desparasitación */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Plan de desparasitación
                  </Typography>
                  <RadioGroup
                    row
                    value={formData.planDesparasitacion}
                    onChange={(e) => handleInputChange("planDesparasitacion", e.target.value)}
                  >
                    <FormControlLabel value="si" control={<Radio />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </Grid>

                {formData.planDesparasitacion === "si" && (
                  <>
                    <Grid item xs={12}>
                      <Button variant="outlined" component="label" startIcon={<AttachFile />} sx={buttonStyles.primary}>
                        Subir archivo
                        <input
                          type="file"
                          hidden
                          onChange={(e) => handleFileChange("planDesparasitacionArchivo", e.target.files?.[0] || null)}
                        />
                      </Button>
                      {formData.planDesparasitacionArchivo && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                          <Typography variant="body2">{formData.planDesparasitacionArchivo.name}</Typography>
                          <IconButton size="small" onClick={() => handleRemoveFile("planDesparasitacionArchivo")}>
                            <Close fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Observaciones"
                        variant="filled"
                        multiline
                        rows={2}
                        value={formData.planDesparasitacionObservaciones}
                        onChange={(e) => handleInputChange("planDesparasitacionObservaciones", e.target.value)}
                      />
                    </Grid>
                  </>
                )}

                {/* Protocolo de vigilancia */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Protocolo de vigilancia del estado sanitario de los animales
                  </Typography>
                  <RadioGroup
                    row
                    value={formData.protocoloVigilancia}
                    onChange={(e) => handleInputChange("protocoloVigilancia", e.target.value)}
                  >
                    <FormControlLabel value="si" control={<Radio />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </Grid>

                {formData.protocoloVigilancia === "si" && (
                  <>
                    <Grid item xs={12}>
                      <Button variant="outlined" component="label" startIcon={<AttachFile />} sx={buttonStyles.primary}>
                        Subir archivo
                        <input
                          type="file"
                          hidden
                          onChange={(e) => handleFileChange("protocoloVigilanciaArchivo", e.target.files?.[0] || null)}
                        />
                      </Button>
                      {formData.protocoloVigilanciaArchivo && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                          <Typography variant="body2">{formData.protocoloVigilanciaArchivo.name}</Typography>
                          <IconButton size="small" onClick={() => handleRemoveFile("protocoloVigilanciaArchivo")}>
                            <Close fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Observaciones"
                        variant="filled"
                        multiline
                        rows={2}
                        value={formData.protocoloVigilanciaObservaciones}
                        onChange={(e) => handleInputChange("protocoloVigilanciaObservaciones", e.target.value)}
                      />
                    </Grid>
                  </>
                )}

                {/* Programa de muestreo */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Programa de muestreo rutinario frente a las enfermedades (ADS)
                  </Typography>
                  <RadioGroup
                    row
                    value={formData.programaMuestreo}
                    onChange={(e) => handleInputChange("programaMuestreo", e.target.value)}
                  >
                    <FormControlLabel value="si" control={<Radio />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </Grid>

                {formData.programaMuestreo === "si" && (
                  <>
                    <Grid item xs={12}>
                      <Button variant="outlined" component="label" startIcon={<AttachFile />} sx={buttonStyles.primary}>
                        Subir archivo
                        <input
                          type="file"
                          hidden
                          onChange={(e) => handleFileChange("programaMuestreoArchivo", e.target.files?.[0] || null)}
                        />
                      </Button>
                      {formData.programaMuestreoArchivo && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                          <Typography variant="body2">{formData.programaMuestreoArchivo.name}</Typography>
                          <IconButton size="small" onClick={() => handleRemoveFile("programaMuestreoArchivo")}>
                            <Close fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Observaciones"
                        variant="filled"
                        multiline
                        rows={2}
                        value={formData.programaMuestreoObservaciones}
                        onChange={(e) => handleInputChange("programaMuestreoObservaciones", e.target.value)}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </form>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCancelar} variant="outlined" sx={buttonStyles.primary}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained" sx={buttonStyles.primary}>
              {modoEdicion ? "Actualizar" : "Registrar"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}