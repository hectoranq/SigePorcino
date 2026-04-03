import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import useUserStore from "../../_store/user";
import useFarmFormStore from "../../_store/farm";
import { buttonStyles } from "./buttonStyles";
import DateInput from "../common/DateInput";
import {
  getPlanBienestarAnimalByFarmId,
  updatePlanBienestarAnimal,
} from "../../action/PlanBienestarAnimalPocket";

interface MutilacionesStepProps {
  onNext: () => void;
  onBack: () => void;
}

const PlanBienestarAnimalMutilacionesStep: React.FC<MutilacionesStepProps> = ({
  onNext,
  onBack,
}) => {
  const { token, record } = useUserStore();
  const { currentFarm } = useFarmFormStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingPlanId, setExistingPlanId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    // Castración
    se_castra: "",
    separacion_castrados: "",
    num_animales_presentes: "",
    se_liman_dientes: "",
    // Raboteo
    registro_mordeduras: "",
    fecha_ultima_cria_rabos_integros: "",
    se_cortan_rabos: "",
    peticion_cliente: "",
    tiene_documento_peticion: "",
    fecha_documento_peticion: "",
    porcentaje_lesiones_grado_1: "",
    porcentaje_lesiones_grado_2: "",
    fecha_modificacion_condiciones: "",
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
        const existingPlan = await getPlanBienestarAnimalByFarmId(
          token,
          record.id,
          currentFarm.id
        );

        if (existingPlan) {
          setExistingPlanId(existingPlan.id!);
          setFormData({
            se_castra: existingPlan.se_castra || "",
            separacion_castrados: existingPlan.separacion_castrados || "",
            num_animales_presentes: existingPlan.num_animales_presentes?.toString() || "",
            se_liman_dientes: existingPlan.se_liman_dientes || "",
            registro_mordeduras: existingPlan.registro_mordeduras || "",
            fecha_ultima_cria_rabos_integros:
              existingPlan.fecha_ultima_cria_rabos_integros || "",
            se_cortan_rabos: existingPlan.se_cortan_rabos || "",
            peticion_cliente: existingPlan.peticion_cliente || "",
            tiene_documento_peticion: existingPlan.tiene_documento_peticion || "",
            fecha_documento_peticion: existingPlan.fecha_documento_peticion || "",
            porcentaje_lesiones_grado_1:
              existingPlan.porcentaje_lesiones_grado_1?.toString() || "",
            porcentaje_lesiones_grado_2:
              existingPlan.porcentaje_lesiones_grado_2?.toString() || "",
            fecha_modificacion_condiciones:
              existingPlan.fecha_modificacion_condiciones || "",
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

    setSaving(true);

    try {
      const dataToSave = {
        se_castra: formData.se_castra,
        separacion_castrados: formData.separacion_castrados,
        num_animales_presentes: formData.num_animales_presentes
          ? Number(formData.num_animales_presentes)
          : undefined,
        se_liman_dientes: formData.se_liman_dientes,
        registro_mordeduras: formData.registro_mordeduras,
        fecha_ultima_cria_rabos_integros: formData.fecha_ultima_cria_rabos_integros,
        se_cortan_rabos: formData.se_cortan_rabos,
        peticion_cliente: formData.peticion_cliente,
        tiene_documento_peticion: formData.tiene_documento_peticion,
        fecha_documento_peticion: formData.fecha_documento_peticion,
        porcentaje_lesiones_grado_1: formData.porcentaje_lesiones_grado_1
          ? Number(formData.porcentaje_lesiones_grado_1)
          : undefined,
        porcentaje_lesiones_grado_2: formData.porcentaje_lesiones_grado_2
          ? Number(formData.porcentaje_lesiones_grado_2)
          : undefined,
        fecha_modificacion_condiciones: formData.fecha_modificacion_condiciones,
      };

      await updatePlanBienestarAnimal(token, existingPlanId, record.id, dataToSave);
      setSnackbar({
        open: true,
        message: "Plan de Bienestar Animal completado exitosamente",
        severity: "success",
      });

      // Proceed to next step after a short delay
      setTimeout(() => {
        onNext();
      }, 1500);
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
          Plan de Bienestar Animal – Mutilaciones
        </Typography>

        {/* Castración Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: "primary.main" }}>
            Castración
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                ¿Se castra?
              </Typography>
              <RadioGroup
                row
                value={formData.se_castra}
                onChange={(e) => handleInputChange("se_castra", e.target.value)}
              >
                <FormControlLabel value="si" control={<Radio />} label="Sí" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
                <FormControlLabel
                  value="no_procede"
                  control={<Radio />}
                  label="No procede"
                />
              </RadioGroup>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                ¿Separación de castrados?
              </Typography>
              <RadioGroup
                row
                value={formData.separacion_castrados}
                onChange={(e) => handleInputChange("separacion_castrados", e.target.value)}
              >
                <FormControlLabel value="si" control={<Radio />} label="Sí" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
                <FormControlLabel
                  value="no_procede"
                  control={<Radio />}
                  label="No procede"
                />
              </RadioGroup>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="N.º de animales presentes"
                value={formData.num_animales_presentes}
                onChange={(e) =>
                  handleInputChange("num_animales_presentes", e.target.value)
                }
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                ¿Se liman los dientes?
              </Typography>
              <RadioGroup
                row
                value={formData.se_liman_dientes}
                onChange={(e) => handleInputChange("se_liman_dientes", e.target.value)}
              >
                <FormControlLabel value="si" control={<Radio />} label="Sí" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
                <FormControlLabel
                  value="no_procede"
                  control={<Radio />}
                  label="No procede"
                />
              </RadioGroup>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Raboteo Section */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: "primary.main" }}>
            Raboteo
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Registro de animales con mordeduras
              </Typography>
              <RadioGroup
                row
                value={formData.registro_mordeduras}
                onChange={(e) => handleInputChange("registro_mordeduras", e.target.value)}
              >
                <FormControlLabel value="si" control={<Radio />} label="Sí" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Grid>

            <Grid item xs={12} md={6}>
              <DateInput
                label="Fecha de última cría con rabos íntegros"
                value={formData.fecha_ultima_cria_rabos_integros}
                onChange={(value) =>
                  handleInputChange("fecha_ultima_cria_rabos_integros", value)
                }
                variant="filled"
                sx={{ mb: 0 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                ¿Se cortan los rabos?
              </Typography>
              <RadioGroup
                row
                value={formData.se_cortan_rabos}
                onChange={(e) => handleInputChange("se_cortan_rabos", e.target.value)}
              >
                <FormControlLabel value="si" control={<Radio />} label="Sí" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
                <FormControlLabel
                  value="no_procede"
                  control={<Radio />}
                  label="No procede"
                />
              </RadioGroup>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                ¿A petición del cliente?
              </Typography>
              <RadioGroup
                row
                value={formData.peticion_cliente}
                onChange={(e) => handleInputChange("peticion_cliente", e.target.value)}
              >
                <FormControlLabel value="si" control={<Radio />} label="Sí" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
                <FormControlLabel
                  value="no_procede"
                  control={<Radio />}
                  label="No procede"
                />
              </RadioGroup>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                ¿Tiene documento de dicha petición?
              </Typography>
              <RadioGroup
                row
                value={formData.tiene_documento_peticion}
                onChange={(e) =>
                  handleInputChange("tiene_documento_peticion", e.target.value)
                }
              >
                <FormControlLabel value="si" control={<Radio />} label="Sí" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
                <FormControlLabel
                  value="no_procede"
                  control={<Radio />}
                  label="No procede"
                />
              </RadioGroup>
            </Grid>

            <Grid item xs={12} md={6}>
              <DateInput
                label="Fecha del documento de petición de raboteo por cliente"
                value={formData.fecha_documento_peticion}
                onChange={(value) =>
                  handleInputChange("fecha_documento_peticion", value)
                }
                variant="filled"
                sx={{ mb: 0 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
                Registro de animales con mordeduras
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="% de animales con lesiones de grado 1"
                value={formData.porcentaje_lesiones_grado_1}
                onChange={(e) =>
                  handleInputChange("porcentaje_lesiones_grado_1", e.target.value)
                }
                inputProps={{ min: 0, max: 100, step: 0.1 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="% de animales con lesiones de grado 2"
                value={formData.porcentaje_lesiones_grado_2}
                onChange={(e) =>
                  handleInputChange("porcentaje_lesiones_grado_2", e.target.value)
                }
                inputProps={{ min: 0, max: 100, step: 0.1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <DateInput
                label="Fecha de registro de modificación de condiciones ambientales"
                value={formData.fecha_modificacion_condiciones}
                onChange={(value) =>
                  handleInputChange("fecha_modificacion_condiciones", value)
                }
                variant="filled"
                sx={{ mb: 0 }}
              />
            </Grid>
          </Grid>
        </Box>

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
            {saving ? <CircularProgress size={24} /> : "Guardar y Finalizar"}
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

export default PlanBienestarAnimalMutilacionesStep;
