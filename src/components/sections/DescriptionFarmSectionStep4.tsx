import { useState, useEffect } from "react"
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
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
  searchFarmDetailsResourcesByFarmId,
  createFarmDetailsResources,
  updateFarmDetailsResources,
  FarmDetailsResources
} from "../../action/FarmsDetailsResourcesPocket"

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const DescriptionFarmSectionStep4: React.FC<Props> = ({ onNext, onBack }) => {
  // Estados de usuario y granja
  const token = useUserStore((state) => state.token)
  const userId = useUserStore((state) => state.record.id)
  const currentFarm = useFarmFormStore((state) => state.currentFarm)
  const farmId = currentFarm?.id
  
  // Estado para saber si existe el registro
  const [resourcesExists, setResourcesExists] = useState<FarmDetailsResources | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Estados para iluminación
  const [lightingType, setLightingType] = useState<string[]>([])
  const [customLightingOptions, setCustomLightingOptions] = useState<string[]>([])
  const [showLightingInput, setShowLightingInput] = useState(false)
  const [newLightingOption, setNewLightingOption] = useState("")
  
  // Estados para gestión de estiércol
  const [annualManureProduction, setAnnualManureProduction] = useState("")
  const [pitSizeType, setPitSizeType] = useState("")
  const [slurryEmptyingFrequency, setSlurryEmptyingFrequency] = useState("")
  const [manureCollectionSystem, setManureCollectionSystem] = useState("")
  const [liquidManureStorage, setLiquidManureStorage] = useState("")
  const [solidManureStorage, setSolidManureStorage] = useState("")
  const [agronomicValorizationPercentage, setAgronomicValorizationPercentage] = useState("")
  const [authorizedTreatmentPercentage, setAuthorizedTreatmentPercentage] = useState("")
  
  // Estados para energía y agua
  const [waterEnergyConsumption, setWaterEnergyConsumption] = useState("")
  const [renewableEnergy, setRenewableEnergy] = useState("")
  const [renewableEnergyObservations, setRenewableEnergyObservations] = useState("")
  const [rainwaterUse, setRainwaterUse] = useState("")
  const [rainwaterObservations, setRainwaterObservations] = useState("")

  // Función para manejar cambios en checkboxes de iluminación
  const handleLightingChange = (value: string, checked: boolean) => {
    setLightingType((prev) =>
      checked
        ? [...prev, value]
        : prev.filter((item) => item !== value)
    )
  }

  // Función para agregar nueva opción de iluminación
  const handleAddLightingOption = () => {
    if (newLightingOption.trim() && !customLightingOptions.includes(newLightingOption.trim())) {
      setCustomLightingOptions([...customLightingOptions, newLightingOption.trim()])
      setNewLightingOption("")
      setShowLightingInput(false)
    }
  }

  // Función para eliminar opción personalizada de iluminación
  const handleRemoveLightingOption = (option: string) => {
    setCustomLightingOptions(customLightingOptions.filter(opt => opt !== option))
    setLightingType(lightingType.filter(item => item !== option))
  }

  // Función para adaptar datos de API a formulario
  const adaptResourcesToForm = (data: FarmDetailsResources) => {
    console.log("Adaptando datos de API a formulario:", data)
    
    // Función auxiliar para parsear campos que pueden venir como string JSON o como array
    const parseField = (field: any): string[] => {
      if (!field) return []
      if (Array.isArray(field)) return field
      if (typeof field === 'string') {
        try {
          return JSON.parse(field)
        } catch {
          return []
        }
      }
      return []
    }
    
    // Parsear tipos de iluminación
    const parseLightingType = parseField(data.lighting_type)
    setLightingType(parseLightingType)
    
    // Establecer opciones personalizadas
    const defaultLightingOptions = ["Barras Led", "Fluorescente", "Incandescente"]
    const customLighting = parseLightingType.filter((opt: string) => !defaultLightingOptions.includes(opt))
    setCustomLightingOptions(customLighting)
    
    // Establecer campos de gestión de estiércol
    setAnnualManureProduction(data.annual_manure_production || "")
    setPitSizeType(data.pit_size_type || "")
    setSlurryEmptyingFrequency(data.slurry_emptying_frequency || "")
    setManureCollectionSystem(data.manure_collection_system || "")
    setLiquidManureStorage(data.liquid_manure_storage || "")
    setSolidManureStorage(data.solid_manure_storage || "")
    setAgronomicValorizationPercentage(data.agronomic_valorization_percentage || "")
    setAuthorizedTreatmentPercentage(data.authorized_treatment_percentage || "")
    
    // Establecer campos de energía y agua
    setWaterEnergyConsumption(data.records_water_energy_consumption || "")
    setRenewableEnergy(data.renewable_energy_use || "")
    setRenewableEnergyObservations(data.renewable_energy_observations || "")
    setRainwaterUse(data.rainwater_use || "")
    setRainwaterObservations(data.rainwater_observations || "")
  }

  // Función para adaptar datos del formulario a API
  const adaptFormToResources = (): Partial<FarmDetailsResources> => {
    console.log("Adaptando datos del formulario a API")
    
    return {
      farm: farmId || "",
      user: userId || "",
      lighting_type: JSON.stringify(lightingType),
      annual_manure_production: annualManureProduction || "",
      pit_size_type: pitSizeType || "",
      slurry_emptying_frequency: slurryEmptyingFrequency || "",
      manure_collection_system: manureCollectionSystem || "",
      liquid_manure_storage: liquidManureStorage || "",
      solid_manure_storage: solidManureStorage || "",
      agronomic_valorization_percentage: agronomicValorizationPercentage || "",
      authorized_treatment_percentage: authorizedTreatmentPercentage || "",
      records_water_energy_consumption: waterEnergyConsumption || "",
      renewable_energy_use: renewableEnergy || "",
      renewable_energy_observations: renewableEnergyObservations || "",
      rainwater_use: rainwaterUse || "",
      rainwater_observations: rainwaterObservations || "",
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

      console.log("Buscando datos de recursos para farmId:", farmId)
      
      try {
        const response = await searchFarmDetailsResourcesByFarmId(token, farmId, userId)
        
        if (response.success && response.data) {
          console.log("Datos encontrados, adaptando al formulario:", response.data)
          setResourcesExists(response.data as FarmDetailsResources)
          adaptResourcesToForm(response.data as FarmDetailsResources)
        } else {
          console.log("No se encontraron datos previos")
          setResourcesExists(null)
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

    console.log("Guardando datos de recursos...")
    const dataToSave = adaptFormToResources()
    console.log("Datos adaptados para guardar:", dataToSave)

    try {
      if (resourcesExists) {
        // Actualizar registro existente
        console.log("Actualizando registro existente con ID:", resourcesExists.id)
        const response = await updateFarmDetailsResources(token, resourcesExists.id!, dataToSave, userId)
        
        if (response.success && response.data) {
          console.log("Registro actualizado exitosamente:", response.data)
          setResourcesExists(response.data as FarmDetailsResources)
          alert("Datos actualizados correctamente")
          onNext()
        } else {
          console.error("No se pudo actualizar el registro:", response.message)
          alert("Error al actualizar los datos: " + response.message)
        }
      } else {
        // Crear nuevo registro
        console.log("Creando nuevo registro")
        const response = await createFarmDetailsResources(token, dataToSave as FarmDetailsResources)
        
        if (response.success && response.data) {
          console.log("Registro creado exitosamente:", response.data)
          setResourcesExists(response.data as FarmDetailsResources)
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
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3, bgcolor: "white" }}>
     

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box sx={{ width: 4, height: 24, bgcolor: "#22d3ee", mr: 1.5 }} />
          <Typography variant="h6" sx={{ color: "#06b6d4", fontWeight: 500 }}>
            Iluminación
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: "#475569", mb: 1.5 }}>
            Tipo de iluminación
          </Typography>
          
          {/* Primera fila con opciones predeterminadas */}
          <Box sx={{ display: "flex", gap: 3, mb: 2, flexWrap: "wrap" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={lightingType.includes("Barras Led")}
                  onChange={(e) => handleLightingChange("Barras Led", e.target.checked)}
                  sx={{ color: "#64748b", "&.Mui-checked": { color: "#0d9488" } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: "#475569" }}>
                  Barras Led
                </Typography>
              }
            />
            
          </Box>

          {/* Segunda fila con opciones personalizadas y botón */}
          <Box sx={{ display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap" }}>
            {customLightingOptions.map((option) => (
              <Box key={option} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={lightingType.includes(option)}
                      onChange={(e) => handleLightingChange(option, e.target.checked)}
                      sx={{ color: "#64748b", "&.Mui-checked": { color: "#0d9488" } }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: "#475569" }}>
                      {option}
                    </Typography>
                  }
                />
                <Button
                  size="small"
                  onClick={() => handleRemoveLightingOption(option)}
                  sx={{
                    minWidth: "auto",
                    p: 0.5,
                    color: "#ef4444",
                    "&:hover": { bgcolor: "#fee2e2" }
                  }}
                >
                  ✕
                </Button>
              </Box>
            ))}
            
            {!showLightingInput ? (
              <Button
                variant="text"
                onClick={() => setShowLightingInput(true)}
                sx={{
                  color: "#0d9488",
                  textTransform: "none",
                  fontSize: "0.875rem",
                  "&:hover": { bgcolor: "#f0fdfa" }
                }}
              >
                + Añadir otra opción
              </Button>
            ) : (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextField
                  size="small"
                  placeholder="Nueva opción"
                  value={newLightingOption}
                  onChange={(e) => setNewLightingOption(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddLightingOption()
                    }
                  }}
                  sx={{ width: 200 }}
                />
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleAddLightingOption}
                  sx={{
                    bgcolor: "#0d9488",
                    "&:hover": { bgcolor: "#0f766e" },
                    minWidth: "auto",
                    px: 2
                  }}
                >
                  ✓
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    setShowLightingInput(false)
                    setNewLightingOption("")
                  }}
                  sx={{
                    minWidth: "auto",
                    color: "#64748b"
                  }}
                >
                  ✕
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box sx={{ width: 4, height: 24, bgcolor: "#22d3ee", mr: 1.5 }} />
          <Typography variant="h6" sx={{ color: "#06b6d4", fontWeight: 500 }}>
            Gestión de estiércol
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Producción anual estimada de estiércoles"
              placeholder="Producción anual estimada de estiércoles"
              variant="filled"
              value={annualManureProduction}
              onChange={(e) => setAnnualManureProduction(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tamaño y tipo de fosa en las naves"
              placeholder="Tamaño y tipo de fosa en las naves"
              variant="filled"
              value={pitSizeType}
              onChange={(e) => setPitSizeType(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Frecuencia de vaciado del purín"
              placeholder="Frecuencia de vaciado del purín"
             variant="filled"
              value={slurryEmptyingFrequency}
              onChange={(e) => setSlurryEmptyingFrequency(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Sistema de recogida de estiércoles a almacenamiento"
              placeholder="Sistema de recogida de estiércoles a almacenamiento"
             variant="filled"
              value={manureCollectionSystem}
              onChange={(e) => setManureCollectionSystem(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Sistema de almacenamiento de estiércoles (líquidos)"
              placeholder="Sistema de almacenamiento de estiércoles (líquidos)"
              variant="filled"
              value={liquidManureStorage}
              onChange={(e) => setLiquidManureStorage(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Sistema de almacenamiento de estiércoles (sólidos)"
              placeholder="Sistema de almacenamiento de estiércoles (sólidos)"
              variant="filled"
              value={solidManureStorage}
              onChange={(e) => setSolidManureStorage(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Valorización agronómica de los estiércoles (y%)"
              placeholder="Valorización agronómica de los estiércoles (y%)"
              variant="filled"
              value={agronomicValorizationPercentage}
              onChange={(e) => setAgronomicValorizationPercentage(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tratamiento autorizado de estiércoles (y%)"
              placeholder="Tratamiento autorizado de estiércoles (y%)"
              variant="filled"
              value={authorizedTreatmentPercentage}
              onChange={(e) => setAuthorizedTreatmentPercentage(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box sx={{ width: 4, height: 24, bgcolor: "#22d3ee", mr: 1.5 }} />
          <Typography variant="h6" sx={{ color: "#06b6d4", fontWeight: 500 }}>
            Energía y agua
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <FormControl>
            <FormLabel sx={{ color: "#1e293b", fontWeight: 500, mb: 1 }}>
              Registro de consumos de agua y energía
            </FormLabel>
            <RadioGroup value={waterEnergyConsumption} onChange={(e) => setWaterEnergyConsumption(e.target.value)} row>
              <FormControlLabel
                value="si"
                control={<Radio sx={{ color: "#64748b", "&.Mui-checked": { color: "#0d9488" } }} />}
                label={
                  <Typography variant="body2" sx={{ color: "#475569" }}>
                    Sí
                  </Typography>
                }
              />
              <FormControlLabel
                value="no"
                control={<Radio sx={{ color: "#64748b", "&.Mui-checked": { color: "#0d9488" } }} />}
                label={
                  <Typography variant="body2" sx={{ color: "#475569" }}>
                    No
                  </Typography>
                }
              />
            </RadioGroup>
          </FormControl>

          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 4 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <FormLabel sx={{ color: "#1e293b", fontWeight: 500, mb: 1 }}>Uso de energías renovables</FormLabel>
              <RadioGroup value={renewableEnergy} onChange={(e) => setRenewableEnergy(e.target.value)} row>
                <FormControlLabel
                  value="si"
                  control={<Radio sx={{ color: "#64748b", "&.Mui-checked": { color: "#0d9488" } }} />}
                  label={
                    <Typography variant="body2" sx={{ color: "#475569" }}>
                      Sí
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="no"
                  control={<Radio sx={{ color: "#64748b", "&.Mui-checked": { color: "#0d9488" } }} />}
                  label={
                    <Typography variant="body2" sx={{ color: "#475569" }}>
                      No
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>
            <TextField
              multiline
              rows={3}
              label="Observaciones sobre energías renovables"
              placeholder="Observaciones"
              variant="filled"
              value={renewableEnergyObservations}
              onChange={(e) => setRenewableEnergyObservations(e.target.value)}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 4 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <FormLabel sx={{ color: "#1e293b", fontWeight: 500, mb: 1 }}>
                Uso de aguas de lluvia no contaminadas como aguas de lavado
              </FormLabel>
              <RadioGroup value={rainwaterUse} onChange={(e) => setRainwaterUse(e.target.value)} row>
                <FormControlLabel
                  value="si"
                  control={<Radio sx={{ color: "#64748b", "&.Mui-checked": { color: "#0d9488" } }} />}
                  label={
                    <Typography variant="body2" sx={{ color: "#475569" }}>
                      Sí
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="no"
                  control={<Radio sx={{ color: "#64748b", "&.Mui-checked": { color: "#0d9488" } }} />}
                  label={
                    <Typography variant="body2" sx={{ color: "#475569" }}>
                      No
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>
            <TextField
              multiline
              rows={3}
              label="Observaciones sobre uso de aguas de lluvia"
              placeholder="Observaciones"
              variant="filled"
              value={rainwaterObservations}
              onChange={(e) => setRainwaterObservations(e.target.value)}
            />
          </Box>
        </Box>
      </Box>

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
            onClick={handleSaveData}
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : resourcesExists ? "Actualizar y Finalizar" : "Guardar y Finalizar"}
          </Button>
        </Box>
    </Box>
  )
}


export default DescriptionFarmSectionStep4;