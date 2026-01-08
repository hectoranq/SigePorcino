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
import { buttonStyles } from "./buttonStyles"

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const DescriptionFarmSectionStep2: React.FC<Props> = ({ onNext, onBack }) => {
  // Aquí va el contenido del paso 2
  const [formData, setFormData] = useState({
    // Alimentación y abrevado
    animalesPorCorral: "",
    observacionesAnimales: "",
    feedingType: [] as string[], // ad-libitum, racionada, multifase
    feedType: [] as string[], // NC-1, NC-2
    mealsPerDay: [] as string[], // ad-libitum, 1-comida/dia, 2-comida/dia
    longitudComedero: "",
    observacionesComedero: "",
    numeroBebederos: "",
    observacionesBebederos: "",
    medicationUse: "", // si/no
    observacionesMedicacion: "",
    
    // Manejo
    inspectionsPerDay: [] as string[], // mes-1-2, meses-2-3-4
    observacionesInspecciones: "",
    automaticEquipment: [] as string[], // equip-1, equip-2
    observacionesEquipamiento: "",
    animalGrouping: [] as string[], // sexo, tamano
    observacionesAgrupamiento: "",
    geneticMaterial: "", // si/no
  })

  const handleCheckboxChange = (category: string, value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [category]: checked
        ? [...(prev[category as keyof typeof prev] as string[]), value]
        : (prev[category as keyof typeof prev] as string[]).filter((item) => item !== value),
    }))
  }

  // Función para manejar cambios en campos de texto
  const handleTextChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
            <TextField
              fullWidth
              label="Número de animales por corral"
              variant="filled"
              size="small"
              sx={{ mb: 3 }}
              value={formData.animalesPorCorral}
              onChange={(e) => handleTextChange("animalesPorCorral", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Observaciones"
              multiline
              variant="filled"
              size="small"
              value={formData.observacionesAnimales}
              onChange={(e) => handleTextChange("observacionesAnimales", e.target.value)}
            />
          </Grid>
        </Grid>

       <Grid container spacing={4} sx={{ mb: 4 }}>
         <Grid item xs={12} md={12}>
            <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ mb: 2, color: "text.primary", fontWeight: 500 }}>
                  Tipo de alimentación
                </FormLabel>
                <FormGroup>
                    <Grid container spacing={{ xs: 1, sm: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.feedingType.includes("ad-libitum")}
                              onChange={(e) =>
                                handleCheckboxChange("feedingType", "ad-libitum", e.target.checked)
                              }
                            />
                          }
                          label="Ad libitum"
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                         <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.feedingType.includes("racionada")}
                              onChange={(e) =>
                                handleCheckboxChange("feedingType", "racionada", e.target.checked)
                              }
                            />
                          }
                          label="Racionada"
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.feedingType.includes("multifase")}
                              onChange={(e) =>
                                handleCheckboxChange("feedingType", "multifase", e.target.checked)
                              }
                            />
                          }
                          label="Multifase"
                        />
                       
                      </Grid>
                    </Grid>
                  </FormGroup>

              </FormControl>
          </Grid>
           
        </Grid>

        <Grid container spacing={4} sx={{ mb: 4 }}>
         <Grid item xs={12} md={12}>
            <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ mb: 2, color: "text.primary", fontWeight: 500 }}>
                 Tipo de piensos utilizados
                </FormLabel>
                <FormGroup>
                    <Grid container spacing={{ xs: 1, sm: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.feedingType.includes("NC-1")}
                              onChange={(e) =>
                                handleCheckboxChange("feedingType", "NC-1", e.target.checked)
                              }
                            />
                          }
                          label="NC-1"
                        />
                      </Grid>

                      

                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.feedingType.includes("NC-2")}
                              onChange={(e) =>
                                handleCheckboxChange("feedingType", "NC-2", e.target.checked)
                              }
                            />
                          }
                          label="NC-2"
                        />
                       
                      </Grid>
                    </Grid>
                  </FormGroup>

              </FormControl>
          </Grid>
           
        </Grid>                  

        <Grid container spacing={4} sx={{ mb: 4 }}>
         <Grid item xs={12} md={12}>
            <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ mb: 2, color: "text.primary", fontWeight: 500 }}>
                 Numero de comidas al día
                </FormLabel>
                <FormGroup>
                    <Grid container spacing={{ xs: 1, sm: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.feedingType.includes("ad-libitum")}
                              onChange={(e) =>
                                handleCheckboxChange("feedingType", "ad-libitum", e.target.checked)
                              }
                            />
                          }
                          label="Ad Libitum"
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.feedingType.includes("1-comida / dia")}
                              onChange={(e) =>
                                handleCheckboxChange("feedingType", "1-comida / dia", e.target.checked)
                              }
                            />
                          }
                          label="1-comida / dia"
                        />
                       
                      </Grid>
                       <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.feedingType.includes("2-comida / dia")}
                              onChange={(e) =>
                                handleCheckboxChange("feedingType", "2-comida / dia", e.target.checked)
                              }
                            />
                          }
                          label="2-comida / dia"
                        />                       
                      </Grid>


                    </Grid>
                  </FormGroup>

              </FormControl>
          </Grid>
           
        </Grid> 

        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Longitud en cm de comedero"
              variant="filled"
              size="small"
              value={formData.longitudComedero}
              onChange={(e) => handleTextChange("longitudComedero", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Observaciones"
              variant="filled"
              size="small"
              value={formData.observacionesComedero}
              onChange={(e) => handleTextChange("observacionesComedero", e.target.value)}
            />
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Número de bebederos"
              variant="filled"
              size="small"
              value={formData.numeroBebederos}
              onChange={(e) => handleTextChange("numeroBebederos", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Observaciones"
              variant="filled"
              size="small"
              value={formData.observacionesBebederos}
              onChange={(e) => handleTextChange("observacionesBebederos", e.target.value)}
            />
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
            <TextField
              fullWidth
              label="Observaciones"
              variant="filled"
              size="small"
              value={formData.observacionesMedicacion}
              onChange={(e) => handleTextChange("observacionesMedicacion", e.target.value)}
            />
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

        <Grid container spacing={4} sx={{ mb: 4 }}>
         <Grid item xs={12} md={12}>
            <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ mb: 2, color: "text.primary", fontWeight: 500 }}>
                 Número de inspecciones a los animales/día
                </FormLabel>
                <FormGroup>
                    <Grid container spacing={{ xs: 1, sm: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.feedingType.includes("mes-1-2")}
                              onChange={(e) =>
                                handleCheckboxChange("feedingType", "mes-1-2", e.target.checked)
                              }
                            />
                          }
                          label="Mes 1-2 veces/día"
                        />
                      </Grid>

                      

                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.feedingType.includes("meses-2-3-4")}
                              onChange={(e) =>
                                handleCheckboxChange("feedingType", "meses-2-3-4", e.target.checked)
                              }
                            />
                          }
                          label="Meses 2, 3 y 4 - 1 vez / día"
                        />
                       
                      </Grid>
                    </Grid>
                  </FormGroup>

              </FormControl>
               <TextField fullWidth label="Observaciones" multiline rows={2} variant="filled" size="small" value={formData.observacionesInspecciones} onChange={(e) => handleTextChange("observacionesInspecciones", e.target.value)} />
          </Grid>
           
        </Grid>  

       <Grid container spacing={4} sx={{ mb: 4 }}>
         <Grid item xs={12} md={12}>
            <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ mb: 2, color: "text.primary", fontWeight: 500 }}>
               Número de inspecciones/día de equipamiento automático (iluminación, abrevado, alimentación, ventilación)
                </FormLabel>
                <FormGroup>
                    <Grid container spacing={{ xs: 1, sm: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.feedingType.includes("equip-1")}
                              onChange={(e) =>
                                handleCheckboxChange("feedingType", "equip-1", e.target.checked)
                              }
                            />
                          }
                          label="1"
                        />
                      </Grid>

                      

                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.feedingType.includes("equip-2")}
                              onChange={(e) =>
                                handleCheckboxChange("feedingType", "equip-2", e.target.checked)
                              }
                            />
                          }
                          label="2"
                        />
                       
                      </Grid>
                    </Grid>
                  </FormGroup>

              </FormControl>
               <TextField fullWidth label="Observaciones" multiline rows={2} variant="filled" size="small" value={formData.observacionesEquipamiento} onChange={(e) => handleTextChange("observacionesEquipamiento", e.target.value)} />
          </Grid>
           
        </Grid>  

        <Grid container spacing={4} sx={{ mb: 4 }}>
         <Grid item xs={12} md={12}>
            <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ mb: 2, color: "text.primary", fontWeight: 500 }}>
              Tipo de agrupamiento de animales
                </FormLabel>
                <FormGroup>
                    <Grid container spacing={{ xs: 1, sm: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                                checked={formData.animalGrouping.includes("sexo")}
                              onChange={(e) =>
                                handleCheckboxChange("animalGrouping", "sexo", e.target.checked)
                              }
                            />
                          }
                          label="1"
                        />
                      </Grid>

                      

                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                               checked={formData.animalGrouping.includes("tamano")}
                              onChange={(e) =>
                                handleCheckboxChange("animalGrouping", "tamano", e.target.checked)
                              }
                            />
                          }
                          label="2"
                        />
                       
                      </Grid>
                    </Grid>
                  </FormGroup>

              </FormControl>
               <TextField fullWidth label="Observaciones" multiline rows={2} variant="filled" size="small" value={formData.observacionesAgrupamiento} onChange={(e) => handleTextChange("observacionesAgrupamiento", e.target.value)} />
          </Grid>
           
        </Grid>  

        
        <FormControl component="fieldset" sx={{ mb: 4 }}>
          <FormLabel component="legend" sx={{ mb: 2, color: "text.primary", fontWeight: 500 }}>
            Se utiliza material genético
          </FormLabel>
          <RadioGroup
            row
            value={formData.geneticMaterial}
            onChange={(e) => setFormData((prev) => ({ ...prev, geneticMaterial: e.target.value }))}
          >
            <FormControlLabel value="si" control={<Radio />} label="Sí" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button
          variant="outlined"
          sx={buttonStyles.back}
          onClick={onBack}
        >
          Atrás
        </Button>
        <Button
          variant="contained"
          sx={buttonStyles.next}
          onClick={() => {
            console.log("Datos del formulario Step 2:", formData);
            onNext();
          }}
        >
          Siguiente
        </Button>
      </Box>
      
    </Box>
  );
};

export default DescriptionFarmSectionStep2;