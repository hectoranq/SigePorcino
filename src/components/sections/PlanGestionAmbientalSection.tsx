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
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Divider,
  IconButton,
} from "@mui/material"
import { Add, Edit, Visibility, Delete, Close } from "@mui/icons-material"

interface PlanGestionAmbiental {
  // Equipamiento disponible
  caudalimetro: boolean
  higrometro: boolean
  luximetro: boolean
  equipamientoAdicional: string[]
  // Registros
  consumoAguaRegistro: string
  consumoEnergeticoRegistro: string
  // Sistema energético
  lineaElectrica: boolean
  generador: boolean
  energiaSolar: boolean
  sistemaEnergeticoAdicional: string[]
  // Sistema control térmico
  ventilacionForzada: boolean
  ventilacionNatural: boolean
  calefaccionSueloRadiante: boolean
  controlTermicoAdicional: string[]
  // Medidas reducción agua
  bebederosCazoleta: boolean
  revisionDiariaFugas: boolean
  aprovisionamientoAguaLluvia: boolean
  equiposAltaPresion: boolean
  // Equipamiento ruido y olor
  sonometro: boolean
  extractores: boolean
  ventiladores: boolean
  equipamientoRuidoAdicional: string[]
  // Medición gases
  sistemaMedicionGases: string
  especificarGases: string
  // Medidas implementadas
  ruidos: boolean
  particulasPolvo: boolean
  olores: boolean
  medidasAdicionales: string[]
  // Plan estiércol
  sistemaRecogidaEstiercol: string
  produccionAnualEstimada: string
  frecuenciaVaciado: string
  balsaAlmacenamiento: string
  superficieAgricola: string
  operadoresAutorizados: string
  instalacionesTratamiento: string
  fichaSeguimientoPurin: boolean
  gestionEstiercolAdicional: string[]
}

const buttonStyles = {
  primary: {
    textTransform: "none",
    borderRadius: 1,
  },
}

