"use client"

import { useState, useEffect } from "react"
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
  Dialog,
  DialogContent,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"
import { Add, KeyboardArrowDown } from "@mui/icons-material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { buttonStyles, headerColors, headerAccentColors, sectionHeaderStyle, headerBarStyle } from "./buttonStyles"
import useUserStore from "../../_store/user"
import useFarmFormStore from "../../_store/farm"
import {
  listDescargaPiensoGranel,
  createDescargaPiensoGranel,
  updateDescargaPiensoGranel,
  deleteDescargaPiensoGranel,
  DescargaPiensoGranel as APIDescargaPiensoGranel,
} from "../../action/DescargaPiensoGranelPocket"

const theme = createTheme({
  palette: {
    primary: {
      main: "#0d9488", // teal-600
      light: "#f0fdfa", // teal-50
    },
    secondary: {
      main: "#22c55e", // green-500
    },
  },
})

interface DescargaPiensoGranelData {
  id?: string
  transportista: string
  matricula: string
  fechaFinalizacion: string
  tipoPienso: string
  nroSacos: string
  nroLote: string
  kg: string
  fechaCreacion: string
  fechaUltimaActualizacion: string
}

const TIPOS_PIENSO_GRANEL = [
  "Pienso Iniciador Lechones - Granel",
  "Pienso Crecimiento Fase I - Granel",
  "Pienso Crecimiento Fase II - Granel",
  "Pienso Acabado Premium - Granel",
  "Pienso Terminación - Granel",
  "Pienso Reproductoras - Granel",
  "Pienso Gestantes - Granel",
  "Pienso Lactación - Granel",
  "Concentrado Proteico - Granel",
  "Premezcla Vitamínica - Granel",
]

