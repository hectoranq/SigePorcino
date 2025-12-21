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
} from "@mui/material"
import { Add, KeyboardArrowDown, Delete } from "@mui/icons-material"

type TipoPersona = "empresa" | "persona"

const POBLACIONES = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza"]
const PROVINCIAS = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza"]
const OPCIONES_IZQ = ["Propietario", "Arrendatario", "Gestor"]
const OPCIONES_DER = ["Transportista", "Veterinario", "Técnico especialista"]

export default function LinkedCompaniesManagersPage() {
  const [empresas, setEmpresas] = useState([
    {
      dni: "2566113",
      nombre: "Jose Antonio Capdevilla Torrejon",
      telefono: "75266312",
      fechaInicio: "12/07/2023",
      fechaFinalizacion: "12/07/2025",
    },
    {
      dni: "2566113",
      nombre: "Mario Antonio Alvarez Peredo",
      telefono: "60547811",
      fechaInicio: "30/05/2024",
      fechaFinalizacion: "31/12/2024",
    },
    {
      dni: "2566113",
      nombre: "Juana Adriana Obregon",
      telefono: "70142889",
      fechaInicio: "01/02/2023",
      fechaFinalizacion: "31/12/2024",
    },
  ])

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
  const [empresaToDelete, setEmpresaToDelete] = useState<number | null>(null)

  const handleAgregarNuevo = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Datos del formulario:", {
      tipoPersona,
      formData,
      poblacion,
      provincia,
      fechaInicio,
      fechaFin,
      checks,
      opcionesExtra,
    })

    // Agregar nueva empresa a la tabla
    const nuevaEmpresa = {
      dni: formData.dni,
      nombre: `${formData.nombre} ${formData.apellidos}`,
      telefono: formData.telefono,
      fechaInicio: formatDateToDisplay(fechaInicio),
      fechaFinalizacion: formatDateToDisplay(fechaFin),
    }

    setEmpresas(prev => [...prev, nuevaEmpresa])
    handleClose()
  }

  const handleCancelar = () => {
    handleClose()
  }

  const handleEditar = (index: number) => {
    console.log("Editar empresa:", empresas[index])
  }

  const handleVerMas = (index: number) => {
    console.log("Ver más de empresa:", empresas[index])
  }

  // Funciones para eliminar
  const handleEliminarClick = (index: number) => {
    setEmpresaToDelete(index)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    if (empresaToDelete !== null) {
      setEmpresas(prev => prev.filter((_, index) => index !== empresaToDelete))
      console.log("Empresa eliminada:", empresas[empresaToDelete])
    }
    setOpenDeleteDialog(false)
    setEmpresaToDelete(null)
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
                {empresas.map((empresa, index) => (
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
                      {empresa.dni}
                    </TableCell>
                    <TableCell sx={{ color: "text.primary" }}>
                      {empresa.nombre}
                    </TableCell>
                    <TableCell sx={{ color: "text.primary" }}>
                      {empresa.telefono}
                    </TableCell>
                    <TableCell sx={{ color: "text.primary" }}>
                      {empresa.fechaInicio}
                    </TableCell>
                    <TableCell sx={{ color: "text.primary" }}>
                      {empresa.fechaFinalizacion}
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
                        {/* BOTÓN ELIMINAR AGREGADO */}
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
              ¿Estás seguro de que deseas eliminar a{" "}
              <strong>{empresaToDelete !== null ? empresas[empresaToDelete]?.nombre : ""}</strong>?
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
      </Container>
    </Box>
  )
}