export function PlanGestionAmbientalSection() {
  const [registros, setRegistros] = useState<PlanGestionAmbiental[]>([
    {
      caudalimetro: true,
      higrometro: true,
      luximetro: false,
      equipamientoAdicional: ["Termómetro digital"],
      consumoAguaRegistro: "si",
      consumoEnergeticoRegistro: "si",
      lineaElectrica: true,
      generador: false,
      energiaSolar: true,
      sistemaEnergeticoAdicional: [],
      ventilacionForzada: true,
      ventilacionNatural: false,
      calefaccionSueloRadiante: true,
      controlTermicoAdicional: [],
      bebederosCazoleta: true,
      revisionDiariaFugas: true,
      aprovisionamientoAguaLluvia: false,
      equiposAltaPresion: true,
      sonometro: true,
      extractores: true,
      ventiladores: true,
      equipamientoRuidoAdicional: [],
      sistemaMedicionGases: "si",
      especificarGases: "CO2, NH3",
      ruidos: true,
      particulasPolvo: true,
      olores: true,
      medidasAdicionales: [],
      sistemaRecogidaEstiercol: "Fosas de recogida bajo slat",
      produccionAnualEstimada: "2500 m³",
      frecuenciaVaciado: "Cada 6 meses",
      balsaAlmacenamiento: "Balsa impermeabilizada de 3000 m³",
      superficieAgricola: "50 hectáreas identificadas",
      operadoresAutorizados: "Agro Services S.L.",
      instalacionesTratamiento: "Planta de compostaje autorizada",
      fichaSeguimientoPurin: true,
      gestionEstiercolAdicional: [],
    },
  ])

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<PlanGestionAmbiental>({
    caudalimetro: false,
    higrometro: false,
    luximetro: false,
    equipamientoAdicional: [],
    consumoAguaRegistro: "",
    consumoEnergeticoRegistro: "",
    lineaElectrica: false,
    generador: false,
    energiaSolar: false,
    sistemaEnergeticoAdicional: [],
    ventilacionForzada: false,
    ventilacionNatural: false,
    calefaccionSueloRadiante: false,
    controlTermicoAdicional: [],
    bebederosCazoleta: false,
    revisionDiariaFugas: false,
    aprovisionamientoAguaLluvia: false,
    equiposAltaPresion: false,
    sonometro: false,
    extractores: false,
    ventiladores: false,
    equipamientoRuidoAdicional: [],
    sistemaMedicionGases: "",
    especificarGases: "",
    ruidos: false,
    particulasPolvo: false,
    olores: false,
    medidasAdicionales: [],
    sistemaRecogidaEstiercol: "",
    produccionAnualEstimada: "",
    frecuenciaVaciado: "",
    balsaAlmacenamiento: "",
    superficieAgricola: "",
    operadoresAutorizados: "",
    instalacionesTratamiento: "",
    fichaSeguimientoPurin: false,
    gestionEstiercolAdicional: [],
  })

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [registroToDelete, setRegistroToDelete] = useState<number | null>(null)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [selectedRegistro, setSelectedRegistro] = useState<PlanGestionAmbiental | null>(null)

  // Estados para agregar nuevas opciones
  const [nuevoEquipamiento, setNuevoEquipamiento] = useState("")
  const [mostrarInputEquipamiento, setMostrarInputEquipamiento] = useState(false)
  const [nuevoSistemaEnergetico, setNuevoSistemaEnergetico] = useState("")
  const [mostrarInputSistemaEnergetico, setMostrarInputSistemaEnergetico] = useState(false)
  const [nuevoControlTermico, setNuevoControlTermico] = useState("")
  const [mostrarInputControlTermico, setMostrarInputControlTermico] = useState(false)
  const [nuevoEquipamientoRuido, setNuevoEquipamientoRuido] = useState("")
  const [mostrarInputEquipamientoRuido, setMostrarInputEquipamientoRuido] = useState(false)
  const [nuevaMedida, setNuevaMedida] = useState("")
  const [mostrarInputMedida, setMostrarInputMedida] = useState(false)
  const [nuevaGestionEstiercol, setNuevaGestionEstiercol] = useState("")
  const [mostrarInputGestionEstiercol, setMostrarInputGestionEstiercol] = useState(false)

  const handleAgregarNuevo = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setFormData({
      caudalimetro: false,
      higrometro: false,
      luximetro: false,
      equipamientoAdicional: [],
      consumoAguaRegistro: "",
      consumoEnergeticoRegistro: "",
      lineaElectrica: false,
      generador: false,
      energiaSolar: false,
      sistemaEnergeticoAdicional: [],
      ventilacionForzada: false,
      ventilacionNatural: false,
      calefaccionSueloRadiante: false,
      controlTermicoAdicional: [],
      bebederosCazoleta: false,
      revisionDiariaFugas: false,
      aprovisionamientoAguaLluvia: false,
      equiposAltaPresion: false,
      sonometro: false,
      extractores: false,
      ventiladores: false,
      equipamientoRuidoAdicional: [],
      sistemaMedicionGases: "",
      especificarGases: "",
      ruidos: false,
      particulasPolvo: false,
      olores: false,
      medidasAdicionales: [],
      sistemaRecogidaEstiercol: "",
      produccionAnualEstimada: "",
      frecuenciaVaciado: "",
      balsaAlmacenamiento: "",
      superficieAgricola: "",
      operadoresAutorizados: "",
      instalacionesTratamiento: "",
      fichaSeguimientoPurin: false,
      gestionEstiercolAdicional: [],
    })
    setMostrarInputEquipamiento(false)
    setMostrarInputSistemaEnergetico(false)
    setMostrarInputControlTermico(false)
    setMostrarInputEquipamientoRuido(false)
    setMostrarInputMedida(false)
    setMostrarInputGestionEstiercol(false)
  }

  const handleCheckboxChange = (field: keyof PlanGestionAmbiental) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleInputChange = (field: keyof PlanGestionAmbiental, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAgregarEquipamiento = () => {
    if (nuevoEquipamiento.trim()) {
      setFormData((prev) => ({
        ...prev,
        equipamientoAdicional: [...prev.equipamientoAdicional, nuevoEquipamiento.trim()],
      }))
      setNuevoEquipamiento("")
      setMostrarInputEquipamiento(false)
    }
  }

  const handleEliminarEquipamiento = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      equipamientoAdicional: prev.equipamientoAdicional.filter((_, i) => i !== index),
    }))
  }

  const handleAgregarSistemaEnergetico = () => {
    if (nuevoSistemaEnergetico.trim()) {
      setFormData((prev) => ({
        ...prev,
        sistemaEnergeticoAdicional: [...prev.sistemaEnergeticoAdicional, nuevoSistemaEnergetico.trim()],
      }))
      setNuevoSistemaEnergetico("")
      setMostrarInputSistemaEnergetico(false)
    }
  }

  const handleEliminarSistemaEnergetico = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sistemaEnergeticoAdicional: prev.sistemaEnergeticoAdicional.filter((_, i) => i !== index),
    }))
  }

  const handleAgregarControlTermico = () => {
    if (nuevoControlTermico.trim()) {
      setFormData((prev) => ({
        ...prev,
        controlTermicoAdicional: [...prev.controlTermicoAdicional, nuevoControlTermico.trim()],
      }))
      setNuevoControlTermico("")
      setMostrarInputControlTermico(false)
    }
  }

  const handleEliminarControlTermico = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      controlTermicoAdicional: prev.controlTermicoAdicional.filter((_, i) => i !== index),
    }))
  }

  const handleAgregarEquipamientoRuido = () => {
    if (nuevoEquipamientoRuido.trim()) {
      setFormData((prev) => ({
        ...prev,
        equipamientoRuidoAdicional: [...prev.equipamientoRuidoAdicional, nuevoEquipamientoRuido.trim()],
      }))
      setNuevoEquipamientoRuido("")
      setMostrarInputEquipamientoRuido(false)
    }
  }

  const handleEliminarEquipamientoRuido = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      equipamientoRuidoAdicional: prev.equipamientoRuidoAdicional.filter((_, i) => i !== index),
    }))
  }

  const handleAgregarMedida = () => {
    if (nuevaMedida.trim()) {
      setFormData((prev) => ({
        ...prev,
        medidasAdicionales: [...prev.medidasAdicionales, nuevaMedida.trim()],
      }))
      setNuevaMedida("")
      setMostrarInputMedida(false)
    }
  }

  const handleEliminarMedida = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medidasAdicionales: prev.medidasAdicionales.filter((_, i) => i !== index),
    }))
  }

  const handleAgregarGestionEstiercol = () => {
    if (nuevaGestionEstiercol.trim()) {
      setFormData((prev) => ({
        ...prev,
        gestionEstiercolAdicional: [...prev.gestionEstiercolAdicional, nuevaGestionEstiercol.trim()],
      }))
      setNuevaGestionEstiercol("")
      setMostrarInputGestionEstiercol(false)
    }
  }

  const handleEliminarGestionEstiercol = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gestionEstiercolAdicional: prev.gestionEstiercolAdicional.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setRegistros((prev) => [...prev, formData])
    handleClose()
    console.log("Plan de gestión ambiental registrado:", formData)
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

  const getMedidasOptimizacion = (registro: PlanGestionAmbiental) => {
    const medidas = []
    if (registro.caudalimetro) medidas.push("Caudalímetro")
    if (registro.higrometro) medidas.push("Higrómetro")
    if (registro.luximetro) medidas.push("Luxímetro")
    if (registro.equipamientoAdicional.length > 0) medidas.push(...registro.equipamientoAdicional)
    if (registro.lineaElectrica) medidas.push("Línea eléctrica")
    if (registro.energiaSolar) medidas.push("Energía solar")
    if (registro.bebederosCazoleta) medidas.push("Bebederos cazoleta")
    if (registro.revisionDiariaFugas) medidas.push("Revisión fugas")
    return medidas.length > 0 ? medidas.join(", ") : "No especificadas"
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
              Plan de Gestión Ambiental
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
                    Medidas para la optimización del uso de agua y energía
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
                      {getMedidasOptimizacion(registro)}
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
              ¿Estás seguro de que deseas eliminar este registro del plan de gestión ambiental? Esta acción no se puede
              deshacer.
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
        <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="lg" fullWidth>
          <DialogTitle sx={{ bgcolor: "#00bcd4", color: "white", fontWeight: 600 }}>
            Detalles del Plan de Gestión Ambiental
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedRegistro && (
              <Grid container spacing={3}>
                {/* Sección 1 */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                      Optimización del uso de agua y energía
                    </Typography>
                  </Divider>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Equipamiento disponible
                  </Typography>
                  <Typography variant="body1">
                    {selectedRegistro.caudalimetro && "Caudalímetro"}
                    {selectedRegistro.higrometro && ", Higrómetro"}
                    {selectedRegistro.luximetro && ", Luxímetro"}
                    {selectedRegistro.equipamientoAdicional.length > 0 &&
                      `, ${selectedRegistro.equipamientoAdicional.join(", ")}`}
                    {!(
                      selectedRegistro.caudalimetro ||
                      selectedRegistro.higrometro ||
                      selectedRegistro.luximetro ||
                      selectedRegistro.equipamientoAdicional.length > 0
                    ) && "Ninguno"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Registro consumo de agua
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.consumoAguaRegistro === "si" ? "Sí" : "No"}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Registro consumo energético
                  </Typography>
                  <Typography variant="body1">
                    {selectedRegistro.consumoEnergeticoRegistro === "si" ? "Sí" : "No"}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Sistema energético
                  </Typography>
                  <Typography variant="body1">
                    {selectedRegistro.lineaElectrica && "Línea eléctrica"}
                    {selectedRegistro.generador && ", Generador"}
                    {selectedRegistro.energiaSolar && ", Energía solar"}
                    {selectedRegistro.sistemaEnergeticoAdicional.length > 0 &&
                      `, ${selectedRegistro.sistemaEnergeticoAdicional.join(", ")}`}
                    {!(
                      selectedRegistro.lineaElectrica ||
                      selectedRegistro.generador ||
                      selectedRegistro.energiaSolar ||
                      selectedRegistro.sistemaEnergeticoAdicional.length > 0
                    ) && "Ninguno"}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Sistema de control térmico
                  </Typography>
                  <Typography variant="body1">
                    {selectedRegistro.ventilacionForzada && "Ventilación forzada"}
                    {selectedRegistro.ventilacionNatural && ", Ventilación natural"}
                    {selectedRegistro.calefaccionSueloRadiante && ", Calefacción suelo radiante"}
                    {selectedRegistro.controlTermicoAdicional.length > 0 &&
                      `, ${selectedRegistro.controlTermicoAdicional.join(", ")}`}
                    {!(
                      selectedRegistro.ventilacionForzada ||
                      selectedRegistro.ventilacionNatural ||
                      selectedRegistro.calefaccionSueloRadiante ||
                      selectedRegistro.controlTermicoAdicional.length > 0
                    ) && "Ninguno"}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Medidas reducción consumo de agua
                  </Typography>
                  <Typography variant="body1">
                    {selectedRegistro.bebederosCazoleta && "Bebederos de cazoleta"}
                    {selectedRegistro.revisionDiariaFugas && ", Revisión diaria fugas"}
                    {selectedRegistro.aprovisionamientoAguaLluvia && ", Aprovisionamiento agua lluvia"}
                    {selectedRegistro.equiposAltaPresion && ", Equipos alta presión"}
                    {!(
                      selectedRegistro.bebederosCazoleta ||
                      selectedRegistro.revisionDiariaFugas ||
                      selectedRegistro.aprovisionamientoAguaLluvia ||
                      selectedRegistro.equiposAltaPresion
                    ) && "Ninguno"}
                  </Typography>
                </Grid>

                {/* Sección 2 */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                      Reducción de ruidos, particulados, polvo y olores
                    </Typography>
                  </Divider>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Equipamiento disponible
                  </Typography>
                  <Typography variant="body1">
                    {selectedRegistro.sonometro && "Sonómetro"}
                    {selectedRegistro.extractores && ", Extractores"}
                    {selectedRegistro.ventiladores && ", Ventiladores"}
                    {selectedRegistro.equipamientoRuidoAdicional.length > 0 &&
                      `, ${selectedRegistro.equipamientoRuidoAdicional.join(", ")}`}
                    {!(
                      selectedRegistro.sonometro ||
                      selectedRegistro.extractores ||
                      selectedRegistro.ventiladores ||
                      selectedRegistro.equipamientoRuidoAdicional.length > 0
                    ) && "Ninguno"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Sistema medición de gases
                  </Typography>
                  <Typography variant="body1">
                    {selectedRegistro.sistemaMedicionGases === "si" ? "Sí" : "No"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Gases específicos
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.especificarGases || "N/A"}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Medidas implementadas
                  </Typography>
                  <Typography variant="body1">
                    {selectedRegistro.ruidos && "Ruidos"}
                    {selectedRegistro.particulasPolvo && ", Partículas y polvo"}
                    {selectedRegistro.olores && ", Olores"}
                    {selectedRegistro.medidasAdicionales.length > 0 &&
                      `, ${selectedRegistro.medidasAdicionales.join(", ")}`}
                    {!(
                      selectedRegistro.ruidos ||
                      selectedRegistro.particulasPolvo ||
                      selectedRegistro.olores ||
                      selectedRegistro.medidasAdicionales.length > 0
                    ) && "Ninguno"}
                  </Typography>
                </Grid>

                {/* Sección 3 */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                      Plan de producción y gestión de estiércol
                    </Typography>
                  </Divider>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Sistema de recogida
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.sistemaRecogidaEstiercol}</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Producción anual estimada
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.produccionAnualEstimada}</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Frecuencia de vaciado
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.frecuenciaVaciado}</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Balsa de almacenamiento
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.balsaAlmacenamiento}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Superficie agrícola
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.superficieAgricola}</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Operadores autorizados
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.operadoresAutorizados}</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Instalaciones de tratamiento
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.instalacionesTratamiento}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Documentación y gestión adicional
                  </Typography>
                  <Typography variant="body1">
                    {selectedRegistro.fichaSeguimientoPurin && "Ficha seguimiento aplicaciones de purín"}
                    {selectedRegistro.gestionEstiercolAdicional.length > 0 &&
                      (selectedRegistro.fichaSeguimientoPurin ? ", " : "") +
                        selectedRegistro.gestionEstiercolAdicional.join(", ")}
                    {!selectedRegistro.fichaSeguimientoPurin &&
                      selectedRegistro.gestionEstiercolAdicional.length === 0 &&
                      "Ninguno"}
                  </Typography>
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
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
          <DialogTitle sx={{ bgcolor: "#00bcd4", color: "white", fontWeight: 600 }}>
            Agregar Plan de Gestión Ambiental
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Sección 1: Optimización agua y energía */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: "#00bcd4", borderRadius: "50%" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00bcd4" }}>
                      Medidas para la optimización del uso de agua y energía
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Equipamiento disponible
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.caudalimetro}
                            onChange={() => handleCheckboxChange("caudalimetro")}
                          />
                        }
                        label="Caudalímetro"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox checked={formData.higrometro} onChange={() => handleCheckboxChange("higrometro")} />
                        }
                        label="Higrómetro"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox checked={formData.luximetro} onChange={() => handleCheckboxChange("luximetro")} />
                        }
                        label="Luxímetro"
                      />
                    </Grid>

                    {/* Opciones adicionales agregadas */}
                    {formData.equipamientoAdicional.map((equip, index) => (
                      <Grid item xs={6} key={index}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <FormControlLabel control={<Checkbox checked={true} disabled />} label={equip} />
                          <IconButton size="small" onClick={() => handleEliminarEquipamiento(index)} color="error">
                            <Close fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}

                    <Grid item xs={6}>
                      {!mostrarInputEquipamiento ? (
                        <Button
                          startIcon={<Add />}
                          onClick={() => setMostrarInputEquipamiento(true)}
                          sx={{
                            color: "#00bcd4",
                            fontSize: "0.875rem",
                          }}
                        >
                          Añadir otra opción
                        </Button>
                      ) : (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <TextField
                            size="small"
                            placeholder="Nueva opción"
                            value={nuevoEquipamiento}
                            onChange={(e) => setNuevoEquipamiento(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleAgregarEquipamiento()
                              }
                            }}
                          />
                          <Button size="small" variant="contained" onClick={handleAgregarEquipamiento}>
                            <Add />
                          </Button>
                          <Button size="small" variant="outlined" onClick={() => setMostrarInputEquipamiento(false)}>
                            <Close />
                          </Button>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Registro de consumo y lavado de agua
                  </Typography>
                  <RadioGroup
                    row
                    value={formData.consumoAguaRegistro}
                    onChange={(e) => handleInputChange("consumoAguaRegistro", e.target.value)}
                  >
                    <FormControlLabel value="si" control={<Radio />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Registro de consumo energético
                  </Typography>
                  <RadioGroup
                    row
                    value={formData.consumoEnergeticoRegistro}
                    onChange={(e) => handleInputChange("consumoEnergeticoRegistro", e.target.value)}
                  >
                    <FormControlLabel value="si" control={<Radio />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Sistema energético de la granja
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.lineaElectrica}
                            onChange={() => handleCheckboxChange("lineaElectrica")}
                          />
                        }
                        label="Línea eléctrica"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox checked={formData.generador} onChange={() => handleCheckboxChange("generador")} />
                        }
                        label="Generador"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.energiaSolar}
                            onChange={() => handleCheckboxChange("energiaSolar")}
                          />
                        }
                        label="Energía solar"
                      />
                    </Grid>

                    {formData.sistemaEnergeticoAdicional.map((sistema, index) => (
                      <Grid item xs={6} key={index}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <FormControlLabel control={<Checkbox checked={true} disabled />} label={sistema} />
                          <IconButton size="small" onClick={() => handleEliminarSistemaEnergetico(index)} color="error">
                            <Close fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}

                    <Grid item xs={6}>
                      {!mostrarInputSistemaEnergetico ? (
                        <Button
                          startIcon={<Add />}
                          onClick={() => setMostrarInputSistemaEnergetico(true)}
                          sx={{
                            color: "#00bcd4",
                            fontSize: "0.875rem",
                          }}
                        >
                          Añadir otra opción
                        </Button>
                      ) : (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <TextField
                            size="small"
                            placeholder="Nueva opción"
                            value={nuevoSistemaEnergetico}
                            onChange={(e) => setNuevoSistemaEnergetico(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleAgregarSistemaEnergetico()
                              }
                            }}
                          />
                          <Button size="small" variant="contained" onClick={handleAgregarSistemaEnergetico}>
                            <Add />
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setMostrarInputSistemaEnergetico(false)}
                          >
                            <Close />
                          </Button>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Sistema de control térmico (sistema de ventilación y calefacción)
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.ventilacionForzada}
                            onChange={() => handleCheckboxChange("ventilacionForzada")}
                          />
                        }
                        label="Ventilación forzada"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.ventilacionNatural}
                            onChange={() => handleCheckboxChange("ventilacionNatural")}
                          />
                        }
                        label="Ventilación natural con ventanas automatizadas"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.calefaccionSueloRadiante}
                            onChange={() => handleCheckboxChange("calefaccionSueloRadiante")}
                          />
                        }
                        label="Calefacción suelo radiante"
                      />
                    </Grid>

                    {formData.controlTermicoAdicional.map((control, index) => (
                      <Grid item xs={6} key={index}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <FormControlLabel control={<Checkbox checked={true} disabled />} label={control} />
                          <IconButton size="small" onClick={() => handleEliminarControlTermico(index)} color="error">
                            <Close fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}

                    <Grid item xs={6}>
                      {!mostrarInputControlTermico ? (
                        <Button
                          startIcon={<Add />}
                          onClick={() => setMostrarInputControlTermico(true)}
                          sx={{
                            color: "#00bcd4",
                            fontSize: "0.875rem",
                          }}
                        >
                          Añadir otra opción
                        </Button>
                      ) : (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <TextField
                            size="small"
                            placeholder="Nueva opción"
                            value={nuevoControlTermico}
                            onChange={(e) => setNuevoControlTermico(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleAgregarControlTermico()
                              }
                            }}
                          />
                          <Button size="small" variant="contained" onClick={handleAgregarControlTermico}>
                            <Add />
                          </Button>
                          <Button size="small" variant="outlined" onClick={() => setMostrarInputControlTermico(false)}>
                            <Close />
                          </Button>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Medidas para la reducción del consumo de agua
                  </Typography>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.bebederosCazoleta}
                          onChange={() => handleCheckboxChange("bebederosCazoleta")}
                        />
                      }
                      label="Bebederos de cazoleta"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.revisionDiariaFugas}
                          onChange={() => handleCheckboxChange("revisionDiariaFugas")}
                        />
                      }
                      label="Revisión diaria para evitar fugas"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.aprovisionamientoAguaLluvia}
                          onChange={() => handleCheckboxChange("aprovisionamientoAguaLluvia")}
                        />
                      }
                      label="Aprovisionamiento agua de lluvia para lavado de naves"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.equiposAltaPresion}
                          onChange={() => handleCheckboxChange("equiposAltaPresion")}
                        />
                      }
                      label="Equipos de alta presión en limpieza y desinfección de las naves"
                    />
                  </FormGroup>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Sección 2: Reducción ruidos y olores */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: "#00bcd4", borderRadius: "50%" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00bcd4" }}>
                      Medidas para la reducción de ruidos, particulados, polvo y olores
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Equipamiento disponible
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox checked={formData.sonometro} onChange={() => handleCheckboxChange("sonometro")} />
                        }
                        label="Sonómetro"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox checked={formData.extractores} onChange={() => handleCheckboxChange("extractores")} />
                        }
                        label="Extractores"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.ventiladores}
                            onChange={() => handleCheckboxChange("ventiladores")}
                          />
                        }
                        label="Ventiladores"
                      />
                    </Grid>

                    {formData.equipamientoRuidoAdicional.map((equip, index) => (
                      <Grid item xs={6} key={index}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <FormControlLabel control={<Checkbox checked={true} disabled />} label={equip} />
                          <IconButton size="small" onClick={() => handleEliminarEquipamientoRuido(index)} color="error">
                            <Close fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}

                    <Grid item xs={6}>
                      {!mostrarInputEquipamientoRuido ? (
                        <Button
                          startIcon={<Add />}
                          onClick={() => setMostrarInputEquipamientoRuido(true)}
                          sx={{
                            color: "#00bcd4",
                            fontSize: "0.875rem",
                          }}
                        >
                          Añadir otra opción
                        </Button>
                      ) : (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <TextField
                            size="small"
                            placeholder="Nueva opción"
                            value={nuevoEquipamientoRuido}
                            onChange={(e) => setNuevoEquipamientoRuido(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleAgregarEquipamientoRuido()
                              }
                            }}
                          />
                          <Button size="small" variant="contained" onClick={handleAgregarEquipamientoRuido}>
                            <Add />
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setMostrarInputEquipamientoRuido(false)}
                          >
                            <Close />
                          </Button>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Sistema de medición de gases de la granja
                  </Typography>
                  <RadioGroup
                    row
                    value={formData.sistemaMedicionGases}
                    onChange={(e) => handleInputChange("sistemaMedicionGases", e.target.value)}
                  >
                    <FormControlLabel value="si" control={<Radio />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Especificar gases"
                    variant="filled"
                    placeholder="Ej: CO2, NH3, CH4"
                    value={formData.especificarGases}
                    onChange={(e) => handleInputChange("especificarGases", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Medidas implementadas para reducir ruidos, particulados, polvo y olores en la explotación
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={<Checkbox checked={formData.ruidos} onChange={() => handleCheckboxChange("ruidos")} />}
                        label="Ruidos"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.particulasPolvo}
                            onChange={() => handleCheckboxChange("particulasPolvo")}
                          />
                        }
                        label="Partículas y polvo"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={<Checkbox checked={formData.olores} onChange={() => handleCheckboxChange("olores")} />}
                        label="Olores"
                      />
                    </Grid>

                    {formData.medidasAdicionales.map((medida, index) => (
                      <Grid item xs={6} key={index}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <FormControlLabel control={<Checkbox checked={true} disabled />} label={medida} />
                          <IconButton size="small" onClick={() => handleEliminarMedida(index)} color="error">
                            <Close fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}

                    <Grid item xs={6}>
                      {!mostrarInputMedida ? (
                        <Button
                          startIcon={<Add />}
                          onClick={() => setMostrarInputMedida(true)}
                          sx={{
                            color: "#00bcd4",
                            fontSize: "0.875rem",
                          }}
                        >
                          Añadir otra opción
                        </Button>
                      ) : (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <TextField
                            size="small"
                            placeholder="Nueva opción"
                            value={nuevaMedida}
                            onChange={(e) => setNuevaMedida(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleAgregarMedida()
                              }
                            }}
                          />
                          <Button size="small" variant="contained" onClick={handleAgregarMedida}>
                            <Add />
                          </Button>
                          <Button size="small" variant="outlined" onClick={() => setMostrarInputMedida(false)}>
                            <Close />
                          </Button>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Sección 3: Plan estiércol */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: "#00bcd4", borderRadius: "50%" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00bcd4" }}>
                      Plan de producción y gestión de estiércol
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Sistema de recogida e instalaciones para el almacenamiento de estiércoles"
                    variant="filled"
                    multiline
                    rows={2}
                    placeholder="Descripción de tipo de fosa utilizada"
                    value={formData.sistemaRecogidaEstiercol}
                    onChange={(e) => handleInputChange("sistemaRecogidaEstiercol", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Producción anual estimada de estiércoles"
                    variant="filled"
                    placeholder="m³"
                    value={formData.produccionAnualEstimada}
                    onChange={(e) => handleInputChange("produccionAnualEstimada", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Frecuencia del vaciado"
                    variant="filled"
                    value={formData.frecuenciaVaciado}
                    onChange={(e) => handleInputChange("frecuenciaVaciado", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Balsa de almacenamiento"
                    variant="filled"
                    value={formData.balsaAlmacenamiento}
                    onChange={(e) => handleInputChange("balsaAlmacenamiento", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}>
                    Descripción de la gestión prevista para los estiércoles, señalando la cuantía de los que se
                    destinarán directamente a la valoración agronómica y las cuantías de los que se destinarán a un
                    tratamiento autorizado
                    <br />
                    <br />
                    Detallar la superficie agrícola o forestal para la utilización de los estiércoles por el productor
                    con identificación de las parcelas destinatarias
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.fichaSeguimientoPurin}
                            onChange={() => handleCheckboxChange("fichaSeguimientoPurin")}
                          />
                        }
                        label="Ficha seguimiento aplicaciones de purín plan de cultivos anual"
                      />
                    </Grid>

                    {formData.gestionEstiercolAdicional.map((gestion, index) => (
                      <Grid item xs={6} key={index}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <FormControlLabel control={<Checkbox checked={true} disabled />} label={gestion} />
                          <IconButton size="small" onClick={() => handleEliminarGestionEstiercol(index)} color="error">
                            <Close fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}

                    <Grid item xs={6}>
                      {!mostrarInputGestionEstiercol ? (
                        <Button
                          startIcon={<Add />}
                          onClick={() => setMostrarInputGestionEstiercol(true)}
                          sx={{
                            color: "#00bcd4",
                            fontSize: "0.875rem",
                          }}
                        >
                          Añadir otra opción
                        </Button>
                      ) : (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <TextField
                            size="small"
                            placeholder="Nueva opción"
                            value={nuevaGestionEstiercol}
                            onChange={(e) => setNuevaGestionEstiercol(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleAgregarGestionEstiercol()
                              }
                            }}
                          />
                          <Button size="small" variant="contained" onClick={handleAgregarGestionEstiercol}>
                            <Add />
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setMostrarInputGestionEstiercol(false)}
                          >
                            <Close />
                          </Button>
                        </Box>
                      )}
                    </Grid>


                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Superficie agrícola o forestal para utilización"
                    variant="filled"
                    multiline
                    rows={2}
                    placeholder="Identificación de parcelas destinatarias"
                    value={formData.superficieAgricola}
                    onChange={(e) => handleInputChange("superficieAgricola", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Identificación de operadores autorizados para la gestión del estiércol"
                    variant="filled"
                    placeholder="m³ tratados"
                    value={formData.operadoresAutorizados}
                    onChange={(e) => handleInputChange("operadoresAutorizados", e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Identificación de las instalaciones de tratamiento autorizado"
                    variant="filled"
                    placeholder="Detallar tipo de tratamiento"
                    value={formData.instalacionesTratamiento}
                    onChange={(e) => handleInputChange("instalacionesTratamiento", e.target.value)}
                    required
                  />
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCancelar} variant="outlined" sx={buttonStyles.primary}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained" sx={buttonStyles.primary}>
              Registrar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}