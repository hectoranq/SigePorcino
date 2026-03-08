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
  Checkbox,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import useUserStore from "../../_store/user";
import { buttonStyles } from "./buttonStyles";
import {
  getWelfareFacilitiesByEvaluationId,
  WelfareFacility,
} from "../../action/WelfareFacilitiesPocket";
import {
  getRiskFactorByFacilityId,
  createRiskFactor,
  updateRiskFactor,
  RiskFactor,
} from "../../action/RiskFactorsPocket";

interface Props {
  onNext: () => void;
  onBack: () => void;
  evaluationId: string | null;
}

const initialRiskForm = {
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

  // Densidad y material manipulable
  cumple_densidad: false,
  material_manipulable: false,

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

  // Genética materna
  genetica_materna: "",

  // Observaciones y cálculo
  valor_a: "",
  valor_b: "",
  interaction_level: 0,
};

const WelfareEvaluationStep2: React.FC<Props> = ({ onNext, onBack, evaluationId }) => {
  const { token } = useUserStore();
  
  const [facilities, setFacilities] = useState<WelfareFacility[]>([]);
  const [riskForms, setRiskForms] = useState<{ [facilityId: string]: typeof initialRiskForm }>({});
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
        const facilitiesData = await getWelfareFacilitiesByEvaluationId(token, evaluationId);
        setFacilities(facilitiesData);

        // Cargar factores de riesgo para cada instalación
        const riskFormsData: { [key: string]: typeof initialRiskForm } = {};
        for (const facility of facilitiesData) {
          if (facility.id) {
            const riskFactor = await getRiskFactorByFacilityId(token, facility.id);
            if (riskFactor) {
              riskFormsData[facility.id] = {
                temperatura: riskFactor.temperatura?.toString() || "",
                humedad: riskFactor.humedad?.toString() || "",
                co2: riskFactor.co2?.toString() || "",
                nh3: riskFactor.nh3?.toString() || "",
                velocidad_aire: riskFactor.velocidad_aire?.toString() || "",
                flujo_agua: riskFactor.flujo_agua?.toString() || "",
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
                cumple_densidad: riskFactor.cumple_densidad || false,
                material_manipulable: riskFactor.material_manipulable || false,
                aspecto_estructural: riskFactor.aspecto_estructural || "",
                sistema_climatizacion: riskFactor.sistema_climatizacion || "",
                limpieza_general: riskFactor.limpieza_general || "",
                calidad_bebederos: riskFactor.calidad_bebederos || "",
                calidad_comederos: riskFactor.calidad_comederos || "",
                agua_disponibilidad: riskFactor.agua_disponibilidad || "",
                bajas_ultimo_mes: riskFactor.bajas_ultimo_mes?.toString() || "",
                tratamientos_grupales_ultimo_mes: riskFactor.tratamientos_grupales_ultimo_mes?.toString() || "",
                tratamientos_individuales_ultimo_mes: riskFactor.tratamientos_individuales_ultimo_mes?.toString() || "",
                tipo_pienso: riskFactor.tipo_pienso || "",
                frecuencia_suministro: riskFactor.frecuencia_suministro || "",
                forma_suministro: riskFactor.forma_suministro || "",
                genetica_materna: riskFactor.genetica_materna || "",
                valor_a: riskFactor.valor_a?.toString() || "",
                valor_b: riskFactor.valor_b?.toString() || "",
                interaction_level: riskFactor.interaction_level || 0,
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
    setRiskForms((prev) => {
      const updated = {
        ...prev,
        [facilityId]: {
          ...prev[facilityId],
          [field]: value,
        },
      };

      // Calcular interaction_level si cambian valor_a o valor_b
      if (field === "valor_a" || field === "valor_b") {
        const form = updated[facilityId];
        const a = Number(form.valor_a) || 0;
        const b = Number(form.valor_b) || 0;
        if (a + b > 0) {
          form.interaction_level = (100 * a) / (a + b);
        } else {
          form.interaction_level = 0;
        }
      }

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
          temperatura: Number(form.temperatura) || undefined,
          humedad: Number(form.humedad) || undefined,
          co2: Number(form.co2) || undefined,
          nh3: Number(form.nh3) || undefined,
          velocidad_aire: Number(form.velocidad_aire) || undefined,
          flujo_agua: Number(form.flujo_agua) || undefined,
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
          cumple_densidad: form.cumple_densidad,
          material_manipulable: form.material_manipulable,
          aspecto_estructural: form.aspecto_estructural,
          sistema_climatizacion: form.sistema_climatizacion,
          limpieza_general: form.limpieza_general,
          calidad_bebederos: form.calidad_bebederos,
          calidad_comederos: form.calidad_comederos,
          agua_disponibilidad: form.agua_disponibilidad,
          bajas_ultimo_mes: Number(form.bajas_ultimo_mes) || undefined,
          tratamientos_grupales_ultimo_mes: Number(form.tratamientos_grupales_ultimo_mes) || undefined,
          tratamientos_individuales_ultimo_mes: Number(form.tratamientos_individuales_ultimo_mes) || undefined,
          tipo_pienso: form.tipo_pienso,
          frecuencia_suministro: form.frecuencia_suministro,
          forma_suministro: form.forma_suministro,
          genetica_materna: form.genetica_materna,
          valor_a: Number(form.valor_a) || undefined,
          valor_b: Number(form.valor_b) || undefined,
          interaction_level: form.interaction_level,
        };

        // Verificar si ya existe
        const existing = await getRiskFactorByFacilityId(token, facility.id);
        if (existing?.id) {
          await updateRiskFactor(token, existing.id, riskData);
        } else {
          await createRiskFactor(token, riskData);
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
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
          Factores de Riesgo por Instalación
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Complete la evaluación de factores de riesgo para cada instalación registrada.
        </Typography>

        {facilities.map((facility) => {
          const form = riskForms[facility.id!] || initialRiskForm;
          
          return (
            <Accordion key={facility.id} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1" fontWeight={500}>
                  {facility.facility_name} - {facility.phase}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {/* Datos Ambientales */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Datos Ambientales
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Temperatura (°C)"
                      value={form.temperatura}
                      onChange={(e) => handleChange(facility.id!, "temperatura", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Humedad (%)"
                      value={form.humedad}
                      onChange={(e) => handleChange(facility.id!, "humedad", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="CO₂ (ppm)"
                      value={form.co2}
                      onChange={(e) => handleChange(facility.id!, "co2", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="NH₃ (ppm)"
                      value={form.nh3}
                      onChange={(e) => handleChange(facility.id!, "nh3", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Velocidad Aire (m/s)"
                      value={form.velocidad_aire}
                      onChange={(e) => handleChange(facility.id!, "velocidad_aire", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Flujo Agua (L/min)"
                      value={form.flujo_agua}
                      onChange={(e) => handleChange(facility.id!, "flujo_agua", e.target.value)}
                    />
                  </Grid>

                  {/* Evaluación de Animales */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                      Evaluación de Animales
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.comportamiento_inactivo}
                          onChange={(e) => handleChange(facility.id!, "comportamiento_inactivo", e.target.checked)}
                        />
                      }
                      label="Comportamiento Inactivo"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.cojeras}
                          onChange={(e) => handleChange(facility.id!, "cojeras", e.target.checked)}
                        />
                      }
                      label="Cojeras"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.tos}
                          onChange={(e) => handleChange(facility.id!, "tos", e.target.checked)}
                        />
                      }
                      label="Tos"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.estereotipias}
                          onChange={(e) => handleChange(facility.id!, "estereotipias", e.target.checked)}
                        />
                      }
                      label="Estereotipias"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.desuniformidad}
                          onChange={(e) => handleChange(facility.id!, "desuniformidad", e.target.checked)}
                        />
                      }
                      label="Desuniformidad"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.lesiones_piel}
                          onChange={(e) => handleChange(facility.id!, "lesiones_piel", e.target.checked)}
                        />
                      }
                      label="Lesiones en Piel"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.heridas}
                          onChange={(e) => handleChange(facility.id!, "heridas", e.target.checked)}
                        />
                      }
                      label="Heridas"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.diarrea}
                          onChange={(e) => handleChange(facility.id!, "diarrea", e.target.checked)}
                        />
                      }
                      label="Diarrea"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.cola_mordida}
                          onChange={(e) => handleChange(facility.id!, "cola_mordida", e.target.checked)}
                        />
                      }
                      label="Cola Mordida"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.orejas_mordidas}
                          onChange={(e) => handleChange(facility.id!, "orejas_mordidas", e.target.checked)}
                        />
                      }
                      label="Orejas Mordidas"
                    />
                  </Grid>

                  {/* Densidad y Material */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                      Densidad y Enriquecimiento
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.cumple_densidad}
                          onChange={(e) => handleChange(facility.id!, "cumple_densidad", e.target.checked)}
                        />
                      }
                      label="Cumple Densidad Normativa"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.material_manipulable}
                          onChange={(e) => handleChange(facility.id!, "material_manipulable", e.target.checked)}
                        />
                      }
                      label="Dispone de Material Manipulable"
                    />
                  </Grid>

                  {/* Estado Instalaciones */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                      Estado de las Instalaciones
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      select
                      label="Aspecto Estructural"
                      value={form.aspecto_estructural}
                      onChange={(e) => handleChange(facility.id!, "aspecto_estructural", e.target.value)}
                    >
                      <MenuItem value="Bueno">Bueno</MenuItem>
                      <MenuItem value="Regular">Regular</MenuItem>
                      <MenuItem value="Malo">Malo</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      select
                      label="Sistema de Climatización"
                      value={form.sistema_climatizacion}
                      onChange={(e) => handleChange(facility.id!, "sistema_climatizacion", e.target.value)}
                    >
                      <MenuItem value="Bueno">Bueno</MenuItem>
                      <MenuItem value="Regular">Regular</MenuItem>
                      <MenuItem value="Malo">Malo</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      select
                      label="Limpieza General"
                      value={form.limpieza_general}
                      onChange={(e) => handleChange(facility.id!, "limpieza_general", e.target.value)}
                    >
                      <MenuItem value="Buena">Buena</MenuItem>
                      <MenuItem value="Regular">Regular</MenuItem>
                      <MenuItem value="Mala">Mala</MenuItem>
                    </TextField>
                  </Grid>

                  {/* Sistemas */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                      Sistemas y Equipamiento
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      select
                      label="Calidad Bebederos"
                      value={form.calidad_bebederos}
                      onChange={(e) => handleChange(facility.id!, "calidad_bebederos", e.target.value)}
                    >
                      <MenuItem value="Buena">Buena</MenuItem>
                      <MenuItem value="Regular">Regular</MenuItem>
                      <MenuItem value="Mala">Mala</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      select
                      label="Calidad Comederos"
                      value={form.calidad_comederos}
                      onChange={(e) => handleChange(facility.id!, "calidad_comederos", e.target.value)}
                    >
                      <MenuItem value="Buena">Buena</MenuItem>
                      <MenuItem value="Regular">Regular</MenuItem>
                      <MenuItem value="Mala">Mala</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      select
                      label="Disponibilidad Agua"
                      value={form.agua_disponibilidad}
                      onChange={(e) => handleChange(facility.id!, "agua_disponibilidad", e.target.value)}
                    >
                      <MenuItem value="Adecuada">Adecuada</MenuItem>
                      <MenuItem value="Insuficiente">Insuficiente</MenuItem>
                    </TextField>
                  </Grid>

                  {/* Estado Sanitario */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                      Estado Sanitario (Último Mes)
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Bajas"
                      value={form.bajas_ultimo_mes}
                      onChange={(e) => handleChange(facility.id!, "bajas_ultimo_mes", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Tratamientos Grupales"
                      value={form.tratamientos_grupales_ultimo_mes}
                      onChange={(e) => handleChange(facility.id!, "tratamientos_grupales_ultimo_mes", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Tratamientos Individuales"
                      value={form.tratamientos_individuales_ultimo_mes}
                      onChange={(e) => handleChange(facility.id!, "tratamientos_individuales_ultimo_mes", e.target.value)}
                    />
                  </Grid>

                  {/* Alimentación */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                      Alimentación
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Tipo de Pienso"
                      value={form.tipo_pienso}
                      onChange={(e) => handleChange(facility.id!, "tipo_pienso", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Frecuencia de Suministro"
                      value={form.frecuencia_suministro}
                      onChange={(e) => handleChange(facility.id!, "frecuencia_suministro", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Forma de Suministro"
                      value={form.forma_suministro}
                      onChange={(e) => handleChange(facility.id!, "forma_suministro", e.target.value)}
                    />
                  </Grid>

                  {/* Genética */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                      Genética
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Genética Materna"
                      value={form.genetica_materna}
                      onChange={(e) => handleChange(facility.id!, "genetica_materna", e.target.value)}
                    />
                  </Grid>

                  {/* Nivel de Interacción */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                      Cálculo de Nivel de Interacción
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Valor A"
                      value={form.valor_a}
                      onChange={(e) => handleChange(facility.id!, "valor_a", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Valor B"
                      value={form.valor_b}
                      onChange={(e) => handleChange(facility.id!, "valor_b", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Nivel de Interacción (%)"
                      value={form.interaction_level.toFixed(2)}
                      disabled
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })}

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={handleSaveAll}
            disabled={saving}
            sx={buttonStyles.save}
          >
            {saving ? "Guardando..." : "Guardar Todos"}
          </Button>
        </Box>
      </Paper>

      {/* Botones de navegación */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" onClick={onBack} sx={buttonStyles.back}>
          Atrás
        </Button>
        <Button variant="contained" onClick={onNext} sx={buttonStyles.next}>
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

export default WelfareEvaluationStep2;
