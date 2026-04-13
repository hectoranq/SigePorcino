import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogContent,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  CircularProgress,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import { Add, KeyboardArrowDown, ExpandMore } from "@mui/icons-material";
import useUserStore from "../../_store/user";
import useFarmFormStore from "../../_store/farm";
import DateInput from "../common/DateInput";
import { buttonStyles, headerColors } from "./buttonStyles";
import {
  getWelfareEvaluationByFarmId,
  createWelfareEvaluation,
  updateWelfareEvaluation,
  WelfareEvaluation,
} from "../../action/WelfareEvaluationPocket";
import {
  getWelfareFacilitiesByEvaluationId,
  createWelfareFacility,
  updateWelfareFacility,
  deleteWelfareFacility,
  WelfareFacility,
} from "../../action/WelfareFacilitiesPocket";
import {
  getCaudophagyOutbreaksByFacilityId,
  createCaudophagyOutbreak,
  updateCaudophagyOutbreak,
  deleteCaudophagyOutbreak,
  CaudophagyOutbreak,
} from "../../action/CaudophagyOutbreaksPocket";
import {
  listLinkedCompaniesManagers,
  LinkedCompanyManager,
} from "../../action/LinkedCompaniesManagerPocket";

interface Props {
  onNext: () => void;
  evaluationId: string | null;
  setEvaluationId: (id: string) => void;
}

// Constantes para opciones de campos
const GASES_OPTIONS = [
  { value: "CO2", label: "CO₂ – Dióxido de Carbono" },
  { value: "NH3", label: "NH₃ – Amoníaco" },
  { value: "O", label: "Otros" },
];

const CALEFACCION_OPTIONS = [
  { value: "SR", label: "Suelo radiante" },
  { value: "MT", label: "Manta térmica" },
  { value: "O", label: "Otros" },
];

const COMEDERO_OPTIONS = [
  { value: "TV", label: "Tolva" },
  { value: "E", label: "Electrónico" },
  { value: "CN", label: "Canaleta" },
  { value: "O", label: "Otros" },
];

const BEBEDERO_OPTIONS = [
  { value: "CH", label: "Chupete" },
  { value: "CN", label: "Canaleta" },
  { value: "CZ", label: "Cazoleta" },
  { value: "O", label: "Otros" },
];

const initialEvaluationForm = {
  farm_name: "",
  owner_name: "",
  rega_code: "",
  evaluation_date: "",
  zootechnical_class: "",
  health_qualification: "",
  integrator: "",
};

const initialFacilityForm = {
  facility_name: "",
  phase: "",
  animales_alojados: "",
  m2_superficie: "",
  
  // Infraestructura
  num_naves: "",
  capacidad_autorizada: "",
  anio_construccion: "",
  orientacion_nave: "",
  aislamiento_estructural: "",
  suelo_hormigon: false,
  suelo_plastico: false,
  suelo_metalico: false,
  parcialmente_emparrillado: false,
  totalmente_emparrillado: false,
  
  // Control ambiental - Temperatura
  sensor_temperatura: false,
  sensores_altura_cabeza: false,
  control_temperatura: false,
  registro_temperatura: false,
  
  // Control ambiental - Humedad
  sensor_humedad: false,
  sensores_humedad_altura_cabeza: false,
  control_humedad: false,
  registro_humedad: false,
  
  // Control ambiental - Gases
  sensor_co2: false,
  sensor_nh3: false,
  medicion_gases: false,
  tipo_gases: [] as string[],
  registro_gases: false,
  
  // Sensores adicionales
  sensor_velocidad_aire: false,
  sensor_flujo_agua: false,
  
  // Ventilación y Climatización
  ventilacion: "",
  extractores: false,
  ventiladores: false,
  apertura_ventanas: false,
  apertura_chimeneas: false,
  cumbreras: false,
  coolings: false,
  ventilacion_artificial: false,
  calefaccion: false,
  tipo_calefaccion: "",
  
  // Material manipulable
  tipo_enriquecimiento: "",
  cama: false,
  adosados_paredes: false,
  suspendidos: false,
  en_el_suelo: false,
  otros_material: false,
  
  // Gestión de purines
  frecuencia_vaciado: "",
  
  // Alimentación
  tipo_comida: "",
  ad_libitum: false,
  tipo_comedero: [] as string[],
  longitud_comedero: "",
  alimentacion_racionada: false,
  n_comidas_dia: "",
  
  // Abrevado
  tipo_agua: "",
  tipo_bebederos: [] as string[],
  n_bebederos: "",
  n_animales_cuadra: "",
  
  // Manejo
  separacion_sexos: false,
  separacion_castrados: false,
  separacion_tamanos: false,
  separacion_enfermos: false,
  
  // Lazareto
  capacidad_lazareto: "",
  n_cuadras_lazareto: "",
  caudofagia_records: false,
};

