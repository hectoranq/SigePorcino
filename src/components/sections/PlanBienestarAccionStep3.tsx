import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
} from "@mui/material";
import { buttonStyles } from "./buttonStyles";
import useUserStore from "../../_store/user";
import useFarmFormStore from "../../_store/farm";
import {
  type PlanBienestarStep3,
  type PhaseFeeding,
  getPlanBienestarStep3ByFarmId,
  createPlanBienestarStep3,
  updatePlanBienestarStep3,
} from "../../action/PlanBienestarStep3Pocket";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const FASES_PRODUCTIVAS = [
  "GESTACIÓN SIN CONFIRMAR",
  "GESTACIÓN CONFIRMADA",
  "PARIDERA",
  "TRANSICIÓN",
  "CEBO",
  "REPOSICIÓN",
  "VERRACOS",
  "LAZARETO",
];

const PlanBienestarAccionStep3: React.FC<Props> = ({ onNext, onBack }) => {
  const { token, record } = useUserStore();
  const { currentFarm } = useFarmFormStore();
  
  const [loading, setLoading] = useState(false);
  const [existingPlanId, setExistingPlanId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  
  // Phase data
  const [phases, setPhases] = useState<PhaseFeeding[]>(
    FASES_PRODUCTIVAS.map(fase => ({
      fase,
      alimentacion_ad_libitum: true,
      tipo_comedero: "Tolva",
      longitud_comedero: "0.30",
      tipo_bebederos: "Chupete",
      num_bebederos: "1",
    }))
  );
  
  // Form data
  const [formData, setFormData] = useState({
    alimentacion_racionada: false,
    num_comidas_dia: 2,
    porcentaje_fibra_pienso: 5.0,
    origen_agua_bebida: "Red pública",
    control_calidad_agua: true,
  });

  // Load existing data
  useEffect(() => {
    if (token && record.id && currentFarm?.id) {
      loadExistingData();
    }
  }, [token, record.id, currentFarm?.id]);

  const loadExistingData = async () => {
    if (!token || !record.id || !currentFarm?.id) return;
    
    setLoading(true);
    const response = await getPlanBienestarStep3ByFarmId(token, record.id, currentFarm.id);
    setLoading(false);
    
    if (response.success && response.data) {
      const data = response.data;
      setExistingPlanId(data.id || null);
      
      // Parse phases
      if (data.fases_alimentacion) {
        try {
          const parsed = typeof data.fases_alimentacion === 'string'
            ? JSON.parse(data.fases_alimentacion)
            : data.fases_alimentacion;
          setPhases(parsed);
        } catch (e) {
          console.error("Error parsing fases_alimentacion:", e);
        }
      }
      
      // Set form data
      setFormData({
        alimentacion_racionada: data.alimentacion_racionada || false,
        num_comidas_dia: data.num_comidas_dia || 0,
        porcentaje_fibra_pienso: data.porcentaje_fibra_pienso || 0,
        origen_agua_bebida: data.origen_agua_bebida || "",
        control_calidad_agua: data.control_calidad_agua || false,
      });
    }
  };

  const handlePhaseChange = (index: number, field: keyof PhaseFeeding, value: any) => {
    const newPhases = [...phases];
    (newPhases[index] as any)[field] = value;
    setPhases(newPhases);
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    if (!token || !record.id || !currentFarm?.id) {
      setSnackbar({ open: true, message: "Error: No hay granja seleccionada", severity: "error" });
      return;
    }

    setLoading(true);
    
    const planData: PlanBienestarStep3 = {
      user_id: record.id,
      farm_id: currentFarm.id,
      fases_alimentacion: JSON.stringify(phases),
      ...formData,
    };

    let response;
    if (existingPlanId) {
      response = await updatePlanBienestarStep3(token, existingPlanId, planData);
    } else {
      response = await createPlanBienestarStep3(token, planData);
    }
    
    setLoading(false);
    
    if (response.success) {
      setSnackbar({ open: true, message: response.message || "Datos guardados exitosamente", severity: "success" });
      if (response.data?.id) {
        setExistingPlanId(response.data.id);
      }
      setTimeout(() => onNext(), 500);
    } else {
      setSnackbar({ open: true, message: "Error: " + (response.message || "No se pudo guardar"), severity: "error" });
    }
  };

  if (!currentFarm) {
    return (
      <Alert severity="warning">
        Por favor, selecciona una granja para continuar
      </Alert>
    );
  }

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 4, border: "1px solid", borderColor: "grey.300" }}>
        <Typography variant="h6" sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}>
          Alimentación y Abrevado
        </Typography>

        {/* Tabla de Fases */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Alimentación por Fase Productiva
        </Typography>
        
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 4, overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell><strong>Fase</strong></TableCell>
                <TableCell align="center"><strong>Ad Libitum</strong></TableCell>
                <TableCell><strong>Tipo Comedero</strong></TableCell>
                <TableCell align="center"><strong>Sup. Comedero (cm2)</strong></TableCell>
                <TableCell><strong>Tipo Bebedero</strong></TableCell>
                <TableCell align="center"><strong>Nº Bebederos</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {phases.map((phase, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{phase.fase}</TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={phase.alimentacion_ad_libitum}
                      onChange={(e) => handlePhaseChange(index, "alimentacion_ad_libitum", e.target.checked)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={phase.tipo_comedero}
                      onChange={(e) => handlePhaseChange(index, "tipo_comedero", e.target.value)}
                      sx={{ minWidth: 100 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="text"
                      size="small"
                      value={phase.longitud_comedero}
                      onChange={(e) => handlePhaseChange(index, "longitud_comedero", e.target.value)}
                      sx={{ width: 80 }}
                      placeholder="0.30"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={phase.tipo_bebederos}
                      onChange={(e) => handlePhaseChange(index, "tipo_bebederos", e.target.value)}
                      sx={{ minWidth: 100 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="text"
                      size="small"
                      value={phase.num_bebederos}
                      onChange={(e) => handlePhaseChange(index, "num_bebederos", e.target.value)}
                      sx={{ width: 70 }}
                      placeholder="1"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Datos Generales */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Datos Generales de Alimentación y Agua
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.alimentacion_racionada}
                  onChange={(e) => handleInputChange("alimentacion_racionada", e.target.checked)}
                />
              }
              label="Alimentación racionada"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Nº de comidas al día"
              fullWidth
              variant="filled"
              type="number"
              value={formData.num_comidas_dia}
              onChange={(e) => handleInputChange("num_comidas_dia", parseInt(e.target.value) || 0)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="% de fibra en el pienso"
              fullWidth
              variant="filled"
              type="number"
              inputProps={{ step: 0.1, min: 0, max: 100 }}
              value={formData.porcentaje_fibra_pienso}
              onChange={(e) => handleInputChange("porcentaje_fibra_pienso", parseFloat(e.target.value) || 0)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Origen del agua de bebida"
              fullWidth
              variant="filled"
              value={formData.origen_agua_bebida}
              onChange={(e) => handleInputChange("origen_agua_bebida", e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.control_calidad_agua}
                  onChange={(e) => handleInputChange("control_calidad_agua", e.target.checked)}
                />
              }
              label="Control de calidad del agua (Análisis regulares)"
            />
          </Grid>
        </Grid>

        {/* Navigation */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            disabled={loading}
            sx={buttonStyles.back}
          >
            Atrás
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            sx={buttonStyles.next}
          >
            {loading ? "Guardando..." : "Guardar y Continuar"}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlanBienestarAccionStep3;
