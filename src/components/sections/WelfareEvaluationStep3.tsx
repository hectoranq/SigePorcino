import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogContent,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, KeyboardArrowDown } from "@mui/icons-material";
import useUserStore from "../../_store/user";
import { buttonStyles, headerColors } from "./buttonStyles";
import {
  getActionPlanByEvaluationId,
  createActionPlan,
  updateActionPlan,
  ActionPlan,
} from "../../action/ActionPlansPocket";
import {
  getActionMeasuresByPlanId,
  createActionMeasure,
  updateActionMeasure,
  deleteActionMeasure,
  ActionMeasure,
} from "../../action/ActionMeasuresPocket";

interface Props {
  onNext: () => void;
  onBack: () => void;
  evaluationId: string | null;
}

const initialPlanForm = {
  plan_name: "",
  plan_date: "",
};

const initialMeasureForm = {
  measure_category: "",
  measure_description: "",
  start_date: "",
  end_date: "",
};

const measureCategories = [
  "Enriquecimiento",
  "Inspección_Formación",
  "Alimentación",
  "Densidad",
  "Otras_CP",
  "Ventilación",
  "Bebederos_Comederos",
  "Tipo_Suelo",
  "Genética",
  "Otras_MLP",
];

const WelfareEvaluationStep3: React.FC<Props> = ({ onNext, onBack, evaluationId }) => {
  const { token } = useUserStore();

  // Estados para plan de acción
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [planForm, setPlanForm] = useState(initialPlanForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estados para medidas
  const [measures, setMeasures] = useState<ActionMeasure[]>([]);
  const [openMeasureDialog, setOpenMeasureDialog] = useState(false);
  const [editMeasureMode, setEditMeasureMode] = useState(false);
  const [editMeasureIndex, setEditMeasureIndex] = useState<number | null>(null);
  const [measureForm, setMeasureForm] = useState(initialMeasureForm);

  // Snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "info" });

  // Cargar plan de acción y medidas
  useEffect(() => {
    const loadData = async () => {
      if (!evaluationId || !token) return;

      setLoading(true);
      try {
        const plan = await getActionPlanByEvaluationId(token, evaluationId);
        if (plan) {
          setActionPlan(plan);
          setPlanForm({
            plan_name: plan.plan_name,
            plan_date: plan.plan_date,
          });

          // Cargar medidas
          const measuresData = await getActionMeasuresByPlanId(token, plan.id!);
          setMeasures(measuresData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [evaluationId, token]);

  // Guardar plan de acción
  const handleSavePlan = async () => {
    if (!evaluationId || !token) return;

    setSaving(true);
    try {
      const planData = {
        evaluation_id: evaluationId,
        ...planForm,
      };

      let result;
      if (actionPlan?.id) {
        result = await updateActionPlan(token, actionPlan.id, planData);
      } else {
        result = await createActionPlan(token, planData);
        setActionPlan(result.data);
      }

      setSnackbar({
        open: true,
        message: "Plan de acción guardado exitosamente",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Error al guardar plan de acción",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // Manejar cambios en formulario de plan
  const handlePlanChange = (field: string, value: any) => {
    setPlanForm((prev) => ({ ...prev, [field]: value }));
  };

  // Manejar cambios en formulario de medida
  const handleMeasureChange = (field: string, value: any) => {
    setMeasureForm((prev) => ({ ...prev, [field]: value }));
  };

  // Abrir dialog para crear medida
  const handleOpenMeasureDialog = () => {
    setMeasureForm(initialMeasureForm);
    setEditMeasureMode(false);
    setEditMeasureIndex(null);
    setOpenMeasureDialog(true);
  };

  // Editar medida
  const handleEditMeasure = (index: number) => {
    const measure = measures[index];
    setMeasureForm({
      measure_category: measure.measure_category,
      measure_description: measure.measure_description,
      start_date: measure.start_date,
      end_date: measure.end_date,
    });
    setEditMeasureMode(true);
    setEditMeasureIndex(index);
    setOpenMeasureDialog(true);
  };

  // Guardar medida
  const handleSaveMeasure = async () => {
    if (!actionPlan?.id || !token) return;

    try {
      const measureData = {
        action_plan_id: actionPlan.id,
        ...measureForm,
      };

      if (editMeasureMode && editMeasureIndex !== null) {
        const measure = measures[editMeasureIndex];
        await updateActionMeasure(token, measure.id!, measureData);
      } else {
        await createActionMeasure(token, measureData);
      }

      // Recargar medidas
      const measuresData = await getActionMeasuresByPlanId(token, actionPlan.id);
      setMeasures(measuresData);

      setOpenMeasureDialog(false);
      setSnackbar({
        open: true,
        message: "Medida guardada exitosamente",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Error al guardar medida",
        severity: "error",
      });
    }
  };

  // Eliminar medida
  const handleDeleteMeasure = async (index: number) => {
    if (!token) return;

    const measure = measures[index];
    if (!measure.id) return;

    try {
      await deleteActionMeasure(token, measure.id);

      // Recargar medidas
      if (actionPlan?.id) {
        const measuresData = await getActionMeasuresByPlanId(token, actionPlan.id);
        setMeasures(measuresData);
      }

      setSnackbar({
        open: true,
        message: "Medida eliminada exitosamente",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Error al eliminar medida",
        severity: "error",
      });
    }
  };

  // Formatear fecha para visualización
  const formatDate = (dateString: string) => {
    if (!dateString) return "Sin fecha";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
          Plan de Acción
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Nombre del Plan"
              value={planForm.plan_name}
              onChange={(e) => handlePlanChange("plan_name", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              label="Fecha del Plan"
              value={planForm.plan_date}
              onChange={(e) => handlePlanChange("plan_date", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={handleSavePlan}
            disabled={saving}
            sx={buttonStyles.save}
          >
            {saving ? "Guardando..." : "Guardar Plan"}
          </Button>
        </Box>
      </Paper>

      {/* Tabla de Medidas */}
      <Paper sx={{ overflow: "hidden" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 4,
                height: 32,
                bgcolor: "primary.main",
                borderRadius: 2,
              }}
            />
            <Typography variant="h6" fontWeight={600}>
              Medidas de Acción
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            sx={buttonStyles.save}
            onClick={handleOpenMeasureDialog}
            disabled={!actionPlan}
          >
            Agregar Medida
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "grey.100" }}>
              <TableRow>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    Categoría
                    <KeyboardArrowDown fontSize="small" color="disabled" />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    Descripción
                    <KeyboardArrowDown fontSize="small" color="disabled" />
                  </Box>
                </TableCell>
                <TableCell>Fecha Inicio</TableCell>
                <TableCell>Fecha Fin</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {measures.map((measure, index) => (
                <TableRow
                  key={measure.id || index}
                  sx={{
                    "&:hover": {
                      bgcolor: "grey.50",
                    },
                  }}
                >
                  <TableCell>{measure.measure_category}</TableCell>
                  <TableCell>{measure.measure_description}</TableCell>
                  <TableCell>{formatDate(measure.start_date)}</TableCell>
                  <TableCell>{formatDate(measure.end_date)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        sx={buttonStyles.edit}
                        onClick={() => handleEditMeasure(index)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteMeasure(index)}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog para Medida */}
      <Dialog open={openMeasureDialog} onClose={() => setOpenMeasureDialog(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {editMeasureMode ? "Editar Medida" : "Nueva Medida"}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Categoría de la Medida"
                value={measureForm.measure_category}
                onChange={(e) => handleMeasureChange("measure_category", e.target.value)}
              >
                {measureCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.replace(/_/g, " ")}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descripción de la Medida"
                value={measureForm.measure_description}
                onChange={(e) => handleMeasureChange("measure_description", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Inicio"
                value={measureForm.start_date}
                onChange={(e) => handleMeasureChange("start_date", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Fin"
                value={measureForm.end_date}
                onChange={(e) => handleMeasureChange("end_date", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={() => setOpenMeasureDialog(false)}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSaveMeasure} sx={buttonStyles.save}>
              Guardar
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Botones de navegación */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" onClick={onBack} sx={buttonStyles.back}>
          Atrás
        </Button>
        <Button
          variant="contained"
          onClick={onNext}
          sx={buttonStyles.next}
          disabled={!actionPlan}
        >
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

export default WelfareEvaluationStep3;