const WelfareEvaluationStep1: React.FC<Props> = ({ onNext, evaluationId, setEvaluationId }) => {
  const { token, record } = useUserStore();
  const { currentFarm } = useFarmFormStore();

  // Estados para evaluación principal
  const [evaluationForm, setEvaluationForm] = useState(initialEvaluationForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [integradoras, setIntegradoras] = useState<LinkedCompanyManager[]>([]);

  // Estados para instalaciones
  const [facilities, setFacilities] = useState<WelfareFacility[]>([]);
  const [openFacilityDialog, setOpenFacilityDialog] = useState(false);
  const [editFacilityMode, setEditFacilityMode] = useState(false);
  const [editFacilityIndex, setEditFacilityIndex] = useState<number | null>(null);
  const [facilityForm, setFacilityForm] = useState(initialFacilityForm);

  // Estados para brotes de caudofagia
  const [caudophagyOutbreaks, setCaudophagyOutbreaks] = useState<CaudophagyOutbreak[]>([]);
  const [openOutbreakDialog, setOpenOutbreakDialog] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "info" });

  // Cargar integradores al montar el componente
  useEffect(() => {
    const loadIntegradoras = async () => {
      if (!currentFarm?.id || !token || !record?.id) return;

      try {
        const response = await listLinkedCompaniesManagers(token, record.id, currentFarm.id);
        if (response.success) {
          console.log("📊 Datos recibidos:", response.data.items);
          // Usar todas las empresas vinculadas sin filtrar
          const integradoresList = response.data.items as LinkedCompanyManager[];
          setIntegradoras(integradoresList);
          console.log("✅ Integradoras cargadas:", integradoresList.length);
        }
      } catch (error) {
        console.error("❌ Error al cargar integradoras:", error);
      }
    };

    loadIntegradoras();
  }, [currentFarm, token, record]);

  // Cargar evaluación existente
  useEffect(() => {
    const loadEvaluation = async () => {
      if (!currentFarm?.id || !token || !record?.id) return;

      setLoading(true);
      try {
        const evaluations = await getWelfareEvaluationByFarmId(token, record.id, currentFarm.id);
        const evaluation = evaluations[0];
        
        if (evaluation) {
          setEvaluationId(evaluation.id!);
          setEvaluationForm({
            farm_name: evaluation.farm_name,
            owner_name: evaluation.owner_name,
            rega_code: evaluation.rega_code,
            evaluation_date: evaluation.evaluation_date,
            zootechnical_class: evaluation.zootechnical_class,
            health_qualification: evaluation.health_qualification,
            integrator: evaluation.integrator,
          });

          // Cargar instalaciones
          const facilitiesData = await getWelfareFacilitiesByEvaluationId(token, evaluation.id!);
          setFacilities(facilitiesData);
        } else {
          // Si no hay evaluación, pre-llenar con datos de la granja actual
          setEvaluationForm({
            farm_name: currentFarm.farm_name || "",
            owner_name: "",
            rega_code: currentFarm.REGA || "",
            evaluation_date: "",
            zootechnical_class: "",
            health_qualification: "",
            integrator: "",
          });
        }
      } catch (error) {
        console.error("Error loading evaluation:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvaluation();
  }, [currentFarm, token, record]);

  // Guardar evaluación principal
  const handleSaveEvaluation = async () => {
    if (!currentFarm?.id || !token || !record?.id) return;

    setSaving(true);
    try {
      const evaluationData = {
        farm: currentFarm.id,
        ...evaluationForm,
      };

      let result;
      if (evaluationId) {
        result = await updateWelfareEvaluation(token, evaluationId,record.id, evaluationData);
      } else {
        result = await createWelfareEvaluation(token, record.id, evaluationData);
        setEvaluationId(result.data.id!);
      }

      setSnackbar({
        open: true,
        message: "Evaluación guardada exitosamente",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Error al guardar evaluación",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // Manejar cambios en formulario de evaluación
  const handleEvaluationChange = (field: string, value: any) => {
    setEvaluationForm((prev) => ({ ...prev, [field]: value }));
  };

  // Manejar cambios en formulario de instalación
  const handleFacilityChange = (field: string, value: any) => {
    setFacilityForm((prev) => ({ ...prev, [field]: value }));
  };

  // Manejar cambios en checkbox groups (arrays)
  const handleCheckboxGroupChange = (field: string, value: string, checked: boolean) => {
    const current = (facilityForm[field as keyof typeof facilityForm] as string[]) || [];
    const updated = checked 
      ? [...current, value] 
      : current.filter((v) => v !== value);
    setFacilityForm((prev) => ({ ...prev, [field]: updated }));
  };

  // Abrir dialog para crear instalación
  const handleOpenFacilityDialog = () => {
    setFacilityForm(initialFacilityForm);
    setEditFacilityMode(false);
    setEditFacilityIndex(null);
    setOpenFacilityDialog(true);
  };

  // Editar instalación
  const handleEditFacility = (index: number) => {
    const facility = facilities[index];
    setFacilityForm({
      facility_name: facility.facility_name,
      phase: facility.phase,
      animales_alojados: facility.animales_alojados.toString(),
      m2_superficie: facility.m2_superficie.toString(),
      
      // Infraestructura
      num_naves: facility.num_naves?.toString() || "",
      capacidad_autorizada: facility.capacidad_autorizada?.toString() || "",
      anio_construccion: facility.anio_construccion?.toString() || "",
      orientacion_nave: facility.orientacion_nave || "",
      aislamiento_estructural: facility.aislamiento_estructural || "",
      suelo_hormigon: facility.suelo_hormigon || false,
      suelo_plastico: facility.suelo_plastico || false,
      suelo_metalico: facility.suelo_metalico || false,
      parcialmente_emparrillado: facility.parcialmente_emparrillado || false,
      totalmente_emparrillado: facility.totalmente_emparrillado || false,
      
      // Control ambiental - Temperatura
      sensor_temperatura: facility.sensor_temperatura,
      sensores_altura_cabeza: facility.sensores_altura_cabeza || false,
      control_temperatura: facility.control_temperatura || false,
      registro_temperatura: facility.registro_temperatura || false,
      
      // Control ambiental - Humedad
      sensor_humedad: facility.sensor_humedad,
      sensores_humedad_altura_cabeza: facility.sensores_humedad_altura_cabeza || false,
      control_humedad: facility.control_humedad || false,
      registro_humedad: facility.registro_humedad || false,
      
      // Control ambiental - Gases
      sensor_co2: facility.sensor_co2,
      sensor_nh3: facility.sensor_nh3,
      medicion_gases: facility.medicion_gases || false,
      tipo_gases: facility.tipo_gases || [],
      registro_gases: facility.registro_gases || false,
      
      // Sensores adicionales
      sensor_velocidad_aire: facility.sensor_velocidad_aire,
      sensor_flujo_agua: facility.sensor_flujo_agua,
      
      // Ventilación y Climatización
      ventilacion: facility.ventilacion,
      extractores: facility.extractores || false,
      ventiladores: facility.ventiladores || false,
      apertura_ventanas: facility.apertura_ventanas || false,
      apertura_chimeneas: facility.apertura_chimeneas || false,
      cumbreras: facility.cumbreras || false,
      coolings: facility.coolings || false,
      ventilacion_artificial: facility.ventilacion_artificial || false,
      calefaccion: facility.calefaccion || false,
      tipo_calefaccion: facility.tipo_calefaccion || "",
      
      // Material manipulable
      tipo_enriquecimiento: facility.tipo_enriquecimiento,
      cama: facility.cama || false,
      adosados_paredes: facility.adosados_paredes || false,
      suspendidos: facility.suspendidos || false,
      en_el_suelo: facility.en_el_suelo || false,
      otros_material: facility.otros_material || false,
      
      // Gestión de purines
      frecuencia_vaciado: facility.frecuencia_vaciado || "",
      
      // Alimentación
      tipo_comida: facility.tipo_comida,
      ad_libitum: facility.ad_libitum || false,
      tipo_comedero: facility.tipo_comedero || [],
      longitud_comedero: facility.longitud_comedero || "",
      alimentacion_racionada: facility.alimentacion_racionada || false,
      n_comidas_dia: facility.n_comidas_dia?.toString() || "",
      
      // Abrevado
      tipo_agua: facility.tipo_agua,
      tipo_bebederos: facility.tipo_bebederos || [],
      n_bebederos: facility.n_bebederos?.toString() || "",
      n_animales_cuadra: facility.n_animales_cuadra?.toString() || "",
      
      // Manejo
      separacion_sexos: facility.separacion_sexos || false,
      separacion_castrados: facility.separacion_castrados || false,
      separacion_tamanos: facility.separacion_tamanos || false,
      separacion_enfermos: facility.separacion_enfermos || false,
      
      // Lazareto
      capacidad_lazareto: facility.capacidad_lazareto?.toString() || "",
      n_cuadras_lazareto: facility.n_cuadras_lazareto?.toString() || "",
      caudofagia_records: facility.caudofagia_records,
    });
    setEditFacilityMode(true);
    setEditFacilityIndex(index);
    setOpenFacilityDialog(true);
  };

  // Guardar instalación
  const handleSaveFacility = async () => {
    if (!evaluationId || !token) return;

    try {
      const animales = Number(facilityForm.animales_alojados);
      const superficie = Number(facilityForm.m2_superficie);
      const densidad = superficie > 0 ? animales / superficie : 0;

      const facilityData = {
        evaluation_id: evaluationId,
        facility_name: facilityForm.facility_name,
        phase: facilityForm.phase,
        animales_alojados: animales,
        m2_superficie: superficie,
        densidad: densidad,
        
        // Infraestructura
        num_naves: facilityForm.num_naves ? Number(facilityForm.num_naves) : undefined,
        capacidad_autorizada: facilityForm.capacidad_autorizada ? Number(facilityForm.capacidad_autorizada) : undefined,
        anio_construccion: facilityForm.anio_construccion ? Number(facilityForm.anio_construccion) : undefined,
        orientacion_nave: facilityForm.orientacion_nave || undefined,
        aislamiento_estructural: facilityForm.aislamiento_estructural || undefined,
        suelo_hormigon: facilityForm.suelo_hormigon,
        suelo_plastico: facilityForm.suelo_plastico,
        suelo_metalico: facilityForm.suelo_metalico,
        parcialmente_emparrillado: facilityForm.parcialmente_emparrillado,
        totalmente_emparrillado: facilityForm.totalmente_emparrillado,
        
        // Control ambiental - Temperatura
        sensor_temperatura: facilityForm.sensor_temperatura,
        sensores_altura_cabeza: facilityForm.sensores_altura_cabeza,
        control_temperatura: facilityForm.control_temperatura,
        registro_temperatura: facilityForm.registro_temperatura,
        
        // Control ambiental - Humedad
        sensor_humedad: facilityForm.sensor_humedad,
        sensores_humedad_altura_cabeza: facilityForm.sensores_humedad_altura_cabeza,
        control_humedad: facilityForm.control_humedad,
        registro_humedad: facilityForm.registro_humedad,
        
        // Control ambiental - Gases
        sensor_co2: facilityForm.sensor_co2,
        sensor_nh3: facilityForm.sensor_nh3,
        medicion_gases: facilityForm.medicion_gases,
        tipo_gases: facilityForm.tipo_gases,
        registro_gases: facilityForm.registro_gases,
        
        // Sensores adicionales
        sensor_velocidad_aire: facilityForm.sensor_velocidad_aire,
        sensor_flujo_agua: facilityForm.sensor_flujo_agua,
        
        // Ventilación y Climatización
        ventilacion: facilityForm.ventilacion,
        extractores: facilityForm.extractores,
        ventiladores: facilityForm.ventiladores,
        apertura_ventanas: facilityForm.apertura_ventanas,
        apertura_chimeneas: facilityForm.apertura_chimeneas,
        cumbreras: facilityForm.cumbreras,
        coolings: facilityForm.coolings,
        ventilacion_artificial: facilityForm.ventilacion_artificial,
        calefaccion: facilityForm.calefaccion,
        tipo_calefaccion: facilityForm.tipo_calefaccion || undefined,
        
        // Material manipulable
        tipo_enriquecimiento: facilityForm.tipo_enriquecimiento,
        cama: facilityForm.cama,
        adosados_paredes: facilityForm.adosados_paredes,
        suspendidos: facilityForm.suspendidos,
        en_el_suelo: facilityForm.en_el_suelo,
        otros_material: facilityForm.otros_material,
        
        // Gestión de purines
        frecuencia_vaciado: facilityForm.frecuencia_vaciado || undefined,
        
        // Alimentación
        tipo_comida: facilityForm.tipo_comida,
        ad_libitum: facilityForm.ad_libitum,
        tipo_comedero: facilityForm.tipo_comedero,
        longitud_comedero: facilityForm.longitud_comedero || undefined,
        alimentacion_racionada: facilityForm.alimentacion_racionada,
        n_comidas_dia: facilityForm.n_comidas_dia ? Number(facilityForm.n_comidas_dia) : undefined,
        
        // Abrevado
        tipo_agua: facilityForm.tipo_agua,
        tipo_bebederos: facilityForm.tipo_bebederos,
        n_bebederos: facilityForm.n_bebederos ? Number(facilityForm.n_bebederos) : undefined,
        n_animales_cuadra: facilityForm.n_animales_cuadra ? Number(facilityForm.n_animales_cuadra) : undefined,
        
        // Manejo
        separacion_sexos: facilityForm.separacion_sexos,
        separacion_castrados: facilityForm.separacion_castrados,
        separacion_tamanos: facilityForm.separacion_tamanos,
        separacion_enfermos: facilityForm.separacion_enfermos,
        
        // Lazareto
        capacidad_lazareto: facilityForm.capacidad_lazareto ? Number(facilityForm.capacidad_lazareto) : undefined,
        n_cuadras_lazareto: facilityForm.n_cuadras_lazareto ? Number(facilityForm.n_cuadras_lazareto) : undefined,
        caudofagia_records: facilityForm.caudofagia_records,
      };

      if (editFacilityMode && editFacilityIndex !== null) {
        const facility = facilities[editFacilityIndex];
        await updateWelfareFacility(token, facility.id!, facilityData);
      } else {
        await createWelfareFacility(token, facilityData);
      }

      // Recargar instalaciones
      const facilitiesData = await getWelfareFacilitiesByEvaluationId(token, evaluationId);
      setFacilities(facilitiesData);

      setOpenFacilityDialog(false);
      setSnackbar({
        open: true,
        message: "Instalación guardada exitosamente",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Error al guardar instalación",
        severity: "error",
      });
    }
  };

  // Eliminar instalación
  const handleDeleteFacility = async (index: number) => {
    if (!token) return;

    const facility = facilities[index];
    if (!facility.id) return;

    try {
      await deleteWelfareFacility(token, facility.id);

      // Recargar instalaciones
      if (evaluationId) {
        const facilitiesData = await getWelfareFacilitiesByEvaluationId(token, evaluationId);
        setFacilities(facilitiesData);
      }

      setSnackbar({
        open: true,
        message: "Instalación eliminada exitosamente",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Error al eliminar instalación",
        severity: "error",
      });
    }
  };

  // Calcular densidad
  const calculateDensity = () => {
    const animales = Number(facilityForm.animales_alojados);
    const superficie = Number(facilityForm.m2_superficie);
    if (animales && superficie) {
      return (animales / superficie).toFixed(2);
    }
    return "0";
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
          Datos Generales de la Evaluación
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre de la Granja"
              value={evaluationForm.farm_name}
              onChange={(e) => handleEvaluationChange("farm_name", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre del Propietario"
              value={evaluationForm.owner_name}
              onChange={(e) => handleEvaluationChange("owner_name", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Código REGA"
              value={evaluationForm.rega_code}
              onChange={(e) => handleEvaluationChange("rega_code", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DateInput
              label="Fecha de Evaluación"
              value={evaluationForm.evaluation_date}
              onChange={(value) => handleEvaluationChange("evaluation_date", value)}
              variant="standard"
              sx={{ mb: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Clasificación Zootécnica"
              value={evaluationForm.zootechnical_class}
              onChange={(e) => handleEvaluationChange("zootechnical_class", e.target.value)}
            >
              <MenuItem value="Selección">Selección</MenuItem>
              <MenuItem value="Multiplicación">Multiplicación</MenuItem>
              <MenuItem value="Producción">Recría</MenuItem>
              <MenuItem value="Autoconsumo">Transición</MenuItem>
              <MenuItem value="Autoconsumo">Producción</MenuItem>
              <MenuItem value="Autoconsumo">Cebo</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Calificación Sanitaria"
              value={evaluationForm.health_qualification}
              onChange={(e) => handleEvaluationChange("health_qualification", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Integradora"
              value={evaluationForm.integrator}
              onChange={(e) => handleEvaluationChange("integrator", e.target.value)}
            >
              <MenuItem value="">
                <em>Seleccione integradora</em>
              </MenuItem>
              {integradoras.map((integradora) => (
                <MenuItem key={integradora.id} value={integradora.id}>
                  {integradora.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={handleSaveEvaluation}
            disabled={saving || !currentFarm}
            sx={buttonStyles.save}
          >
            {saving ? "Guardando..." : "Guardar Evaluación"}
          </Button>
        </Box>
      </Paper>

      {/* Tabla de Instalaciones */}
      <Paper sx={{ overflow: "hidden" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
                bgcolor: "primary.main",
                borderRadius: 2,
              }}
            />
            <Typography variant="h6" fontWeight={600}>
              Instalaciones/Naves
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            sx={buttonStyles.save}
            onClick={handleOpenFacilityDialog}
            disabled={!evaluationId}
          >
            Agregar Instalación
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "grey.100" }}>
              <TableRow>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    Nombre
                    <KeyboardArrowDown fontSize="small" color="disabled" />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    Fase
                    <KeyboardArrowDown fontSize="small" color="disabled" />
                  </Box>
                </TableCell>
                <TableCell>Animales</TableCell>
                <TableCell>Superficie (m²)</TableCell>
                <TableCell>Densidad</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {facilities.map((facility, index) => (
                <TableRow
                  key={facility.id || index}
                  sx={{
                    "&:hover": {
                      bgcolor: "grey.50",
                    },
                  }}
                >
                  <TableCell>{facility.facility_name}</TableCell>
                  <TableCell>{facility.phase}</TableCell>
                  <TableCell>{facility.animales_alojados}</TableCell>
                  <TableCell>{facility.m2_superficie}</TableCell>
                  <TableCell>{facility.densidad.toFixed(2)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        sx={buttonStyles.edit}
                        onClick={() => handleEditFacility(index)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteFacility(index)}
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

      {/* Dialog para Instalación */}
      <Dialog open={openFacilityDialog} onClose={() => setOpenFacilityDialog(false)} maxWidth="lg" fullWidth>
        <DialogContent sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {editFacilityMode ? "Editar Instalación" : "Nueva Instalación"}
          </Typography>

          {/* Accordion 1: Infraestructura Básica */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>🏗️ Infraestructura Básica</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre de la Instalación"
                    value={facilityForm.facility_name}
                    onChange={(e) => handleFacilityChange("facility_name", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Fase Productiva"
                    value={facilityForm.phase}
                    onChange={(e) => handleFacilityChange("phase", e.target.value)}
                  >
                    <MenuItem value="Gestación">Gestación</MenuItem>
                    <MenuItem value="Maternidad">Maternidad</MenuItem>
                    <MenuItem value="Transición">Transición</MenuItem>
                    <MenuItem value="Cebo">Cebo</MenuItem>
                    <MenuItem value="Reposición">Reposición</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Nº Naves"
                    value={facilityForm.num_naves}
                    onChange={(e) => handleFacilityChange("num_naves", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Capacidad Autorizada"
                    value={facilityForm.capacidad_autorizada}
                    onChange={(e) => handleFacilityChange("capacidad_autorizada", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Animales Alojados"
                    value={facilityForm.animales_alojados}
                    onChange={(e) => handleFacilityChange("animales_alojados", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Superficie (m²)"
                    value={facilityForm.m2_superficie}
                    onChange={(e) => handleFacilityChange("m2_superficie", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Densidad (animales/m²)"
                    value={calculateDensity()}
                    disabled
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Año de Construcción"
                    value={facilityForm.anio_construccion}
                    onChange={(e) => handleFacilityChange("anio_construccion", e.target.value)}
                    placeholder="YYYY"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Orientación de la Nave"
                    value={facilityForm.orientacion_nave}
                    onChange={(e) => handleFacilityChange("orientacion_nave", e.target.value)}
                    placeholder="Ej. Norte, Sur, Este..."
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tipo de Aislamiento Estructural"
                    value={facilityForm.aislamiento_estructural}
                    onChange={(e) => handleFacilityChange("aislamiento_estructural", e.target.value)}
                    placeholder="Ej. Ladrillo, Panel..."
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                    Tipo de Suelo
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.suelo_hormigon}
                          onChange={(e) => handleFacilityChange("suelo_hormigon", e.target.checked)}
                        />
                      }
                      label="Hormigón"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.suelo_plastico}
                          onChange={(e) => handleFacilityChange("suelo_plastico", e.target.checked)}
                        />
                      }
                      label="Plástico"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.suelo_metalico}
                          onChange={(e) => handleFacilityChange("suelo_metalico", e.target.checked)}
                        />
                      }
                      label="Metálico"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.parcialmente_emparrillado}
                          onChange={(e) => handleFacilityChange("parcialmente_emparrillado", e.target.checked)}
                        />
                      }
                      label="Parcialmente emparrillado"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.totalmente_emparrillado}
                          onChange={(e) => handleFacilityChange("totalmente_emparrillado", e.target.checked)}
                        />
                      }
                      label="Totalmente emparrillado"
                    />
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Accordion 2: Control Ambiental - Temperatura */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>🌡️ Control Ambiental · Temperatura</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.sensor_temperatura}
                        onChange={(e) => handleFacilityChange("sensor_temperatura", e.target.checked)}
                      />
                    }
                    label="¿Dispone de sensores de temperatura?"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.sensores_altura_cabeza}
                        onChange={(e) => handleFacilityChange("sensores_altura_cabeza", e.target.checked)}
                      />
                    }
                    label="¿Están a la altura de la cabeza de los animales?"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.control_temperatura}
                        onChange={(e) => handleFacilityChange("control_temperatura", e.target.checked)}
                      />
                    }
                    label="¿Se realiza control de temperatura?"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.registro_temperatura}
                        onChange={(e) => handleFacilityChange("registro_temperatura", e.target.checked)}
                      />
                    }
                    label="¿Se registra la temperatura?"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Accordion 3: Control Ambiental - Humedad */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>💧 Control Ambiental · Humedad</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.sensor_humedad}
                        onChange={(e) => handleFacilityChange("sensor_humedad", e.target.checked)}
                      />
                    }
                    label="¿Dispone de sensores de humedad?"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.sensores_humedad_altura_cabeza}
                        onChange={(e) => handleFacilityChange("sensores_humedad_altura_cabeza", e.target.checked)}
                      />
                    }
                    label="¿Están a la altura de la cabeza de los animales?"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.control_humedad}
                        onChange={(e) => handleFacilityChange("control_humedad", e.target.checked)}
                      />
                    }
                    label="¿Se realiza control de humedad?"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.registro_humedad}
                        onChange={(e) => handleFacilityChange("registro_humedad", e.target.checked)}
                      />
                    }
                    label="¿Se registra la humedad?"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Accordion 4: Control Ambiental - Gases */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>💨 Control Ambiental · Gases</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.sensor_co2}
                          onChange={(e) => handleFacilityChange("sensor_co2", e.target.checked)}
                        />
                      }
                      label="Sensor CO₂"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.sensor_nh3}
                          onChange={(e) => handleFacilityChange("sensor_nh3", e.target.checked)}
                        />
                      }
                      label="Sensor NH₃"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.sensor_velocidad_aire}
                          onChange={(e) => handleFacilityChange("sensor_velocidad_aire", e.target.checked)}
                        />
                      }
                      label="Sensor Velocidad Aire"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.sensor_flujo_agua}
                          onChange={(e) => handleFacilityChange("sensor_flujo_agua", e.target.checked)}
                        />
                      }
                      label="Sensor Flujo Agua"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.medicion_gases}
                        onChange={(e) => handleFacilityChange("medicion_gases", e.target.checked)}
                      />
                    }
                    label="¿Se mide la concentración de gases?"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Indicar gases medidos
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {GASES_OPTIONS.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        control={
                          <Checkbox
                            checked={facilityForm.tipo_gases.includes(option.value)}
                            onChange={(e) => handleCheckboxGroupChange("tipo_gases", option.value, e.target.checked)}
                          />
                        }
                        label={option.label}
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.registro_gases}
                        onChange={(e) => handleFacilityChange("registro_gases", e.target.checked)}
                      />
                    }
                    label="¿Se registran las mediciones?"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Accordion 5: Ventilación y Climatización */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>🌬️ Ventilación y Climatización</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Sistema de Ventilación</FormLabel>
                    <RadioGroup
                      row
                      value={facilityForm.ventilacion}
                      onChange={(e) => handleFacilityChange("ventilacion", e.target.value)}
                    >
                      <FormControlLabel value="Natural" control={<Radio />} label="Natural" />
                      <FormControlLabel value="Forzada" control={<Radio />} label="Forzada" />
                      <FormControlLabel value="Mixta" control={<Radio />} label="Mixta" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Sistemas de Ventilación Disponibles
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.extractores}
                          onChange={(e) => handleFacilityChange("extractores", e.target.checked)}
                        />
                      }
                      label="Extractores"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.ventiladores}
                          onChange={(e) => handleFacilityChange("ventiladores", e.target.checked)}
                        />
                      }
                      label="Ventiladores"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.apertura_ventanas}
                          onChange={(e) => handleFacilityChange("apertura_ventanas", e.target.checked)}
                        />
                      }
                      label="Apertura automática ventanas"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.apertura_chimeneas}
                          onChange={(e) => handleFacilityChange("apertura_chimeneas", e.target.checked)}
                        />
                      }
                      label="Apertura automática chimeneas"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.cumbreras}
                          onChange={(e) => handleFacilityChange("cumbreras", e.target.checked)}
                        />
                      }
                      label="Cumbreras"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.coolings}
                          onChange={(e) => handleFacilityChange("coolings", e.target.checked)}
                        />
                      }
                      label="Coolings"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.ventilacion_artificial}
                          onChange={(e) => handleFacilityChange("ventilacion_artificial", e.target.checked)}
                        />
                      }
                      label="Ventilación total artificial"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.calefaccion}
                          onChange={(e) => handleFacilityChange("calefaccion", e.target.checked)}
                        />
                      }
                      label="Calefacción"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Tipo de Calefacción
                  </Typography>
                  <RadioGroup
                    row
                    value={facilityForm.tipo_calefaccion}
                    onChange={(e) => handleFacilityChange("tipo_calefaccion", e.target.value)}
                  >
                    {CALEFACCION_OPTIONS.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Accordion 6: Material Manipulable */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>🔧 Material Manipulable (Enriquecimiento)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Tipos de Material Disponible
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.cama}
                          onChange={(e) => handleFacilityChange("cama", e.target.checked)}
                        />
                      }
                      label="Cama"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.adosados_paredes}
                          onChange={(e) => handleFacilityChange("adosados_paredes", e.target.checked)}
                        />
                      }
                      label="Adosados a paredes"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.suspendidos}
                          onChange={(e) => handleFacilityChange("suspendidos", e.target.checked)}
                        />
                      }
                      label="Suspendidos"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.en_el_suelo}
                          onChange={(e) => handleFacilityChange("en_el_suelo", e.target.checked)}
                        />
                      }
                      label="En el suelo"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={facilityForm.otros_material}
                          onChange={(e) => handleFacilityChange("otros_material", e.target.checked)}
                        />
                      }
                      label="Otros"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descripción del Tipo de Enriquecimiento"
                    value={facilityForm.tipo_enriquecimiento}
                    onChange={(e) => handleFacilityChange("tipo_enriquecimiento", e.target.value)}
                    placeholder="Ej: Cadenas, juguetes, paja, etc."
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Accordion 7: Gestión de Purines */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>♻️ Gestión de Purines</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Frecuencia de Vaciado de Purín"
                    value={facilityForm.frecuencia_vaciado}
                    onChange={(e) => handleFacilityChange("frecuencia_vaciado", e.target.value)}
                    placeholder="Ej. Semanal, quincenal, mensual..."
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Accordion 8: Alimentación */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>🌾 Alimentación</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Tipo de Comida</FormLabel>
                    <RadioGroup
                      value={facilityForm.tipo_comida}
                      onChange={(e) => handleFacilityChange("tipo_comida", e.target.value)}
                    >
                      <FormControlLabel value="Seca" control={<Radio />} label="Seca" />
                      <FormControlLabel value="Húmeda" control={<Radio />} label="Húmeda" />
                      <FormControlLabel value="Líquida" control={<Radio />} label="Líquida" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.ad_libitum}
                        onChange={(e) => handleFacilityChange("ad_libitum", e.target.checked)}
                      />
                    }
                    label="Alimentación Ad libitum"
                    sx={{ mt: 2 }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.alimentacion_racionada}
                        onChange={(e) => handleFacilityChange("alimentacion_racionada", e.target.checked)}
                      />
                    }
                    label="Alimentación Racionada"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Tipo de Comedero
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {COMEDERO_OPTIONS.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        control={
                          <Checkbox
                            checked={facilityForm.tipo_comedero.includes(option.value)}
                            onChange={(e) => handleCheckboxGroupChange("tipo_comedero", option.value, e.target.checked)}
                          />
                        }
                        label={option.label}
                      />
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Longitud/Superficie Comedero por Animal"
                    value={facilityForm.longitud_comedero}
                    onChange={(e) => handleFacilityChange("longitud_comedero", e.target.value)}
                    placeholder="cm o cm²"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Nº Comidas / Día"
                    value={facilityForm.n_comidas_dia}
                    onChange={(e) => handleFacilityChange("n_comidas_dia", e.target.value)}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Accordion 9: Abrevado */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>🚰 Abrevado</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Tipo de Agua</FormLabel>
                    <RadioGroup
                      row
                      value={facilityForm.tipo_agua}
                      onChange={(e) => handleFacilityChange("tipo_agua", e.target.value)}
                    >
                      <FormControlLabel value="Chupete" control={<Radio />} label="Chupete" />
                      <FormControlLabel value="Cazoleta" control={<Radio />} label="Cazoleta" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Tipo de Bebederos
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {BEBEDERO_OPTIONS.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        control={
                          <Checkbox
                            checked={facilityForm.tipo_bebederos.includes(option.value)}
                            onChange={(e) => handleCheckboxGroupChange("tipo_bebederos", option.value, e.target.checked)}
                          />
                        }
                        label={option.label}
                      />
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Nº Bebederos"
                    value={facilityForm.n_bebederos}
                    onChange={(e) => handleFacilityChange("n_bebederos", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Nº Animales por Cuadra"
                    value={facilityForm.n_animales_cuadra}
                    onChange={(e) => handleFacilityChange("n_animales_cuadra", e.target.value)}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Accordion 10: Manejo */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>🐖 Manejo</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.separacion_sexos}
                        onChange={(e) => handleFacilityChange("separacion_sexos", e.target.checked)}
                      />
                    }
                    label="Separación ♂ / ♀"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.separacion_castrados}
                        onChange={(e) => handleFacilityChange("separacion_castrados", e.target.checked)}
                      />
                    }
                    label="Separación de castrados"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.separacion_tamanos}
                        onChange={(e) => handleFacilityChange("separacion_tamanos", e.target.checked)}
                      />
                    }
                    label="Separación por tamaños"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.separacion_enfermos}
                        onChange={(e) => handleFacilityChange("separacion_enfermos", e.target.checked)}
                      />
                    }
                    label="Separación enfermos y/o heridos"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Accordion 11: Lazareto */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>🏥 Lazareto</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Capacidad Lazareto (% sobre total)"
                    value={facilityForm.capacidad_lazareto}
                    onChange={(e) => handleFacilityChange("capacidad_lazareto", e.target.value)}
                    placeholder="%"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Nº Cuadras Lazareto"
                    value={facilityForm.n_cuadras_lazareto}
                    onChange={(e) => handleFacilityChange("n_cuadras_lazareto", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.caudofagia_records}
                        onChange={(e) => handleFacilityChange("caudofagia_records", e.target.checked)}
                      />
                    }
                    label="¿Hay registros de caudofagia en los últimos 12 meses?"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={() => setOpenFacilityDialog(false)}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSaveFacility} sx={buttonStyles.save}>
              Guardar
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Botones de navegación */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" disabled sx={buttonStyles.back}>
          Atrás
        </Button>
        <Button
          variant="contained"
          sx={buttonStyles.next}
          onClick={onNext}
          disabled={!evaluationId || facilities.length === 0}
        >
          Siguiente
        </Button>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WelfareEvaluationStep1;
