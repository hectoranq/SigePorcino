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
  Checkbox,
  Alert,
  Snackbar,
} from "@mui/material";
import { buttonStyles } from "./buttonStyles";
import useUserStore from "../../_store/user";
import useFarmFormStore from "../../_store/farm";
import {
  type PlanBienestarStep5,
  type PhaseEnvironmental,
  getPlanBienestarStep5ByFarmId,
  createPlanBienestarStep5,
  updatePlanBienestarStep5,
} from "../../action/PlanBienestarStep5Pocket";

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

const PlanBienestarAccionStep5: React.FC<Props> = ({ onNext, onBack }) => {
  const { token, record } = useUserStore();
  const { currentFarm } = useFarmFormStore();
  
  const [loading, setLoading] = useState(false);
  const [existingPlanId, setExistingPlanId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  
  // Phase data
  const [phases, setPhases] = useState<PhaseEnvironmental[]>(
    FASES_PRODUCTIVAS.map(fase => ({
      fase,
      sensores_temperatura: true,
      sensores_temp_altura_animales: true,
      control_temperatura: true,
      registro_temperatura: true,
      sensores_humedad: false,
      sensores_hum_altura_animales: false,
      control_humedad: false,
      registro_humedad: false,
    }))
  );
  
  // Form data
  const [formData, setFormData] = useState({
    gases_indicados: "CO2, NH3",
    gases_registrados: true,
    extractores_ventiladores: true,
    apertura_automatica_ventanas: false,
    apertura_automatica_chimeneas: true,
    cumbreras: true,
    coolings: false,
    nebulizacion: true,
    ventilacion_total_artificial: false,
    calefaccion: true,
    iluminacion: "Natural + Artificial",
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
    const response = await getPlanBienestarStep5ByFarmId(token, record.id, currentFarm.id);
    setLoading(false);
    
    if (response.success && response.data) {
      const data = response.data;
      setExistingPlanId(data.id || null);
      
      // Parse phases
      if (data.fases_ambiental) {
        try {
          const parsed = typeof data.fases_ambiental === 'string'
            ? JSON.parse(data.fases_ambiental)
            : data.fases_ambiental;
          setPhases(parsed);
        } catch (e) {
          console.error("Error parsing fases_ambiental:", e);
        }
      }
      
      // Set form data
      setFormData({
        gases_indicados: data.gases_indicados || "",
        gases_registrados: data.gases_registrados || false,
        extractores_ventiladores: data.extractores_ventiladores || false,
        apertura_automatica_ventanas: data.apertura_automatica_ventanas || false,
        apertura_automatica_chimeneas: data.apertura_automatica_chimeneas || false,
        cumbreras: data.cumbreras || false,
        coolings: data.coolings || false,
        nebulizacion: data.nebulizacion || false,
        ventilacion_total_artificial: data.ventilacion_total_artificial || false,
        calefaccion: data.calefaccion || false,
        iluminacion: data.iluminacion || "",
      });
    }
  };

  const handlePhaseChange = (index: number, field: keyof PhaseEnvironmental, value: boolean) => {
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
    
    const planData: PlanBienestarStep5 = {
      user_id: record.id,
      farm_id: currentFarm.id,
      fases_ambiental: JSON.stringify(phases),
      ...formData,
    };

    let response;
    if (existingPlanId) {
      response = await updatePlanBienestarStep5(token, existingPlanId, planData);
    } else {
      response = await createPlanBienestarStep5(token, planData);
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
          Condiciones Ambientales
        </Typography>

        {/* Tabla de Fases */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Control Ambiental por Fase Productiva
        </Typography>
        
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 4, overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell rowSpan={2}><strong>Fase</strong></TableCell>
                <TableCell align="center" colSpan={4}><strong>Temperatura</strong></TableCell>
                <TableCell align="center" colSpan={4}><strong>Humedad</strong></TableCell>
              </TableRow>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell align="center" sx={{ fontSize: "0.75rem" }}>Sensores</TableCell>
                <TableCell align="center" sx={{ fontSize: "0.75rem" }}>Altura Animal</TableCell>
                <TableCell align="center" sx={{ fontSize: "0.75rem" }}>Control</TableCell>
                <TableCell align="center" sx={{ fontSize: "0.75rem" }}>Registro</TableCell>
                <TableCell align="center" sx={{ fontSize: "0.75rem" }}>Sensores</TableCell>
                <TableCell align="center" sx={{ fontSize: "0.75rem" }}>Altura Animal</TableCell>
                <TableCell align="center" sx={{ fontSize: "0.75rem" }}>Control</TableCell>
                <TableCell align="center" sx={{ fontSize: "0.75rem" }}>Registro</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {phases.map((phase, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ whiteSpace: "nowrap", fontSize: "0.85rem" }}>{phase.fase}</TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={phase.sensores_temperatura}
                      onChange={(e) => handlePhaseChange(index, "sensores_temperatura", e.target.checked)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={phase.sensores_temp_altura_animales}
                      onChange={(e) => handlePhaseChange(index, "sensores_temp_altura_animales", e.target.checked)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={phase.control_temperatura}
                      onChange={(e) => handlePhaseChange(index, "control_temperatura", e.target.checked)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={phase.registro_temperatura}
                      onChange={(e) => handlePhaseChange(index, "registro_temperatura", e.target.checked)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={phase.sensores_humedad}
                      onChange={(e) => handlePhaseChange(index, "sensores_humedad", e.target.checked)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={phase.sensores_hum_altura_animales}
                      onChange={(e) => handlePhaseChange(index, "sensores_hum_altura_animales", e.target.checked)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={phase.control_humedad}
                      onChange={(e) => handlePhaseChange(index, "control_humedad", e.target.checked)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={phase.registro_humedad}
                      onChange={(e) => handlePhaseChange(index, "registro_humedad", e.target.checked)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Datos Generales */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Equipamiento General
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Gases indicados"
              fullWidth
              variant="filled"
              value={formData.gases_indicados}
              onChange={(e) => handleInputChange("gases_indicados", e.target.value)}
              placeholder="ej: CO2, NH3, H2S"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
              <Typography>
                <Checkbox
                  checked={formData.gases_registrados}
                  onChange={(e) => handleInputChange("gases_registrados", e.target.checked)}
                />
                Gases registrados
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography>
              <Checkbox
                checked={formData.extractores_ventiladores}
                onChange={(e) => handleInputChange("extractores_ventiladores", e.target.checked)}
              />
              Extractores/Ventiladores
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography>
              <Checkbox
                checked={formData.apertura_automatica_ventanas}
                onChange={(e) => handleInputChange("apertura_automatica_ventanas", e.target.checked)}
              />
              Apertura automática de ventanas
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography>
              <Checkbox
                checked={formData.apertura_automatica_chimeneas}
                onChange={(e) => handleInputChange("apertura_automatica_chimeneas", e.target.checked)}
              />
              Apertura automática de chimeneas
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography>
              <Checkbox
                checked={formData.cumbreras}
                onChange={(e) => handleInputChange("cumbreras", e.target.checked)}
              />
              Cumbreras
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography>
              <Checkbox
                checked={formData.coolings}
                onChange={(e) => handleInputChange("coolings", e.target.checked)}
              />
              Coolings
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography>
              <Checkbox
                checked={formData.nebulizacion}
                onChange={(e) => handleInputChange("nebulizacion", e.target.checked)}
              />
              Nebulización
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography>
              <Checkbox
                checked={formData.ventilacion_total_artificial}
                onChange={(e) => handleInputChange("ventilacion_total_artificial", e.target.checked)}
              />
              Ventilación total artificial
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography>
              <Checkbox
                checked={formData.calefaccion}
                onChange={(e) => handleInputChange("calefaccion", e.target.checked)}
              />
              Calefacción
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Tipo de iluminación"
              fullWidth
              variant="filled"
              value={formData.iluminacion}
              onChange={(e) => handleInputChange("iluminacion", e.target.value)}
              placeholder="ej: Natural, Artificial, Natural + Artificial"
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

export default PlanBienestarAccionStep5;
