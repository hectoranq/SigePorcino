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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from "@mui/material";
import { buttonStyles } from "./buttonStyles";
import useUserStore from "../../_store/user";
import useFarmFormStore from "../../_store/farm";
import {
  type PlanBienestarStep4,
  type PhaseMaterial,
  getPlanBienestarStep4ByFarmId,
  createPlanBienestarStep4,
  updatePlanBienestarStep4,
} from "../../action/PlanBienestarStep4Pocket";

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

const PlanBienestarAccionStep4: React.FC<Props> = ({ onNext, onBack }) => {
  const { token, record } = useUserStore();
  const { currentFarm } = useFarmFormStore();
  
  const [loading, setLoading] = useState(false);
  const [existingPlanId, setExistingPlanId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  
  // Phase data
  const [phases, setPhases] = useState<PhaseMaterial[]>(
    FASES_PRODUCTIVAS.map(fase => ({
      fase,
      tipo_material: "Cadenas",
      localizacion: "Centro del corral",
      num_puntos_acceso: 1,
      animales_activos: 80,
      animales_interaccionando: 20,
    }))
  );
  
  // Form data
  const [formData, setFormData] = useState({
    num_tipos_diferentes: 1,
    consideracion_material: "optimo" as "optimo" | "mejorable" | "no_apto",
    periodicidad_renovacion: 4,
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
    const response = await getPlanBienestarStep4ByFarmId(token, record.id, currentFarm.id);
    setLoading(false);
    
    if (response.success && response.data) {
      const data = response.data;
      setExistingPlanId(data.id || null);
      
      // Parse phases
      if (data.fases_material) {
        try {
          const parsed = typeof data.fases_material === 'string'
            ? JSON.parse(data.fases_material)
            : data.fases_material;
          setPhases(parsed);
        } catch (e) {
          console.error("Error parsing fases_material:", e);
        }
      }
      
      // Set form data
      setFormData({
        num_tipos_diferentes: data.num_tipos_diferentes || 0,
        consideracion_material: (data.consideracion_material as any) || "optimo",
        periodicidad_renovacion: data.periodicidad_renovacion || 0,
      });
    }
  };

  const handlePhaseChange = (index: number, field: keyof PhaseMaterial, value: any) => {
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
    
    const planData: PlanBienestarStep4 = {
      user_id: record.id,
      farm_id: currentFarm.id,
      fases_material: JSON.stringify(phases),
      ...formData,
    };

    let response;
    if (existingPlanId) {
      response = await updatePlanBienestarStep4(token, existingPlanId, planData);
    } else {
      response = await createPlanBienestarStep4(token, planData);
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
          Material Manipulable
        </Typography>

        {/* Tabla de Fases */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Material por Fase Productiva
        </Typography>
        
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 4, overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell><strong>Fase</strong></TableCell>
                <TableCell><strong>Tipo Material</strong></TableCell>
                <TableCell><strong>Localización</strong></TableCell>
                <TableCell align="center"><strong>Nº Puntos Acceso</strong></TableCell>
                <TableCell align="center"><strong>% Activos</strong></TableCell>
                <TableCell align="center"><strong>% Interaccionando</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {phases.map((phase, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{phase.fase}</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={phase.tipo_material}
                      onChange={(e) => handlePhaseChange(index, "tipo_material", e.target.value)}
                      sx={{ minWidth: 120 }}
                      placeholder="ej: Cadenas"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={phase.localizacion}
                      onChange={(e) => handlePhaseChange(index, "localizacion", e.target.value)}
                      sx={{ minWidth: 120 }}
                      placeholder="ej: Centro"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      size="small"
                      value={phase.num_puntos_acceso}
                      onChange={(e) => handlePhaseChange(index, "num_puntos_acceso", parseInt(e.target.value) || 0)}
                      sx={{ width: 70 }}
                      inputProps={{ min: 0 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      size="small"
                      value={phase.animales_activos}
                      onChange={(e) => handlePhaseChange(index, "animales_activos", parseInt(e.target.value) || 0)}
                      sx={{ width: 70 }}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      size="small"
                      value={phase.animales_interaccionando}
                      onChange={(e) => handlePhaseChange(index, "animales_interaccionando", parseInt(e.target.value) || 0)}
                      sx={{ width: 70 }}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Datos Generales */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Evaluación General del Material
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Nº de tipos diferentes de material"
              fullWidth
              variant="filled"
              type="number"
              value={formData.num_tipos_diferentes}
              onChange={(e) => handleInputChange("num_tipos_diferentes", parseInt(e.target.value) || 0)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="filled">
              <InputLabel>Consideración del material</InputLabel>
              <Select
                value={formData.consideracion_material}
                onChange={(e) => handleInputChange("consideracion_material", e.target.value)}
              >
                <MenuItem value="optimo">Óptimo</MenuItem>
                <MenuItem value="mejorable">Mejorable</MenuItem>
                <MenuItem value="no_apto">No Apto</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Periodicidad de renovación del material (semanas)"
              fullWidth
              variant="filled"
              type="number"
              value={formData.periodicidad_renovacion}
              onChange={(e) => handleInputChange("periodicidad_renovacion", parseInt(e.target.value) || 0)}
              inputProps={{ min: 0 }}
              helperText="Número de semanas entre renovaciones del material"
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

export default PlanBienestarAccionStep4;
