import { useState, useEffect } from "react"
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
import { buttonStyles } from "./buttonStyles"
import useUserStore from "../../_store/user"
import useFarmFormStore from "../../_store/farm"
import {
  searchFarmDetailsEnvironmentalByFarmId,
  createFarmDetailsEnvironmental,
  updateFarmDetailsEnvironmental,
  FarmDetailsEnvironmental
} from "../../action/FarmsDetailsEnvironmentalPocket"

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const DescriptionFarmSectionStep3: React.FC<Props> = ({ onNext, onBack }) => {
  // Estados de usuario y granja
  const token = useUserStore((state) => state.token)
  const userId = useUserStore((state) => state.record.id)
  const currentFarm = useFarmFormStore((state) => state.currentFarm)
  const farmId = currentFarm?.id
  
  // Estado para saber si existe el registro
  const [environmentalExists, setEnvironmentalExists] = useState<FarmDetailsEnvironmental | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  // Función para adaptar datos de API a formulario
  const adaptEnvironmentalToForm = (data: FarmDetailsEnvironmental) => {
    console.log("Adaptando datos de API a formulario:", data)
    
    setFormData({
      hasTemperatureSensors: data.has_temperature_sensors || "",
      recordsTemperature: data.records_temperature || "",
      temperatureControl: data.temperature_control || "",
      temperatureObservations: data.temperature_observations || "",
      hasHumiditySensors: data.has_humidity_sensors || "",
      recordsHumidity: data.records_humidity || "",
      humidityControl: data.humidity_control || "",
      humidityObservations: data.humidity_observations || "",
      extractorsVentilators: data.extractors_ventilators || "",
      extractorsObservations: data.extractors_observations || "",
      automaticWindowOpening: data.automatic_window_opening || "",
      windowObservations: data.window_observations || "",
      automaticChimneyOpening: data.automatic_chimney_opening || "",
      chimneyObservations: data.chimney_observations || "",
      recordsGasEmissions: data.records_gas_emissions || "",
      gasObservations: data.gas_observations || "",
      coolings: data.coolings || "",
      coolingsObservations: data.coolings_observations || "",
      artificialVentilation: data.artificial_ventilation || "",
      ventilationObservations: data.ventilation_observations || "",
      heatingType: data.heating_type || "",
      heatingObservations: data.heating_observations || "",
    })
  }

  // Función para adaptar datos del formulario a API
  const adaptFormToEnvironmental = (): Partial<FarmDetailsEnvironmental> => {
    console.log("Adaptando datos del formulario a API:", formData)
    
    return {
      farm: farmId || "",
      user: userId || "",
      has_temperature_sensors: formData.hasTemperatureSensors || "",
      records_temperature: formData.recordsTemperature || "",
      temperature_control: formData.temperatureControl || "",
      temperature_observations: formData.temperatureObservations || "",
      has_humidity_sensors: formData.hasHumiditySensors || "",
      records_humidity: formData.recordsHumidity || "",
      humidity_control: formData.humidityControl || "",
      humidity_observations: formData.humidityObservations || "",
      extractors_ventilators: formData.extractorsVentilators || "",
      extractors_observations: formData.extractorsObservations || "",
      automatic_window_opening: formData.automaticWindowOpening || "",
      window_observations: formData.windowObservations || "",
      automatic_chimney_opening: formData.automaticChimneyOpening || "",
      chimney_observations: formData.chimneyObservations || "",
      records_gas_emissions: formData.recordsGasEmissions || "",
      gas_observations: formData.gasObservations || "",
      coolings: formData.coolings || "",
      coolings_observations: formData.coolingsObservations || "",
      artificial_ventilation: formData.artificialVentilation || "",
      ventilation_observations: formData.ventilationObservations || "",
      heating_type: formData.heatingType || "",
      heating_observations: formData.heatingObservations || "",
    }
  }

  // useEffect para cargar datos existentes
  useEffect(() => {
    const loadExistingData = async () => {
      if (!farmId || !token || !userId) {
        console.log("Faltan datos necesarios:", { farmId, token: !!token, userId })
        setIsLoading(false)
        return
      }

      console.log("Buscando datos ambientales para farmId:", farmId)
      
      try {
        const response = await searchFarmDetailsEnvironmentalByFarmId(token, farmId, userId)
        
        if (response.success && response.data) {
          console.log("Datos encontrados, adaptando al formulario:", response.data)
          setEnvironmentalExists(response.data as FarmDetailsEnvironmental)
          adaptEnvironmentalToForm(response.data as FarmDetailsEnvironmental)
        } else {
          console.log("No se encontraron datos previos")
          setEnvironmentalExists(null)
        }
      } catch (error) {
        console.error("Error al cargar datos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadExistingData()
  }, [farmId, token, userId])

  // Función para guardar/actualizar datos
  const handleSaveData = async () => {
    if (!farmId || !token || !userId) {
      console.error("Faltan datos necesarios para guardar")
      alert("Error: No se pudo identificar la granja o el usuario")
      return
    }

    console.log("Guardando datos ambientales...")
    const dataToSave = adaptFormToEnvironmental()
    console.log("Datos adaptados para guardar:", dataToSave)

    try {
      if (environmentalExists) {
        // Actualizar registro existente
        console.log("Actualizando registro existente con ID:", environmentalExists.id)
        const response = await updateFarmDetailsEnvironmental(token, environmentalExists.id!, dataToSave, userId)
        
        if (response.success && response.data) {
          console.log("Registro actualizado exitosamente:", response.data)
          setEnvironmentalExists(response.data as FarmDetailsEnvironmental)
          alert("Datos actualizados correctamente")
          onNext()
        } else {
          console.error("No se pudo actualizar el registro:", response.message)
          alert("Error al actualizar los datos: " + response.message)
        }
      } else {
        // Crear nuevo registro
        console.log("Creando nuevo registro")
        const response = await createFarmDetailsEnvironmental(token, dataToSave as FarmDetailsEnvironmental)
        
        if (response.success && response.data) {
          console.log("Registro creado exitosamente:", response.data)
          setEnvironmentalExists(response.data as FarmDetailsEnvironmental)
          alert("Datos guardados correctamente")
          onNext()
        } else {
          console.error("No se pudo crear el registro:", response.message)
          alert("Error al guardar los datos: " + response.message)
        }
      }
    } catch (error) {
      console.error("Error al guardar datos:", error)
      alert("Error al guardar los datos")
    }
  }

    return (
       <Paper elevation={1} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2 }}>
     
      <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 3, md: 4 } }}>
        {/* Temperature Section */}
        <Box sx={{ borderLeft: "4px solid #22d3ee", pl: 3 }}>
          <Typography variant="h6" sx={{ color: "#0891b2", fontWeight: 500, mb: 3 }}>
            Temperatura
          </Typography>

          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
                  ¿Dispone de sensores de temperatura?
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.hasTemperatureSensors}
                  onChange={(e) => handleRadioChange("hasTemperatureSensors", e.target.value)}
                  sx={{ gap: { xs: 2, md: 3 } }}
                >
                  <FormControlLabel value="si" control={<Radio size="small" />} label="Sí" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6}>
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

          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
                  ¿Se realiza control de temperatura?
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.temperatureControl}
                  onChange={(e) => handleRadioChange("temperatureControl", e.target.value)}
                  sx={{ gap: { xs: 2, md: 3 } }}
                >
                  <FormControlLabel value="si" control={<Radio size="small" />} label="Sí" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6}>
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

          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
                  ¿Dispone de sensores de humedad?
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.hasHumiditySensors}
                  onChange={(e) => handleRadioChange("hasHumiditySensors", e.target.value)}
                  sx={{ gap: { xs: 2, md: 3 } }}
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

          <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, md: 3 } }}>
            {/* Extractores y/o ventiladores */}
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
                    Extractores y/o ventiladores
                  </FormLabel>
                  <RadioGroup
                    row
                    value={formData.extractorsVentilators}
                    onChange={(e) => handleRadioChange("extractorsVentilators", e.target.value)}
                    sx={{ gap: { xs: 2, md: 3 } }}
                  >
                    <FormControlLabel value="si" control={<Radio size="small" />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
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
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
                    Apertura automática ventanas
                  </FormLabel>
                  <RadioGroup
                    row
                    value={formData.automaticWindowOpening}
                    onChange={(e) => handleRadioChange("automaticWindowOpening", e.target.value)}
                    sx={{ gap: { xs: 2, md: 3 } }}
                  >
                    <FormControlLabel value="si" control={<Radio size="small" />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
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
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
                    Coolings
                  </FormLabel>
                  <RadioGroup
                    row
                    value={formData.coolings}
                    onChange={(e) => handleRadioChange("coolings", e.target.value)}
                    sx={{ gap: { xs: 2, md: 3 } }}
                  >
                    <FormControlLabel value="si" control={<Radio size="small" />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
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
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ color: "#374151", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
                    Ventilación total artificial
                  </FormLabel>
                  <RadioGroup
                    row
                    value={formData.artificialVentilation}
                    onChange={(e) => handleRadioChange("artificialVentilation", e.target.value)}
                    sx={{ gap: { xs: 2, md: 3 } }}
                  >
                    <FormControlLabel value="si" control={<Radio size="small" />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
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

              <Grid item xs={12} sm={12} md={6} lg={6}>
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, flexDirection: { xs: "column", sm: "row" }, gap: { xs: 2, sm: 0 } }}>
        <Button
          variant="outlined"
          sx={{ ...buttonStyles.back, width: { xs: "100%", sm: "auto" } }}
          onClick={onBack}
        >
          Atrás
        </Button>
        <Button
          variant="contained"
          sx={{ ...buttonStyles.next, width: { xs: "100%", sm: "auto" } }}
          onClick={handleSaveData}
          disabled={isLoading}
        >
          {isLoading ? "Cargando..." : environmentalExists ? "Actualizar y Continuar" : "Guardar y Continuar"}
        </Button>
      </Box>
    </Paper>     
    );
};

export default DescriptionFarmSectionStep3;