export function DescargaPiensoGranelSection() {
  // Stores
  const { token, record } = useUserStore()
  const { currentFarm } = useFarmFormStore()

  // Estados
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [currentRegistroId, setCurrentRegistroId] = useState<string | null>(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })

  // Estados para el popup
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    transportista: "",
    matricula: "",
    fechaFinalizacion: "",
    tipoPienso: "",
    nroSacos: "",
    nroLote: "",
    kg: "",
  })

  // Estado para la tabla de descarga de pienso a granel
  const [descargaPiensoGranelData, setDescargaPiensoGranelData] = useState<DescargaPiensoGranelData[]>([])

  // Función para convertir fecha ISO a YYYY-MM-DD
  const formatDateForInput = (isoDate: string): string => {
    if (!isoDate) return ""
    const dateOnly = isoDate.split("T")[0].split(" ")[0]
    return dateOnly
  }

  // Función para convertir datos de la API a formato local
  const convertAPItoLocal = (apiData: APIDescargaPiensoGranel): DescargaPiensoGranelData => {
    return {
      id: apiData.id,
      transportista: apiData.transportista,
      matricula: apiData.matricula,
      fechaFinalizacion: formatDateForInput(apiData.fecha_finalizacion),
      tipoPienso: apiData.tipo_pienso,
      nroSacos: String(apiData.nro_sacos),
      nroLote: apiData.nro_lote,
      kg: String(apiData.kg),
      fechaCreacion: formatDateToDisplay(apiData.created || ""),
      fechaUltimaActualizacion: formatDateToDisplay(apiData.updated || ""),
    }
  }

  // Función para convertir datos locales a formato API
  const convertLocalToAPI = (localData: typeof formData) => {
    return {
      transportista: localData.transportista,
      matricula: localData.matricula,
      fecha_finalizacion: localData.fechaFinalizacion,
      tipo_pienso: localData.tipoPienso,
      nro_sacos: parseFloat(localData.nroSacos) || 0,
      nro_lote: localData.nroLote,
      kg: parseFloat(localData.kg) || 0,
    }
  }

  // Cargar datos desde la API
  useEffect(() => {
    const loadData = async () => {
      if (!token || !record?.id || !currentFarm?.id) return

      setLoading(true)
      try {
        const response = await listDescargaPiensoGranel(token, record.id, currentFarm.id)
        if (response.success && response.data) {
          const localData = response.data.items.map(item => convertAPItoLocal(item as APIDescargaPiensoGranel))
          setDescargaPiensoGranelData(localData)
        }
      } catch (error: any) {
        console.error("Error al cargar descargas de pienso a granel:", error)
        setSnackbar({ open: true, message: error.message || "Error al cargar datos", severity: "error" })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [token, record?.id, currentFarm?.id])

  const handleOpen = () => {
    setCurrentRegistroId(null)
    setEditMode(false)
    setViewMode(false)
    setEditIndex(null)
    setOpen(true)
  }

  // Función para abrir en modo edición
  const handleEdit = (index: number) => {
    const item = descargaPiensoGranelData[index]
    
    setFormData({
      transportista: item.transportista,
      matricula: item.matricula,
      fechaFinalizacion: formatDateForInput(item.fechaFinalizacion),
      tipoPienso: item.tipoPienso,
      nroSacos: item.nroSacos,
      nroLote: item.nroLote,
      kg: item.kg,
    })
    
    setCurrentRegistroId(item.id || null)
    setEditMode(true)
    setViewMode(false)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para "Ver más"
  const handleVerMas = (index: number) => {
    const item = descargaPiensoGranelData[index]
    
    setFormData({
      transportista: item.transportista,
      matricula: item.matricula,
      fechaFinalizacion: formatDateForInput(item.fechaFinalizacion),
      tipoPienso: item.tipoPienso,
      nroSacos: item.nroSacos,
      nroLote: item.nroLote,
      kg: item.kg,
    })
    
    setCurrentRegistroId(item.id || null)
    setEditMode(false)
    setViewMode(true)
    setEditIndex(index)
    setOpen(true)
  }

  // Función para convertir fecha de YYYY-MM-DD a DD/MM/YYYY
  const formatDateToDisplay = (dateString: string) => {
    if (!dateString) return "Sin fecha"
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handleClose = () => {
    setOpen(false)
    setCurrentRegistroId(null)
    setEditMode(false)
    setViewMode(false)
    setEditIndex(null)
    setFormData({
      transportista: "",
      matricula: "",
      fechaFinalizacion: "",
      tipoPienso: "",
      nroSacos: "",
      nroLote: "",
      kg: "",
    })
  }

  const handleSubmit = async () => {
    // Validar que los campos requeridos estén llenos
    if (!formData.transportista || !formData.matricula || !formData.fechaFinalizacion || !formData.tipoPienso) {
      setSnackbar({ open: true, message: "Por favor, completa todos los campos requeridos", severity: "error" })
      return
    }

    if (!formData.nroLote || !formData.kg) {
      setSnackbar({ open: true, message: "Por favor, completa todos los campos numéricos", severity: "error" })
      return
    }

    if (!token || !record?.id || !currentFarm?.id) {
      setSnackbar({ open: true, message: "Error: No hay sesión activa", severity: "error" })
      return
    }

    setSaving(true)
    try {
      const apiData = convertLocalToAPI(formData)

      if (editMode && currentRegistroId) {
        // Actualizar elemento existente
        await updateDescargaPiensoGranel(
          token,
          currentRegistroId,
          apiData,
          record.id
        )
        setSnackbar({ open: true, message: "Descarga de pienso a granel actualizada exitosamente", severity: "success" })
      } else {
        // Crear nuevo elemento
        await createDescargaPiensoGranel(
          token,
          {
            ...apiData,
            farm: currentFarm.id,
            user: record.id,
          }
        )
        setSnackbar({ open: true, message: "Descarga de pienso a granel registrada exitosamente", severity: "success" })
      }

      // Recargar datos
      const response = await listDescargaPiensoGranel(token, record.id, currentFarm.id)
      if (response.success && response.data) {
        const localData = response.data.items.map(item => convertAPItoLocal(item as APIDescargaPiensoGranel))
        setDescargaPiensoGranelData(localData)
      }

      handleClose()
    } catch (error: any) {
      console.error("Error al guardar:", error)
      setSnackbar({ open: true, message: error.message || "Error al guardar", severity: "error" })
    } finally {
      setSaving(false)
    }
  }

  // Función para eliminar un registro
  const handleDelete = async () => {
    if (!currentRegistroId || !token || !record?.id) return

    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      return
    }

    setSaving(true)
    try {
      await deleteDescargaPiensoGranel(token, currentRegistroId, record.id)
      setSnackbar({ open: true, message: "Descarga de pienso a granel eliminada exitosamente", severity: "success" })

      // Recargar datos
      const response = await listDescargaPiensoGranel(token, record.id, currentFarm?.id)
      if (response.success && response.data) {
        const localData = response.data.items.map(item => convertAPItoLocal(item as APIDescargaPiensoGranel))
        setDescargaPiensoGranelData(localData)
      }

      handleClose()
    } catch (error: any) {
      console.error("Error al eliminar:", error)
      setSnackbar({ open: true, message: error.message || "Error al eliminar", severity: "error" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {/* Page Content */}
          <Box sx={{ flexGrow: 1, p: 3, bgcolor: "grey.50" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                <CircularProgress />
              </Box>
            ) : (
            <Paper elevation={1} sx={{ borderRadius: 2 }}>
              {/* Header */}
              <Box sx={sectionHeaderStyle}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={headerBarStyle} />
                  <Typography variant="h5" fontWeight={600}>
                    Descarga de pienso a granel
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  startIcon={<Add />} 
                  sx={buttonStyles.primary}
                  onClick={handleOpen}
                >
                  Agregar nuevo
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "grey.100" }}>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Transportista
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Matrícula
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Fecha finalización
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Tipo de pienso
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Nro sacos
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Nro lote
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Kg
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Acciones
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {descargaPiensoGranelData.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography variant="body2" sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap' 
                          }}>
                            {item.transportista}
                          </Typography>
                        </TableCell>
                        <TableCell>{item.matricula}</TableCell>
                        <TableCell>{formatDateToDisplay(item.fechaFinalizacion)}</TableCell>
                        <TableCell sx={{ maxWidth: 180 }}>
                          <Typography variant="body2" sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap' 
                          }}>
                            {item.tipoPienso}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {item.nroSacos === "0" ? (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              N/A (Granel)
                            </Typography>
                          ) : (
                            item.nroSacos
                          )}
                        </TableCell>
                        <TableCell>{item.nroLote}</TableCell>
                        <TableCell>{item.kg} kg</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              sx={buttonStyles.edit}
                              onClick={() => handleEdit(index)}
                            >
                              Editar
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              sx={buttonStyles.secondary}
                              onClick={() => handleVerMas(index)}
                            >
                              Ver más
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            )}
          </Box>
        </Box>

        {/* Dialog/Popup */}
        <Dialog 
          open={open} 
          onClose={handleClose} 
          maxWidth="lg" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            <ThemeProvider theme={theme}>
              <Box sx={{ minHeight: "auto", bgcolor: "#f9fafb", p: 3 }}>
                <Paper sx={{ maxWidth: 1200, mx: "auto", borderRadius: 2, overflow: "hidden" }}>
                  {/* Header dinámico según el modo */}
                  <Box sx={{ 
                    bgcolor: viewMode ? headerColors.view : editMode ? headerColors.edit : headerColors.create, 
                    px: 3, 
                    py: 2, 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 1 
                  }}>
                    <Box sx={{ 
                      width: 4, 
                      height: 24, 
                      bgcolor: viewMode ? headerAccentColors.view : editMode ? headerAccentColors.edit : headerAccentColors.create, 
                      borderRadius: 0.5 
                    }} />
                    <Typography variant="h6" sx={{ color: "white", fontWeight: 500 }}>
                      {viewMode ? "Detalle de descarga de pienso a granel" : editMode ? "Editar descarga de pienso a granel" : "Registro de descarga de pienso a granel"}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    {/* Transportista y Matrícula */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Transportista"
                          placeholder="Transportista"
                          variant="standard"
                          value={formData.transportista}
                          onChange={(e) => setFormData((prev) => ({ ...prev, transportista: e.target.value }))}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "text.primary",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Matrícula"
                          placeholder="Matrícula del vehículo cisterna"
                          variant="standard"
                          value={formData.matricula}
                          onChange={(e) => setFormData((prev) => ({ ...prev, matricula: e.target.value }))}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "text.primary",
                            },
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* Fecha de finalización y Tipo de pienso */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Fecha de finalización"
                          type={viewMode ? "text" : "date"}
                          variant="standard"
                          value={viewMode ? formatDateToDisplay(formData.fechaFinalizacion) : formData.fechaFinalizacion}
                          onChange={(e) => setFormData((prev) => ({ ...prev, fechaFinalizacion: e.target.value }))}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "text.primary",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          select={!viewMode}
                          label="Tipo de pienso a granel"
                          variant="standard"
                          value={formData.tipoPienso}
                          onChange={(e) => setFormData((prev) => ({ ...prev, tipoPienso: e.target.value }))}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "text.primary",
                            },
                          }}
                        >
                          {!viewMode && TIPOS_PIENSO_GRANEL.map((tipo) => (
                            <MenuItem key={tipo} value={tipo}>
                              {tipo}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>

                    {/* Número de sacos, Número de lote y Kg */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label="Número de sacos"
                          placeholder="Número de sacos (0 para granel)"
                          variant="standard"
                          type="number"
                          value={formData.nroSacos}
                          onChange={(e) => setFormData((prev) => ({ ...prev, nroSacos: e.target.value }))}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "text.primary",
                            },
                          }}
                          helperText={!viewMode ? "Generalmente 0 para entregas a granel" : ""}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label="Número de lote"
                          placeholder="Número de lote"
                          variant="standard"
                          type="number"
                          value={formData.nroLote}
                          onChange={(e) => setFormData((prev) => ({ ...prev, nroLote: e.target.value }))}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "text.primary",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label="Kilogramos totales"
                          placeholder="Kilogramos totales"
                          variant="standard"
                          type="number"
                          value={formData.kg}
                          onChange={(e) => setFormData((prev) => ({ ...prev, kg: e.target.value }))}
                          InputProps={{
                            readOnly: viewMode,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: viewMode ? "text.secondary" : "text.primary",
                            },
                          }}
                          helperText={!viewMode ? "Peso total de la descarga" : ""}
                        />
                      </Grid>
                    </Grid>

                    {/* Botones dinámicos según el modo */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                      {viewMode && currentRegistroId ? (
                        <>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={handleDelete}
                            disabled={saving}
                          >
                            {saving ? "Eliminando..." : "Eliminar"}
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={handleClose}
                            disabled={saving}
                            sx={buttonStyles.close}
                          >
                            Cerrar
                          </Button>
                        </>
                      ) : (
                        <>
                          <div />
                          <Box sx={{ display: "flex", gap: 2 }}>
                            <Button
                              variant="outlined"
                              onClick={handleClose}
                              disabled={saving}
                              sx={buttonStyles.cancel}
                            >
                              Cancelar
                            </Button>
                            <Button
                              variant="contained"
                              onClick={handleSubmit}
                              disabled={saving}
                              sx={buttonStyles.save}
                            >
                              {saving ? "Guardando..." : editMode ? "Actualizar" : "Guardar"}
                            </Button>
                          </Box>
                        </>
                      )}
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </ThemeProvider>
          </DialogContent>
        </Dialog>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  )
}