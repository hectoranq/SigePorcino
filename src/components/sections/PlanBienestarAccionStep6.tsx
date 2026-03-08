import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Grid,
  Alert,
  Snackbar,
} from "@mui/material";
import { buttonStyles } from "./buttonStyles";
import useUserStore from "../../_store/user";
import useFarmFormStore from "../../_store/farm";
import {
  type PlanBienestarStep6,
  getPlanBienestarStep6ByFarmId,
  createPlanBienestarStep6,
  updatePlanBienestarStep6,
} from "../../action/PlanBienestarStep6Pocket";

interface Props {
  onBack: () => void;
}

const PlanBienestarAccionStep6: React.FC<Props> = ({ onBack }) => {
  const { token, record } = useUserStore();
  const { currentFarm } = useFarmFormStore();
  
  const [loading, setLoading] = useState(false);
  const [existingPlanId, setExistingPlanId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  
  // Form data
  const [formData, setFormData] = useState({
    riesgos_identificados: "",
    riesgos_inmediatos: "",
    riesgos_corto_plazo: "",
    riesgos_medio_plazo: "",
    riesgos_largo_plazo: "",
    num_asuntos_tratar: "",
    personas_responsables: "",
    indicadores_exito: "",
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
    const response = await getPlanBienestarStep6ByFarmId(token, record.id, currentFarm.id);
    setLoading(false);
    
    if (response.success && response.data) {
      const data = response.data;
      setExistingPlanId(data.id || null);
      
      // Set form data
      setFormData({
        riesgos_identificados: data.riesgos_identificados || "",
        riesgos_inmediatos: data.riesgos_inmediatos || "",
        riesgos_corto_plazo: data.riesgos_corto_plazo || "",
        riesgos_medio_plazo: data.riesgos_medio_plazo || "",
        riesgos_largo_plazo: data.riesgos_largo_plazo || "",
        num_asuntos_tratar: data.num_asuntos_tratar || "",
        personas_responsables: data.personas_responsables || "",
        indicadores_exito: data.indicadores_exito || "",
      });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    if (!token || !record.id || !currentFarm?.id) {
      setSnackbar({ open: true, message: "Error: No hay granja seleccionada", severity: "error" });
      return;
    }

    setLoading(true);
    
    const planData: PlanBienestarStep6 = {
      user_id: record.id,
      farm_id: currentFarm.id,
      ...formData,
    };

    let response;
    if (existingPlanId) {
      response = await updatePlanBienestarStep6(token, existingPlanId, planData);
    } else {
      response = await createPlanBienestarStep6(token, planData);
    }
    
    setLoading(false);
    
    if (response.success) {
      setSnackbar({ 
        open: true, 
        message: "Plan de Acción guardado exitosamente. ¡Has completado todas las secciones del Plan de Bienestar Animal!", 
        severity: "success" 
      });
      if (response.data?.id) {
        setExistingPlanId(response.data.id);
      }
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
          Plan de Acción
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Define los riesgos identificados y las acciones a implementar según el plazo de ejecución.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Riesgos identificados"
              fullWidth
              variant="filled"
              multiline
              rows={4}
              value={formData.riesgos_identificados}
              onChange={(e) => handleInputChange("riesgos_identificados", e.target.value)}
              placeholder="Describe todos los riesgos identificados en la evaluación del bienestar animal..."
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Riesgos a resolver de forma inmediata"
              fullWidth
              variant="filled"
              multiline
              rows={3}
              value={formData.riesgos_inmediatos}
              onChange={(e) => handleInputChange("riesgos_inmediatos", e.target.value)}
              placeholder="Riesgos que requieren atención urgente (24-48 horas)..."
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Riesgos a resolver a corto plazo (1-3 meses)"
              fullWidth
              variant="filled"
              multiline
              rows={3}
              value={formData.riesgos_corto_plazo}
              onChange={(e) => handleInputChange("riesgos_corto_plazo", e.target.value)}
              placeholder="Acciones a implementar en los próximos 1-3 meses..."
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Riesgos a resolver a medio plazo (3-6 meses)"
              fullWidth
              variant="filled"
              multiline
              rows={3}
              value={formData.riesgos_medio_plazo}
              onChange={(e) => handleInputChange("riesgos_medio_plazo", e.target.value)}
              placeholder="Acciones planificadas para 3-6 meses..."
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Riesgos a resolver a largo plazo (más de 6 meses)"
              fullWidth
              variant="filled"
              multiline
              rows={3}
              value={formData.riesgos_largo_plazo}
              onChange={(e) => handleInputChange("riesgos_largo_plazo", e.target.value)}
              placeholder="Acciones y mejoras a largo plazo (inversiones, reformas estructurales, etc.)..."
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Número de asuntos a tratar"
              fullWidth
              variant="filled"
              value={formData.num_asuntos_tratar}
              onChange={(e) => handleInputChange("num_asuntos_tratar", e.target.value)}
              placeholder="ej: 12 asuntos prioritarios"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Personas responsables"
              fullWidth
              variant="filled"
              value={formData.personas_responsables}
              onChange={(e) => handleInputChange("personas_responsables", e.target.value)}
              placeholder="ej: Juan García (Gerente), María López (Veterinaria)"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Indicadores de éxito"
              fullWidth
              variant="filled"
              multiline
              rows={4}
              value={formData.indicadores_exito}
              onChange={(e) => handleInputChange("indicadores_exito", e.target.value)}
              placeholder="Define los indicadores que permitirán evaluar el éxito del plan (ej: Reducción de mortalidad, mejora en comportamientos, cumplimiento de acciones)..."
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
            {loading ? "Guardando..." : "Guardar Plan de Acción"}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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

export default PlanBienestarAccionStep6;
