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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import useUserStore from "../../_store/user";
import useFarmFormStore from "../../_store/farm";
import { buttonStyles } from "./buttonStyles";
import {
  getPlanBienestarAnimalByFarmId,
  createPlanBienestarAnimal,
  updatePlanBienestarAnimal,
} from "../../action/PlanBienestarAnimalPocket";

interface EquipamientoStepProps {
  onNext: () => void;
}

interface Equipment {
  name: string;
  available: string; // "si" | "no"
  fijo_movil?: string;
  localizacion?: string;
  tipo?: string;
  observaciones?: string;
}

const EQUIPMENT_LIST = [
  "Luxómetro",
  "Sonómetro",
  "Termómetro",
  "Higrómetro",
  "Medidor de CO₂",
  "Medidor de NO₂",
  "Medidores de otros gases",
  "Sistemas de alarma",
  "Equipo de aturdimiento y matanza",
  "Carros de procesamiento",
  "Lima de dientes",
  "Cortador de rabos",
  "Cortador de pezuñas",
  "Desplazamiento de animales",
  "Rampas",
  "Otros",
];

const PlanBienestarAnimalEquipamientoStep: React.FC<EquipamientoStepProps> = ({ onNext }) => {
  const { token, record } = useUserStore();
  const { currentFarm } = useFarmFormStore();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingPlanId, setExistingPlanId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    const initializeEquipment = () => {
      return EQUIPMENT_LIST.map((name) => ({
        name,
        available: "no",
        fijo_movil: "",
        localizacion: "",
        tipo: "",
        observaciones: "",
      }));
    };

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
          
          // Parse equipment JSON if it exists
          if (existingPlan.equipment_json) {
            try {
              const parsedEquipment = JSON.parse(existingPlan.equipment_json);
              setEquipment(parsedEquipment);
            } catch (error) {
              console.error("Error parsing equipment JSON:", error);
              setEquipment(initializeEquipment());
            }
          } else {
            setEquipment(initializeEquipment());
          }
        } else {
          setEquipment(initializeEquipment());
        }
      } catch (error) {
        console.error("Error loading plan:", error);
        setEquipment(initializeEquipment());
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

  const handleAvailabilityChange = (index: number, value: string) => {
    const newEquipment = [...equipment];
    newEquipment[index] = {
      ...newEquipment[index],
      available: value,
      // Clear conditional fields if "no" is selected
      ...(value === "no" && {
        fijo_movil: "",
        localizacion: "",
        tipo: "",
        observaciones: "",
      }),
    };
    setEquipment(newEquipment);
  };

  const handleFieldChange = (index: number, field: keyof Equipment, value: string) => {
    const newEquipment = [...equipment];
    newEquipment[index] = {
      ...newEquipment[index],
      [field]: value,
    };
    setEquipment(newEquipment);
  };

  const handleSubmit = async () => {
    if (!token || !record?.id || !currentFarm?.id) {
      setSnackbar({
        open: true,
        message: "Error: No se encontró información de usuario o granja",
        severity: "error",
      });
      return;
    }

    setSaving(true);

    try {
      const equipmentJson = JSON.stringify(equipment);
      const data = {
        equipment_json: equipmentJson,
        farm: currentFarm.id,
      };

      if (existingPlanId) {
        await updatePlanBienestarAnimal(token, existingPlanId, record.id, data);
        setSnackbar({
          open: true,
          message: "Equipamiento actualizado exitosamente",
          severity: "success",
        });
      } else {
        const result = await createPlanBienestarAnimal(token, record.id, data);
        setExistingPlanId(result.data.id!);
        setSnackbar({
          open: true,
          message: "Equipamiento guardado exitosamente",
          severity: "success",
        });
      }

      // Proceed to next step after a short delay
      setTimeout(() => {
        onNext();
      }, 1000);
    } catch (error: any) {
      console.error("Error saving equipment:", error);
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
          Plan de Bienestar Animal – Equipamiento
        </Typography>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "grey.100" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: "30%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    Nombre del equipo
                    <KeyboardArrowDown fontSize="small" color="disabled" />
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: "15%" }}>
                  ¿Está disponible?
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Detalles</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipment.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="body2">{item.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup
                      row
                      value={item.available}
                      onChange={(e) => handleAvailabilityChange(index, e.target.value)}
                    >
                      <FormControlLabel
                        value="si"
                        control={<Radio size="small" />}
                        label="Sí"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio size="small" />}
                        label="No"
                      />
                    </RadioGroup>
                  </TableCell>
                  <TableCell>
                    {item.available === "si" && (
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            size="small"
                            variant="filled"
                            label="Fijo / Móvil"
                            value={item.fijo_movil || ""}
                            onChange={(e) =>
                              handleFieldChange(index, "fijo_movil", e.target.value)
                            }
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            size="small"
                            variant="filled"
                            label="Localización"
                            value={item.localizacion || ""}
                            onChange={(e) =>
                              handleFieldChange(index, "localizacion", e.target.value)
                            }
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            size="small"
                            variant="filled"
                            label="Tipo"
                            value={item.tipo || ""}
                            onChange={(e) =>
                              handleFieldChange(index, "tipo", e.target.value)
                            }
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            size="small"
                            variant="filled"
                            label="Observaciones"
                            value={item.observaciones || ""}
                            onChange={(e) =>
                              handleFieldChange(index, "observaciones", e.target.value)
                            }
                          />
                        </Grid>
                      </Grid>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
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

export default PlanBienestarAnimalEquipamientoStep;
