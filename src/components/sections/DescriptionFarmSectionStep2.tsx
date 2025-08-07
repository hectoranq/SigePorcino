import { useState } from "react"
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Grid,
} from "@mui/material"

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const DescriptionFarmSectionStep2: React.FC<Props> = ({ onNext, onBack }) => {
  // Aquí va el contenido del paso 2
  const [formData, setFormData] = useState({
    feedingType: [] as string[],
    feedType: [] as string[],
    mealsPerDay: [] as string[],
    medicationUse: "",
    inspectionsPerDay: [] as string[],
    automaticEquipment: [] as string[],
    animalGrouping: [] as string[],
    geneticMaterial: "",
  })

  const handleCheckboxChange = (category: string, value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [category]: checked
        ? [...(prev[category as keyof typeof prev] as string[]), value]
        : (prev[category as keyof typeof prev] as string[]).filter((item) => item !== value),
    }))
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3, bgcolor: "background.default" }}>
     

      {/* Alimentación y abrevado Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderLeft: 4,
          borderLeftColor: "primary.main",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 3, color: "primary.main", fontWeight: 500 }}>
          Alimentación y abrevado
        </Typography>

        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Número de animales por corral" variant="filled" size="small" sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ mb: 2, color: "text.primary", fontWeight: 500 }}>
                  Tipo de alimentación
                </FormLabel>
                <FormGroup>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.feedingType.includes("ad-libitum")}
                            onChange={(e) => handleCheckboxChange("feedingType", "ad-libitum", e.target.checked)}
                          />
                        }
                        label="Ad libitum"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.feedingType.includes("multifase")}
                            onChange={(e) => handleCheckboxChange("feedingType", "multifase", e.target.checked)}
                          />
                        }
                        label="Multifase"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.feedingType.includes("racionada")}
                            onChange={(e) => handleCheckboxChange("feedingType", "racionada", e.target.checked)}
                          />
                        }
                        label="Racionada"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.feedingType.includes("anadir-opcion-2")}
                            onChange={(e) => handleCheckboxChange("feedingType", "anadir-opcion-2", e.target.checked)}
                          />
                        }
                        label={<Typography sx={{ color: "primary.main" }}>Añadir otra opción</Typography>}
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ mb: 2, color: "text.primary", fontWeight: 500 }}>
                  Tipo de piensos utilizados
                </FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.feedType.includes("nc-1")}
                        onChange={(e) => handleCheckboxChange("feedType", "nc-1", e.target.checked)}
                      />
                    }
                    label="NC-1"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.feedType.includes("anadir-opcion-1")}
                        onChange={(e) => handleCheckboxChange("feedType", "anadir-opcion-1", e.target.checked)}
                      />
                    }
                    label={<Typography sx={{ color: "primary.main" }}>Añadir otra opción</Typography>}
                  />
                </FormGroup>
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ mb: 2, color: "text.primary", fontWeight: 500 }}>
                  Número de comidas por día
                </FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.mealsPerDay.includes("ad-libitum-meals")}
                        onChange={(e) => handleCheckboxChange("mealsPerDay", "ad-libitum-meals", e.target.checked)}
                      />
                    }
                    label="Ad libitum"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.mealsPerDay.includes("2-comidas")}
                        onChange={(e) => handleCheckboxChange("mealsPerDay", "2-comidas", e.target.checked)}
                      />
                    }
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, bgcolor: "black", borderRadius: 0.5 }} />
                        <Typography sx={{ color: "error.main" }}>2 comidas / día</Typography>
                      </Box>
                    }
                  />
                </FormGroup>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Observaciones"
             
                variant="filled"
              size="small"
              sx={{ mb: 3 }}
            />

            <FormControl component="fieldset" sx={{ mb: 3, mt: 4 }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.feedingType.includes("racionada")}
                      onChange={(e) => handleCheckboxChange("feedingType", "racionada", e.target.checked)}
                    />
                  }
                  label="Racionada"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.feedingType.includes("anadir-opcion-2")}
                      onChange={(e) => handleCheckboxChange("feedingType", "anadir-opcion-2", e.target.checked)}
                    />
                  }
                  label={<Typography sx={{ color: "primary.main" }}>Añadir otra opción</Typography>}
                />
              </FormGroup>
            </FormControl>

            <FormControl component="fieldset" sx={{ mb: 3, mt: 4 }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.feedType.includes("nc-2")}
                      onChange={(e) => handleCheckboxChange("feedType", "nc-2", e.target.checked)}
                    />
                  }
                  label="NC-2"
                />
              </FormGroup>
            </FormControl>

            <FormControl component="fieldset" sx={{ mt: 4 }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.mealsPerDay.includes("1-comida")}
                      onChange={(e) => handleCheckboxChange("mealsPerDay", "1-comida", e.target.checked)}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          bgcolor: "black",
                          borderRadius: 0.5,
                        }}
                      />
                      <Typography sx={{ color: "error.main" }}>1 comida / día</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.mealsPerDay.includes("anadir-opcion-meals")}
                      onChange={(e) => handleCheckboxChange("mealsPerDay", "anadir-opcion-meals", e.target.checked)}
                    />
                  }
                  label={<Typography sx={{ color: "primary.main" }}>Añadir otra opción</Typography>}
                />
              </FormGroup>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Longitud en cm de comedero" variant="outlined" size="small" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Observaciones" multiline rows={2} variant="outlined" size="small" />
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Número de bebederos" variant="outlined" size="small" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Observaciones" multiline rows={2} variant="outlined" size="small" />
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ mb: 2, color: "text.primary", fontWeight: 500 }}>
                Uso de medicación por agua
              </FormLabel>
              <RadioGroup
                value={formData.medicationUse}
                onChange={(e) => setFormData((prev) => ({ ...prev, medicationUse: e.target.value }))}
              >
                <FormControlLabel value="si" control={<Radio />} label="Sí" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Observaciones" multiline rows={2} variant="outlined" size="small" />
          </Grid>
        </Grid>
      </Paper>

      {/* Manejo Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderLeft: 4,
          borderLeftColor: "primary.main",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 3, color: "primary.main", fontWeight: 500 }}>
          Manejo
        </Typography>

        <Box sx={{ mb: 4 }}>
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend" sx={{ mb: 2, color: "text.primary", fontWeight: 500 }}>
              Número de inspecciones a los animales/día
            </FormLabel>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.inspectionsPerDay.includes("mes-1-2")}
                        onChange={(e) => handleCheckboxChange("inspectionsPerDay", "mes-1-2", e.target.checked)}
                      />
                    }
                    label="Mes 1-2 veces/día"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.inspectionsPerDay.includes("anadir-inspeccion")}
                        onChange={(e) =>
                          handleCheckboxChange("inspectionsPerDay", "anadir-inspeccion", e.target.checked)
                        }
                      />
                    }
                    label={<Typography sx={{ color: "primary.main" }}>Añadir otra opción</Typography>}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.inspectionsPerDay.includes("meses-2-3-4")}
                        onChange={(e) => handleCheckboxChange("inspectionsPerDay", "meses-2-3-4", e.target.checked)}
                      />
                    }
                    label={<Typography sx={{ color: "error.main" }}>Meses 2, 3 y 4 - 1 vez / día</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.inspectionsPerDay.includes("anadir-inspeccion-2")}
                        onChange={(e) =>
                          handleCheckboxChange("inspectionsPerDay", "anadir-inspeccion-2", e.target.checked)
                        }
                      />
                    }
                    label={<Typography sx={{ color: "primary.main" }}>Añadir otra opción</Typography>}
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </FormControl>
          <TextField fullWidth label="Observaciones" multiline rows={2} variant="outlined" size="small" />
        </Box>

        <Box sx={{ mb: 4 }}>
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend" sx={{ mb: 2, color: "text.primary", fontWeight: 500 }}>
              Número de inspecciones/día de equipamiento automático (iluminación, abrevado, alimentación, ventilación)
            </FormLabel>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.automaticEquipment.includes("equip-1")}
                        onChange={(e) => handleCheckboxChange("automaticEquipment", "equip-1", e.target.checked)}
                      />
                    }
                    label="1"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.automaticEquipment.includes("anadir-equip")}
                        onChange={(e) => handleCheckboxChange("automaticEquipment", "anadir-equip", e.target.checked)}
                      />
                    }
                    label={<Typography sx={{ color: "primary.main" }}>Añadir otra opción</Typography>}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.automaticEquipment.includes("equip-2")}
                        onChange={(e) => handleCheckboxChange("automaticEquipment", "equip-2", e.target.checked)}
                      />
                    }
                    label="2"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </FormControl>
          <TextField fullWidth label="Observaciones" multiline rows={2} variant="outlined" size="small" />
        </Box>

        <Box sx={{ mb: 4 }}>
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend" sx={{ mb: 2, color: "text.primary", fontWeight: 500 }}>
              Tipo de agrupamiento de animales
            </FormLabel>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.animalGrouping.includes("sexo")}
                        onChange={(e) => handleCheckboxChange("animalGrouping", "sexo", e.target.checked)}
                      />
                    }
                    label="Sexo"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.animalGrouping.includes("anadir-grupo")}
                        onChange={(e) => handleCheckboxChange("animalGrouping", "anadir-grupo", e.target.checked)}
                      />
                    }
                    label={<Typography sx={{ color: "primary.main" }}>Añadir otra opción</Typography>}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.animalGrouping.includes("tamano")}
                        onChange={(e) => handleCheckboxChange("animalGrouping", "tamano", e.target.checked)}
                      />
                    }
                    label="Tamaño"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </FormControl>
          <TextField fullWidth label="Observaciones" multiline rows={2} variant="outlined" size="small" />
        </Box>

        <FormControl component="fieldset" sx={{ mb: 4 }}>
          <FormLabel component="legend" sx={{ mb: 2, color: "text.primary", fontWeight: 500 }}>
            Se utiliza material genético
          </FormLabel>
          <RadioGroup
            value={formData.geneticMaterial}
            onChange={(e) => setFormData((prev) => ({ ...prev, geneticMaterial: e.target.value }))}
          >
            <FormControlLabel value="si" control={<Radio />} label="Sí" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", pt: 3 }}>
        <Button
          variant="outlined"
          size="large"
          sx={{ px: 4 }}
          onClick={onBack}
        >
          Atrás
        </Button>
        <Button
          variant="contained"
          size="large"
          sx={{ px: 4 }}
          onClick={onNext}
        >
          Siguiente
        </Button>
      </Box>
    </Box>
  );
};

export default DescriptionFarmSectionStep2;