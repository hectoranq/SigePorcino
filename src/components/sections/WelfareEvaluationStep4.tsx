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
  CircularProgress,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Add, ExpandMore, KeyboardArrowDown } from "@mui/icons-material";
import useUserStore from "../../_store/user";
import { buttonStyles, headerColors } from "./buttonStyles";
import DateInput from "../common/DateInput";
import {
  getActionPlanByEvaluationId,
  ActionPlan,
} from "../../action/ActionPlansPocket";
import {
  getActionMeasuresByPlanId,
  ActionMeasure,
} from "../../action/ActionMeasuresPocket";
import {
  getActionFollowupsByMeasureId,
  createActionFollowup,
  updateActionFollowup,
  deleteActionFollowup,
  ActionFollowup,
} from "../../action/ActionFollowupsPocket";

interface Props {
  onNext: () => void;
  onBack: () => void;
  evaluationId: string | null;
}

const initialFollowupForm = {
  followup_date: "",
  start_date: "",
  end_date: "",
  implementation_difficulties: "",
  corrective_actions: "",
  implementation_result: "",
  improvement_proposal: "",
  observations: "",
};

const WelfareEvaluationStep4: React.FC<Props> = ({ onNext, onBack, evaluationId }) => {
  const { token } = useUserStore();

  // Estados principales
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [measures, setMeasures] = useState<ActionMeasure[]>([]);
  const [followupsByMeasure, setFollowupsByMeasure] = useState<{
    [measureId: string]: ActionFollowup[];
  }>({});
  const [loading, setLoading] = useState(false);

  // Estados para dialog de seguimiento
  const [openFollowupDialog, setOpenFollowupDialog] = useState(false);
  const [selectedMeasureId, setSelectedMeasureId] = useState<string | null>(null);
  const [editFollowupMode, setEditFollowupMode] = useState(false);
  const [editFollowupId, setEditFollowupId] = useState<string | null>(null);
  const [followupForm, setFollowupForm] = useState(initialFollowupForm);

  // Snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "info" });

  // Cargar datos
  useEffect(() => {
    const loadData = async () => {
      if (!evaluationId || !token) return;

      setLoading(true);
      try {
        // Cargar plan de acción
        const plan = await getActionPlanByEvaluationId(token, evaluationId);
        if (plan) {
          setActionPlan(plan);

          // Cargar medidas
          const measuresData = await getActionMeasuresByPlanId(token, plan.id!);
          setMeasures(measuresData);

          // Cargar seguimientos para cada medida
          const followupsData: { [key: string]: ActionFollowup[] } = {};
          for (const measure of measuresData) {
            if (measure.id) {
              const followups = await getActionFollowupsByMeasureId(token, measure.id);
              followupsData[measure.id] = followups;
            }
          }
          setFollowupsByMeasure(followupsData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [evaluationId, token]);

  // Manejar cambios en formulario de seguimiento
  const handleFollowupChange = (field: string, value: any) => {
    setFollowupForm((prev) => ({ ...prev, [field]: value }));
  };

  // Abrir dialog para crear seguimiento
  const handleOpenFollowupDialog = (measureId: string) => {
    setFollowupForm(initialFollowupForm);
    setSelectedMeasureId(measureId);
    setEditFollowupMode(false);
    setEditFollowupId(null);
    setOpenFollowupDialog(true);
  };

  // Editar seguimiento
  const handleEditFollowup = (measureId: string, followup: ActionFollowup) => {
    setFollowupForm({
      followup_date: followup.followup_date,
      start_date: followup.start_date,
      end_date: followup.end_date,
      implementation_difficulties: followup.implementation_difficulties,
      corrective_actions: followup.corrective_actions,
      implementation_result: followup.implementation_result,
      improvement_proposal: followup.improvement_proposal,
      observations: followup.observations,
    });
    setSelectedMeasureId(measureId);
    setEditFollowupMode(true);
    setEditFollowupId(followup.id!);
    setOpenFollowupDialog(true);
  };

  // Guardar seguimiento
  const handleSaveFollowup = async () => {
    if (!selectedMeasureId || !token) return;

    try {
      const followupData = {
        measure_id: selectedMeasureId,
        ...followupForm,
      };

      if (editFollowupMode && editFollowupId) {
        await updateActionFollowup(token, editFollowupId, followupData);
      } else {
        await createActionFollowup(token, followupData);
      }

      // Recargar seguimientos para esta medida
      const followups = await getActionFollowupsByMeasureId(token, selectedMeasureId);
      setFollowupsByMeasure((prev) => ({
        ...prev,
        [selectedMeasureId]: followups,
      }));

      setOpenFollowupDialog(false);
      setSnackbar({
        open: true,
        message: "Seguimiento guardado exitosamente",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Error al guardar seguimiento",
        severity: "error",
      });
    }
  };

  // Eliminar seguimiento
  const handleDeleteFollowup = async (measureId: string, followupId: string) => {
    if (!token) return;

    try {
      await deleteActionFollowup(token, followupId);

      // Recargar seguimientos para esta medida
      const followups = await getActionFollowupsByMeasureId(token, measureId);
      setFollowupsByMeasure((prev) => ({
        ...prev,
        [measureId]: followups,
      }));

      setSnackbar({
        open: true,
        message: "Seguimiento eliminado exitosamente",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Error al eliminar seguimiento",
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
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
          Seguimiento de Medidas
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Registre el seguimiento de implementación para cada medida del plan de acción.
        </Typography>

        {measures.map((measure) => (
          <Accordion key={measure.id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ width: "100%" }}>
                <Typography variant="subtitle1" fontWeight={500}>
                  {measure.measure_category.replace(/_/g, " ")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {measure.measure_description}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  startIcon={<Add />}
                  sx={buttonStyles.save}
                  onClick={() => handleOpenFollowupDialog(measure.id!)}
                >
                  Agregar Seguimiento
                </Button>
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "grey.100" }}>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Fecha Seguimiento
                          <KeyboardArrowDown fontSize="small" color="disabled" />
                        </Box>
                      </TableCell>
                      <TableCell>Periodo</TableCell>
                      <TableCell>Resultado</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {followupsByMeasure[measure.id!]?.map((followup) => (
                      <TableRow
                        key={followup.id}
                        sx={{
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                      >
                        <TableCell>{formatDate(followup.followup_date)}</TableCell>
                        <TableCell>
                          {formatDate(followup.start_date)} - {formatDate(followup.end_date)}
                        </TableCell>
                        <TableCell>
                          {followup.implementation_result 
                            ? followup.implementation_result.substring(0, 50) + "..." 
                            : "Sin resultado"}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              sx={buttonStyles.edit}
                              onClick={() => handleEditFollowup(measure.id!, followup)}
                            >
                              Editar
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleDeleteFollowup(measure.id!, followup.id!)}
                            >
                              Eliminar
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!followupsByMeasure[measure.id!] || followupsByMeasure[measure.id!].length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No hay seguimientos registrados
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

      {/* Dialog para Seguimiento */}
      <Dialog
        open={openFollowupDialog}
        onClose={() => setOpenFollowupDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {editFollowupMode ? "Editar Seguimiento" : "Nuevo Seguimiento"}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <DateInput
                label="Fecha de Seguimiento"
                value={followupForm.followup_date}
                onChange={(value) => handleFollowupChange("followup_date", value)}
                variant="standard"
                sx={{ mb: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DateInput
                label="Fecha Inicio Periodo"
                value={followupForm.start_date}
                onChange={(value) => handleFollowupChange("start_date", value)}
                variant="standard"
                sx={{ mb: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DateInput
                label="Fecha Fin Periodo"
                value={followupForm.end_date}
                onChange={(value) => handleFollowupChange("end_date", value)}
                variant="standard"
                sx={{ mb: 0 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Dificultades de Implementación"
                value={followupForm.implementation_difficulties}
                onChange={(e) => handleFollowupChange("implementation_difficulties", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Acciones Correctivas"
                value={followupForm.corrective_actions}
                onChange={(e) => handleFollowupChange("corrective_actions", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Resultado de Implementación"
                value={followupForm.implementation_result}
                onChange={(e) => handleFollowupChange("implementation_result", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Propuesta de Mejora"
                value={followupForm.improvement_proposal}
                onChange={(e) => handleFollowupChange("improvement_proposal", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Observaciones"
                value={followupForm.observations}
                onChange={(e) => handleFollowupChange("observations", e.target.value)}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={() => setOpenFollowupDialog(false)}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSaveFollowup} sx={buttonStyles.save}>
              Guardar
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Botones de navegación */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" onClick={onBack} sx={buttonStyles.back}>
          Atrás
        </Button>
        <Button variant="contained" onClick={onNext} sx={buttonStyles.next}>
          Finalizar
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

export default WelfareEvaluationStep4;
