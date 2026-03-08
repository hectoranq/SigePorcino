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
  type PlanBienestarStep2,
  type PhaseManagement,
  getPlanBienestarStep2ByFarmId,
  createPlanBienestarStep2,
  updatePlanBienestarStep2,
} from "../../action/PlanBienestarStep2Pocket";

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

const PlanBienestarAccionStep2: React.FC<Props> = ({ onNext, onBack }) => {
  const { token, record } = useUserStore();
  const { currentFarm } = useFarmFormStore();
  
  const [loading, setLoading] = useState(false);
  const [existingPlanId, setExistingPlanId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  
  // Phase data
  const [phases, setPhases] = useState<PhaseManagement[]>(
    FASES_PRODUCTIVAS.map(fase => ({
      fase,
      num_inspecciones_dia: 3,
      num_inspecciones_equipamiento_dia: 2,
    }))
  );
  
  // Form data
  const [formData, setFormData] = useState({
    frecuencia_limpieza: "Diaria",
    num_trabajadores: 3,
    trabajadores_formacion_bienestar: 3,
    separacion_tamanos: true,
    separacion_enfermos_heridos: true,
    separacion_otros: "",
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
    const response = await getPlanBienestarStep2ByFarmId(token, record.id, currentFarm.id);
    setLoading(false);
    
    if (response.success && response.data) {
      const data = response.data;
      setExistingPlanId(data.id || null);
      
      // Parse phases
      if (data.fases_manejo) {
        try {
          const parsed = typeof data.fases_manejo === 'string'
            ? JSON.parse(data.fases_manejo)
            : data.fases_manejo;
          setPhases(parsed);
        } catch (e) {
          console.error("Error parsing fases_manejo:", e);
        }
      }
      
      // Set form data
      setFormData({
        frecuencia_limpieza: data.frecuencia_limpieza || "",
        num_trabajadores: data.num_trabajadores || 0,
        trabajadores_formacion_bienestar: data.trabajadores_formacion_bienestar || 0,
        separacion_tamanos: data.separacion_tamanos || false,
        separacion_enfermos_heridos: data.separacion_enfermos_heridos || false,
        separacion_otros: data.separacion_otros || "",
      });
    }
  };

  const handlePhaseChange = (index: number, field: keyof PhaseManagement, value: any) => {
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
    
    const planData: PlanBienestarStep2 = {
      user_id: record.id,
      farm_id: currentFarm.id,
      fases_manejo: JSON.stringify(phases),
      ...formData,
    };

    let response;
    if (existingPlanId) {
      response = await updatePlanBienestarStep2(token, existingPlanId, planData);
    } else {
      response = await createPlanBienestarStep2(token, planData);
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
          Manejo y Personal
        </Typography>

        {/* Tabla de Fases */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Inspecciones por Fase Productiva
        </Typography>
        
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell><strong>Fase Productiva</strong></TableCell>
                <TableCell align="center"><strong>Nº Inspecciones/Día</strong></TableCell>
                <TableCell align="center"><strong>Nº Inspecciones Equipamiento/Día</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {phases.map((phase, index) => (
                <TableRow key={index}>
                  <TableCell>{phase.fase}</TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      size="small"
                      value={phase.num_inspecciones_dia}
                      onChange={(e) => handlePhaseChange(index, "num_inspecciones_dia", parseInt(e.target.value) || 0)}
                      sx={{ width: 80 }}
                      inputProps={{ min: 0 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      size="small"
                      value={phase.num_inspecciones_equipamiento_dia}
                      onChange={(e) => handlePhaseChange(index, "num_inspecciones_equipamiento_dia", parseInt(e.target.value) || 0)}
                      sx={{ width: 80 }}
                      inputProps={{ min: 0 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Datos Generales */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Personal y Limpieza
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Frecuencia de limpieza de corralinas"
              fullWidth
              variant="filled"
              value={formData.frecuencia_limpieza}
              onChange={(e) => handleInputChange("frecuencia_limpieza", e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Nº de trabajadores"
              fullWidth
              variant="filled"
              type="number"
              value={formData.num_trabajadores}
              onChange={(e) => handleInputChange("num_trabajadores", parseInt(e.target.value) || 0)}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Trabajadores con formación en bienestar animal"
              fullWidth
              variant="filled"
              type="number"
              value={formData.trabajadores_formacion_bienestar}
              onChange={(e) => handleInputChange("trabajadores_formacion_bienestar", parseInt(e.target.value) || 0)}
              inputProps={{ min: 0 }}
              helperText="Número de trabajadores formados (no puede superar el total de trabajadores)"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.separacion_tamanos}
                  onChange={(e) => handleInputChange("separacion_tamanos", e.target.checked)}
                />
              }
              label="Separación por tamaños"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.separacion_enfermos_heridos}
                  onChange={(e) => handleInputChange("separacion_enfermos_heridos", e.target.checked)}
                />
              }
              label="Separación de enfermos/heridos"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Otras separaciones"
              fullWidth
              variant="filled"
              multiline
              rows={3}
              value={formData.separacion_otros}
              onChange={(e) => handleInputChange("separacion_otros", e.target.value)}
              placeholder="Describe otras separaciones realizadas..."
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

export default PlanBienestarAccionStep2;
