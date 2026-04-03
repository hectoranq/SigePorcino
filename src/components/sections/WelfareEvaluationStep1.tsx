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
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, KeyboardArrowDown } from "@mui/icons-material";
import useUserStore from "../../_store/user";
import useFarmFormStore from "../../_store/farm";
import DateInput from "../common/DateInput";
import { buttonStyles, headerColors } from "./buttonStyles";
import {
  getWelfareEvaluationByFarmId,
  createWelfareEvaluation,
  updateWelfareEvaluation,
  WelfareEvaluation,
} from "../../action/WelfareEvaluationPocket";
import {
  getWelfareFacilitiesByEvaluationId,
  createWelfareFacility,
  updateWelfareFacility,
  deleteWelfareFacility,
  WelfareFacility,
} from "../../action/WelfareFacilitiesPocket";
import {
  getCaudophagyOutbreaksByFacilityId,
  createCaudophagyOutbreak,
  updateCaudophagyOutbreak,
  deleteCaudophagyOutbreak,
  CaudophagyOutbreak,
} from "../../action/CaudophagyOutbreaksPocket";

interface Props {
  onNext: () => void;
  evaluationId: string | null;
  setEvaluationId: (id: string) => void;
}

const initialEvaluationForm = {
  farm_name: "",
  owner_name: "",
  rega_code: "",
  evaluation_date: "",
  zootechnical_class: "",
  health_qualification: "",
  integrator: "",
};

const initialFacilityForm = {
  facility_name: "",
  phase: "",
  animales_alojados: "",
  m2_superficie: "",
  // Sensores
  sensor_temperatura: false,
  sensor_humedad: false,
  sensor_co2: false,
  sensor_nh3: false,
  sensor_velocidad_aire: false,
  sensor_flujo_agua: false,
  // Ventilación
  ventilacion: "",
  // Alimentación
  tipo_comida: "",
  tipo_agua: "",
  // Enriquecimiento
  tipo_enriquecimiento: "",
  caudofagia_records: false,
};

