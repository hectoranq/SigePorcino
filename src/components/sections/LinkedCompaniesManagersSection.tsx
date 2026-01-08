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
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  FormGroup,
  Checkbox,
  Divider,
  DialogTitle,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material"
import { Add, KeyboardArrowDown, Delete } from "@mui/icons-material"
import {
  listLinkedCompaniesManagers,
  createLinkedCompanyManager,
  updateLinkedCompanyManager,
  deleteLinkedCompanyManager,
  LinkedCompanyManager,
} from "../../action/LinkedCompaniesManagerPocket"

type TipoPersona = "empresa" | "persona"

const POBLACIONES = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza"]
const PROVINCIAS = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza"]
const OPCIONES_IZQ = ["Propietario", "Arrendatario", "Gestor"]
const OPCIONES_DER = ["Transportista", "Veterinario", "Técnico especialista"]

interface LinkedCompaniesManagersPageProps {
  token: string;
  userId: string;
  farmId?: string;
}

export default function LinkedCompaniesManagersPage({ token, userId, farmId }: LinkedCompaniesManagersPageProps) {
  const [empresas, setEmpresas] = useState<LinkedCompanyManager[]>([])
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })

  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [tipoPersona, setTipoPersona] = useState<TipoPersona>("empresa")
  const [poblacion, setPoblacion] = useState("")
  const [provincia, setProvincia] = useState("")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [checks, setChecks] = useState<{ [key: string]: boolean }>({})
  const [nuevaOpcion, setNuevaOpcion] = useState("")
  const [opcionesExtra, setOpcionesExtra] = useState<string[]>([])
  const [formData, setFormData] = useState({
    dni: "",
    nombre: "",
    apellidos: "",
    direccion: "",
    telefono: "",
    email: "",
  })

  // Estados para el diálogo de confirmación de eliminación
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [empresaToDelete, setEmpresaToDelete] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Cargar empresas vinculadas al montar el componente
  useEffect(() => {
    loadEmpresas()
  }, [token, userId, farmId])

  const loadEmpresas = async () => {
    if (!token || !userId) {
      console.error("❌ Token o userId no disponibles")
      return
    }

    setLoading(true)
    try {
      const response = await listLinkedCompaniesManagers(token, userId, farmId)
      if (response.success) {
        setEmpresas(response.data.items as LinkedCompanyManager[] || [])
        console.log("✅ Empresas vinculadas cargadas:", response.data.items.length)
      }
    } catch (error: any) {
      console.error("❌ Error al cargar empresas:", error)
      setSnackbar({
        open: true,
        message: error.message || "Error al cargar empresas vinculadas",
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
    setTipoPersona("empresa")
    setPoblacion("")
    setProvincia("")
    setFechaInicio("")
    setFechaFin("")
    setChecks({})
    setNuevaOpcion("")
    setOpcionesExtra([])
    setFormData({
      dni: "",
      nombre: "",
      apellidos: "",
      direccion: "",
      telefono: "",
      email: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCheck = (option: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecks(prev => ({ ...prev, [option]: event.target.checked }))
  }

  const handleAddOpcion = () => {
    if (nuevaOpcion.trim()) {
      setOpcionesExtra(prev => [...prev, nuevaOpcion.trim()])
      setNuevaOpcion("")
    }
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

    // Recolectar tipos de vinculación seleccionados
    const tiposVinculacion = Object.keys(checks).filter(key => checks[key])

    const data = {
      tipo_persona: tipoPersona,
      dni_cif: formData.dni,
      nombre: formData.nombre,
      apellidos: formData.apellidos || "",
      direccion: formData.direccion,
      poblacion,
      provincia,
      telefono: formData.telefono,
      email: formData.email,
      fecha_inicio: fechaInicio,
      fecha_finalizacion: fechaFin,
      tipo_vinculacion: tiposVinculacion,
      farm: farmId,
      user: userId,
    }

    setLoading(true)
    try {
      if (editingId) {
        // Actualizar empresa existente
        const response = await updateLinkedCompanyManager(token, editingId, data, userId)
        if (response.success) {
          setSnackbar({
            open: true,
            message: "Empresa actualizada exitosamente",
            severity: "success",
          })
          await loadEmpresas()
          handleClose()
        }
      } else {
        // Crear nueva empresa
        const response = await createLinkedCompanyManager(token, data)
        if (response.success) {
          setSnackbar({
            open: true,
            message: "Empresa registrada exitosamente",
            severity: "success",
          })
          await loadEmpresas()
          handleClose()
        }
      }
    } catch (error: any) {
      console.error("❌ Error al guardar empresa:", error)
      setSnackbar({
        open: true,
        message: error.message || "Error al guardar la empresa",
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
    const empresa = empresas.find(e => e.id === id)
    if (!empresa) return

    console.log("Editar empresa:", empresa)
    
    // Cargar datos en el formulario
    setEditingId(id)
    setTipoPersona(empresa.tipo_persona)
    setFormData({
      dni: empresa.dni_cif,
      nombre: empresa.nombre,
      apellidos: empresa.apellidos || "",
      direccion: empresa.direccion,
      telefono: empresa.telefono,
      email: empresa.email,
    })
    setPoblacion(empresa.poblacion)
    setProvincia(empresa.provincia)
    setFechaInicio(empresa.fecha_inicio)
    setFechaFin(empresa.fecha_finalizacion)
    
    // Cargar checkboxes de tipo_vinculacion
    const checksObj: { [key: string]: boolean } = {}
    empresa.tipo_vinculacion.forEach(tipo => {
      checksObj[tipo] = true
    })
    setChecks(checksObj)
    
    setOpen(true)
  }

  const handleVerMas = (id: string) => {
    const empresa = empresas.find(e => e.id === id)
    console.log("Ver más de empresa:", empresa)
    // TODO: Implementar modal de detalles si se requiere
  }

  // Funciones para eliminar
  const handleEliminarClick = (id: string) => {
    setEmpresaToDelete(id)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!empresaToDelete || !token || !userId) return

    setLoading(true)
    try {
      const response = await deleteLinkedCompanyManager(token, empresaToDelete, userId)
      if (response.success) {
        setSnackbar({
          open: true,
          message: "Empresa eliminada exitosamente",
          severity: "success",
        })
        await loadEmpresas()
      }
    } catch (error: any) {
      console.error("❌ Error al eliminar empresa:", error)
      setSnackbar({
        open: true,
        message: error.message || "Error al eliminar la empresa",
        severity: "error",
      })
    } finally {
      setLoading(false)
      setOpenDeleteDialog(false)
      setEmpresaToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false)
    setEmpresaToDelete(null)
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
                Empresas vinculadas y gestores autorizados
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
                      DNI/CIF
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>
                      Nombre
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>
                      Teléfono
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>
                      Fecha de inicio
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    <TableSortLabel IconComponent={KeyboardArrowDown}>
                      Fecha de finalización
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
                {loading && empresas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={40} />
                      <Typography sx={{ mt: 2 }}>Cargando empresas vinculadas...</Typography>
                    </TableCell>
                  </TableRow>
                ) : empresas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No hay empresas vinculadas registradas
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  empresas.map((empresa) => (
                    <TableRow
                      key={empresa.id}
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
                        {empresa.dni_cif}
                      </TableCell>
                      <TableCell sx={{ color: "text.primary" }}>
                        {empresa.nombre} {empresa.apellidos}
                      </TableCell>
                      <TableCell sx={{ color: "text.primary" }}>
                        {empresa.telefono}
                      </TableCell>
                      <TableCell sx={{ color: "text.primary" }}>
                        {formatDateToDisplay(empresa.fecha_inicio)}
                      </TableCell>
                      <TableCell sx={{ color: "text.primary" }}>
                        {formatDateToDisplay(empresa.fecha_finalizacion)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleEditar(empresa.id!)}
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
                            onClick={() => handleVerMas(empresa.id!)}
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
                            onClick={() => handleEliminarClick(empresa.id!)}
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
              ¿Estás seguro de que deseas eliminar a{" "}
              <strong>
                {empresaToDelete
                  ? empresas.find(e => e.id === empresaToDelete)?.nombre
                  : ""}
              </strong>?
              Esta acción no se puede deshacer.
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

        {/* Dialog/Popup de registro - mantener igual */}
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Registro de empresas vinculadas y gestores autorizados
              </Typography>

              <Box component="form" id="form-registro" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2}>
                  {/* Identificación */}
                  <Grid item xs={12}>
                    <FormControl>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Se identifica como:
                      </Typography>
                      <RadioGroup
                        row
                        value={tipoPersona}
                        onChange={(_, v) => setTipoPersona(v as TipoPersona)}
                      >
                        <FormControlLabel value="empresa" control={<Radio />} label="Empresa" />
                        <FormControlLabel value="persona" control={<Radio />} label="Persona física" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {/* DNI */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="dni"
                      label="DNI"
                      fullWidth
                      value={formData.dni}
                      onChange={(e) => handleInputChange("dni", e.target.value)}
                    />
                  </Grid>

                  {/* Nombre / Apellidos */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="nombre"
                      label="Nombre"
                      fullWidth
                      value={formData.nombre}
                      onChange={(e) => handleInputChange("nombre", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="apellidos"
                      label="Apellidos"
                      fullWidth
                      value={formData.apellidos}
                      onChange={(e) => handleInputChange("apellidos", e.target.value)}
                    />
                  </Grid>

                  {/* Población / Provincia */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="Población"
                      value={poblacion}
                      onChange={(e) => setPoblacion(e.target.value)}
                      fullWidth
                    >
                      {POBLACIONES.map((p) => (
                        <MenuItem key={p} value={p}>
                          {p}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="Provincia"
                      value={provincia}
                      onChange={(e) => setProvincia(e.target.value)}
                      fullWidth
                    >
                      {PROVINCIAS.map((p) => (
                        <MenuItem key={p} value={p}>
                          {p}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Dirección */}
                  <Grid item xs={12}>
                    <TextField
                      name="direccion"
                      label="Dirección"
                      fullWidth
                      value={formData.direccion}
                      onChange={(e) => handleInputChange("direccion", e.target.value)}
                    />
                  </Grid>

                  {/* Teléfono / Email */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="telefono"
                      label="Teléfono"
                      fullWidth
                      value={formData.telefono}
                      onChange={(e) => handleInputChange("telefono", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="email"
                      label="Correo electrónico"
                      type="email"
                      fullWidth
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </Grid>

                  {/* Fechas */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Fecha de inicio"
                      type="date"
                      fullWidth
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Fecha de finalización"
                      type="date"
                      fullWidth
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  {/* Tipo de vinculación */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
                      Tipo de vinculación
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <FormGroup>
                          {OPCIONES_IZQ.map((opt) => (
                            <FormControlLabel
                              key={opt}
                              control={
                                <Checkbox
                                  checked={!!checks[opt]}
                                  onChange={handleCheck(opt)}
                                  name={opt}
                                />
                              }
                              label={opt}
                            />
                          ))}
                        </FormGroup>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormGroup>
                          {OPCIONES_DER.map((opt) => (
                            <FormControlLabel
                              key={opt}
                              control={
                                <Checkbox
                                  checked={!!checks[opt]}
                                  onChange={handleCheck(opt)}
                                  name={opt}
                                />
                              }
                              label={opt}
                            />
                          ))}

                          {/* Añadir otra opción */}
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                            <TextField
                              size="small"
                              placeholder="Añadir otra opción"
                              value={nuevaOpcion}
                              onChange={(e) => setNuevaOpcion(e.target.value)}
                              fullWidth
                            />
                            <Button variant="outlined" onClick={handleAddOpcion}>
                              Añadir
                            </Button>
                          </Box>

                          {/* Render de opciones extra */}
                          {opcionesExtra.length > 0 && (
                            <>
                              <Divider sx={{ my: 1 }} />
                              {opcionesExtra.map((opt) => (
                                <FormControlLabel
                                  key={opt}
                                  control={
                                    <Checkbox
                                      checked={!!checks[opt]}
                                      onChange={handleCheck(opt)}
                                      name={opt}
                                    />
                                  }
                                  label={opt}
                                />
                              ))}
                            </>
                          )}
                        </FormGroup>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Botones */}
                  <Grid item xs={12} md={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="inherit"
                      onClick={handleCancelar}
                      sx={{ height: 44 }}
                    >
                      Cancelar
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button fullWidth type="submit" variant="contained" sx={{ height: 44 }}>
                      Registrar
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </DialogContent>
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
