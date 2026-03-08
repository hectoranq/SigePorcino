import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, KeyboardArrowDown } from "@mui/icons-material";
import { useRouter } from "next/router";
import useUserStore from "../../_store/user";
import useFarmFormStore from "../../_store/farm";
import { buttonStyles } from "./buttonStyles";
import {
  getWelfareEvaluationByFarmId,
  deleteWelfareEvaluation,
  WelfareEvaluation,
} from "../../action/WelfareEvaluationPocket";

export function WelfareEvaluationListSection() {
  const { token, record } = useUserStore();
  const { currentFarm } = useFarmFormStore();
  const router = useRouter();

  const [evaluations, setEvaluations] = useState<WelfareEvaluation[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "info" });

  // Cargar evaluaciones
  useEffect(() => {
    const loadEvaluations = async () => {
      if (!currentFarm?.id || !token || !record?.id) return;

      setLoading(true);
      try {
        const evaluationsList = await getWelfareEvaluationByFarmId(token, record.id, currentFarm.id);
        setEvaluations(evaluationsList);
      } catch (error) {
        console.error("Error loading evaluations:", error);
        setSnackbar({
          open: true,
          message: "Error al cargar las evaluaciones",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadEvaluations();
  }, [currentFarm, token, record]);

  // Navegar a crear nueva evaluación
  const handleCreateNew = () => {
    router.push("/home?section=raboteo");
  };

  // Ver evaluación
  const handleView = (evaluationId: string) => {
    router.push(`/home?section=raboteo&evaluationId=${evaluationId}&viewMode=true`);
  };

  // Editar evaluación
  const handleEdit = (evaluationId: string) => {
    router.push(`/home?section=raboteo&evaluationId=${evaluationId}`);
  };

  // Eliminar evaluación
  const handleDelete = async (evaluationId: string) => {
    if (!token || !record?.id || !confirm("¿Está seguro de eliminar esta evaluación?")) return;

    try {
      await deleteWelfareEvaluation(token, evaluationId, record.id);
      
      // Recargar lista
      const evaluationsList = await getWelfareEvaluationByFarmId(token, record.id, currentFarm!.id);
      setEvaluations(evaluationsList);

      setSnackbar({
        open: true,
        message: "Evaluación eliminada exitosamente",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Error al eliminar evaluación",
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

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
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
            <Typography variant="h5" fontWeight={600}>
              Evaluación de Bienestar Animal
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            sx={buttonStyles.save}
            onClick={handleCreateNew}
            disabled={!currentFarm || evaluations.length > 0}
          >
            Nueva Evaluación
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "grey.100" }}>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      Granja
                      <KeyboardArrowDown fontSize="small" color="disabled" />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      Propietario
                      <KeyboardArrowDown fontSize="small" color="disabled" />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      Código REGA
                      <KeyboardArrowDown fontSize="small" color="disabled" />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      Fecha Evaluación
                      <KeyboardArrowDown fontSize="small" color="disabled" />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      Clase Zootécnica
                      <KeyboardArrowDown fontSize="small" color="disabled" />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      Acciones
                      <KeyboardArrowDown fontSize="small" color="disabled" />
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {evaluations.map((evaluation) => (
                  <TableRow
                    key={evaluation.id}
                    sx={{
                      "&:hover": {
                        bgcolor: "grey.50",
                      },
                    }}
                  >
                    <TableCell>{evaluation.farm_name}</TableCell>
                    <TableCell>{evaluation.owner_name}</TableCell>
                    <TableCell>{evaluation.rega_code}</TableCell>
                    <TableCell>{formatDate(evaluation.evaluation_date)}</TableCell>
                    <TableCell>{evaluation.zootechnical_class}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          sx={buttonStyles.edit}
                          onClick={() => handleEdit(evaluation.id!)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: "#93c5fd",
                            color: "#2563eb",
                            "&:hover": {
                              bgcolor: "#eff6ff",
                              borderColor: "#93c5fd",
                            },
                          }}
                          onClick={() => handleView(evaluation.id!)}
                        >
                          Ver más
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(evaluation.id!)}
                        >
                          Eliminar
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {evaluations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                        No hay evaluaciones registradas. Haga clic en "Nueva Evaluación" para comenzar.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

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
}

export default WelfareEvaluationListSection;