const WelfareEvaluationStep1: React.FC<Props> = ({ onNext, evaluationId, setEvaluationId }) => {
  const { token, record } = useUserStore();
  const { currentFarm } = useFarmFormStore();

  // Estados para evaluación principal
  const [evaluationForm, setEvaluationForm] = useState(initialEvaluationForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estados para instalaciones
  const [facilities, setFacilities] = useState<WelfareFacility[]>([]);
  const [openFacilityDialog, setOpenFacilityDialog] = useState(false);
  const [editFacilityMode, setEditFacilityMode] = useState(false);
  const [editFacilityIndex, setEditFacilityIndex] = useState<number | null>(null);
  const [facilityForm, setFacilityForm] = useState(initialFacilityForm);

  // Estados para brotes de caudofagia
  const [caudophagyOutbreaks, setCaudophagyOutbreaks] = useState<CaudophagyOutbreak[]>([]);
  const [openOutbreakDialog, setOpenOutbreakDialog] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "info" });

  // Cargar evaluación existente
  useEffect(() => {
    const loadEvaluation = async () => {
      if (!currentFarm?.id || !token || !record?.id) return;

      setLoading(true);
      try {
        const evaluations = await getWelfareEvaluationByFarmId(token, record.id, currentFarm.id);
        const evaluation = evaluations[0];
        
        if (evaluation) {
          setEvaluationId(evaluation.id!);
          setEvaluationForm({
            farm_name: evaluation.farm_name,
            owner_name: evaluation.owner_name,
            rega_code: evaluation.rega_code,
            evaluation_date: evaluation.evaluation_date,
            zootechnical_class: evaluation.zootechnical_class,
            health_qualification: evaluation.health_qualification,
            integrator: evaluation.integrator,
          });

          // Cargar instalaciones
          const facilitiesData = await getWelfareFacilitiesByEvaluationId(token, evaluation.id!);
          setFacilities(facilitiesData);
        } else {
          // Si no hay evaluación, pre-llenar con datos de la granja actual
          setEvaluationForm({
            farm_name: currentFarm.farm_name || "",
            owner_name: "",
            rega_code: currentFarm.REGA || "",
            evaluation_date: "",
            zootechnical_class: "",
            health_qualification: "",
            integrator: "",
          });
        }
      } catch (error) {
        console.error("Error loading evaluation:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvaluation();
  }, [currentFarm, token, record]);

  // Guardar evaluación principal
  const handleSaveEvaluation = async () => {
    if (!currentFarm?.id || !token || !record?.id) return;

    setSaving(true);
    try {
      const evaluationData = {
        farm: currentFarm.id,
        ...evaluationForm,
      };

      let result;
      if (evaluationId) {
        result = await updateWelfareEvaluation(token, evaluationId,record.id, evaluationData);
      } else {
        result = await createWelfareEvaluation(token, record.id, evaluationData);
        setEvaluationId(result.data.id!);
      }

      setSnackbar({
        open: true,
        message: "Evaluación guardada exitosamente",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Error al guardar evaluación",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // Manejar cambios en formulario de evaluación
  const handleEvaluationChange = (field: string, value: any) => {
    setEvaluationForm((prev) => ({ ...prev, [field]: value }));
  };

  // Manejar cambios en formulario de instalación
  const handleFacilityChange = (field: string, value: any) => {
    setFacilityForm((prev) => ({ ...prev, [field]: value }));
  };

  // Abrir dialog para crear instalación
  const handleOpenFacilityDialog = () => {
    setFacilityForm(initialFacilityForm);
    setEditFacilityMode(false);
    setEditFacilityIndex(null);
    setOpenFacilityDialog(true);
  };

  // Editar instalación
  const handleEditFacility = (index: number) => {
    const facility = facilities[index];
    setFacilityForm({
      facility_name: facility.facility_name,
      phase: facility.phase,
      animales_alojados: facility.animales_alojados.toString(),
      m2_superficie: facility.m2_superficie.toString(),
      sensor_temperatura: facility.sensor_temperatura,
      sensor_humedad: facility.sensor_humedad,
      sensor_co2: facility.sensor_co2,
      sensor_nh3: facility.sensor_nh3,
      sensor_velocidad_aire: facility.sensor_velocidad_aire,
      sensor_flujo_agua: facility.sensor_flujo_agua,
      ventilacion: facility.ventilacion,
      tipo_comida: facility.tipo_comida,
      tipo_agua: facility.tipo_agua,
      tipo_enriquecimiento: facility.tipo_enriquecimiento,
      caudofagia_records: facility.caudofagia_records,
    });
    setEditFacilityMode(true);
    setEditFacilityIndex(index);
    setOpenFacilityDialog(true);
  };

  // Guardar instalación
  const handleSaveFacility = async () => {
    if (!evaluationId || !token) return;

    try {
      const animales = Number(facilityForm.animales_alojados);
      const superficie = Number(facilityForm.m2_superficie);
      const densidad = superficie > 0 ? animales / superficie : 0;

      const facilityData = {
        evaluation_id: evaluationId,
        facility_name: facilityForm.facility_name,
        phase: facilityForm.phase,
        animales_alojados: animales,
        m2_superficie: superficie,
        densidad: densidad,
        sensor_temperatura: facilityForm.sensor_temperatura,
        sensor_humedad: facilityForm.sensor_humedad,
        sensor_co2: facilityForm.sensor_co2,
        sensor_nh3: facilityForm.sensor_nh3,
        sensor_velocidad_aire: facilityForm.sensor_velocidad_aire,
        sensor_flujo_agua: facilityForm.sensor_flujo_agua,
        ventilacion: facilityForm.ventilacion,
        tipo_comida: facilityForm.tipo_comida,
        tipo_agua: facilityForm.tipo_agua,
        tipo_enriquecimiento: facilityForm.tipo_enriquecimiento,
        caudofagia_records: facilityForm.caudofagia_records,
      };

      if (editFacilityMode && editFacilityIndex !== null) {
        const facility = facilities[editFacilityIndex];
        await updateWelfareFacility(token, facility.id!, facilityData);
      } else {
        await createWelfareFacility(token, facilityData);
      }

      // Recargar instalaciones
      const facilitiesData = await getWelfareFacilitiesByEvaluationId(token, evaluationId);
      setFacilities(facilitiesData);

      setOpenFacilityDialog(false);
      setSnackbar({
        open: true,
        message: "Instalación guardada exitosamente",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Error al guardar instalación",
        severity: "error",
      });
    }
  };

  // Eliminar instalación
  const handleDeleteFacility = async (index: number) => {
    if (!token) return;

    const facility = facilities[index];
    if (!facility.id) return;

    try {
      await deleteWelfareFacility(token, facility.id);

      // Recargar instalaciones
      if (evaluationId) {
        const facilitiesData = await getWelfareFacilitiesByEvaluationId(token, evaluationId);
        setFacilities(facilitiesData);
      }

      setSnackbar({
        open: true,
        message: "Instalación eliminada exitosamente",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Error al eliminar instalación",
        severity: "error",
      });
    }
  };

  // Calcular densidad
  const calculateDensity = () => {
    const animales = Number(facilityForm.animales_alojados);
    const superficie = Number(facilityForm.m2_superficie);
    if (animales && superficie) {
      return (animales / superficie).toFixed(2);
    }
    return "0";
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
          Datos Generales de la Evaluación
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre de la Granja"
              value={evaluationForm.farm_name}
              onChange={(e) => handleEvaluationChange("farm_name", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre del Propietario"
              value={evaluationForm.owner_name}
              onChange={(e) => handleEvaluationChange("owner_name", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Código REGA"
              value={evaluationForm.rega_code}
              onChange={(e) => handleEvaluationChange("rega_code", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DateInput
              label="Fecha de Evaluación"
              value={evaluationForm.evaluation_date}
              onChange={(value) => handleEvaluationChange("evaluation_date", value)}
              variant="standard"
              sx={{ mb: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Clasificación Zootécnica"
              value={evaluationForm.zootechnical_class}
              onChange={(e) => handleEvaluationChange("zootechnical_class", e.target.value)}
            >
              <MenuItem value="Selección">Selección</MenuItem>
              <MenuItem value="Multiplicación">Multiplicación</MenuItem>
              <MenuItem value="Producción">Producción</MenuItem>
              <MenuItem value="Autoconsumo">Autoconsumo</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Calificación Sanitaria"
              value={evaluationForm.health_qualification}
              onChange={(e) => handleEvaluationChange("health_qualification", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Integradora"
              value={evaluationForm.integrator}
              onChange={(e) => handleEvaluationChange("integrator", e.target.value)}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={handleSaveEvaluation}
            disabled={saving || !currentFarm}
            sx={buttonStyles.save}
          >
            {saving ? "Guardando..." : "Guardar Evaluación"}
          </Button>
        </Box>
      </Paper>

      {/* Tabla de Instalaciones */}
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
              Instalaciones/Naves
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            sx={buttonStyles.save}
            onClick={handleOpenFacilityDialog}
            disabled={!evaluationId}
          >
            Agregar Instalación
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "grey.100" }}>
              <TableRow>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    Nombre
                    <KeyboardArrowDown fontSize="small" color="disabled" />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    Fase
                    <KeyboardArrowDown fontSize="small" color="disabled" />
                  </Box>
                </TableCell>
                <TableCell>Animales</TableCell>
                <TableCell>Superficie (m²)</TableCell>
                <TableCell>Densidad</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {facilities.map((facility, index) => (
                <TableRow
                  key={facility.id || index}
                  sx={{
                    "&:hover": {
                      bgcolor: "grey.50",
                    },
                  }}
                >
                  <TableCell>{facility.facility_name}</TableCell>
                  <TableCell>{facility.phase}</TableCell>
                  <TableCell>{facility.animales_alojados}</TableCell>
                  <TableCell>{facility.m2_superficie}</TableCell>
                  <TableCell>{facility.densidad.toFixed(2)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        sx={buttonStyles.edit}
                        onClick={() => handleEditFacility(index)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteFacility(index)}
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

      {/* Dialog para Instalación */}
      <Dialog open={openFacilityDialog} onClose={() => setOpenFacilityDialog(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {editFacilityMode ? "Editar Instalación" : "Nueva Instalación"}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre de la Instalación"
                value={facilityForm.facility_name}
                onChange={(e) => handleFacilityChange("facility_name", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Fase Productiva"
                value={facilityForm.phase}
                onChange={(e) => handleFacilityChange("phase", e.target.value)}
              >
                <MenuItem value="Gestación">Gestación</MenuItem>
                <MenuItem value="Maternidad">Maternidad</MenuItem>
                <MenuItem value="Transición">Transición</MenuItem>
                <MenuItem value="Cebo">Cebo</MenuItem>
                <MenuItem value="Reposición">Reposición</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Animales Alojados"
                value={facilityForm.animales_alojados}
                onChange={(e) => handleFacilityChange("animales_alojados", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Superficie (m²)"
                value={facilityForm.m2_superficie}
                onChange={(e) => handleFacilityChange("m2_superficie", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Densidad (calc)"
                value={calculateDensity()}
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            {/* Sensores */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Sensores Disponibles
              </Typography>
              <Grid container>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.sensor_temperatura}
                        onChange={(e) => handleFacilityChange("sensor_temperatura", e.target.checked)}
                      />
                    }
                    label="Temperatura"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.sensor_humedad}
                        onChange={(e) => handleFacilityChange("sensor_humedad", e.target.checked)}
                      />
                    }
                    label="Humedad"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.sensor_co2}
                        onChange={(e) => handleFacilityChange("sensor_co2", e.target.checked)}
                      />
                    }
                    label="CO₂"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.sensor_nh3}
                        onChange={(e) => handleFacilityChange("sensor_nh3", e.target.checked)}
                      />
                    }
                    label="NH₃"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.sensor_velocidad_aire}
                        onChange={(e) => handleFacilityChange("sensor_velocidad_aire", e.target.checked)}
                      />
                    }
                    label="Velocidad Aire"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={facilityForm.sensor_flujo_agua}
                        onChange={(e) => handleFacilityChange("sensor_flujo_agua", e.target.checked)}
                      />
                    }
                    label="Flujo Agua"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Ventilación */}
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Sistema de Ventilación</FormLabel>
                <RadioGroup
                  row
                  value={facilityForm.ventilacion}
                  onChange={(e) => handleFacilityChange("ventilacion", e.target.value)}
                >
                  <FormControlLabel value="Natural" control={<Radio />} label="Natural" />
                  <FormControlLabel value="Forzada" control={<Radio />} label="Forzada" />
                  <FormControlLabel value="Mixta" control={<Radio />} label="Mixta" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Alimentación */}
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Tipo de Comida</FormLabel>
                <RadioGroup
                  value={facilityForm.tipo_comida}
                  onChange={(e) => handleFacilityChange("tipo_comida", e.target.value)}
                >
                  <FormControlLabel value="Seca" control={<Radio />} label="Seca" />
                  <FormControlLabel value="Húmeda" control={<Radio />} label="Húmeda" />
                  <FormControlLabel value="Líquida" control={<Radio />} label="Líquida" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Tipo de Agua</FormLabel>
                <RadioGroup
                  value={facilityForm.tipo_agua}
                  onChange={(e) => handleFacilityChange("tipo_agua", e.target.value)}
                >
                  <FormControlLabel value="Chupete" control={<Radio />} label="Chupete" />
                  <FormControlLabel value="Cazoleta" control={<Radio />} label="Cazoleta" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Enriquecimiento */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tipo de Enriquecimiento"
                value={facilityForm.tipo_enriquecimiento}
                onChange={(e) => handleFacilityChange("tipo_enriquecimiento", e.target.value)}
                placeholder="Ej: Cadenas, juguetes, paja, etc."
              />
            </Grid>

            {/* Caudofagia */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={facilityForm.caudofagia_records}
                    onChange={(e) => handleFacilityChange("caudofagia_records", e.target.checked)}
                  />
                }
                label="¿Hay registros de brotes de caudofagia en los últimos 12 meses?"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={() => setOpenFacilityDialog(false)}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSaveFacility} sx={buttonStyles.save}>
              Guardar
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Botones de navegación */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" disabled sx={buttonStyles.back}>
          Atrás
        </Button>
        <Button
          variant="contained"
          sx={buttonStyles.next}
          onClick={onNext}
          disabled={!evaluationId || facilities.length === 0}
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

export default WelfareEvaluationStep1;
