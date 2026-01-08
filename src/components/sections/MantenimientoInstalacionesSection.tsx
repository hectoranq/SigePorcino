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
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"
import { Add, KeyboardArrowDown, Delete } from "@mui/icons-material"
import { listStaff, getStaffMember, type Staff } from "../../action/PersonalRegisterPocket"
import  useUserStore  from "../../_store/user"
import  useFarmFormStore  from "../../_store/farm"
import {
  createMantenimientoInstalacion,
  updateMantenimientoInstalacion,
  deleteMantenimientoInstalacion,
  getMantenimientoInstalacionByFarmId,
  type MantenimientoInstalacion as MantenimientoInstalacionAPI,
} from "../../action/MantenimientoInstalacionesPocket"

interface MantenimientoInstalacion {
  id?: string
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
  const { token, record } = useUserStore()
  const { currentFarm } = useFarmFormStore()

  const [staffList, setStaffList] = useState<Staff[]>([])
  const [staffNames, setStaffNames] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [registros, setRegistros] = useState<MantenimientoInstalacion[]>([])
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null)

  // Snackbar states
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error" | "info" | "warning"
  }>({ open: false, message: "", severity: "success" })

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

  // Cargar lista de personal y planes al montar el componente
  useEffect(() => {
    loadStaffList()
    loadMantenimientoPlans()
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

  const loadMantenimientoPlans = async () => {
    if (!currentFarm || !record?.id || !token) {
      console.log("⚠️ No hay farmId o usuario disponible")
      return
    }

    setLoading(true)
    try {
      const result = await getMantenimientoInstalacionByFarmId(token, record.id, currentFarm.id)
      if (result && result.length > 0) {
        const convertedPlans = result.map(convertAPItoLocal)
        setRegistros(convertedPlans)
        console.log("✅ Planes de mantenimiento cargados:", result.length)
        
        // Cargar nombres del personal para todos los IDs únicos
        await loadStaffNames(convertedPlans)
      } else {
        setRegistros([])
        console.log("ℹ️ No hay planes de mantenimiento para esta granja")
      }
    } catch (error) {
      console.error("❌ Error al cargar planes de mantenimiento:", error)
      setSnackbar({
        open: true,
        message: "Error al cargar los planes de mantenimiento",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadStaffNames = async (plans: MantenimientoInstalacion[]) => {
    if (!token || !record?.id) return

    // Recopilar todos los IDs únicos de personal de todos los planes
    const allStaffIds = new Set<string>()
    plans.forEach(plan => {
      plan.personalEncargado.forEach(id => allStaffIds.add(id))
      plan.trabajadores.forEach(id => allStaffIds.add(id))
      plan.gestoresAutorizados.forEach(id => allStaffIds.add(id))
    })

    // Cargar los nombres para cada ID
    const namesMap: Record<string, string> = {}
    await Promise.all(
      Array.from(allStaffIds).map(async (staffId) => {
        try {
          const result = await getStaffMember(token, staffId, record.id)
          if (result.success && result.data) {
            namesMap[staffId] = `${result.data.nombre} ${result.data.apellidos}`
          }
        } catch (error) {
          console.error(`❌ Error al cargar personal ${staffId}:`, error)
          namesMap[staffId] = staffId // Fallback al ID si falla
        }
      })
    )

    setStaffNames(namesMap)
  }

  // Convertir de formato API (snake_case) a formato local (camelCase)
  const convertAPItoLocal = (apiData: MantenimientoInstalacionAPI): MantenimientoInstalacion => {
    return {
      id: apiData.id,
      personalEncargado: apiData.personal_encargado || [],
      trabajadores: apiData.trabajadores || [],
      gestoresAutorizados: apiData.gestores_autorizados || [],
      procedimientoRevision: apiData.procedimiento_revision || "",
      frecuenciaRevision: apiData.frecuencia_revision || "",
      proveedoresServicios: apiData.proveedores_servicios || "",
      regasAplicables: apiData.regas_aplicables || [],
      fechaRegistro: apiData.fecha_registro || "",
    }
  }

  // Convertir de formato local (camelCase) a formato API (snake_case)
  const convertLocalToAPI = (localData: MantenimientoInstalacion) => {
    return {
      personal_encargado: localData.personalEncargado,
      trabajadores: localData.trabajadores,
      gestores_autorizados: localData.gestoresAutorizados,
      procedimiento_revision: localData.procedimientoRevision,
      frecuencia_revision: localData.frecuenciaRevision,
      proveedores_servicios: localData.proveedoresServicios,
      regas_aplicables: localData.regasAplicables,
      fecha_registro: localData.fechaRegistro,
      farm: currentFarm!.id!,
    }
  }

  const loadPlanToForm = (plan: MantenimientoInstalacion) => {
    setFormData(plan)
    if (plan.id) {
      setCurrentPlanId(plan.id)
    }
    setOpen(true)
  }

  const handleAgregarNuevo = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setCurrentPlanId(null)
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
        await updateMantenimientoInstalacion(token, currentPlanId, record.id, apiData)
        setSnackbar({
          open: true,
          message: "Plan de mantenimiento actualizado exitosamente",
          severity: "success",
        })
      } else {
        // Crear nuevo plan
        await createMantenimientoInstalacion(token, record.id, apiData)
        setSnackbar({
          open: true,
          message: "Plan de mantenimiento creado exitosamente",
          severity: "success",
        })
      }

      // Recargar la lista de planes
      await loadMantenimientoPlans()
      handleClose()
    } catch (error: any) {
      console.error("❌ Error al guardar plan de mantenimiento:", error)
      setSnackbar({
        open: true,
        message: error?.message || "Error al guardar el plan de mantenimiento",
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
    console.log("Editar registro:", plan)
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
      await deleteMantenimientoInstalacion(token, plan.id, record.id)
      setSnackbar({
        open: true,
        message: "Plan de mantenimiento eliminado exitosamente",
        severity: "success",
      })
      await loadMantenimientoPlans()
    } catch (error: any) {
      console.error("❌ Error al eliminar plan de mantenimiento:", error)
      setSnackbar({
        open: true,
        message: error?.message || "Error al eliminar el plan de mantenimiento",
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

  const getPersonNameById = (id: string) => {
    return staffNames[id] || id
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
                      {registro.personalEncargado.map(id => getPersonNameById(id)).join(", ")}
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
            )}
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
                    {selectedRegistro.personalEncargado.map((id) => getPersonNameById(id)).join(", ")}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Lista de Trabajadores
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRegistro.trabajadores.map((id) => getPersonNameById(id)).join(", ")}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Gestores Autorizados
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRegistro.gestoresAutorizados.map((id) => getPersonNameById(id)).join(", ")}
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
            {currentPlanId ? "Editar" : "Agregar"} Plan de Mantenimiento de Instalaciones
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
                    {loading ? (
                      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : staffList.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                        No hay personal registrado
                      </Typography>
                    ) : (
                      staffList.map((person) => (
                        <FormControlLabel
                          key={person.id}
                          control={
                            <Checkbox
                              checked={formData.personalEncargado.includes(person.id!)}
                              onChange={(e) => handlePersonnelChange("personalEncargado", person.id!, e.target.checked)}
                            />
                          }
                          label={`${person.nombre} ${person.apellidos}`}
                        />
                      ))
                    )}
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
                    {loading ? (
                      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : staffList.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                        No hay personal registrado
                      </Typography>
                    ) : (
                      staffList.map((person) => (
                        <FormControlLabel
                          key={person.id}
                          control={
                            <Checkbox
                              checked={formData.trabajadores.includes(person.id!)}
                              onChange={(e) => handlePersonnelChange("trabajadores", person.id!, e.target.checked)}
                            />
                          }
                          label={`${person.nombre} ${person.apellidos}`}
                        />
                      ))
                    )}
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
                    {loading ? (
                      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : staffList.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                        No hay personal registrado
                      </Typography>
                    ) : (
                      staffList.map((person) => (
                        <FormControlLabel
                          key={person.id}
                          control={
                            <Checkbox
                              checked={formData.gestoresAutorizados.includes(person.id!)}
                              onChange={(e) => handlePersonnelChange("gestoresAutorizados", person.id!, e.target.checked)}
                            />
                          }
                          label={`${person.nombre} ${person.apellidos}`}
                        />
                      ))
                    )}
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
                    {currentFarm?.REGA && currentFarm.REGA.trim() ? (
                      currentFarm.REGA.split(',').map((rega) => {
                        const regaTrimmed = rega.trim();
                        return (
                          <FormControlLabel
                            key={regaTrimmed}
                            control={
                              <Checkbox
                                checked={formData.regasAplicables.includes(regaTrimmed)}
                                onChange={(e) => handleRegaChange(regaTrimmed, e.target.checked)}
                              />
                            }
                            label={regaTrimmed}
                          />
                        );
                      })
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                        No hay REGAs disponibles en esta granja
                      </Typography>
                    )}
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
            <Button onClick={handleCancelar} variant="outlined" color="inherit" disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary" disabled={saving}>
              {saving ? <CircularProgress size={24} /> : "Guardar"}
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