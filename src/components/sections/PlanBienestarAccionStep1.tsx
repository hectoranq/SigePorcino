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
  Alert,
  Snackbar,
} from "@mui/material";
import { buttonStyles } from "./buttonStyles";
import useUserStore from "../../_store/user";
import useFarmFormStore from "../../_store/farm";
import {
  type PlanBienestarStep1,
  type ProductionPhase,
  getPlanBienestarStep1ByFarmId,
  createPlanBienestarStep1,
  updatePlanBienestarStep1,
} from "../../action/PlanBienestarStep1Pocket";

interface Props {
  onNext: () => void;
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

const PlanBienestarAccionStep1: React.FC<Props> = ({ onNext }) => {
  const { token, record } = useUserStore();
  const { currentFarm } = useFarmFormStore();
  
  const [loading, setLoading] = useState(false);
  const [existingPlanId, setExistingPlanId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  
  // Phase data
  const [phases, setPhases] = useState<ProductionPhase[]>(
    FASES_PRODUCTIVAS.map(fase => ({ fase, num_naves: 2 }))
  );
  
  // Form data
  const [formData, setFormData] = useState({
    orientacion_naves: "Noreste",
    num_animales_presentes: 910,
    aislamiento_cerramientos: "Ladrillo",
    aislamiento_cubierta: "Fibrocemento+Poliuretano",
    densidad_carga: 0.65,
    tipo_suelo: "Parcialmente emparrillado",
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
    const response = await getPlanBienestarStep1ByFarmId(token, record.id, currentFarm.id);
    setLoading(false);
    
    if (response.success && response.data) {
      const data = response.data;
      setExistingPlanId(data.id || null);
      
      // Parse phases
      if (data.fases_productivas) {
        try {
          const parsed = typeof data.fases_productivas === 'string'
            ? JSON.parse(data.fases_productivas)
            : data.fases_productivas;
          setPhases(parsed);
        } catch (e) {
          console.error("Error parsing fases_productivas:", e);
        }
      }
      
      // Set form data
      setFormData({
        orientacion_naves: data.orientacion_naves || "",
        num_animales_presentes: data.num_animales_presentes || 0,
        aislamiento_cerramientos: data.aislamiento_cerramientos || "",
        aislamiento_cubierta: data.aislamiento_cubierta || "",
        densidad_carga: data.densidad_carga || 0,
        tipo_suelo: data.tipo_suelo || "",
      });
    }
  };

  const handlePhaseChange = (index: number, value: number) => {
    const newPhases = [...phases];
    newPhases[index].num_naves = value;
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
    
    const planData: PlanBienestarStep1 = {
      user_id: record.id,
      farm_id: currentFarm.id,
      fases_productivas: JSON.stringify(phases),
      ...formData,
    };

    let response;
    if (existingPlanId) {
      response = await updatePlanBienestarStep1(token, existingPlanId, planData);
    } else {
      response = await createPlanBienestarStep1(token, planData);
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
          Condiciones Generales
        </Typography>

        {/* Tabla de Fases Productivas */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Fases Productivas
        </Typography>
        
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell><strong>Fase Productiva</strong></TableCell>
                <TableCell align="center"><strong>Nº de Naves</strong></TableCell>
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
                      value={phase.num_naves}
                      onChange={(e) => handlePhaseChange(index, parseInt(e.target.value) || 0)}
                      sx={{ width: 100 }}
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
          Datos Generales
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Orientación de la nave"
              fullWidth
              variant="filled"
              value={formData.orientacion_naves}
              onChange={(e) => handleInputChange("orientacion_naves", e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Nº de animales presentes"
              fullWidth
              variant="filled"
              type="number"
              value={formData.num_animales_presentes}
              onChange={(e) => handleInputChange("num_animales_presentes", parseInt(e.target.value) || 0)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Tipo de aislamiento estructural de cerramientos"
              fullWidth
              variant="filled"
              value={formData.aislamiento_cerramientos}
              onChange={(e) => handleInputChange("aislamiento_cerramientos", e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Tipo de aislamiento estructural de cubierta"
              fullWidth
              variant="filled"
              value={formData.aislamiento_cubierta}
              onChange={(e) => handleInputChange("aislamiento_cubierta", e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Densidad de carga (m² por animal)"
              fullWidth
              variant="filled"
              type="number"
              inputProps={{ step: 0.01 }}
              value={formData.densidad_carga}
              onChange={(e) => handleInputChange("densidad_carga", parseFloat(e.target.value) || 0)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Tipo de suelo"
              fullWidth
              variant="filled"
              value={formData.tipo_suelo}
              onChange={(e) => handleInputChange("tipo_suelo", e.target.value)}
            />
          </Grid>
        </Grid>

        {/* Navigation */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
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

export default PlanBienestarAccionStep1;
