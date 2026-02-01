import { useState, useEffect } from "react"
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
import useUserStore from "../../_store/user"
import useFarmFormStore from "../../_store/farm"
import {
  searchFarmDetailsInfraestructuraByFarmId,
  createFarmDetailsInfraestructura,
  updateFarmDetailsInfraestructura,
  FarmDetailsInfraestructura
} from "../../action/FarmsDetailsInfraestructuraPocket"

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const DescriptionFarmSectionStep2: React.FC<Props> = ({ onNext, onBack }) => {
  // Estados de usuario y granja
  const token = useUserStore((state) => state.token)
  const userId = useUserStore((state) => state.record.id)
  const currentFarm = useFarmFormStore((state) => state.currentFarm)
  const farmId = currentFarm?.id
  
  // Estado para saber si existe el registro
  const [infraestructuraExists, setInfraestructuraExists] = useState<FarmDetailsInfraestructura | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
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

  // Estados para opciones personalizadas de tipo de alimentación
  const [customFeedingOptions, setCustomFeedingOptions] = useState<string[]>([])
  const [showFeedingInput, setShowFeedingInput] = useState(false)
  const [newFeedingOption, setNewFeedingOption] = useState("")

  // Estados para opciones personalizadas de tipo de piensos
  const [customFeedTypeOptions, setCustomFeedTypeOptions] = useState<string[]>([])
  const [showFeedTypeInput, setShowFeedTypeInput] = useState(false)
  const [newFeedTypeOption, setNewFeedTypeOption] = useState("")

  // Estados para opciones personalizadas de comidas al día
  const [customMealsOptions, setCustomMealsOptions] = useState<string[]>([])
  const [showMealsInput, setShowMealsInput] = useState(false)
  const [newMealsOption, setNewMealsOption] = useState("")

  // Estados para opciones personalizadas de inspecciones
  const [customInspectionsOptions, setCustomInspectionsOptions] = useState<string[]>([])
  const [showInspectionsInput, setShowInspectionsInput] = useState(false)
  const [newInspectionsOption, setNewInspectionsOption] = useState("")

  // Estados para opciones personalizadas de equipamiento automático
  const [customEquipmentOptions, setCustomEquipmentOptions] = useState<string[]>([])
  const [showEquipmentInput, setShowEquipmentInput] = useState(false)
  const [newEquipmentOption, setNewEquipmentOption] = useState("")

  // Estados para opciones personalizadas de agrupamiento de animales
  const [customGroupingOptions, setCustomGroupingOptions] = useState<string[]>([])
  const [showGroupingInput, setShowGroupingInput] = useState(false)
  const [newGroupingOption, setNewGroupingOption] = useState("")

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

  // Función para agregar nueva opción de alimentación
  const handleAddFeedingOption = () => {
    if (newFeedingOption.trim() && !customFeedingOptions.includes(newFeedingOption.trim())) {
      setCustomFeedingOptions([...customFeedingOptions, newFeedingOption.trim()])
      setNewFeedingOption("")
      setShowFeedingInput(false)
    }
  }

  // Función para eliminar opción personalizada
  const handleRemoveFeedingOption = (option: string) => {
    setCustomFeedingOptions(customFeedingOptions.filter(opt => opt !== option))
    setFormData((prev) => ({
      ...prev,
      feedingType: prev.feedingType.filter(item => item !== option)
    }))
  }

  // Función para agregar nueva opción de tipo de piensos
  const handleAddFeedTypeOption = () => {
    if (newFeedTypeOption.trim() && !customFeedTypeOptions.includes(newFeedTypeOption.trim())) {
      setCustomFeedTypeOptions([...customFeedTypeOptions, newFeedTypeOption.trim()])
      setNewFeedTypeOption("")
      setShowFeedTypeInput(false)
    }
  }

  // Función para eliminar opción personalizada de tipo de piensos
  const handleRemoveFeedTypeOption = (option: string) => {
    setCustomFeedTypeOptions(customFeedTypeOptions.filter(opt => opt !== option))
    setFormData((prev) => ({
      ...prev,
      feedType: prev.feedType.filter(item => item !== option)
    }))
  }

  // Función para agregar nueva opción de comidas al día
  const handleAddMealsOption = () => {
    if (newMealsOption.trim() && !customMealsOptions.includes(newMealsOption.trim())) {
      setCustomMealsOptions([...customMealsOptions, newMealsOption.trim()])
      setNewMealsOption("")
      setShowMealsInput(false)
    }
  }

  // Función para eliminar opción personalizada de comidas al día
  const handleRemoveMealsOption = (option: string) => {
    setCustomMealsOptions(customMealsOptions.filter(opt => opt !== option))
    setFormData((prev) => ({
      ...prev,
      mealsPerDay: prev.mealsPerDay.filter(item => item !== option)
    }))
  }

  // Función para agregar nueva opción de inspecciones
  const handleAddInspectionsOption = () => {
    if (newInspectionsOption.trim() && !customInspectionsOptions.includes(newInspectionsOption.trim())) {
      setCustomInspectionsOptions([...customInspectionsOptions, newInspectionsOption.trim()])
      setNewInspectionsOption("")
      setShowInspectionsInput(false)
    }
  }

  // Función para eliminar opción personalizada de inspecciones
  const handleRemoveInspectionsOption = (option: string) => {
    setCustomInspectionsOptions(customInspectionsOptions.filter(opt => opt !== option))
    setFormData((prev) => ({
      ...prev,
      inspectionsPerDay: prev.inspectionsPerDay.filter(item => item !== option)
    }))
  }

  // Función para agregar nueva opción de equipamiento automático
  const handleAddEquipmentOption = () => {
    if (newEquipmentOption.trim() && !customEquipmentOptions.includes(newEquipmentOption.trim())) {
      setCustomEquipmentOptions([...customEquipmentOptions, newEquipmentOption.trim()])
      setNewEquipmentOption("")
      setShowEquipmentInput(false)
    }
  }

  // Función para eliminar opción personalizada de equipamiento automático
  const handleRemoveEquipmentOption = (option: string) => {
    setCustomEquipmentOptions(customEquipmentOptions.filter(opt => opt !== option))
    setFormData((prev) => ({
      ...prev,
      automaticEquipment: prev.automaticEquipment.filter(item => item !== option)
    }))
  }

  // Función para agregar nueva opción de agrupamiento de animales
  const handleAddGroupingOption = () => {
    if (newGroupingOption.trim() && !customGroupingOptions.includes(newGroupingOption.trim())) {
      setCustomGroupingOptions([...customGroupingOptions, newGroupingOption.trim()])
      setNewGroupingOption("")
      setShowGroupingInput(false)
    }
  }

  // Función para eliminar opción personalizada de agrupamiento de animales
  const handleRemoveGroupingOption = (option: string) => {
    setCustomGroupingOptions(customGroupingOptions.filter(opt => opt !== option))
    setFormData((prev) => ({
      ...prev,
      animalGrouping: prev.animalGrouping.filter(item => item !== option)
    }))
  }

  // Función para adaptar datos de API a formulario
  const adaptInfraestructuraToForm = (data: FarmDetailsInfraestructura) => {
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
    
    // Parsear campos JSON a arrays (o usarlos directamente si ya son arrays)
    const parseFeedingType = parseField(data.feeding_type)
    const parseFeedType = parseField(data.feed_type)
    const parseMealsPerDay = parseField(data.meals_per_day)
    const parseInspectionsPerDay = parseField(data.inspections_per_day)
    const parseAutomaticEquipment = parseField(data.automatic_equipment)
    const parseAnimalGrouping = parseField(data.animal_grouping)
    
    // Establecer formData
    setFormData({
      animalesPorCorral: data.animales_por_corral?.toString() || "",
      observacionesAnimales: data.observaciones_animales || "",
      feedingType: parseFeedingType,
      feedType: parseFeedType,
      mealsPerDay: parseMealsPerDay,
      longitudComedero: typeof data.longitud_comedero === 'number' ? data.longitud_comedero.toString() : data.longitud_comedero || "",
      observacionesComedero: data.observaciones_comedero || "",
      numeroBebederos: typeof data.numero_bebederos === 'number' ? data.numero_bebederos.toString() : data.numero_bebederos || "",
      observacionesBebederos: data.observaciones_bebederos || "",
      medicationUse: data.medication_use || "",
      observacionesMedicacion: data.observaciones_medicacion || "",
      inspectionsPerDay: parseInspectionsPerDay,
      observacionesInspecciones: data.observaciones_inspecciones || "",
      automaticEquipment: parseAutomaticEquipment,
      observacionesEquipamiento: data.observaciones_equipamiento || "",
      animalGrouping: parseAnimalGrouping,
      observacionesAgrupamiento: data.observaciones_agrupamiento || "",
      geneticMaterial: data.genetic_material || "",
    })

    // Establecer opciones personalizadas (extraer las que no son predeterminadas)
    const defaultFeedingOptions = ["Ad-libitum", "Racionada", "Multifase"]
    const customFeeding = parseFeedingType.filter((opt: string) => !defaultFeedingOptions.includes(opt))
    setCustomFeedingOptions(customFeeding)

    const defaultFeedTypeOptions = ["NC-1", "NC-2", "NC-3"]
    const customFeedType = parseFeedType.filter((opt: string) => !defaultFeedTypeOptions.includes(opt))
    setCustomFeedTypeOptions(customFeedType)

    const defaultMealsOptions = ["Ad-libitum", "1 comida/día", "2 comidas/día", "3 comidas/día"]
    const customMeals = parseMealsPerDay.filter((opt: string) => !defaultMealsOptions.includes(opt))
    setCustomMealsOptions(customMeals)

    const defaultInspectionsOptions = ["Mes 1-2", "Meses 2-3-4", "Resto"]
    const customInspections = parseInspectionsPerDay.filter((opt: string) => !defaultInspectionsOptions.includes(opt))
    setCustomInspectionsOptions(customInspections)

    const defaultEquipmentOptions = ["Comederos automáticos", "Bebederos automáticos", "Sistema de ventilación"]
    const customEquipment = parseAutomaticEquipment.filter((opt: string) => !defaultEquipmentOptions.includes(opt))
    setCustomEquipmentOptions(customEquipment)

    const defaultGroupingOptions = ["Por sexo", "Por tamaño", "Por edad"]
    const customGrouping = parseAnimalGrouping.filter((opt: string) => !defaultGroupingOptions.includes(opt))
    setCustomGroupingOptions(customGrouping)
  }

  // Función para adaptar datos del formulario a API
  const adaptFormToInfraestructura = (): Partial<FarmDetailsInfraestructura> => {
    console.log("Adaptando datos del formulario a API:", formData)
    
    return {
      farm: farmId || "",
      user: userId || "",
      animales_por_corral: formData.animalesPorCorral ? parseInt(formData.animalesPorCorral) : undefined,
      observaciones_animales: formData.observacionesAnimales || "",
      feeding_type: JSON.stringify(formData.feedingType),
      feed_type: JSON.stringify(formData.feedType),
      meals_per_day: JSON.stringify(formData.mealsPerDay),
      longitud_comedero: formData.longitudComedero ? parseFloat(formData.longitudComedero) : undefined,
      observaciones_comedero: formData.observacionesComedero || "",
      numero_bebederos: formData.numeroBebederos ? parseInt(formData.numeroBebederos) : undefined,
      observaciones_bebederos: formData.observacionesBebederos || "",
      medication_use: formData.medicationUse || "",
      observaciones_medicacion: formData.observacionesMedicacion || "",
      inspections_per_day: JSON.stringify(formData.inspectionsPerDay),
      observaciones_inspecciones: formData.observacionesInspecciones || "",
      automatic_equipment: JSON.stringify(formData.automaticEquipment),
      observaciones_equipamiento: formData.observacionesEquipamiento || "",
      animal_grouping: JSON.stringify(formData.animalGrouping),
      observaciones_agrupamiento: formData.observacionesAgrupamiento || "",
      genetic_material: formData.geneticMaterial || "",
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

      console.log("Buscando datos de infraestructura para farmId:", farmId)
      
      try {
        const response = await searchFarmDetailsInfraestructuraByFarmId(token, farmId, userId)
        
        if (response.success && response.data) {
          console.log("Datos encontrados, adaptando al formulario:", response.data)
          setInfraestructuraExists(response.data as FarmDetailsInfraestructura)
          adaptInfraestructuraToForm(response.data as FarmDetailsInfraestructura)
        } else {
          console.log("No se encontraron datos previos")
          setInfraestructuraExists(null)
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
      console.error("Faltan datos necesarios:", { farmId, token: !!token, userId })
      alert("Error: No se pudo identificar la granja o usuario")
      return
    }

    console.log("Guardando datos...")
    const dataToSave = adaptFormToInfraestructura()
    console.log("Datos adaptados para guardar:", dataToSave)

    try {
      if (infraestructuraExists && infraestructuraExists.id) {
        // Actualizar registro existente
        console.log("Actualizando registro existente con ID:", infraestructuraExists.id)
        const response = await updateFarmDetailsInfraestructura(
          token, 
          infraestructuraExists.id, 
          dataToSave,
          userId
        )
        
        if (response.success && response.data) {
          console.log("Registro actualizado exitosamente:", response.data)
          setInfraestructuraExists(response.data as FarmDetailsInfraestructura)
          alert("Datos actualizados correctamente")
          onNext()
        } else {
          console.error("No se pudo actualizar el registro:", response.message)
          alert(`Error al actualizar los datos: ${response.message}`)
        }
      } else {
        // Crear nuevo registro
        console.log("Creando nuevo registro")
        const response = await createFarmDetailsInfraestructura(
          token,
          dataToSave as Omit<FarmDetailsInfraestructura, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>
        )
        
        if (response.success && response.data) {
          console.log("Registro creado exitosamente:", response.data)
          setInfraestructuraExists(response.data as FarmDetailsInfraestructura)
          alert("Datos guardados correctamente")
          onNext()
        } else {
          console.error("No se pudo crear el registro:", response.message)
          alert(`Error al guardar los datos: ${response.message}`)
        }
      }
    } catch (error) {
      console.error("Error al guardar datos:", error)
      alert("Error al guardar los datos")
    }
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

                      {/* Opciones personalizadas */}
                      {customFeedingOptions.map((option, index) => (
                        <Grid item xs={12} sm={6} key={`custom-feeding-${index}`}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.feedingType.includes(option)}
                                  onChange={(e) =>
                                    handleCheckboxChange("feedingType", option, e.target.checked)
                                  }
                                />
                              }
                              label={option}
                            />
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleRemoveFeedingOption(option)}
                              sx={{ minWidth: 'auto', p: 0.5 }}
                            >
                              ✕
                            </Button>
                          </Box>
                        </Grid>
                      ))}

                      {/* Input para agregar nueva opción */}
                      {showFeedingInput && (
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                              size="small"
                              placeholder="Nueva opción"
                              value={newFeedingOption}
                              onChange={(e) => setNewFeedingOption(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddFeedingOption()
                                }
                              }}
                              sx={{ flex: 1 }}
                            />
                            <Button
                              variant="contained"
                              size="small"
                              onClick={handleAddFeedingOption}
                            >
                              Agregar
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                setShowFeedingInput(false)
                                setNewFeedingOption("")
                              }}
                            >
                              Cancelar
                            </Button>
                          </Box>
                        </Grid>
                      )}

                      {/* Botón para mostrar input */}
                      {!showFeedingInput && (
                        <Grid item xs={12}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setShowFeedingInput(true)}
                            sx={{ mt: 1 }}
                          >
                            + Añadir otra opción
                          </Button>
                        </Grid>
                      )}
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
                              checked={formData.feedType.includes("NC-1")}
                              onChange={(e) =>
                                handleCheckboxChange("feedType", "NC-1", e.target.checked)
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
                              checked={formData.feedType.includes("NC-2")}
                              onChange={(e) =>
                                handleCheckboxChange("feedType", "NC-2", e.target.checked)
                              }
                            />
                          }
                          label="NC-2"
                        />
                      </Grid>

                      {/* Opciones personalizadas */}
                      {customFeedTypeOptions.map((option, index) => (
                        <Grid item xs={12} sm={6} key={`custom-feedtype-${index}`}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.feedType.includes(option)}
                                  onChange={(e) =>
                                    handleCheckboxChange("feedType", option, e.target.checked)
                                  }
                                />
                              }
                              label={option}
                            />
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleRemoveFeedTypeOption(option)}
                              sx={{ minWidth: 'auto', p: 0.5 }}
                            >
                              ✕
                            </Button>
                          </Box>
                        </Grid>
                      ))}

                      {/* Input para agregar nueva opción */}
                      {showFeedTypeInput && (
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                              size="small"
                              placeholder="Nueva opción"
                              value={newFeedTypeOption}
                              onChange={(e) => setNewFeedTypeOption(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddFeedTypeOption()
                                }
                              }}
                              sx={{ flex: 1 }}
                            />
                            <Button
                              variant="contained"
                              size="small"
                              onClick={handleAddFeedTypeOption}
                            >
                              Agregar
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                setShowFeedTypeInput(false)
                                setNewFeedTypeOption("")
                              }}
                            >
                              Cancelar
                            </Button>
                          </Box>
                        </Grid>
                      )}

                      {/* Botón para mostrar input */}
                      {!showFeedTypeInput && (
                        <Grid item xs={12}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setShowFeedTypeInput(true)}
                            sx={{ mt: 1 }}
                          >
                            + Añadir otra opción
                          </Button>
                        </Grid>
                      )}
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
                              checked={formData.mealsPerDay.includes("ad-libitum")}
                              onChange={(e) =>
                                handleCheckboxChange("mealsPerDay", "ad-libitum", e.target.checked)
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
                              checked={formData.mealsPerDay.includes("1-comida / dia")}
                              onChange={(e) =>
                                handleCheckboxChange("mealsPerDay", "1-comida / dia", e.target.checked)
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
                              checked={formData.mealsPerDay.includes("2-comida / dia")}
                              onChange={(e) =>
                                handleCheckboxChange("mealsPerDay", "2-comida / dia", e.target.checked)
                              }
                            />
                          }
                          label="2-comida / dia"
                        />                       
                      </Grid>

                      {/* Opciones personalizadas */}
                      {customMealsOptions.map((option, index) => (
                        <Grid item xs={12} sm={6} key={`custom-meals-${index}`}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.mealsPerDay.includes(option)}
                                  onChange={(e) =>
                                    handleCheckboxChange("mealsPerDay", option, e.target.checked)
                                  }
                                />
                              }
                              label={option}
                            />
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleRemoveMealsOption(option)}
                              sx={{ minWidth: 'auto', p: 0.5 }}
                            >
                              ✕
                            </Button>
                          </Box>
                        </Grid>
                      ))}

                      {/* Input para agregar nueva opción */}
                      {showMealsInput && (
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                              size="small"
                              placeholder="Nueva opción"
                              value={newMealsOption}
                              onChange={(e) => setNewMealsOption(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddMealsOption()
                                }
                              }}
                              sx={{ flex: 1 }}
                            />
                            <Button
                              variant="contained"
                              size="small"
                              onClick={handleAddMealsOption}
                            >
                              Agregar
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                setShowMealsInput(false)
                                setNewMealsOption("")
                              }}
                            >
                              Cancelar
                            </Button>
                          </Box>
                        </Grid>
                      )}

                      {/* Botón para mostrar input */}
                      {!showMealsInput && (
                        <Grid item xs={12}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setShowMealsInput(true)}
                            sx={{ mt: 1 }}
                          >
                            + Añadir otra opción
                          </Button>
                        </Grid>
                      )}
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
                              checked={formData.inspectionsPerDay.includes("mes-1-2")}
                              onChange={(e) =>
                                handleCheckboxChange("inspectionsPerDay", "mes-1-2", e.target.checked)
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
                              checked={formData.inspectionsPerDay.includes("meses-2-3-4")}
                              onChange={(e) =>
                                handleCheckboxChange("inspectionsPerDay", "meses-2-3-4", e.target.checked)
                              }
                            />
                          }
                          label="Meses 2, 3 y 4 - 1 vez / día"
                        />
                      </Grid>

                      {/* Opciones personalizadas */}
                      {customInspectionsOptions.map((option, index) => (
                        <Grid item xs={12} sm={6} key={`custom-inspections-${index}`}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.inspectionsPerDay.includes(option)}
                                  onChange={(e) =>
                                    handleCheckboxChange("inspectionsPerDay", option, e.target.checked)
                                  }
                                />
                              }
                              label={option}
                            />
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleRemoveInspectionsOption(option)}
                              sx={{ minWidth: 'auto', p: 0.5 }}
                            >
                              ✕
                            </Button>
                          </Box>
                        </Grid>
                      ))}

                      {/* Input para agregar nueva opción */}
                      {showInspectionsInput && (
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                              size="small"
                              placeholder="Nueva opción"
                              value={newInspectionsOption}
                              onChange={(e) => setNewInspectionsOption(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddInspectionsOption()
                                }
                              }}
                              sx={{ flex: 1 }}
                            />
                            <Button
                              variant="contained"
                              size="small"
                              onClick={handleAddInspectionsOption}
                            >
                              Agregar
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                setShowInspectionsInput(false)
                                setNewInspectionsOption("")
                              }}
                            >
                              Cancelar
                            </Button>
                          </Box>
                        </Grid>
                      )}

                      {/* Botón para mostrar input */}
                      {!showInspectionsInput && (
                        <Grid item xs={12}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setShowInspectionsInput(true)}
                            sx={{ mt: 1 }}
                          >
                            + Añadir otra opción
                          </Button>
                        </Grid>
                      )}
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
                              checked={formData.automaticEquipment.includes("equip-1")}
                              onChange={(e) =>
                                handleCheckboxChange("automaticEquipment", "equip-1", e.target.checked)
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
                              checked={formData.automaticEquipment.includes("equip-2")}
                              onChange={(e) =>
                                handleCheckboxChange("automaticEquipment", "equip-2", e.target.checked)
                              }
                            />
                          }
                          label="2"
                        />
                      </Grid>

                      {/* Opciones personalizadas */}
                      {customEquipmentOptions.map((option, index) => (
                        <Grid item xs={12} sm={6} key={`custom-equipment-${index}`}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.automaticEquipment.includes(option)}
                                  onChange={(e) =>
                                    handleCheckboxChange("automaticEquipment", option, e.target.checked)
                                  }
                                />
                              }
                              label={option}
                            />
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleRemoveEquipmentOption(option)}
                              sx={{ minWidth: 'auto', p: 0.5 }}
                            >
                              ✕
                            </Button>
                          </Box>
                        </Grid>
                      ))}

                      {/* Input para agregar nueva opción */}
                      {showEquipmentInput && (
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                              size="small"
                              placeholder="Nueva opción"
                              value={newEquipmentOption}
                              onChange={(e) => setNewEquipmentOption(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddEquipmentOption()
                                }
                              }}
                              sx={{ flex: 1 }}
                            />
                            <Button
                              variant="contained"
                              size="small"
                              onClick={handleAddEquipmentOption}
                            >
                              Agregar
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                setShowEquipmentInput(false)
                                setNewEquipmentOption("")
                              }}
                            >
                              Cancelar
                            </Button>
                          </Box>
                        </Grid>
                      )}

                      {/* Botón para mostrar input */}
                      {!showEquipmentInput && (
                        <Grid item xs={12}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setShowEquipmentInput(true)}
                            sx={{ mt: 1 }}
                          >
                            + Añadir otra opción
                          </Button>
                        </Grid>
                      )}
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
                          label="Sexo"
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
                          label="Tamaño"
                        />
                      </Grid>

                      {/* Opciones personalizadas */}
                      {customGroupingOptions.map((option, index) => (
                        <Grid item xs={12} sm={6} key={`custom-grouping-${index}`}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.animalGrouping.includes(option)}
                                  onChange={(e) =>
                                    handleCheckboxChange("animalGrouping", option, e.target.checked)
                                  }
                                />
                              }
                              label={option}
                            />
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleRemoveGroupingOption(option)}
                              sx={{ minWidth: 'auto', p: 0.5 }}
                            >
                              ✕
                            </Button>
                          </Box>
                        </Grid>
                      ))}

                      {/* Input para agregar nueva opción */}
                      {showGroupingInput && (
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                              size="small"
                              placeholder="Nueva opción"
                              value={newGroupingOption}
                              onChange={(e) => setNewGroupingOption(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddGroupingOption()
                                }
                              }}
                              sx={{ flex: 1 }}
                            />
                            <Button
                              variant="contained"
                              size="small"
                              onClick={handleAddGroupingOption}
                            >
                              Agregar
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                setShowGroupingInput(false)
                                setNewGroupingOption("")
                              }}
                            >
                              Cancelar
                            </Button>
                          </Box>
                        </Grid>
                      )}

                      {/* Botón para mostrar input */}
                      {!showGroupingInput && (
                        <Grid item xs={12}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setShowGroupingInput(true)}
                            sx={{ mt: 1 }}
                          >
                            + Añadir otra opción
                          </Button>
                        </Grid>
                      )}
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
          onClick={handleSaveData}
          disabled={isLoading}
        >
          {isLoading ? "Cargando..." : infraestructuraExists ? "Actualizar y Continuar" : "Guardar y Continuar"}
        </Button>
      </Box>
      
    </Box>
  );
};

export default DescriptionFarmSectionStep2;