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
import  useUserStore  from "../../_store/user"
import  useFarmFormStore  from "../../_store/farm"
import { listStaff, Staff } from "../../action/PersonalRegisterPocket"
import {
  createPlanGestionResiduos,
  updatePlanGestionResiduos,
  deletePlanGestionResiduos,
  getPlanGestionResiduosByFarmId,
  PlanGestionResiduos as APIPlanGestionResiduos,
} from "../../action/PlanGestionResiduosPocket"

const GESTORES = [
  { id: "1", name: "Gestor Residuos A" },
  { id: "2", name: "Gestor Residuos B" },
  { id: "3", name: "Gestor Residuos C" },
]

const PERIODICIDADES = ["Diaria", "Semanal", "Quincenal", "Mensual", "Trimestral", "Semestral", "Anual"]

interface GestionResiduos {
  id?: string
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
  const { token, record } = useUserStore()
  const { currentFarm } = useFarmFormStore()
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [loadingStaff, setLoadingStaff] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error" | "info" | "warning"
  }>({ open: false, message: "", severity: "info" })

  const [registros, setRegistros] = useState<GestionResiduos[]>([])

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

  useEffect(() => {
    const loadStaff = async () => {
      if (!token || !record?.id) return
      setLoadingStaff(true)
      try {
        const response = await listStaff(token, record.id)
        if (response.success && response.data) {
          setStaffList(response.data.items as Staff[])
        }
      } catch (error) {
        console.error("Error al cargar el personal:", error)
      } finally {
        setLoadingStaff(false)
      }
    }
    loadStaff()
  }, [token, record?.id])

  useEffect(() => {
    const loadPlanes = async () => {
      if (!token || !record?.id || !currentFarm?.id) return
      setLoading(true)
      try {
        const response = await getPlanGestionResiduosByFarmId(token, currentFarm.id, record.id)
        if (response.success && response.data) {
          const planesLocales = (response.data.items as APIPlanGestionResiduos[]).map(convertAPItoLocal)
          setRegistros(planesLocales)
        }
      } catch (error) {
        console.error("Error al cargar planes:", error)
        setSnackbar({
          open: true,
          message: "Error al cargar los planes de gestión de residuos",
          severity: "error",
        })
      } finally {
        setLoading(false)
      }
    }
    loadPlanes()
  }, [token, record?.id, currentFarm?.id])

  const getStaffNameById = (id: string) => {
    const staff = staffList.find((s) => s.id === id)
    return staff ? `${staff.nombre} ${staff.apellidos}` : id
  }

  // Convertir de API (snake_case) a local (camelCase)
  const convertAPItoLocal = (apiData: APIPlanGestionResiduos): GestionResiduos => {
    return {
      id: apiData.id,
      ubicacionMedicamentos: apiData.ubicacion_medicamentos,
      descripcionMedicamentos: apiData.descripcion_medicamentos,
      encargadoMedicamentos: apiData.encargado_medicamentos,
      gestorMedicamentos: apiData.gestor_medicamentos,
      protocoloMedicamentos: apiData.protocolo_medicamentos,
      periodicidadMedicamentos: apiData.periodicidad_medicamentos,
      ubicacionPiensos: apiData.ubicacion_piensos,
      descripcionPiensos: apiData.descripcion_piensos,
      encargadoPiensos: apiData.encargado_piensos,
      gestorPiensos: apiData.gestor_piensos,
      protocoloPiensos: apiData.protocolo_piensos,
      periodicidadPiensos: apiData.periodicidad_piensos,
      ubicacionMaterial: apiData.ubicacion_material,
      descripcionMaterial: apiData.descripcion_material,
      encargadoMaterial: apiData.encargado_material,
      gestorMaterial: apiData.gestor_material,
      protocoloMaterial: apiData.protocolo_material,
      periodicidadMaterial: apiData.periodicidad_material,
      ubicacionEnvases: apiData.ubicacion_envases,
      descripcionEnvases: apiData.descripcion_envases,
      encargadoEnvases: apiData.encargado_envases,
      gestorEnvases: apiData.gestor_envases,
      protocoloEnvases: apiData.protocolo_envases,
      periodicidadEnvases: apiData.periodicidad_envases,
    }
  }

  // Convertir de local (camelCase) a API (snake_case)
  const convertLocalToAPI = (localData: GestionResiduos) => {
    return {
      ubicacion_medicamentos: localData.ubicacionMedicamentos,
      descripcion_medicamentos: localData.descripcionMedicamentos,
      encargado_medicamentos: localData.encargadoMedicamentos,
      gestor_medicamentos: localData.gestorMedicamentos,
      protocolo_medicamentos: localData.protocoloMedicamentos,
      periodicidad_medicamentos: localData.periodicidadMedicamentos,
      ubicacion_piensos: localData.ubicacionPiensos,
      descripcion_piensos: localData.descripcionPiensos,
      encargado_piensos: localData.encargadoPiensos,
      gestor_piensos: localData.gestorPiensos,
      protocolo_piensos: localData.protocoloPiensos,
      periodicidad_piensos: localData.periodicidadPiensos,
      ubicacion_material: localData.ubicacionMaterial,
      descripcion_material: localData.descripcionMaterial,
      encargado_material: localData.encargadoMaterial,
      gestor_material: localData.gestorMaterial,
      protocolo_material: localData.protocoloMaterial,
      periodicidad_material: localData.periodicidadMaterial,
      ubicacion_envases: localData.ubicacionEnvases,
      descripcion_envases: localData.descripcionEnvases,
      encargado_envases: localData.encargadoEnvases,
      gestor_envases: localData.gestorEnvases,
      protocolo_envases: localData.protocoloEnvases,
      periodicidad_envases: localData.periodicidadEnvases,
      farm: currentFarm!.id,
      user: record!.id,
    }
  }

  const loadPlanToForm = (plan: GestionResiduos) => {
    setFormData({
      ubicacionMedicamentos: plan.ubicacionMedicamentos,
      descripcionMedicamentos: plan.descripcionMedicamentos,
      encargadoMedicamentos: plan.encargadoMedicamentos,
      gestorMedicamentos: plan.gestorMedicamentos,
      protocoloMedicamentos: plan.protocoloMedicamentos,
      periodicidadMedicamentos: plan.periodicidadMedicamentos,
      ubicacionPiensos: plan.ubicacionPiensos,
      descripcionPiensos: plan.descripcionPiensos,
      encargadoPiensos: plan.encargadoPiensos,
      gestorPiensos: plan.gestorPiensos,
      protocoloPiensos: plan.protocoloPiensos,
      periodicidadPiensos: plan.periodicidadPiensos,
      ubicacionMaterial: plan.ubicacionMaterial,
      descripcionMaterial: plan.descripcionMaterial,
      encargadoMaterial: plan.encargadoMaterial,
      gestorMaterial: plan.gestorMaterial,
      protocoloMaterial: plan.protocoloMaterial,
      periodicidadMaterial: plan.periodicidadMaterial,
      ubicacionEnvases: plan.ubicacionEnvases,
      descripcionEnvases: plan.descripcionEnvases,
      encargadoEnvases: plan.encargadoEnvases,
      gestorEnvases: plan.gestorEnvases,
      protocoloEnvases: plan.protocoloEnvases,
      periodicidadEnvases: plan.periodicidadEnvases,
    })
    setCurrentPlanId(plan.id || null)
  }

  const handleAgregarNuevo = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setCurrentPlanId(null)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token || !record?.id || !currentFarm?.id) {
      setSnackbar({
        open: true,
        message: "Faltan datos de autenticación o granja",
        severity: "error",
      })
      return
    }

    setSaving(true)
    try {
      const apiData = convertLocalToAPI(formData)

      if (currentPlanId) {
        // Actualizar plan existente
        const response = await updatePlanGestionResiduos(token, currentPlanId, apiData, record.id)
        if (response.success) {
          const planActualizado = convertAPItoLocal(response.data as APIPlanGestionResiduos)
          setRegistros((prev) => prev.map((p) => (p.id === currentPlanId ? planActualizado : p)))
          setSnackbar({
            open: true,
            message: "Plan de gestión de residuos actualizado exitosamente",
            severity: "success",
          })
        }
      } else {
        // Crear nuevo plan
        const response = await createPlanGestionResiduos(token, apiData)
        if (response.success) {
          const nuevoPlan = convertAPItoLocal(response.data as APIPlanGestionResiduos)
          setRegistros((prev) => [...prev, nuevoPlan])
          setSnackbar({
            open: true,
            message: "Plan de gestión de residuos registrado exitosamente",
            severity: "success",
          })
        }
      }
      handleClose()
    } catch (error: any) {
      console.error("Error al guardar plan:", error)
      setSnackbar({
        open: true,
        message: error?.message || "Error al guardar el plan de gestión de residuos",
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

  const handleConfirmDelete = async () => {
    if (registroToDelete === null) return

    const plan = registros[registroToDelete]
    if (!plan.id || !token || !record?.id) {
      setSnackbar({
        open: true,
        message: "No se puede eliminar este registro",
        severity: "error",
      })
      setOpenDeleteDialog(false)
      setRegistroToDelete(null)
      return
    }

    try {
      const response = await deletePlanGestionResiduos(token, plan.id, record.id)
      if (response.success) {
        setRegistros((prev) => prev.filter((_, index) => index !== registroToDelete))
        setSnackbar({
          open: true,
          message: "Plan de gestión de residuos eliminado exitosamente",
          severity: "success",
        })
      }
    } catch (error: any) {
      console.error("Error al eliminar plan:", error)
      setSnackbar({
        open: true,
        message: error?.message || "Error al eliminar el plan",
        severity: "error",
      })
    } finally {
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
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
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
          )}
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
                  <Typography variant="body1">{getStaffNameById(selectedRegistro.encargadoMedicamentos)}</Typography>
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
                  <Typography variant="body1">{getStaffNameById(selectedRegistro.encargadoPiensos)}</Typography>
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
                  <Typography variant="body1">{getStaffNameById(selectedRegistro.encargadoMaterial)}</Typography>
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
                  <Typography variant="body1">{getStaffNameById(selectedRegistro.encargadoEnvases)}</Typography>
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
            {currentPlanId ? "Editar" : "Agregar"} Plan de Gestión de Residuos
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
                    disabled={loadingStaff}
                  >
                    <MenuItem value="">
                      <em>{loadingStaff ? "Cargando..." : "Seleccionar encargado"}</em>
                    </MenuItem>
                    {staffList.map((staff) => (
                      <MenuItem key={staff.id} value={staff.id}>
                        {staff.nombre} {staff.apellidos}
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
                    disabled={loadingStaff}
                  >
                    <MenuItem value="">
                      <em>{loadingStaff ? "Cargando..." : "Seleccionar encargado"}</em>
                    </MenuItem>
                    {staffList.map((staff) => (
                      <MenuItem key={staff.id} value={staff.id}>
                        {staff.nombre} {staff.apellidos}
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
                    disabled={loadingStaff}
                  >
                    <MenuItem value="">
                      <em>{loadingStaff ? "Cargando..." : "Seleccionar encargado"}</em>
                    </MenuItem>
                    {staffList.map((staff) => (
                      <MenuItem key={staff.id} value={staff.id}>
                        {staff.nombre} {staff.apellidos}
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
                    disabled={loadingStaff}
                  >
                    <MenuItem value="">
                      <em>{loadingStaff ? "Cargando..." : "Seleccionar encargado"}</em>
                    </MenuItem>
                    {staffList.map((staff) => (
                      <MenuItem key={staff.id} value={staff.id}>
                        {staff.nombre} {staff.apellidos}
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
            <Button onClick={handleCancelar} variant="outlined" color="inherit" disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary" disabled={saving}>
              {saving ? <CircularProgress size={24} /> : currentPlanId ? "Actualizar" : "Registrar"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  )
}