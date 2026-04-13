import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { ExpandMore, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import useUserStore from "../../_store/user";
import { buttonStyles } from "./buttonStyles";
import {
  getWelfareFacilitiesByEvaluationId,
  WelfareFacility,
} from "../../action/WelfareFacilitiesPocket";
import {
  getWelfareEvaluationById,
  WelfareEvaluation,
} from "../../action/WelfareEvaluationPocket";
import {
  getRiskFactorByFacilityId,
  createRiskFactor,
  updateRiskFactor,
  RiskFactor,
} from "../../action/RiskFactorsPocket";
import {
  getLazaretoEntriesByRiskFactorId,
  createLazaretoEntry,
  deleteLazaretoEntriesByRiskFactorId,
} from "../../action/LazaretoEntriesPocket";
import {
  getEnfermedadesEntriesByRiskFactorId,
  createEnfermedadEntry,
  deleteEnfermedadesEntriesByRiskFactorId,
} from "../../action/EnfermedadesEntriesPocket";

interface LazaretoEntry {
  id?: string;
  fecha_entrada: string;
  lote_edad: string;
  motivo: string;
  cantidad_animales: string;
}

interface EnfermedadEntry {
  id?: string;
  nombre: string;
  n_animales_afectados: string;
  en_tratamiento: boolean;
  separacion_afectados: boolean;
}

interface Props {
  onNext: () => void;
  onBack: () => void;
  evaluationId: string | null;
}

const initialRiskForm = {
  // Datos de la visita
  fecha_hora: "",
  temperatura_exterior: "",
  humedad_exterior: "",
  nave_evaluada: "",
  
  // Datos ambientales
  temperatura: "",
  humedad: "",
  co2: "",
  nh3: "",
  velocidad_aire: "",
  flujo_agua: "",
  
  // Evaluación de animales
  comportamiento_inactivo: false,
  cojeras: false,
  tos: false,
  estereotipias: false,
  desuniformidad: false,
  lesiones_piel: false,
  heridas: false,
  diarrea: false,
  cola_mordida: false,
  orejas_mordidas: false,

  // Animales evaluados - Estado de raboteo
  raboteados: "",
  sin_rabotear: "",
  
  // Animales evaluados - Reproductoras
  cerdas_gestantes: "",
  cerdas_gestantes_raboteadas: "",
  cerdas_gestantes_sin_rabotear: "",
  cerdas_parideras: "",
  cerdas_parideras_raboteadas: "",
  cerdas_parideras_sin_rabotear: "",
  lechones: "",
  lechones_raboteados: "",
  lechones_sin_rabotear: "",
  
  // Animales evaluados - Por categoría
  reposicion_num: "",
  reposicion_peso: "",
  reposicion_rega: "",
  reposicion_raboteados: "",
  reposicion_sin_rabotear: "",
  transicion_num: "",
  transicion_peso: "",
  transicion_rega: "",
  transicion_raboteados: "",
  transicion_sin_rabotear: "",
  cebo_num: "",
  cebo_peso: "",
  cebo_rega: "",
  cebo_raboteados: "",
  cebo_sin_rabotear: "",

  // Densidad y material manipulable
  cumple_densidad: false,
  material_manipulable: false,
  superficie_animal: "",
  peso_medio_animales: "",
  
  // Material de enriquecimiento
  tipo_material: "",
  comestible: false,
  masticable: false,
  explorable: false,
  manipulable: false,
  n_puntos_acceso: "",
  localizacion_material: "",
  accesibilidad_material: "",
  periodicidad_renovacion: "",
  estado_conservacion_material: "",
  higiene_material: "",
  competencia_material: "",
  n_cerdos_exploran: "",
  n_cerdos_interactuan: "",
  
  // Condiciones ambientales
  valoracion_confort_termico: "",
  temblor: false,
  arqueo: false,
  apinamiento: false,
  jadeo: false,
  pelaje_erizado: false,
  ventilacion: "",
  iluminacion: "",
  co2_valoracion: "",
  co2_medicion: "",
  nh3_valoracion: "",
  nh3_medicion: "",
  otro_gas_nombre: "",
  otro_gas_valoracion: "",
  otro_gas_medicion: "",
  otro_gas_2_nombre: "",
  otro_gas_2_valoracion: "",
  otro_gas_2_medicion: "",
  humedad_valoracion: "",
  humedad_medicion: "",
  medicion_caudal_aire: "",

  // Estado de las instalaciones
  aspecto_estructural: "",
  sistema_climatizacion: "",
  limpieza_general: "",

  // Sistemas y equipamiento
  calidad_bebederos: "",
  calidad_comederos: "",
  agua_disponibilidad: "",

  // Estado sanitario
  bajas_ultimo_mes: "",
  tratamientos_grupales_ultimo_mes: "",
  tratamientos_individuales_ultimo_mes: "",

  // Alimentación
  tipo_pienso: "",
  frecuencia_suministro: "",
  forma_suministro: "",
  adecuada_categoria_edad: false,
  contiene_aminoacidos: false,
  control_analitico: false,
  tipo_control: "",
  estado_conservacion_alimento: "",
  funcionamiento_comederos: "",
  funcionamiento_bebederos: "",
  temperatura_agua_bebedero: "",

  // Genética
  genetica_materna: "",
  raza_cruce: "",
  observa_agresividad: false,
  
  // Mordeduras - Rabo
  mordedura_rabo_aprecian: false,
  mordedura_rabo_porcentaje: "",
  mordedura_rabo_puntuacion_1: "",
  mordedura_rabo_puntuacion_2: "",
  
  // Mordeduras - Orejas
  mordedura_orejas_aprecian: false,
  mordedura_orejas_porcentaje: "",
  
  // Mordeduras - Vulva
  mordedura_vulva_aprecian: false,
  mordedura_vulva_porcentaje: "",
  
  // Mordeduras - Otras
  mordedura_otras_aprecian: false,
  mordedura_otras_porcentaje: "",
  mordedura_otras_localizacion: "",

  // Observaciones y cálculo
  observaciones: "",
  valor_a: "",
  valor_b: "",
  interaction_level: 0,
  
  // Datos anidados
  lazareto: [] as LazaretoEntry[],
  enfermedades: [] as EnfermedadEntry[],
};

const WelfareEvaluationStep2: React.FC<Props> = ({ onNext, onBack, evaluationId }) => {
  const { token, record } = useUserStore();
  
  const [facilities, setFacilities] = useState<WelfareFacility[]>([]);
  const [riskForms, setRiskForms] = useState<{ [facilityId: string]: typeof initialRiskForm }>({});
  const [evaluation, setEvaluation] = useState<WelfareEvaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "info" });

  // Cargar instalaciones y factores de riesgo
  useEffect(() => {
    const loadData = async () => {
      if (!evaluationId || !token) return;

      setLoading(true);
      try {
        const [evaluationData, facilitiesData] = await Promise.all([
          getWelfareEvaluationById(token, evaluationId, record.id),
          getWelfareFacilitiesByEvaluationId(token, evaluationId),
        ]);
        setEvaluation(evaluationData);
        const facilitiesData2 = facilitiesData;
        setFacilities(facilitiesData2);

        // Cargar factores de riesgo para cada instalación
        const riskFormsData: { [key: string]: typeof initialRiskForm } = {};
        for (const facility of facilitiesData2) {
          if (facility.id) {
            const riskFactor = await getRiskFactorByFacilityId(token, facility.id);
            
            if (riskFactor && riskFactor.id) {
              // Load lazareto and enfermedades entries
              const lazaretoEntries = await getLazaretoEntriesByRiskFactorId(token, riskFactor.id);
              const enfermedadesEntries = await getEnfermedadesEntriesByRiskFactorId(token, riskFactor.id);

              riskFormsData[facility.id] = {
                // Datos de la visita
                fecha_hora: riskFactor.fecha_hora
                  ? riskFactor.fecha_hora.split(" ")[0].split("T")[0]
                  : "",
                temperatura_exterior: riskFactor.temperatura_exterior?.toString() || "",
                humedad_exterior: riskFactor.humedad_exterior?.toString() || "",
                nave_evaluada: riskFactor.nave_evaluada || "",
                // Datos ambientales
                temperatura: riskFactor.temperatura?.toString() || "",
                humedad: riskFactor.humedad?.toString() || "",
                co2: riskFactor.co2?.toString() || "",
                nh3: riskFactor.nh3?.toString() || "",
                velocidad_aire: riskFactor.velocidad_aire?.toString() || "",
                flujo_agua: riskFactor.flujo_agua?.toString() || "",
                // Evaluación de animales
                comportamiento_inactivo: riskFactor.comportamiento_inactivo || false,
                cojeras: riskFactor.cojeras || false,
                tos: riskFactor.tos || false,
                estereotipias: riskFactor.estereotipias || false,
                desuniformidad: riskFactor.desuniformidad || false,
                lesiones_piel: riskFactor.lesiones_piel || false,
                heridas: riskFactor.heridas || false,
                diarrea: riskFactor.diarrea || false,
                cola_mordida: riskFactor.cola_mordida || false,
                orejas_mordidas: riskFactor.orejas_mordidas || false,
                // Animales evaluados
                raboteados: riskFactor.raboteados?.toString() || "",
                sin_rabotear: riskFactor.sin_rabotear?.toString() || "",
                cerdas_gestantes: riskFactor.cerdas_gestantes?.toString() || "",
                cerdas_gestantes_raboteadas: riskFactor.cerdas_gestantes_raboteadas?.toString() || "",
                cerdas_gestantes_sin_rabotear: riskFactor.cerdas_gestantes_sin_rabotear?.toString() || "",
                cerdas_parideras: riskFactor.cerdas_parideras?.toString() || "",
                cerdas_parideras_raboteadas: riskFactor.cerdas_parideras_raboteadas?.toString() || "",
                cerdas_parideras_sin_rabotear: riskFactor.cerdas_parideras_sin_rabotear?.toString() || "",
                lechones: riskFactor.lechones?.toString() || "",
                lechones_raboteados: riskFactor.lechones_raboteados?.toString() || "",
                lechones_sin_rabotear: riskFactor.lechones_sin_rabotear?.toString() || "",
                reposicion_num: riskFactor.reposicion_num?.toString() || "",
                reposicion_peso: riskFactor.reposicion_peso?.toString() || "",
                reposicion_rega: riskFactor.reposicion_rega || "",
                reposicion_raboteados: riskFactor.reposicion_raboteados?.toString() || "",
                reposicion_sin_rabotear: riskFactor.reposicion_sin_rabotear?.toString() || "",
                transicion_num: riskFactor.transicion_num?.toString() || "",
                transicion_peso: riskFactor.transicion_peso?.toString() || "",
                transicion_rega: riskFactor.transicion_rega || "",
                transicion_raboteados: riskFactor.transicion_raboteados?.toString() || "",
                transicion_sin_rabotear: riskFactor.transicion_sin_rabotear?.toString() || "",
                cebo_num: riskFactor.cebo_num?.toString() || "",
                cebo_peso: riskFactor.cebo_peso?.toString() || "",
                cebo_rega: riskFactor.cebo_rega || "",
                cebo_raboteados: riskFactor.cebo_raboteados?.toString() || "",
                cebo_sin_rabotear: riskFactor.cebo_sin_rabotear?.toString() || "",
                // Densidad
                cumple_densidad: riskFactor.cumple_densidad || false,
                material_manipulable: riskFactor.material_manipulable || false,
                superficie_animal: riskFactor.superficie_animal?.toString() || "",
                peso_medio_animales: riskFactor.peso_medio_animales?.toString() || "",
                // Material de enriquecimiento
                tipo_material: riskFactor.tipo_material || "",
                comestible: riskFactor.comestible || false,
                masticable: riskFactor.masticable || false,
                explorable: riskFactor.explorable || false,
                manipulable: riskFactor.manipulable || false,
                n_puntos_acceso: riskFactor.n_puntos_acceso?.toString() || "",
                localizacion_material: riskFactor.localizacion_material || "",
                accesibilidad_material: riskFactor.accesibilidad_material || "",
                periodicidad_renovacion: riskFactor.periodicidad_renovacion || "",
                estado_conservacion_material: riskFactor.estado_conservacion_material || "",
                higiene_material: riskFactor.higiene_material || "",
                competencia_material: riskFactor.competencia_material || "",
                n_cerdos_exploran: riskFactor.n_cerdos_exploran?.toString() || "",
                n_cerdos_interactuan: riskFactor.n_cerdos_interactuan?.toString() || "",
                // Condiciones ambientales
                valoracion_confort_termico: riskFactor.valoracion_confort_termico || "",
                temblor: riskFactor.temblor || false,
                arqueo: riskFactor.arqueo || false,
                apinamiento: riskFactor.apinamiento || false,
                jadeo: riskFactor.jadeo || false,
                pelaje_erizado: riskFactor.pelaje_erizado || false,
                ventilacion: riskFactor.ventilacion || "",
                iluminacion: riskFactor.iluminacion || "",
                co2_valoracion: riskFactor.co2_valoracion || "",
                co2_medicion: riskFactor.co2_medicion?.toString() || "",
                nh3_valoracion: riskFactor.nh3_valoracion || "",
                nh3_medicion: riskFactor.nh3_medicion?.toString() || "",
                otro_gas_nombre: riskFactor.otro_gas_nombre || "",
                otro_gas_valoracion: riskFactor.otro_gas_valoracion || "",
                otro_gas_medicion: riskFactor.otro_gas_medicion?.toString() || "",
                otro_gas_2_nombre: riskFactor.otro_gas_2_nombre || "",
                otro_gas_2_valoracion: riskFactor.otro_gas_2_valoracion || "",
                otro_gas_2_medicion: riskFactor.otro_gas_2_medicion?.toString() || "",
                humedad_valoracion: riskFactor.humedad_valoracion || "",
                humedad_medicion: riskFactor.humedad_medicion?.toString() || "",
                medicion_caudal_aire: riskFactor.medicion_caudal_aire?.toString() || "",
                // Estado de las instalaciones
                aspecto_estructural: riskFactor.aspecto_estructural || "",
                sistema_climatizacion: riskFactor.sistema_climatizacion || "",
                limpieza_general: riskFactor.limpieza_general || "",
                // Sistemas y equipamiento
                calidad_bebederos: riskFactor.calidad_bebederos || "",
                calidad_comederos: riskFactor.calidad_comederos || "",
                agua_disponibilidad: riskFactor.agua_disponibilidad || "",
                // Estado sanitario
                bajas_ultimo_mes: riskFactor.bajas_ultimo_mes?.toString() || "",
                tratamientos_grupales_ultimo_mes: riskFactor.tratamientos_grupales_ultimo_mes?.toString() || "",
                tratamientos_individuales_ultimo_mes: riskFactor.tratamientos_individuales_ultimo_mes?.toString() || "",
                // Alimentación
                tipo_pienso: riskFactor.tipo_pienso || "",
                frecuencia_suministro: riskFactor.frecuencia_suministro || "",
                forma_suministro: riskFactor.forma_suministro || "",
                adecuada_categoria_edad: riskFactor.adecuada_categoria_edad || false,
                contiene_aminoacidos: riskFactor.contiene_aminoacidos || false,
                control_analitico: riskFactor.control_analitico || false,
                tipo_control: riskFactor.tipo_control || "",
                estado_conservacion_alimento: riskFactor.estado_conservacion_alimento || "",
                funcionamiento_comederos: riskFactor.funcionamiento_comederos || "",
                funcionamiento_bebederos: riskFactor.funcionamiento_bebederos || "",
                temperatura_agua_bebedero: riskFactor.temperatura_agua_bebedero?.toString() || "",
                // Genética
                genetica_materna: riskFactor.genetica_materna || "",
                raza_cruce: riskFactor.raza_cruce || "",
                observa_agresividad: riskFactor.observa_agresividad || false,
                // Mordeduras
                mordedura_rabo_aprecian: riskFactor.mordedura_rabo_aprecian || false,
                mordedura_rabo_porcentaje: riskFactor.mordedura_rabo_porcentaje?.toString() || "",
                mordedura_rabo_puntuacion_1: riskFactor.mordedura_rabo_puntuacion_1?.toString() || "",
                mordedura_rabo_puntuacion_2: riskFactor.mordedura_rabo_puntuacion_2?.toString() || "",
                mordedura_orejas_aprecian: riskFactor.mordedura_orejas_aprecian || false,
                mordedura_orejas_porcentaje: riskFactor.mordedura_orejas_porcentaje?.toString() || "",
                mordedura_vulva_aprecian: riskFactor.mordedura_vulva_aprecian || false,
                mordedura_vulva_porcentaje: riskFactor.mordedura_vulva_porcentaje?.toString() || "",
                mordedura_otras_aprecian: riskFactor.mordedura_otras_aprecian || false,
                mordedura_otras_porcentaje: riskFactor.mordedura_otras_porcentaje?.toString() || "",
                mordedura_otras_localizacion: riskFactor.mordedura_otras_localizacion || "",
                // Observaciones
                observaciones: riskFactor.observaciones || "",
                valor_a: riskFactor.valor_a?.toString() || "",
                valor_b: riskFactor.valor_b?.toString() || "",
                interaction_level: riskFactor.interaction_level || 0,
                // Nested data
                lazareto: lazaretoEntries.map(entry => ({
                  id: entry.id,
                  fecha_entrada: entry.fecha_entrada
                    ? entry.fecha_entrada.split(" ")[0].split("T")[0]
                    : "",
                  lote_edad: entry.lote_edad || "",
                  motivo: entry.motivo || "",
                  cantidad_animales: entry.cantidad_animales?.toString() || "",
                })),
                enfermedades: enfermedadesEntries.map(entry => ({
                  id: entry.id,
                  nombre: entry.nombre || "",
                  n_animales_afectados: entry.n_animales_afectados?.toString() || "",
                  en_tratamiento: entry.en_tratamiento || false,
                  separacion_afectados: entry.separacion_afectados || false,
                })),
              };
            } else {
              riskFormsData[facility.id] = { ...initialRiskForm };
            }
          }
        }
        setRiskForms(riskFormsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [evaluationId, token]);

  // Manejar cambios en formulario
  const handleChange = (facilityId: string, field: string, value: any) => {
    setRiskForms((prev) => ({
      ...prev,
      [facilityId]: {
        ...prev[facilityId],
        [field]: value,
      },
    }));
  };

  // Handlers for Lazareto table
  const handleAddLazareto = (facilityId: string) => {
    setRiskForms((prev) => ({
      ...prev,
      [facilityId]: {
        ...prev[facilityId],
        lazareto: [
          ...prev[facilityId].lazareto,
          { fecha_entrada: "", lote_edad: "", motivo: "", cantidad_animales: "" }
        ]
      }
    }));
  };

  const handleRemoveLazareto = (facilityId: string, index: number) => {
    setRiskForms((prev) => ({
      ...prev,
      [facilityId]: {
        ...prev[facilityId],
        lazareto: prev[facilityId].lazareto.filter((_, i) => i !== index)
      }
    }));
  };

  const handleLazaretoChange = (facilityId: string, index: number, field: keyof LazaretoEntry, value: any) => {
    setRiskForms((prev) => {
      const updated = { ...prev };
      const lazareto = [...updated[facilityId].lazareto];
      lazareto[index] = { ...lazareto[index], [field]: value };
      updated[facilityId] = { ...updated[facilityId], lazareto };
      return updated;
    });
  };

  // Handlers for Enfermedades table
  const handleAddEnfermedad = (facilityId: string) => {
    setRiskForms((prev) => ({
      ...prev,
      [facilityId]: {
        ...prev[facilityId],
        enfermedades: [
          ...prev[facilityId].enfermedades,
          { nombre: "", n_animales_afectados: "", en_tratamiento: false, separacion_afectados: false }
        ]
      }
    }));
  };

  const handleRemoveEnfermedad = (facilityId: string, index: number) => {
    setRiskForms((prev) => ({
      ...prev,
      [facilityId]: {
        ...prev[facilityId],
        enfermedades: prev[facilityId].enfermedades.filter((_, i) => i !== index)
      }
    }));
  };

  const handleEnfermedadChange = (facilityId: string, index: number, field: keyof EnfermedadEntry, value: any) => {
    setRiskForms((prev) => {
      const updated = { ...prev };
      const enfermedades = [...updated[facilityId].enfermedades];
      enfermedades[index] = { ...enfermedades[index], [field]: value };
      updated[facilityId] = { ...updated[facilityId], enfermedades };
      return updated;
    });
  };

  // Guardar todos los factores de riesgo
  const handleSaveAll = async () => {
    if (!evaluationId || !token) return;

    setSaving(true);
    try {
      for (const facility of facilities) {
        if (!facility.id) continue;

        const form = riskForms[facility.id];
        if (!form) continue;

        const riskData = {
          evaluation_id: evaluationId,
          facility_id: facility.id,
          // Datos de la visita
          fecha_hora: form.fecha_hora || undefined,
          temperatura_exterior: Number(form.temperatura_exterior) || undefined,
          humedad_exterior: Number(form.humedad_exterior) || undefined,
          nave_evaluada: form.nave_evaluada || undefined,
          // Datos ambientales
          temperatura: Number(form.temperatura) || undefined,
          humedad: Number(form.humedad) || undefined,
          co2: Number(form.co2) || undefined,
          nh3: Number(form.nh3) || undefined,
          velocidad_aire: Number(form.velocidad_aire) || undefined,
          flujo_agua: Number(form.flujo_agua) || undefined,
          // Evaluación de animales
          comportamiento_inactivo: form.comportamiento_inactivo,
          cojeras: form.cojeras,
          tos: form.tos,
          estereotipias: form.estereotipias,
          desuniformidad: form.desuniformidad,
          lesiones_piel: form.lesiones_piel,
          heridas: form.heridas,
          diarrea: form.diarrea,
          cola_mordida: form.cola_mordida,
          orejas_mordidas: form.orejas_mordidas,
          // Animales evaluados
          raboteados: Number(form.raboteados) || undefined,
          sin_rabotear: Number(form.sin_rabotear) || undefined,
          cerdas_gestantes: Number(form.cerdas_gestantes) || undefined,
          cerdas_gestantes_raboteadas: Number(form.cerdas_gestantes_raboteadas) || undefined,
          cerdas_gestantes_sin_rabotear: Number(form.cerdas_gestantes_sin_rabotear) || undefined,
          cerdas_parideras: Number(form.cerdas_parideras) || undefined,
          cerdas_parideras_raboteadas: Number(form.cerdas_parideras_raboteadas) || undefined,
          cerdas_parideras_sin_rabotear: Number(form.cerdas_parideras_sin_rabotear) || undefined,
          lechones: Number(form.lechones) || undefined,
          lechones_raboteados: Number(form.lechones_raboteados) || undefined,
          lechones_sin_rabotear: Number(form.lechones_sin_rabotear) || undefined,
          reposicion_num: Number(form.reposicion_num) || undefined,
          reposicion_peso: Number(form.reposicion_peso) || undefined,
          reposicion_rega: form.reposicion_rega || undefined,
          reposicion_raboteados: Number(form.reposicion_raboteados) || undefined,
          reposicion_sin_rabotear: Number(form.reposicion_sin_rabotear) || undefined,
          transicion_num: Number(form.transicion_num) || undefined,
          transicion_peso: Number(form.transicion_peso) || undefined,
          transicion_rega: form.transicion_rega || undefined,
          transicion_raboteados: Number(form.transicion_raboteados) || undefined,
          transicion_sin_rabotear: Number(form.transicion_sin_rabotear) || undefined,
          cebo_num: Number(form.cebo_num) || undefined,
          cebo_peso: Number(form.cebo_peso) || undefined,
          cebo_rega: form.cebo_rega || undefined,
          cebo_raboteados: Number(form.cebo_raboteados) || undefined,
          cebo_sin_rabotear: Number(form.cebo_sin_rabotear) || undefined,
          // Densidad
          cumple_densidad: form.cumple_densidad,
          material_manipulable: form.material_manipulable,
          superficie_animal: Number(form.superficie_animal) || undefined,
          peso_medio_animales: Number(form.peso_medio_animales) || undefined,
          // Material de enriquecimiento
          tipo_material: form.tipo_material || undefined,
          comestible: form.comestible,
          masticable: form.masticable,
          explorable: form.explorable,
          manipulable: form.manipulable,
          n_puntos_acceso: form.n_puntos_acceso || undefined,
          localizacion_material: form.localizacion_material || undefined,
          accesibilidad_material: form.accesibilidad_material || undefined,
          periodicidad_renovacion: form.periodicidad_renovacion || undefined,
          estado_conservacion_material: form.estado_conservacion_material || undefined,
          higiene_material: form.higiene_material || undefined,
          competencia_material: form.competencia_material || undefined,
          n_cerdos_exploran: Number(form.n_cerdos_exploran) || undefined,
          n_cerdos_interactuan: Number(form.n_cerdos_interactuan) || undefined,
          // Condiciones ambientales
          valoracion_confort_termico: form.valoracion_confort_termico || undefined,
          temblor: form.temblor,
          arqueo: form.arqueo,
          apinamiento: form.apinamiento,
          jadeo: form.jadeo,
          pelaje_erizado: form.pelaje_erizado,
          ventilacion: form.ventilacion || undefined,
          iluminacion: form.iluminacion || undefined,
          co2_valoracion: form.co2_valoracion || undefined,
          co2_medicion: Number(form.co2_medicion) || undefined,
          nh3_valoracion: form.nh3_valoracion || undefined,
          nh3_medicion: Number(form.nh3_medicion) || undefined,
          otro_gas_nombre: form.otro_gas_nombre || undefined,
          otro_gas_valoracion: form.otro_gas_valoracion || undefined,
          otro_gas_medicion: Number(form.otro_gas_medicion) || undefined,
          otro_gas_2_nombre: form.otro_gas_2_nombre || undefined,
          otro_gas_2_valoracion: form.otro_gas_2_valoracion || undefined,
          otro_gas_2_medicion: Number(form.otro_gas_2_medicion) || undefined,
          humedad_valoracion: form.humedad_valoracion || undefined,
          humedad_medicion: Number(form.humedad_medicion) || undefined,
          medicion_caudal_aire: Number(form.medicion_caudal_aire) || undefined,
          // Estado de las instalaciones
          aspecto_estructural: form.aspecto_estructural || undefined,
          sistema_climatizacion: form.sistema_climatizacion || undefined,
          limpieza_general: form.limpieza_general || undefined,
          // Sistemas y equipamiento
          calidad_bebederos: form.calidad_bebederos || undefined,
          calidad_comederos: form.calidad_comederos || undefined,
          agua_disponibilidad: form.agua_disponibilidad || undefined,
          // Estado sanitario
          bajas_ultimo_mes: Number(form.bajas_ultimo_mes) || undefined,
          tratamientos_grupales_ultimo_mes: Number(form.tratamientos_grupales_ultimo_mes) || undefined,
          tratamientos_individuales_ultimo_mes: Number(form.tratamientos_individuales_ultimo_mes) || undefined,
          // Alimentación
          tipo_pienso: form.tipo_pienso || undefined,
          frecuencia_suministro: form.frecuencia_suministro || undefined,
          forma_suministro: form.forma_suministro || undefined,
          adecuada_categoria_edad: form.adecuada_categoria_edad,
          contiene_aminoacidos: form.contiene_aminoacidos,
          control_analitico: form.control_analitico,
          tipo_control: form.tipo_control || undefined,
          estado_conservacion_alimento: form.estado_conservacion_alimento || undefined,
          funcionamiento_comederos: form.funcionamiento_comederos || undefined,
          funcionamiento_bebederos: form.funcionamiento_bebederos || undefined,
          temperatura_agua_bebedero: Number(form.temperatura_agua_bebedero) || undefined,
          // Genética
          genetica_materna: form.genetica_materna || undefined,
          raza_cruce: form.raza_cruce || undefined,
          observa_agresividad: form.observa_agresividad,
          // Mordeduras
          mordedura_rabo_aprecian: form.mordedura_rabo_aprecian,
          mordedura_rabo_porcentaje: Number(form.mordedura_rabo_porcentaje) || undefined,
          mordedura_rabo_puntuacion_1: Number(form.mordedura_rabo_puntuacion_1) || undefined,
          mordedura_rabo_puntuacion_2: Number(form.mordedura_rabo_puntuacion_2) || undefined,
          mordedura_orejas_aprecian: form.mordedura_orejas_aprecian,
          mordedura_orejas_porcentaje: Number(form.mordedura_orejas_porcentaje) || undefined,
          mordedura_vulva_aprecian: form.mordedura_vulva_aprecian,
          mordedura_vulva_porcentaje: Number(form.mordedura_vulva_porcentaje) || undefined,
          mordedura_otras_aprecian: form.mordedura_otras_aprecian,
          mordedura_otras_porcentaje: Number(form.mordedura_otras_porcentaje) || undefined,
          mordedura_otras_localizacion: form.mordedura_otras_localizacion || undefined,
          // Observaciones
          observaciones: form.observaciones || undefined,
          valor_a: Number(form.n_cerdos_exploran) || undefined,
          valor_b: Number(form.n_cerdos_interactuan) || undefined,
          interaction_level: (() => {
            const nA = Number(form.n_cerdos_exploran) || 0;
            const nB = Number(form.n_cerdos_interactuan) || 0;
            return nA + nB > 0 ? Math.round((100 * nA) / (nA + nB)) : 0;
          })(),
        };

        // Verificar si ya existe
        const existing = await getRiskFactorByFacilityId(token, facility.id);
        let riskFactorId: string;
        
        if (existing?.id) {
          await updateRiskFactor(token, existing.id, riskData);
          riskFactorId = existing.id;
        } else {
          const created = await createRiskFactor(token, riskData);
          riskFactorId = created.data.id;
        }

        // Save lazareto entries
        await deleteLazaretoEntriesByRiskFactorId(token, riskFactorId);
        for (const lazaretoEntry of form.lazareto) {
          if (lazaretoEntry.fecha_entrada || lazaretoEntry.motivo) {
            await createLazaretoEntry(token, {
              risk_factor_id: riskFactorId,
              fecha_entrada: lazaretoEntry.fecha_entrada,
              lote_edad: lazaretoEntry.lote_edad,
              motivo: lazaretoEntry.motivo,
              cantidad_animales: Number(lazaretoEntry.cantidad_animales) || 0,
            });
          }
        }

        // Save enfermedades entries
        await deleteEnfermedadesEntriesByRiskFactorId(token, riskFactorId);
        for (const enfermedadEntry of form.enfermedades) {
          if (enfermedadEntry.nombre) {
            await createEnfermedadEntry(token, {
              risk_factor_id: riskFactorId,
              nombre: enfermedadEntry.nombre,
              n_animales_afectados: Number(enfermedadEntry.n_animales_afectados) || 0,
              en_tratamiento: enfermedadEntry.en_tratamiento,
              separacion_afectados: enfermedadEntry.separacion_afectados,
            });
          }
        }
      }

      setSnackbar({
        open: true,
        message: "Factores de riesgo guardados exitosamente",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Error al guardar factores de riesgo",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
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
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
        Ficha de Evaluación: Factores de Riesgo de Caudofagia
      </Typography>

      {facilities.length === 0 && (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            No hay instalaciones registradas. Completa el paso anterior primero.
          </Typography>
        </Paper>
      )}

      {facilities.map((facility) => {
        const facilityId = facility.id!;
        const form = riskForms[facilityId] ?? { ...initialRiskForm };
        const niveA = parseFloat(form.n_cerdos_exploran) || 0;
        const niveB = parseFloat(form.n_cerdos_interactuan) || 0;
        const nivelInteractuacion = niveA + niveB === 0 ? "—" : `${Math.round((100 * niveA) / (niveA + niveB))}%`;

        return (
          <Paper key={facilityId} sx={{ mb: 3, overflow: "hidden" }}>
            {/* Facility header */}
            <Box sx={{ px: 2.5, py: 1.5, bgcolor: "grey.100", borderBottom: "1px solid", borderColor: "divider" }}>
              <Typography variant="subtitle1" fontWeight={600}>
                🏠 {facility.facility_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Fase: {facility.phase} · Animales: {facility.animales_alojados} · Superficie: {facility.m2_superficie} m²
              </Typography>
            </Box>

            {/* ─── Sección 1: Datos generales ─── */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2" fontWeight={600}>1 · Datos generales de la explotación</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth size="small" label="Nombre de la explotación" value={evaluation?.farm_name ?? ""} disabled />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth size="small" label="Titular de la explotación" value={evaluation?.owner_name ?? ""} disabled />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth size="small" label="Código REGA" value={evaluation?.rega_code ?? ""} disabled />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth size="small" label="Clasificación zootécnica" value={evaluation?.zootechnical_class ?? ""} disabled />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth size="small" label="Cualificación sanitaria" value={evaluation?.health_qualification ?? ""} disabled />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth size="small" label="Integradora" value={evaluation?.integrator ?? ""} disabled />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="Fecha / hora de la visita" type="date"
                      InputLabelProps={{ shrink: true }}
                      value={form.fecha_hora}
                      onChange={(e) => handleChange(facilityId, "fecha_hora", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth size="small" label="Nave evaluada" select
                      value={form.nave_evaluada}
                      onChange={(e) => handleChange(facilityId, "nave_evaluada", e.target.value)}
                    >
                      {["Maternidad", "Transición", "Cebo", "Gestación", "Reposición"].map((o) => (
                        <MenuItem key={o} value={o}>{o}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth size="small" label="Temperatura exterior (°C)" type="number"
                      value={form.temperatura_exterior}
                      onChange={(e) => handleChange(facilityId, "temperatura_exterior", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth size="small" label="Humedad relativa exterior (%)" type="number" inputProps={{ min: 0, max: 100 }}
                      value={form.humedad_exterior}
                      onChange={(e) => handleChange(facilityId, "humedad_exterior", e.target.value)}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* ─── Sección 2: Animales evaluados ─── */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2" fontWeight={600}>2 · Animales evaluados</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "grey.100" }}>
                      <TableRow>
                        <TableCell>Categoría</TableCell>
                        <TableCell align="center">Raboteados</TableCell>
                        <TableCell align="center">Sin rabotear</TableCell>
                        <TableCell align="center">Peso medio (kg)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        { label: "Cerdas gestantes", r: "cerdas_gestantes_raboteadas", s: "cerdas_gestantes_sin_rabotear", p: null },
                        { label: "Cerdas en parideras", r: "cerdas_parideras_raboteadas", s: "cerdas_parideras_sin_rabotear", p: null },
                        { label: "Lechones", r: "lechones_raboteados", s: "lechones_sin_rabotear", p: null },
                        { label: "Reposición", r: "reposicion_raboteados", s: "reposicion_sin_rabotear", p: "reposicion_peso" },
                        { label: "Transición", r: "transicion_raboteados", s: "transicion_sin_rabotear", p: "transicion_peso" },
                        { label: "Cebo", r: "cebo_raboteados", s: "cebo_sin_rabotear", p: "cebo_peso" },
                      ].map(({ label, r, s, p }) => (
                        <TableRow key={label}>
                          <TableCell>{label}</TableCell>
                          <TableCell>
                            <TextField size="small" type="number" inputProps={{ min: 0 }} sx={{ width: 80 }}
                              value={(form as any)[r]} onChange={(e) => handleChange(facilityId, r, e.target.value)} />
                          </TableCell>
                          <TableCell>
                            <TextField size="small" type="number" inputProps={{ min: 0 }} sx={{ width: 80 }}
                              value={(form as any)[s]} onChange={(e) => handleChange(facilityId, s, e.target.value)} />
                          </TableCell>
                          <TableCell>
                            <TextField size="small" type="number" inputProps={{ min: 0 }} sx={{ width: 80 }}
                              disabled={!p} value={p ? (form as any)[p] : ""}
                              onChange={(e) => p && handleChange(facilityId, p, e.target.value)} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>

            {/* ─── Sección 3: Densidad de cuadras ─── */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2" fontWeight={600}>3 · Densidad de cuadras</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="Superficie disponible / animal (m²/animal)" type="number" inputProps={{ min: 0, step: 0.01 }}
                      value={form.superficie_animal}
                      onChange={(e) => handleChange(facilityId, "superficie_animal", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="Peso medio de los animales (kg)" type="number" inputProps={{ min: 0, step: 0.1 }}
                      value={form.peso_medio_animales}
                      onChange={(e) => handleChange(facilityId, "peso_medio_animales", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl>
                      <FormLabel sx={{ fontSize: 13 }}>¿Cumple densidad por normativa?</FormLabel>
                      <RadioGroup row value={form.cumple_densidad ? "SI" : "NO"}
                        onChange={(e) => handleChange(facilityId, "cumple_densidad", e.target.value === "SI")}>
                        <FormControlLabel value="SI" control={<Radio size="small" />} label="Sí" />
                        <FormControlLabel value="NO" control={<Radio size="small" />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* ─── Sección 4: Material de enriquecimiento ─── */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2" fontWeight={600}>4 · Material de enriquecimiento</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth size="small" label="Tipo de material / materiales" placeholder="Ej: cadenas, cuerdas, juguetes..."
                      value={form.tipo_material}
                      onChange={(e) => handleChange(facilityId, "tipo_material", e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider><Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".04em" }}>Características del material</Typography></Divider>
                  </Grid>
                  {[
                    { field: "comestible", label: "Comestible" },
                    { field: "masticable", label: "Masticable" },
                    { field: "explorable", label: "Explorable" },
                    { field: "manipulable", label: "Manipulable" },
                  ].map(({ field, label }) => (
                    <Grid item xs={6} sm={3} key={field}>
                      <FormControlLabel
                        control={<Checkbox size="small" checked={(form as any)[field]}
                          onChange={(e) => handleChange(facilityId, field, e.target.checked)} />}
                        label={label}
                      />
                    </Grid>
                  ))}

                  <Grid item xs={12}>
                    <Divider><Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".04em" }}>Disposición y gestión</Typography></Divider>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="N° puntos de acceso / N° animales (ej: 1/20)"
                      value={form.n_puntos_acceso}
                      onChange={(e) => handleChange(facilityId, "n_puntos_acceso", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="Localización"
                      value={form.localizacion_material}
                      onChange={(e) => handleChange(facilityId, "localizacion_material", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="Accesibilidad"
                      value={form.accesibilidad_material}
                      onChange={(e) => handleChange(facilityId, "accesibilidad_material", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="Periodicidad de renovación" placeholder="Ej: diaria, semanal..."
                      value={form.periodicidad_renovacion}
                      onChange={(e) => handleChange(facilityId, "periodicidad_renovacion", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="Estado de conservación" select
                      value={form.estado_conservacion_material}
                      onChange={(e) => handleChange(facilityId, "estado_conservacion_material", e.target.value)}
                    >
                      {["Bueno", "Regular", "Malo"].map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="Higiene" select
                      value={form.higiene_material}
                      onChange={(e) => handleChange(facilityId, "higiene_material", e.target.value)}
                    >
                      {["Buena", "Regular", "Mala"].map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider><Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".04em" }}>Nivel de interactuación</Typography></Divider>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth size="small" type="number" inputProps={{ min: 0 }}
                      label="(A) Nº cerdos que exploran material de enriquecimiento"
                      value={form.n_cerdos_exploran}
                      onChange={(e) => handleChange(facilityId, "n_cerdos_exploran", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth size="small" type="number" inputProps={{ min: 0 }}
                      label="(B) Nº cerdos que interactúan con otros cerdos / accesorios"
                      value={form.n_cerdos_interactuan}
                      onChange={(e) => handleChange(facilityId, "n_cerdos_interactuan", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Box sx={{ bgcolor: "primary.50", border: "1px solid", borderColor: "primary.200", borderRadius: 1, p: 1.5, textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <Typography variant="h5" color="primary.main" fontWeight={600}>{nivelInteractuacion}</Typography>
                      <Typography variant="caption" color="text.secondary">Nivel (100×A/(A+B))</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* ─── Sección 5: Condiciones ambientales ─── */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2" fontWeight={600}>5 · Condiciones ambientales</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="Temperatura nave (°C)" type="number" inputProps={{ step: 0.1 }}
                      value={form.temperatura}
                      onChange={(e) => handleChange(facilityId, "temperatura", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="Valoración confort térmico" select
                      value={form.valoracion_confort_termico}
                      onChange={(e) => handleChange(facilityId, "valoracion_confort_termico", e.target.value)}
                    >
                      {["Óptimo", "Frío leve", "Calor leve", "Frío intenso", "Calor intenso"].map((o) => (
                        <MenuItem key={o} value={o}>{o}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider><Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".04em" }}>Signos clínicos observados</Typography></Divider>
                  </Grid>
                  {[
                    { field: "temblor", label: "Temblor" },
                    { field: "apinamiento", label: "Agrupamiento (acaloramiento)" },
                    { field: "jadeo", label: "Jadeo" },
                    { field: "pelaje_erizado", label: "Pelaje erizado" },
                  ].map(({ field, label }) => (
                    <Grid item xs={12} sm={3} key={field}>
                      <FormControlLabel
                        control={<Checkbox size="small" checked={(form as any)[field]}
                          onChange={(e) => handleChange(facilityId, field, e.target.checked)} />}
                        label={label}
                      />
                    </Grid>
                  ))}

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="Ventilación" select
                      value={form.ventilacion}
                      onChange={(e) => handleChange(facilityId, "ventilacion", e.target.value)}
                    >
                      {["Buena", "Regular", "Mala"].map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="Iluminación" select
                      value={form.iluminacion}
                      onChange={(e) => handleChange(facilityId, "iluminacion", e.target.value)}
                    >
                      {["Adecuada", "Excesiva", "Insuficiente"].map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </TextField>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* ─── Sección 6: Lazareto ─── */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2" fontWeight={600}>6 · Lazareto</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "grey.100" }}>
                      <TableRow>
                        <TableCell>Fecha entrada</TableCell>
                        <TableCell>Lote Nº / Edad</TableCell>
                        <TableCell>Motivo de entrada</TableCell>
                        <TableCell>Cantidad animales</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {form.lazareto.map((entry, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <TextField size="small" type="date" InputLabelProps={{ shrink: true }}
                              value={entry.fecha_entrada}
                              onChange={(e) => handleLazaretoChange(facilityId, idx, "fecha_entrada", e.target.value)} />
                          </TableCell>
                          <TableCell>
                            <TextField size="small" placeholder="Ej: Lote 3 / 8 semanas"
                              value={entry.lote_edad}
                              onChange={(e) => handleLazaretoChange(facilityId, idx, "lote_edad", e.target.value)} />
                          </TableCell>
                          <TableCell>
                            <TextField size="small" placeholder="Causa"
                              value={entry.motivo}
                              onChange={(e) => handleLazaretoChange(facilityId, idx, "motivo", e.target.value)} />
                          </TableCell>
                          <TableCell>
                            <TextField size="small" type="number" inputProps={{ min: 0 }} sx={{ width: 90 }}
                              value={entry.cantidad_animales}
                              onChange={(e) => handleLazaretoChange(facilityId, idx, "cantidad_animales", e.target.value)} />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" color="error" onClick={() => handleRemoveLazareto(facilityId, idx)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {form.lazareto.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Typography variant="caption" color="text.secondary">Sin entradas. Añade una fila.</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ mt: 1 }}>
                  <Button size="small" startIcon={<AddIcon />} onClick={() => handleAddLazareto(facilityId)}>
                    Añadir entrada
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* ─── Sección 7: Estado sanitario ─── */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2" fontWeight={600}>7 · Estado sanitario</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth size="small" label="Bajas último mes" type="number" inputProps={{ min: 0 }}
                      value={form.bajas_ultimo_mes}
                      onChange={(e) => handleChange(facilityId, "bajas_ultimo_mes", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth size="small" label="Tratamientos grupales (último mes)" type="number" inputProps={{ min: 0 }}
                      value={form.tratamientos_grupales_ultimo_mes}
                      onChange={(e) => handleChange(facilityId, "tratamientos_grupales_ultimo_mes", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth size="small" label="Tratamientos individuales (último mes)" type="number" inputProps={{ min: 0 }}
                      value={form.tratamientos_individuales_ultimo_mes}
                      onChange={(e) => handleChange(facilityId, "tratamientos_individuales_ultimo_mes", e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider><Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".04em" }}>Enfermedades / lesiones detectadas</Typography></Divider>
                  </Grid>
                  <Grid item xs={12}>
                    <TableContainer>
                      <Table size="small">
                        <TableHead sx={{ bgcolor: "grey.100" }}>
                          <TableRow>
                            <TableCell>Enfermedad / lesión</TableCell>
                            <TableCell align="center">Nº afectados</TableCell>
                            <TableCell align="center">En tratamiento</TableCell>
                            <TableCell align="center">Separación afectados</TableCell>
                            <TableCell />
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {form.enfermedades.map((entry, idx) => (
                            <TableRow key={idx}>
                              <TableCell>
                                <TextField size="small" fullWidth placeholder="Descripción"
                                  value={entry.nombre}
                                  onChange={(e) => handleEnfermedadChange(facilityId, idx, "nombre", e.target.value)} />
                              </TableCell>
                              <TableCell>
                                <TextField size="small" type="number" inputProps={{ min: 0 }} sx={{ width: 80 }}
                                  value={entry.n_animales_afectados}
                                  onChange={(e) => handleEnfermedadChange(facilityId, idx, "n_animales_afectados", e.target.value)} />
                              </TableCell>
                              <TableCell align="center">
                                <Checkbox size="small" checked={entry.en_tratamiento}
                                  onChange={(e) => handleEnfermedadChange(facilityId, idx, "en_tratamiento", e.target.checked)} />
                              </TableCell>
                              <TableCell align="center">
                                <Checkbox size="small" checked={entry.separacion_afectados}
                                  onChange={(e) => handleEnfermedadChange(facilityId, idx, "separacion_afectados", e.target.checked)} />
                              </TableCell>
                              <TableCell>
                                <IconButton size="small" color="error" onClick={() => handleRemoveEnfermedad(facilityId, idx)}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                          {form.enfermedades.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} align="center">
                                <Typography variant="caption" color="text.secondary">Sin enfermedades registradas.</Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box sx={{ mt: 1 }}>
                      <Button size="small" startIcon={<AddIcon />} onClick={() => handleAddEnfermedad(facilityId)}>
                        Añadir enfermedad / lesión
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* ─── Sección 8: Alimentación ─── */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2" fontWeight={600}>8 · Alimentación</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={<Checkbox size="small" checked={form.adecuada_categoria_edad}
                        onChange={(e) => handleChange(facilityId, "adecuada_categoria_edad", e.target.checked)} />}
                      label="Adecuada a categoría y edad del animal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={<Checkbox size="small" checked={form.contiene_aminoacidos}
                        onChange={(e) => handleChange(facilityId, "contiene_aminoacidos", e.target.checked)} />}
                      label="Contiene aminoácidos esenciales (incl. Triptófano)"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={<Checkbox size="small" checked={form.control_analitico}
                        onChange={(e) => handleChange(facilityId, "control_analitico", e.target.checked)} />}
                      label="Se realiza control analítico del pienso"
                    />
                  </Grid>
                  {form.control_analitico && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth size="small" label="Tipo de control (toxinas, bacteriano, nutricional...)"
                        placeholder="Indicar tipo si se realiza"
                        value={form.tipo_control}
                        onChange={(e) => handleChange(facilityId, "tipo_control", e.target.value)}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="Tipo de pienso"
                      value={form.tipo_pienso}
                      onChange={(e) => handleChange(facilityId, "tipo_pienso", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="Frecuencia de suministro"
                      value={form.frecuencia_suministro}
                      onChange={(e) => handleChange(facilityId, "frecuencia_suministro", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth size="small" label="Estado de conservación del alimento" select
                      value={form.estado_conservacion_alimento}
                      onChange={(e) => handleChange(facilityId, "estado_conservacion_alimento", e.target.value)}
                    >
                      {["Bien", "Regular", "Mal"].map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth size="small" label="Funcionamiento de los comederos" select
                      value={form.funcionamiento_comederos}
                      onChange={(e) => handleChange(facilityId, "funcionamiento_comederos", e.target.value)}
                    >
                      {["Bien", "Regular", "Mal"].map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth size="small" label="Funcionamiento de los bebederos" select
                      value={form.funcionamiento_bebederos}
                      onChange={(e) => handleChange(facilityId, "funcionamiento_bebederos", e.target.value)}
                    >
                      {["Bien", "Regular", "Mal"].map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth size="small" label="Temperatura agua bebedero (°C)" type="number" inputProps={{ step: 0.1 }}
                      value={form.temperatura_agua_bebedero}
                      onChange={(e) => handleChange(facilityId, "temperatura_agua_bebedero", e.target.value)}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* ─── Sección 9: Genética y mordeduras ─── */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2" fontWeight={600}>9 · Genética y mordeduras</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>

                  {/* Genética */}
                  <Grid item xs={12}>
                    <Divider><Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".04em" }}>Genética</Typography></Divider>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="Raza / cruce" placeholder="Ej: Duroc × Pietrain"
                      value={form.raza_cruce}
                      onChange={(e) => handleChange(facilityId, "raza_cruce", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl>
                      <FormLabel sx={{ fontSize: 13 }}>¿Se observa agresividad?</FormLabel>
                      <RadioGroup row value={form.observa_agresividad ? "SI" : "NO"}
                        onChange={(e) => handleChange(facilityId, "observa_agresividad", e.target.value === "SI")}>
                        <FormControlLabel value="SI" control={<Radio size="small" />} label="Sí" />
                        <FormControlLabel value="NO" control={<Radio size="small" />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {/* Mordeduras de rabo */}
                  <Grid item xs={12}>
                    <Divider><Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".04em" }}>Mordeduras de rabo</Typography></Divider>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl>
                      <FormLabel sx={{ fontSize: 13 }}>¿Se aprecian mordeduras?</FormLabel>
                      <RadioGroup row value={form.mordedura_rabo_aprecian ? "SI" : "NO"}
                        onChange={(e) => handleChange(facilityId, "mordedura_rabo_aprecian", e.target.value === "SI")}>
                        <FormControlLabel value="SI" control={<Radio size="small" />} label="Sí" />
                        <FormControlLabel value="NO" control={<Radio size="small" />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={2.67}>
                    <TextField
                      fullWidth size="small" label="% animales afectados" type="number" inputProps={{ min: 0, max: 100 }}
                      value={form.mordedura_rabo_porcentaje}
                      onChange={(e) => handleChange(facilityId, "mordedura_rabo_porcentaje", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2.67}>
                    <TextField
                      fullWidth size="small" label="% lesiones puntuación 1" type="number" inputProps={{ min: 0, max: 100 }}
                      value={form.mordedura_rabo_puntuacion_1}
                      onChange={(e) => handleChange(facilityId, "mordedura_rabo_puntuacion_1", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2.66}>
                    <TextField
                      fullWidth size="small" label="% lesiones puntuación 2" type="number" inputProps={{ min: 0, max: 100 }}
                      value={form.mordedura_rabo_puntuacion_2}
                      onChange={(e) => handleChange(facilityId, "mordedura_rabo_puntuacion_2", e.target.value)}
                    />
                  </Grid>

                  {/* Mordeduras de orejas */}
                  <Grid item xs={12}>
                    <Divider><Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".04em" }}>Mordeduras de orejas</Typography></Divider>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl>
                      <FormLabel sx={{ fontSize: 13 }}>¿Se aprecian mordeduras?</FormLabel>
                      <RadioGroup row value={form.mordedura_orejas_aprecian ? "SI" : "NO"}
                        onChange={(e) => handleChange(facilityId, "mordedura_orejas_aprecian", e.target.value === "SI")}>
                        <FormControlLabel value="SI" control={<Radio size="small" />} label="Sí" />
                        <FormControlLabel value="NO" control={<Radio size="small" />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="% animales afectados" type="number" inputProps={{ min: 0, max: 100 }}
                      value={form.mordedura_orejas_porcentaje}
                      onChange={(e) => handleChange(facilityId, "mordedura_orejas_porcentaje", e.target.value)}
                    />
                  </Grid>

                  {/* Mordeduras en vulva */}
                  <Grid item xs={12}>
                    <Divider><Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".04em" }}>Mordeduras en vulva</Typography></Divider>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl>
                      <FormLabel sx={{ fontSize: 13 }}>¿Se aprecian mordeduras?</FormLabel>
                      <RadioGroup row value={form.mordedura_vulva_aprecian ? "SI" : "NO"}
                        onChange={(e) => handleChange(facilityId, "mordedura_vulva_aprecian", e.target.value === "SI")}>
                        <FormControlLabel value="SI" control={<Radio size="small" />} label="Sí" />
                        <FormControlLabel value="NO" control={<Radio size="small" />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="% animales afectados" type="number" inputProps={{ min: 0, max: 100 }}
                      value={form.mordedura_vulva_porcentaje}
                      onChange={(e) => handleChange(facilityId, "mordedura_vulva_porcentaje", e.target.value)}
                    />
                  </Grid>

                  {/* Mordeduras en otras localizaciones */}
                  <Grid item xs={12}>
                    <Divider><Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".04em" }}>Mordeduras en otras localizaciones</Typography></Divider>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl>
                      <FormLabel sx={{ fontSize: 13 }}>¿Se aprecian lesiones?</FormLabel>
                      <RadioGroup row value={form.mordedura_otras_aprecian ? "SI" : "NO"}
                        onChange={(e) => handleChange(facilityId, "mordedura_otras_aprecian", e.target.value === "SI")}>
                        <FormControlLabel value="SI" control={<Radio size="small" />} label="Sí" />
                        <FormControlLabel value="NO" control={<Radio size="small" />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth size="small" label="Indicar localización lesionada" placeholder="Ej: flancos, abdomen..."
                      value={form.mordedura_otras_localizacion}
                      onChange={(e) => handleChange(facilityId, "mordedura_otras_localizacion", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth size="small" label="% animales afectados" type="number" inputProps={{ min: 0, max: 100 }}
                      value={form.mordedura_otras_porcentaje}
                      onChange={(e) => handleChange(facilityId, "mordedura_otras_porcentaje", e.target.value)}
                    />
                  </Grid>

                  {/* Observaciones */}
                  <Grid item xs={12}>
                    <Divider><Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".04em" }}>Observaciones</Typography></Divider>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth size="small" multiline minRows={3}
                      label="Observaciones generales"
                      placeholder="Cualquier observación relevante durante la visita..."
                      value={form.observaciones}
                      onChange={(e) => handleChange(facilityId, "observaciones", e.target.value)}
                    />
                  </Grid>

                 
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Paper>
        );
      })}

      {/* Navigation */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="outlined" onClick={onBack}>Anterior</Button>
        <Button
          variant="contained"
          onClick={handleSaveAll}
          disabled={saving}
          sx={buttonStyles.primary}
        >
          {saving ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
          Guardar
        </Button>
        <Button variant="contained" onClick={onNext} sx={buttonStyles.primary}>Siguiente</Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WelfareEvaluationStep2;
