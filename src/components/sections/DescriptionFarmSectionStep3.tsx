import { useState } from "react"
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
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

const DescriptionFarmSectionStep3: React.FC<Props> = ({ onNext, onBack }) => {

    const [formData, setFormData] = useState({
    // Temperature section
    hasTemperatureSensors: "",
    recordsTemperature: "",
    temperatureControl: "",
    temperatureObservations: "",

    // Humidity section
    hasHumiditySensors: "",
    recordsHumidity: "",
    humidityControl: "",
    humidityObservations: "",

    // Gases section
    extractorsVentilators: "",
    extractorsObservations: "",
    automaticWindowOpening: "",
    windowObservations: "",
    automaticChimneyOpening: "",
    chimneyObservations: "",
    recordsGasEmissions: "",
    gasObservations: "",
    coolings: "",
    coolingsObservations: "",
    artificialVentilation: "",
    ventilationObservations: "",
    heatingType: "",
    heatingObservations: "",
  })

  const handleRadioChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }


    return (
       <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
     
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Temperature Section */}
        <Box sx={{ borderLeft: "4px solid #22d3ee", pl: 3 }}>
          <Typography variant="h6" sx={{ color: "#0891b2", fontWeight: 500, mb: 3 }}>
            Temperatura
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} lg={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
                  ¿Dispone de sensores de temperatura?
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.hasTemperatureSensors}
                  onChange={(e) => handleRadioChange("hasTemperatureSensors", e.target.value)}
                  sx={{ gap: 3 }}
                >
                  <FormControlLabel value="si" control={<Radio size="small" />} label="Sí" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} lg={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
                  ¿Se registra la temperatura?
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.recordsTemperature}
                  onChange={(e) => handleRadioChange("recordsTemperature", e.target.value)}
                  sx={{ gap: 3 }}
                >
                  <FormControlLabel value="si" control={<Radio size="small" />} label="Sí" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
                  ¿Se realiza control de temperatura?
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.temperatureControl}
                  onChange={(e) => handleRadioChange("temperatureControl", e.target.value)}
                  sx={{ gap: 3 }}
                >
                  <FormControlLabel value="si" control={<Radio size="small" />} label="Sí" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                placeholder="Observaciones"
                variant="filled"
                fullWidth
                value={formData.temperatureObservations}
                onChange={(e) => handleInputChange("temperatureObservations", e.target.value)}
               
              />
            </Grid>
          </Grid>
        </Box>

        {/* Humidity Section */}
        <Box sx={{ borderLeft: "4px solid #22d3ee", pl: 3 }}>
          <Typography variant="h6" sx={{ color: "#0891b2", fontWeight: 500, mb: 3 }}>
            Humedad
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} lg={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
                  ¿Dispone de sensores de humedad?
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.hasHumiditySensors}
                  onChange={(e) => handleRadioChange("hasHumiditySensors", e.target.value)}
                  sx={{ gap: 3 }}
                >
                  <FormControlLabel value="si" control={<Radio size="small" />} label="Sí" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} lg={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
                  ¿Se registra la humedad?
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.recordsHumidity}
                  onChange={(e) => handleRadioChange("recordsHumidity", e.target.value)}
                  sx={{ gap: 3 }}
                >
                  <FormControlLabel value="si" control={<Radio size="small" />} label="Sí" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
                  ¿Se realiza control de humedad?
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.humidityControl}
                  onChange={(e) => handleRadioChange("humidityControl", e.target.value)}
                  sx={{ gap: 3 }}
                >
                  <FormControlLabel value="si" control={<Radio size="small" />} label="Sí" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                placeholder="Observaciones"
                variant="filled"
                fullWidth
                value={formData.humidityObservations}
                onChange={(e) => handleInputChange("humidityObservations", e.target.value)}
               
              />
            </Grid>
          </Grid>
        </Box>

        {/* Gases Section */}
        <Box sx={{ borderLeft: "4px solid #22d3ee", pl: 3 }}>
          <Typography variant="h6" sx={{ color: "#0891b2", fontWeight: 500, mb: 3 }}>
            Gases
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Extractores y/o ventiladores */}
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
                    Extractores y/o ventiladores
                  </FormLabel>
                  <RadioGroup
                    row
                    value={formData.extractorsVentilators}
                    onChange={(e) => handleRadioChange("extractorsVentilators", e.target.value)}
                    sx={{ gap: 3 }}
                  >
                    <FormControlLabel value="si" control={<Radio size="small" />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} lg={6}>
                <TextField
                  placeholder="Observaciones"
                  variant="filled"
                  fullWidth
                  value={formData.extractorsObservations}
                  onChange={(e) => handleInputChange("extractorsObservations", e.target.value)}
                
                />
              </Grid>
            </Grid>

            {/* Apertura automática ventanas */}
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
                    Apertura automática ventanas
                  </FormLabel>
                  <RadioGroup
                    row
                    value={formData.automaticWindowOpening}
                    onChange={(e) => handleRadioChange("automaticWindowOpening", e.target.value)}
                    sx={{ gap: 3 }}
                  >
                    <FormControlLabel value="si" control={<Radio size="small" />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} lg={6}>
                <TextField
                  placeholder="Observaciones"
                  variant="filled"
                  fullWidth
                  value={formData.windowObservations}
                  onChange={(e) => handleInputChange("windowObservations", e.target.value)}
                  
                />
              </Grid>
            </Grid>

            {/* Apertura automática chimeneas */}
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
                    Apertura automática chimeneas
                  </FormLabel>
                  <RadioGroup
                    row
                    value={formData.automaticChimneyOpening}
                    onChange={(e) => handleRadioChange("automaticChimneyOpening", e.target.value)}
                    sx={{ gap: 3 }}
                  >
                    <FormControlLabel value="si" control={<Radio size="small" />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} lg={6}>
                <TextField
                  placeholder="Observaciones"
                  variant="filled"
                  fullWidth
                  value={formData.chimneyObservations}
                  onChange={(e) => handleInputChange("chimneyObservations", e.target.value)}
                 
                />
              </Grid>
            </Grid>

            {/* Se registran emisiones de gases */}
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
                    ¿Se registran emisiones de gases?
                  </FormLabel>
                  <RadioGroup
                    row
                    value={formData.recordsGasEmissions}
                    onChange={(e) => handleRadioChange("recordsGasEmissions", e.target.value)}
                    sx={{ gap: 3 }}
                  >
                    <FormControlLabel value="si" control={<Radio size="small" />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} lg={6}>
                <TextField
                  placeholder="Observaciones"
                  variant="filled"
                  fullWidth
                  value={formData.gasObservations}
                  onChange={(e) => handleInputChange("gasObservations", e.target.value)}
                  
                />
              </Grid>
            </Grid>

            {/* Coolings */}
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
                    Coolings
                  </FormLabel>
                  <RadioGroup
                    row
                    value={formData.coolings}
                    onChange={(e) => handleRadioChange("coolings", e.target.value)}
                    sx={{ gap: 3 }}
                  >
                    <FormControlLabel value="si" control={<Radio size="small" />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} lg={6}>
                <TextField
                  placeholder="Observaciones"
                  variant="filled"
                  fullWidth
                  value={formData.coolingsObservations}
                  onChange={(e) => handleInputChange("coolingsObservations", e.target.value)}
                  
                />
              </Grid>
            </Grid>

            {/* Ventilación total artificial */}
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
                    Ventilación total artificial
                  </FormLabel>
                  <RadioGroup
                    row
                    value={formData.artificialVentilation}
                    onChange={(e) => handleRadioChange("artificialVentilation", e.target.value)}
                    sx={{ gap: 3 }}
                  >
                    <FormControlLabel value="si" control={<Radio size="small" />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} lg={6}>
                <TextField
                  placeholder="Observaciones"
                  variant="filled"
                  fullWidth
                  value={formData.ventilationObservations}
                  onChange={(e) => handleInputChange("ventilationObservations", e.target.value)}
                 
                />
              </Grid>
            </Grid>

            {/* Calefacción y tipo */}
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
                    Calefacción y tipo
                  </FormLabel>
                  <RadioGroup
                    row
                    value={formData.heatingType}
                    onChange={(e) => handleRadioChange("heatingType", e.target.value)}
                    sx={{ gap: 3 }}
                  >
                    <FormControlLabel value="si" control={<Radio size="small" />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} lg={6}>
                <TextField
                  placeholder="Observaciones"
                  variant="filled"
                  fullWidth
                  value={formData.heatingObservations}
                  onChange={(e) => handleInputChange("heatingObservations", e.target.value)}
                  
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>

      {/* Navigation buttons */}
     <section className="form-grid-2-cols">
                    <Button
                      variant="outlined"
                      color="secondary"
                      className="btnatras"
                      sx={{ mr: 2 }}
                       onClick={onBack}
                    >
                      Atras
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      className="btnsiguiente"
                      onClick={() => {
     
      onNext();
    }}
                    >
                      Siguiente
                    </Button>
                  </section>
    </Paper>     
    );
};

export default DescriptionFarmSectionStep3;