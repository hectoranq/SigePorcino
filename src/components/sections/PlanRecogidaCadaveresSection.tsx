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
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"
import { Add, KeyboardArrowDown, Delete } from "@mui/icons-material"
import { listStaff, type Staff } from "../../action/PersonalRegisterPocket"
import useUserStore from "../../_store/user"
import useFarmFormStore from "../../_store/farm"
import {
  createPlanRecogidaCadaveres,
  updatePlanRecogidaCadaveres,
  deletePlanRecogidaCadaveres,
  getPlanRecogidaCadaveresByFarmId,
  type PlanRecogidaCadaveres as PlanRecogidaCadaveresAPI,
} from "../../action/PlanRecogidaCadaveresPocket"


interface PlanRecogidaCadaveres {
  id?: string
  sistemaRecogidaCadaveres: string
  gestorAutorizadoCadaveres: string
  ubicacionContenedoresCadaveres: string
  sistemaRecogidaSandach: string
  gestorAutorizadoSandach: string
  ubicacionContenedoresSandach: string
}

export function PlanRecogidaCadaveresSection() {
  const { token, record } = useUserStore()
  const { currentFarm } = useFarmFormStore()

  const [staffList, setStaffList] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null)

  // Snackbar states
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error" | "info" | "warning"
  }>({ open: false, message: "", severity: "success" })

  const [registros, setRegistros] = useState<PlanRecogidaCadaveres[]>([])

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

  // Cargar lista de personal y planes al montar el componente
  useEffect(() => {
    loadStaffList()
    loadPlanes()
  }, [currentFarm, token, record])

  const loadStaffList = async () => {
    if (!currentFarm || !record?.id || !token) {
      console.log("⚠️ No hay farmId o usuario disponible")
      return
    }

    setLoading(true)
    try {
      const result = await listStaff(token, record.id, currentFarm.id)
      if (result.success && result.data) {
        setStaffList(result.data.items as Staff[])
        console.log("✅ Personal cargado:", result.data.items.length)
      }
    } catch (error) {
      console.error("❌ Error al cargar personal:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadPlanes = async () => {
    if (!currentFarm || !record?.id || !token) {
      console.log("⚠️ No hay farmId o usuario disponible")
      return
    }

    setLoading(true)
    try {
      const result = await getPlanRecogidaCadaveresByFarmId(token, record.id, currentFarm.id)
      if (result && result.length > 0) {
        const convertedPlans = result.map(convertAPItoLocal)
        setRegistros(convertedPlans)
        console.log("✅ Planes de recogida de cadáveres cargados:", result.length)
      } else {
        setRegistros([])
        console.log("ℹ️ No hay planes de recogida de cadáveres para esta granja")
      }
    } catch (error) {
      console.error("❌ Error al cargar planes de recogida de cadáveres:", error)
      setSnackbar({
        open: true,
        message: "Error al cargar los planes de recogida de cadáveres",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // Convertir de formato API (snake_case) a formato local (camelCase)
  const convertAPItoLocal = (apiData: PlanRecogidaCadaveresAPI): PlanRecogidaCadaveres => {
    return {
      id: apiData.id,
      sistemaRecogidaCadaveres: apiData.sistema_recogida_cadaveres || "",
      gestorAutorizadoCadaveres: apiData.gestor_autorizado_cadaveres || "",
      ubicacionContenedoresCadaveres: apiData.ubicacion_contenedores_cadaveres || "",
      sistemaRecogidaSandach: apiData.sistema_recogida_sandach || "",
      gestorAutorizadoSandach: apiData.gestor_autorizado_sandach || "",
      ubicacionContenedoresSandach: apiData.ubicacion_contenedores_sandach || "",
    }
  }

  // Convertir de formato local (camelCase) a formato API (snake_case)
  const convertLocalToAPI = (localData: PlanRecogidaCadaveres) => {
    return {
      sistema_recogida_cadaveres: localData.sistemaRecogidaCadaveres,
      gestor_autorizado_cadaveres: localData.gestorAutorizadoCadaveres,
      ubicacion_contenedores_cadaveres: localData.ubicacionContenedoresCadaveres,
      sistema_recogida_sandach: localData.sistemaRecogidaSandach,
      gestor_autorizado_sandach: localData.gestorAutorizadoSandach,
      ubicacion_contenedores_sandach: localData.ubicacionContenedoresSandach,
      farm: currentFarm!.id!,
    }
  }

  const loadPlanToForm = (plan: PlanRecogidaCadaveres) => {
    setFormData({
      sistemaRecogidaCadaveres: plan.sistemaRecogidaCadaveres,
      gestorAutorizadoCadaveres: plan.gestorAutorizadoCadaveres,
      ubicacionContenedoresCadaveres: plan.ubicacionContenedoresCadaveres,
      sistemaRecogidaSandach: plan.sistemaRecogidaSandach,
      gestorAutorizadoSandach: plan.gestorAutorizadoSandach,
      ubicacionContenedoresSandach: plan.ubicacionContenedoresSandach,
    })
    if (plan.id) {
      setCurrentPlanId(plan.id)
    }
    setOpen(true)
  }

  const getStaffNameById = (id: string) => {
    const staff = staffList.find((s) => s.id === id)
    return staff ? `${staff.nombre} ${staff.apellidos}` : id
  }

  const handleAgregarNuevo = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setCurrentPlanId(null)
    setFormData({
      sistemaRecogidaCadaveres: "",
      gestorAutorizadoCadaveres: "",
      ubicacionContenedoresCadaveres: "",
      sistemaRecogidaSandach: "",
      gestorAutorizadoSandach: "",
      ubicacionContenedoresSandach: "",
    })
  }

  const handleInputChange = (field: keyof PlanRecogidaCadaveres, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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
        await updatePlanRecogidaCadaveres(token, currentPlanId, record.id, apiData)
        setSnackbar({
          open: true,
          message: "Plan de recogida de cadáveres actualizado exitosamente",
          severity: "success",
        })
      } else {
        // Crear nuevo plan
        await createPlanRecogidaCadaveres(token, record.id, apiData)
        setSnackbar({
          open: true,
          message: "Plan de recogida de cadáveres creado exitosamente",
          severity: "success",
        })
      }

      // Recargar la lista de planes
      await loadPlanes()
      handleClose()
    } catch (error: any) {
      console.error("❌ Error al guardar plan de recogida de cadáveres:", error)
      setSnackbar({
        open: true,
        message: error?.message || "Error al guardar el plan de recogida de cadáveres",
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
      await deletePlanRecogidaCadaveres(token, plan.id, record.id)
      setSnackbar({
        open: true,
        message: "Plan de recogida de cadáveres eliminado exitosamente",
        severity: "success",
      })
      await loadPlanes()
    } catch (error: any) {
      console.error("❌ Error al eliminar plan de recogida de cadáveres:", error)
      setSnackbar({
        open: true,
        message: error?.message || "Error al eliminar el plan de recogida de cadáveres",
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
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
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
                      {getStaffNameById(registro.gestorAutorizadoCadaveres)}
                    </TableCell>
                    <TableCell sx={{ color: "text.primary" }}>
                      {registro.sistemaRecogidaSandach.substring(0, 40)}...
                    </TableCell>
                    <TableCell sx={{ color: "text.primary" }}>
                      {getStaffNameById(registro.gestorAutorizadoSandach)}
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
            )}
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
                    {getStaffNameById(selectedRegistro.gestorAutorizadoCadaveres)}
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
                    {getStaffNameById(selectedRegistro.gestorAutorizadoSandach)}
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
            {currentPlanId ? "Editar" : "Agregar"} Plan de Recogida de Cadáveres
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
                    {loading ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} />
                      </MenuItem>
                    ) : staffList.length > 0 ? (
                      staffList.map((staff) => (
                        <MenuItem key={staff.id} value={staff.id}>
                          {staff.nombre} {staff.apellidos}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        <em>No hay personal disponible</em>
                      </MenuItem>
                    )}
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
                    {loading ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} />
                      </MenuItem>
                    ) : staffList.length > 0 ? (
                      staffList.map((staff) => (
                        <MenuItem key={staff.id} value={staff.id}>
                          {staff.nombre} {staff.apellidos}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        <em>No hay personal disponible</em>
                      </MenuItem>
                    )}
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
            <Button onClick={handleCancelar} variant="outlined" color="inherit" disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary" disabled={saving}>
              {saving ? <CircularProgress size={24} /> : (currentPlanId ? "Actualizar" : "Registrar")}
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