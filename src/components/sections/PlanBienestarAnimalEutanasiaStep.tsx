import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";
import { OpenInNew } from "@mui/icons-material";
import useUserStore from "../../_store/user";
import useFarmFormStore from "../../_store/farm";
import { buttonStyles } from "./buttonStyles";
import {
  getPlanBienestarAnimalByFarmId,
  updatePlanBienestarAnimal,
} from "../../action/PlanBienestarAnimalPocket";
import { listStaff, Staff } from "../../action/PersonalRegisterPocket";

interface EutanasiaStepProps {
  onNext: () => void;
  onBack: () => void;
}

const PlanBienestarAnimalEutanasiaStep: React.FC<EutanasiaStepProps> = ({
  onNext,
  onBack,
}) => {
  const { token, record } = useUserStore();
  const { currentFarm } = useFarmFormStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingPlanId, setExistingPlanId] = useState<string | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [formData, setFormData] = useState({
    sistema_aturdimiento: "Pistola bala cautiva",
    sistema_matanza: "Sangrado",
    persona_encargada_eutanasia: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    const loadData = async () => {
      if (!token || !record?.id || !currentFarm?.id) {
        setLoading(false);
        return;
      }

      try {
        // Load staff
        const staffResponse = await listStaff(token, record.id, currentFarm.id);
        if (staffResponse?.data?.items) {
          setStaff(staffResponse.data.items as Staff[]);
        }

        // Load existing plan
        const existingPlan = await getPlanBienestarAnimalByFarmId(
          token,
          record.id,
          currentFarm.id
        );

        if (existingPlan) {
          setExistingPlanId(existingPlan.id!);
          setFormData({
            sistema_aturdimiento:
              existingPlan.sistema_aturdimiento || "Pistola bala cautiva",
            sistema_matanza: existingPlan.sistema_matanza || "Sangrado",
            persona_encargada_eutanasia:
              existingPlan.persona_encargada_eutanasia || "",
          });
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setSnackbar({
          open: true,
          message: "Error al cargar los datos",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, record, currentFarm]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!token || !record?.id || !currentFarm?.id || !existingPlanId) {
      setSnackbar({
        open: true,
        message: "Error: No se encontró información del plan",
        severity: "error",
      });
      return;
    }

    // Validation
    if (!formData.persona_encargada_eutanasia) {
      setSnackbar({
        open: true,
        message: "Por favor, selecciona la persona encargada de la eutanasia",
        severity: "error",
      });
      return;
    }

    setSaving(true);

    try {
      await updatePlanBienestarAnimal(token, existingPlanId, record.id, formData);
      setSnackbar({
        open: true,
        message: "Información de eutanasia guardada exitosamente",
        severity: "success",
      });

      // Proceed to next step after a short delay
      setTimeout(() => {
        onNext();
      }, 1000);
    } catch (error: any) {
      console.error("Error saving data:", error);
      setSnackbar({
        open: true,
        message: error?.message || "Error al guardar los datos",
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
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
          Plan de Bienestar Animal – Eutanasia
        </Typography>

        <Box
          sx={{
            bgcolor: "info.lighter",
            border: "1px solid",
            borderColor: "info.light",
            borderRadius: 1,
            p: 2,
            mb: 3,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            La granja debe disponer de un sistema para aturdir los animales y un sistema
            para matarles tras el aturdimiento.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="filled"
              label="Sistema de aturdimiento"
              value={formData.sistema_aturdimiento}
              onChange={(e) => handleInputChange("sistema_aturdimiento", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="filled"
              label="Sistema de matanza"
              value={formData.sistema_matanza}
              onChange={(e) => handleInputChange("sistema_matanza", e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="filled">
              <InputLabel>Persona encargada de la eutanasia</InputLabel>
              <Select
                value={formData.persona_encargada_eutanasia}
                onChange={(e) =>
                  handleInputChange("persona_encargada_eutanasia", e.target.value)
                }
              >
                {staff.length === 0 ? (
                  <MenuItem value="" disabled>
                    No hay personal registrado
                  </MenuItem>
                ) : (
                  staff.map((person) => (
                    <MenuItem key={person.id} value={person.id}>
                      {person.nombre} {person.apellidos}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 1,
                p: 2,
              }}
            >
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Existe una <strong>"Guía para la eutanasia de los animales en las
                explotaciones porcinas"</strong> publicada en el sitio web del MAPA
              </Typography>
              <Link
                href="https://www.mapa.gob.es/es/ganaderia/temas/produccion-y-mercados-ganaderos/guia_eutanasia_en_granjaver3_tcm30-556545.pdf"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Ver guía del MAPA
                <OpenInNew fontSize="small" />
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button variant="outlined" onClick={onBack} sx={buttonStyles.cancel}>
            Atrás
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving}
            sx={buttonStyles.primary}
          >
            {saving ? <CircularProgress size={24} /> : "Guardar y Continuar"}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PlanBienestarAnimalEutanasiaStep;
