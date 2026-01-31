import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  FormLabel,
  FormControl,
  Grid,
} from "@mui/material"

import useUserStore from "../../_store/user"
import useFarmFormStore from "../../_store/farm"
import { buttonStyles } from "./buttonStyles"
import {
  FarmDetails,
  searchFarmDetailsByFarmId,
  createFarmDetails,
  updateFarmDetails as updateFarmDetailsAPI,
} from "../../action/FarmsDetailsPocket"

const initialForm = {
  anio_construccion: "",
  anio_renovacion: "",
  superficie_autorizada: "",
  superficie_util: "",
  observaciones_superficie: "",
  capacidad_autorizada: "",
  orientacion_naves: "",
  delimitacion_perimetral: "",
  observaciones_delimitacion: "",
  tipo_aislamiento: "",
  numero_trabajadores: "",
  suelo_hormigon: false,
  suelo_metalico: false,
  suelo_plastico: false,
  empanillado_hormigon: false,
  empanillado_metalico: false,
  empanillado_plastico: false,
  luxometro: "",
  termometro: "",
  medidores_gases: "",
  sonometro: "",
  higrometro: "",
  rampa_carga_descarga: "",
  desplazamiento_tableros: false,
  desplazamiento_puertas: false,
  sistema_eliminacion_cadaveres: "",
  otros_carro_contenedor: false,
}

function adaptFarmDetailsToForm(data: Partial<FarmDetails>, setCustomOptions: {
  setCustomSueloOptions: React.Dispatch<React.SetStateAction<string[]>>;
  setCustomEmpanilladoOptions: React.Dispatch<React.SetStateAction<string[]>>;
  setCustomDesplazamientoOptions: React.Dispatch<React.SetStateAction<string[]>>;
  setCustomOtrosOptions: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  console.log("Adaptando datos de la granja:", data);
  
  // Cargar opciones personalizadas (desde JSON strings)
  try {
    if (data.suelo_custom) {
      const parsed = typeof data.suelo_custom === 'string' ? JSON.parse(data.suelo_custom) : data.suelo_custom;
      if (Array.isArray(parsed)) {
        setCustomOptions.setCustomSueloOptions(parsed.map(item => item.name));
      }
    }
    if (data.empanillado_custom) {
      const parsed = typeof data.empanillado_custom === 'string' ? JSON.parse(data.empanillado_custom) : data.empanillado_custom;
      if (Array.isArray(parsed)) {
        setCustomOptions.setCustomEmpanilladoOptions(parsed.map(item => item.name));
      }
    }
    if (data.desplazamiento_custom) {
      const parsed = typeof data.desplazamiento_custom === 'string' ? JSON.parse(data.desplazamiento_custom) : data.desplazamiento_custom;
      if (Array.isArray(parsed)) {
        setCustomOptions.setCustomDesplazamientoOptions(parsed.map(item => item.name));
      }
    }
    if (data.otros_custom) {
      const parsed = typeof data.otros_custom === 'string' ? JSON.parse(data.otros_custom) : data.otros_custom;
      if (Array.isArray(parsed)) {
        setCustomOptions.setCustomOtrosOptions(parsed.map(item => item.name));
      }
    }
  } catch (error) {
    console.error('Error al parsear campos custom:', error);
  }
  
  return {
    anio_construccion: data.anio_construccion?.toString() ?? "",
    anio_renovacion: data.anio_renovacion?.toString() ?? "",
    superficie_autorizada: data.superficie_autorizada?.toString() ?? "",
    superficie_util: data.superficie_util?.toString() ?? "",
    observaciones_superficie: data.observaciones_superficie ?? "",
    capacidad_autorizada: data.capacidad_autorizada?.toString() ?? "",
    orientacion_naves: data.orientacion_naves ?? "",
    delimitacion_perimetral: data.delimitacion_perimetral ?? "",
    observaciones_delimitacion: data.observaciones_delimitacion ?? "",
    tipo_aislamiento: data.tipo_aislamiento ?? "",
    numero_trabajadores: data.numero_trabajadores?.toString() ?? "",
    suelo_hormigon: !!data.suelo_hormigon,
    suelo_metalico: !!data.suelo_metalico,
    suelo_plastico: !!data.suelo_plastico,
    empanillado_hormigon: !!data.empanillado_hormigon,
    empanillado_metalico: !!data.empanillado_metalico,
    empanillado_plastico: !!data.empanillado_plastico,
    luxometro: data.luxometro ?? "",
    termometro: data.termometro ?? "",
    medidores_gases: data.medidores_gases ?? "",
    sonometro: data.sonometro ?? "",
    higrometro: data.higrometro ?? "",
    rampa_carga_descarga: data.rampa_carga_descarga ?? "",
    desplazamiento_tableros: !!data.desplazamiento_tableros,
    desplazamiento_puertas: !!data.desplazamiento_puertas,
    sistema_eliminacion_cadaveres: data.sistema_eliminacion_cadaveres ?? "",
    otros_carro_contenedor: !!data.otros_carro_contenedor,
  }
}

function adaptFormToFarmDetails(
  form: typeof initialForm,
  customOptions: {
    suelo: string[];
    empanillado: string[];
    desplazamiento: string[];
    otros: string[];
  },
  idfarm: string,
  userId: string
): Omit<FarmDetails, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'> {
  return {
    frams: idfarm,
    user: userId,
    anio_construccion: form.anio_construccion ? Number(form.anio_construccion) : undefined,
    anio_renovacion: form.anio_renovacion ? Number(form.anio_renovacion) : undefined,
    superficie_autorizada: form.superficie_autorizada ? Number(form.superficie_autorizada) : undefined,
    superficie_util: form.superficie_util ? Number(form.superficie_util) : undefined,
    observaciones_superficie: form.observaciones_superficie || undefined,
    capacidad_autorizada: form.capacidad_autorizada ? Number(form.capacidad_autorizada) : undefined,
    orientacion_naves: form.orientacion_naves || undefined,
    delimitacion_perimetral: form.delimitacion_perimetral || undefined,
    observaciones_delimitacion: form.observaciones_delimitacion || undefined,
    tipo_aislamiento: form.tipo_aislamiento || undefined,
    numero_trabajadores: form.numero_trabajadores ? Number(form.numero_trabajadores) : undefined,
    suelo_hormigon: form.suelo_hormigon,
    suelo_metalico: form.suelo_metalico,
    suelo_plastico: form.suelo_plastico,
    suelo_custom: customOptions.suelo.length > 0 ? JSON.stringify(customOptions.suelo.map(name => ({ name, checked: false }))) : "",
    empanillado_hormigon: form.empanillado_hormigon,
    empanillado_metalico: form.empanillado_metalico,
    empanillado_plastico: form.empanillado_plastico,
    empanillado_custom: customOptions.empanillado.length > 0 ? JSON.stringify(customOptions.empanillado.map(name => ({ name, checked: false }))) : "",
    luxometro: form.luxometro || undefined,
    termometro: form.termometro || undefined,
    medidores_gases: form.medidores_gases || undefined,
    sonometro: form.sonometro || undefined,
    higrometro: form.higrometro || undefined,
    rampa_carga_descarga: form.rampa_carga_descarga || undefined,
    desplazamiento_tableros: form.desplazamiento_tableros,
    desplazamiento_puertas: form.desplazamiento_puertas,
    desplazamiento_custom: customOptions.desplazamiento.length > 0 ? JSON.stringify(customOptions.desplazamiento.map(name => ({ name, checked: false }))) : "",
    sistema_eliminacion_cadaveres: form.sistema_eliminacion_cadaveres || undefined,
    otros_carro_contenedor: form.otros_carro_contenedor,
    otros_custom: customOptions.otros.length > 0 ? JSON.stringify(customOptions.otros.map(name => ({ name, checked: false }))) : "",
  };
}

const DescriptionFarmSectionStep1 = ({ onNext }: { onNext: () => void }) => {
  const [form, setForm] = useState(initialForm);
  const [farmDetailsExists, setFarmDetailsExists] = useState<string | null>(null);
  const [customSueloOptions, setCustomSueloOptions] = useState<string[]>([]);
  const [showSueloInput, setShowSueloInput] = useState(false);
  const [newSueloOption, setNewSueloOption] = useState("");
  const [customEmpanilladoOptions, setCustomEmpanilladoOptions] = useState<string[]>([]);
  const [showEmpanilladoInput, setShowEmpanilladoInput] = useState(false);
  const [newEmpanilladoOption, setNewEmpanilladoOption] = useState("");
  const [customDesplazamientoOptions, setCustomDesplazamientoOptions] = useState<string[]>([]);
  const [showDesplazamientoInput, setShowDesplazamientoInput] = useState(false);
  const [newDesplazamientoOption, setNewDesplazamientoOption] = useState("");
  const [customOtrosOptions, setCustomOtrosOptions] = useState<string[]>([]);
  const [showOtrosInput, setShowOtrosInput] = useState(false);
  const [newOtrosOption, setNewOtrosOption] = useState("");

  // CAMBIO: Usar currentFarm en lugar de formData
  const token = useUserStore(state => state.token);
  const currentFarm = useFarmFormStore(state => state.currentFarm);
  const farmDetailsId = currentFarm?.id || "";
  
  console.log("Current Farm:", currentFarm);
  console.log("Farm Details ID:", farmDetailsId);
  console.log("Token:", token); 

  useEffect(() => {
    const loadFarmDetails = async () => {
      // Validar que tengamos un ID de granja y usuario
      if (!farmDetailsId || !token) {
        console.warn("⚠️ No hay ID de granja o token disponible");
        return;
      }

      try {
        const response = await searchFarmDetailsByFarmId(token, farmDetailsId, useUserStore.getState().record.id || "");
        
        if (response.success && response.data) {
          const customSetters = {
            setCustomSueloOptions,
            setCustomEmpanilladoOptions,
            setCustomDesplazamientoOptions,
            setCustomOtrosOptions,
          };
          
          setForm(prev => ({
            ...prev,
            ...adaptFarmDetailsToForm(response.data, customSetters),
          }));
          setFarmDetailsExists(response.data.id || null);
          console.log("✅ Detalles de granja cargados:", response.data);
        } else {
          setFarmDetailsExists(null);
          console.log("ℹ️ No se encontraron detalles previos para esta granja");
        }
      } catch (error) {
        setFarmDetailsExists(null);
        console.error("❌ Error al cargar detalles de la granja:", error);
      }
    };

    loadFarmDetails();
  }, [farmDetailsId, token]);

  // Ejemplo de handleChange para campos de texto
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Ejemplo para radios
  const handleRadioChange = (name: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  // Función para agregar opción personalizada de suelo
  const handleAddSueloOption = () => {
    if (newSueloOption.trim()) {
      setCustomSueloOptions(prev => [...prev, newSueloOption.trim()]);
      setNewSueloOption("");
      setShowSueloInput(false);
    }
  };

  // Función para agregar opción personalizada de empanillado
  const handleAddEmpanilladoOption = () => {
    if (newEmpanilladoOption.trim()) {
      setCustomEmpanilladoOptions(prev => [...prev, newEmpanilladoOption.trim()]);
      setNewEmpanilladoOption("");
      setShowEmpanilladoInput(false);
    }
  };

  // Función para agregar opción personalizada de desplazamiento
  const handleAddDesplazamientoOption = () => {
    if (newDesplazamientoOption.trim()) {
      setCustomDesplazamientoOptions(prev => [...prev, newDesplazamientoOption.trim()]);
      setNewDesplazamientoOption("");
      setShowDesplazamientoInput(false);
    }
  };

  // Función para agregar opción personalizada de Otros
  const handleAddOtrosOption = () => {
    if (newOtrosOption.trim()) {
      setCustomOtrosOptions(prev => [...prev, newOtrosOption.trim()]);
      setNewOtrosOption("");
      setShowOtrosInput(false);
    }
  };

  // Enviar datos a PocketBase
  const handleSubmit = async () => {
    // Validar que tengamos un ID de granja y usuario
    const userId = useUserStore.getState().record.id;
    
    if (!farmDetailsId) {
      console.error("❌ No se puede guardar: falta el ID de granja");
      alert("Error: No se encontró la granja seleccionada");
      return;
    }

    if (!userId) {
      console.error("❌ No se puede guardar: falta el ID de usuario");
      alert("Error: Usuario no autenticado");
      return;
    }

    try {
      const customOptions = {
        suelo: customSueloOptions,
        empanillado: customEmpanilladoOptions,
        desplazamiento: customDesplazamientoOptions,
        otros: customOtrosOptions,
      };
      
      const dataToSend = adaptFormToFarmDetails(form, customOptions, farmDetailsId, userId);
      
      // Log para depuración
      console.log("📤 Datos a enviar:", JSON.stringify(dataToSend, null, 2));
      
      if (farmDetailsExists) {
        const response = await updateFarmDetailsAPI(token, farmDetailsExists, dataToSend);
        console.log("✅ Datos actualizados correctamente:", response.message);
        alert(response.message);
      } else {
        const response = await createFarmDetails(token, dataToSend);
        console.log("✅ Datos guardados correctamente:", response.message);
        setFarmDetailsExists(response.data.id || null);
        alert(response.message);
      }
      
      onNext(); // Llama a la función onNext para avanzar al siguiente paso
    } catch (error: any) {
      console.error("❌ Error al guardar/actualizar los detalles de la granja:", error);
      alert(error?.message || "Error al guardar los datos. Por favor, intenta de nuevo.");
    }
  };

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3, bgcolor: "background.default" }}>
      <Paper elevation={0} sx={{ p: 4 }}>
       

        {!currentFarm && (
          <Box sx={{ mb: 3, p: 2, bgcolor: "warning.light", borderRadius: 1 }}>
            <Typography variant="body2" color="warning.dark">
              ⚠️ No hay granja seleccionada. Por favor, selecciona o crea una granja primero.
            </Typography>
          </Box>
        )}

        {/* Form Content */}
        <Box sx={{ mt: 0 }}>
          {/* Condiciones generales */}
          <Box sx={{ borderLeft: 4, borderColor: "primary.main", pl: 2, mb: 6 }}>
            <Typography variant="h5" sx={{ color: "primary.main", mb: 4, fontWeight: 500 }}>
              Condiciones generales
            </Typography>

            <Box sx={{ "& > *": { mb: 3 } }}>
              {/* First row - 4 columns */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Año de construcción"
                    variant="filled"
                    size="small"
                    name="anio_construccion"
                    value={form.anio_construccion}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Año de renovación"
                    variant="filled"
                    size="small"
                    name="anio_renovacion"
                    value={form.anio_renovacion}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="m² superficie autorizada"
                    variant="filled"
                    size="small"
                    name="superficie_autorizada"
                    value={form.superficie_autorizada}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="m² de superficie útil"
                    variant="filled"
                    size="small"
                    name="superficie_util"
                    value={form.superficie_util}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              {/* Observations */}
              <TextField
                fullWidth
                label="Observaciones sobre los m² disponibles"
                multiline
                rows={3}
                variant="filled"
                name="observaciones_superficie"
                value={form.observaciones_superficie}
                onChange={handleChange}
              />

              {/* Second row - 2 columns */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Capacidad autorizada"
                    variant="filled"
                    size="small"
                    name="capacidad_autorizada"
                    value={form.capacidad_autorizada}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Orientación de las naves"
                    variant="filled"
                    size="small"
                    name="orientacion_naves"
                    value={form.orientacion_naves}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              {/* Perimeter delimitation and observations */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend" sx={{ fontWeight: 500, color: "text.primary" }}>
                      Delimitación perimetral
                    </FormLabel>
                    <RadioGroup row sx={{ mt: 1 }}>
                      <FormControlLabel
                        value="si"
                        control={<Radio />}
                        label="Sí"
                        onChange={() => handleRadioChange("delimitacion_perimetral", "si")}
                        checked={form.delimitacion_perimetral === "si"}
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="No"
                        onChange={() => handleRadioChange("delimitacion_perimetral", "no")}
                        checked={form.delimitacion_perimetral === "no"}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Observaciones"
                    multiline
                    rows={3}
                    variant="filled"
                    name="observaciones_delimitacion"
                    value={form.observaciones_delimitacion}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              {/* Third row - 2 columns */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tipo de aislamiento estructural"
                    variant="filled"
                    size="small"
                    name="tipo_aislamiento"
                    value={form.tipo_aislamiento}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Número de trabajadores"
                    variant="filled"
                    size="small"
                    name="numero_trabajadores"
                    value={form.numero_trabajadores}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              {/* Soil and flooring types */}
              <FormControl component="fieldset" sx={{ width: "100%" }}>
                <FormLabel component="legend" sx={{ fontWeight: 500, color: "text.primary", mb: 2 }}>
                  Tipo de suelo disponible
                </FormLabel>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Hormigón"
                        name="suelo_hormigon"
                        checked={form.suelo_hormigon}
                        onChange={handleChange}
                      />
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Metálico"
                        name="suelo_metalico"
                        checked={form.suelo_metalico}
                        onChange={handleChange}
                      />
                      
                      {/* Opciones personalizadas - primera columna */}
                      {customSueloOptions.filter((_, index) => index % 2 === 0).map((option, index) => (
                        <FormControlLabel
                          key={`custom-suelo-${index * 2}`}
                          control={<Checkbox />}
                          label={option}
                          name={`suelo_custom_${index * 2}`}
                          onChange={handleChange}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Plástico"
                        name="suelo_plastico"
                        checked={form.suelo_plastico}
                        onChange={handleChange}
                      />
                      
                      {/* Opciones personalizadas - segunda columna */}
                      {customSueloOptions.filter((_, index) => index % 2 === 1).map((option, index) => (
                        <FormControlLabel
                          key={`custom-suelo-${index * 2 + 1}`}
                          control={<Checkbox />}
                          label={option}
                          name={`suelo_custom_${index * 2 + 1}`}
                          onChange={handleChange}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                  
                  {/* Input para nueva opción - full width */}
                  <Grid item xs={12}>
                    {showSueloInput && (
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <TextField
                          size="small"
                          variant="outlined"
                          placeholder="Nombre de la opción"
                          value={newSueloOption}
                          onChange={(e) => setNewSueloOption(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleAddSueloOption();
                            }
                          }}
                          sx={{ flex: 1, maxWidth: "400px" }}
                        />
                        <Button
                          size="small"
                          variant="contained"
                          onClick={handleAddSueloOption}
                          sx={{ minWidth: "auto", px: 2 }}
                        >
                          ✓
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setShowSueloInput(false);
                            setNewSueloOption("");
                          }}
                          sx={{ minWidth: "auto", px: 2 }}
                        >
                          ✕
                        </Button>
                      </Box>
                    )}
                    
                    {/* Botón añadir otra opción */}
                    {!showSueloInput && (
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => setShowSueloInput(true)}
                        sx={{ 
                          justifyContent: "flex-start",
                          textTransform: "none",
                          color: "primary.main"
                        }}
                      >
                        + Añadir otra opción
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </FormControl>

              {/* Flooring type */}
              <FormControl component="fieldset" sx={{ width: "100%" }}>
                <FormLabel component="legend" sx={{ fontWeight: 500, color: "text.primary", mb: 2 }}>
                  Tipo de empanillado
                </FormLabel>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Hormigón"
                        name="empanillado_hormigon"
                        checked={form.empanillado_hormigon}
                        onChange={handleChange}
                      />
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Metálico"
                        name="empanillado_metalico"
                        checked={form.empanillado_metalico}
                        onChange={handleChange}
                      />
                      
                      {/* Opciones personalizadas - primera columna */}
                      {customEmpanilladoOptions.filter((_, index) => index % 2 === 0).map((option, index) => (
                        <FormControlLabel
                          key={`custom-empanillado-${index * 2}`}
                          control={<Checkbox />}
                          label={option}
                          name={`empanillado_custom_${index * 2}`}
                          onChange={handleChange}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Plástico"
                        name="empanillado_plastico"
                        checked={form.empanillado_plastico}
                        onChange={handleChange}
                      />
                      
                      {/* Opciones personalizadas - segunda columna */}
                      {customEmpanilladoOptions.filter((_, index) => index % 2 === 1).map((option, index) => (
                        <FormControlLabel
                          key={`custom-empanillado-${index * 2 + 1}`}
                          control={<Checkbox />}
                          label={option}
                          name={`empanillado_custom_${index * 2 + 1}`}
                          onChange={handleChange}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                  
                  {/* Input para nueva opción - full width */}
                  <Grid item xs={12}>
                    {showEmpanilladoInput && (
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <TextField
                          size="small"
                          variant="outlined"
                          placeholder="Nombre de la opción"
                          value={newEmpanilladoOption}
                          onChange={(e) => setNewEmpanilladoOption(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleAddEmpanilladoOption();
                            }
                          }}
                          sx={{ flex: 1, maxWidth: "400px" }}
                        />
                        <Button
                          size="small"
                          variant="contained"
                          onClick={handleAddEmpanilladoOption}
                          sx={{ minWidth: "auto", px: 2 }}
                        >
                          ✓
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setShowEmpanilladoInput(false);
                            setNewEmpanilladoOption("");
                          }}
                          sx={{ minWidth: "auto", px: 2 }}
                        >
                          ✕
                        </Button>
                      </Box>
                    )}
                    
                    {/* Botón añadir otra opción */}
                    {!showEmpanilladoInput && (
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => setShowEmpanilladoInput(true)}
                        sx={{ 
                          justifyContent: "flex-start",
                          textTransform: "none",
                          color: "primary.main"
                        }}
                      >
                        + Añadir otra opción
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
            </Box>
          </Box>

          {/* Equipamiento */}
          <Box sx={{ borderLeft: 4, borderColor: "primary.main", pl: 2, mb: 6 }}>
            <Typography variant="h5" sx={{ color: "primary.main", mb: 4, fontWeight: 500 }}>
              Equipamiento
            </Typography>

            <Grid container spacing={4}>
              {/* Left column */}
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontWeight: 500, color: "text.primary", mb: 2 }}>
                    Luxómetro
                  </FormLabel>
                  <RadioGroup row sx={{ mt: 1 }}>
                    <FormControlLabel
                      value="si"
                      control={<Radio />}
                      label="Sí"
                      onChange={() => handleRadioChange("luxometro", "si")}
                      checked={form.luxometro === "si"}
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                      onChange={() => handleRadioChange("luxometro", "no")}
                      checked={form.luxometro === "no"}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontWeight: 500, color: "text.primary" }}>
                    Termómetro ambiental
                  </FormLabel>
                  <RadioGroup row sx={{ mt: 1 }}>
                    <FormControlLabel
                      value="si"
                      control={<Radio />}
                      label="Sí"
                      onChange={() => handleRadioChange("termometro", "si")}
                      checked={form.termometro === "si"}
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                      onChange={() => handleRadioChange("termometro", "no")}
                      checked={form.termometro === "no"}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              {/* Left column */}
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontWeight: 500, color: "text.primary" }}>
                    Medidores de CO₂, NO₃, amoníaco y otros gases
                  </FormLabel>
                  <RadioGroup row sx={{ mt: 1 }}>
                    <FormControlLabel
                      value="si"
                      control={<Radio />}
                      label="Sí"
                      onChange={() => handleRadioChange("medidores_gases", "si")}
                      checked={form.medidores_gases === "si"}
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                      onChange={() => handleRadioChange("medidores_gases", "no")}
                      checked={form.medidores_gases === "no"}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontWeight: 500, color: "text.primary" }}>
                    Sonómetro
                  </FormLabel>
                  <RadioGroup row sx={{ mt: 1 }}>
                    <FormControlLabel
                      value="si"
                      control={<Radio />}
                      label="Sí"
                      onChange={() => handleRadioChange("sonometro", "si")}
                      checked={form.sonometro === "si"}
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                      onChange={() => handleRadioChange("sonometro", "no")}
                      checked={form.sonometro === "no"}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              {/* Left column */}
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontWeight: 500, color: "text.primary" }}>
                    Higrómetro
                  </FormLabel>
                  <RadioGroup row sx={{ mt: 1 }}>
                    <FormControlLabel
                      value="si"
                      control={<Radio />}
                      label="Sí"
                      onChange={() => handleRadioChange("higrometro", "si")}
                      checked={form.higrometro === "si"}
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                      onChange={() => handleRadioChange("higrometro", "no")}
                      checked={form.higrometro === "no"}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontWeight: 500, color: "text.primary" }}>
                    Rampa de carga y descarga
                  </FormLabel>
                  <RadioGroup row sx={{ mt: 1 }}>
                    <FormControlLabel
                      value="si"
                      control={<Radio />}
                      label="Sí"
                      onChange={() => handleRadioChange("rampa_carga_descarga", "si")}
                      checked={form.rampa_carga_descarga === "si"}
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                      onChange={() => handleRadioChange("rampa_carga_descarga", "no")}
                      checked={form.rampa_carga_descarga === "no"}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>

            {/* Equipment for animal displacement */}
            <Box sx={{ mt: 4 }}>
              <FormControl component="fieldset" sx={{ width: "100%" }}>
                <FormLabel component="legend" sx={{ fontWeight: 500, color: "text.primary", mb: 2 }}>
                  Equipamiento para los desplazamientos de los animales por su propio pie
                </FormLabel>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Tableros"
                        name="desplazamiento_tableros"
                        checked={form.desplazamiento_tableros}
                        onChange={handleChange}
                      />
                      
                      {/* Opciones personalizadas - primera columna */}
                      {customDesplazamientoOptions.filter((_, index) => index % 2 === 0).map((option, index) => (
                        <FormControlLabel
                          key={`custom-desplazamiento-${index * 2}`}
                          control={<Checkbox />}
                          label={option}
                          name={`desplazamiento_custom_${index * 2}`}
                          onChange={handleChange}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Puertas"
                        name="desplazamiento_puertas"
                        checked={form.desplazamiento_puertas}
                        onChange={handleChange}
                      />
                      
                      {/* Opciones personalizadas - segunda columna */}
                      {customDesplazamientoOptions.filter((_, index) => index % 2 === 1).map((option, index) => (
                        <FormControlLabel
                          key={`custom-desplazamiento-${index * 2 + 1}`}
                          control={<Checkbox />}
                          label={option}
                          name={`desplazamiento_custom_${index * 2 + 1}`}
                          onChange={handleChange}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                  
                  {/* Input para nueva opción - full width */}
                  <Grid item xs={12}>
                    {showDesplazamientoInput && (
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <TextField
                          size="small"
                          variant="outlined"
                          placeholder="Nombre de la opción"
                          value={newDesplazamientoOption}
                          onChange={(e) => setNewDesplazamientoOption(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleAddDesplazamientoOption();
                            }
                          }}
                          sx={{ flex: 1, maxWidth: "400px" }}
                        />
                        <Button
                          size="small"
                          variant="contained"
                          onClick={handleAddDesplazamientoOption}
                          sx={{ minWidth: "auto", px: 2 }}
                        >
                          ✓
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setShowDesplazamientoInput(false);
                            setNewDesplazamientoOption("");
                          }}
                          sx={{ minWidth: "auto", px: 2 }}
                        >
                          ✕
                        </Button>
                      </Box>
                    )}
                    
                    {/* Botón añadir otra opción */}
                    {!showDesplazamientoInput && (
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => setShowDesplazamientoInput(true)}
                        sx={{ 
                          justifyContent: "flex-start",
                          textTransform: "none",
                          color: "primary.main"
                        }}
                      >
                        + Añadir otra opción
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
            </Box>

            {/* Carcass elimination system */}
            <Box sx={{ mt: 4 }}>
              <TextField
                fullWidth
                label="Sistema de eliminación de cadáveres"
                variant="filled"
                size="small"
                name="sistema_eliminacion_cadaveres"
                value={form.sistema_eliminacion_cadaveres}
                onChange={handleChange}
              />
            </Box>
          </Box>

          {/* Otros */}
          <Box sx={{ mb: 6 }}>
            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <FormLabel component="legend" sx={{ fontWeight: 500, color: "text.primary", mb: 2 }}>
                Otros
              </FormLabel>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Carro para traslado hasta el contenedor"
                      name="otros_carro_contenedor"
                      checked={form.otros_carro_contenedor}
                      onChange={handleChange}
                    />
                    
                    {/* Opciones personalizadas - primera columna */}
                    {customOtrosOptions.filter((_, index) => index % 2 === 0).map((option, index) => (
                      <FormControlLabel
                        key={`custom-otros-${index * 2}`}
                        control={<Checkbox />}
                        label={option}
                        name={`otros_custom_${index * 2}`}
                        onChange={handleChange}
                      />
                    ))}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormGroup>
                    {/* Opciones personalizadas - segunda columna */}
                    {customOtrosOptions.filter((_, index) => index % 2 === 1).map((option, index) => (
                      <FormControlLabel
                        key={`custom-otros-${index * 2 + 1}`}
                        control={<Checkbox />}
                        label={option}
                        name={`otros_custom_${index * 2 + 1}`}
                        onChange={handleChange}
                      />
                    ))}
                  </FormGroup>
                </Grid>
                
                {/* Input para nueva opción - full width */}
                <Grid item xs={12}>
                  {showOtrosInput && (
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <TextField
                        size="small"
                        variant="outlined"
                        placeholder="Nombre de la opción"
                        value={newOtrosOption}
                        onChange={(e) => setNewOtrosOption(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleAddOtrosOption();
                          }
                        }}
                        sx={{ flex: 1, maxWidth: "400px" }}
                      />
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleAddOtrosOption}
                        sx={{ minWidth: "auto", px: 2 }}
                      >
                        ✓
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setShowOtrosInput(false);
                          setNewOtrosOption("");
                        }}
                        sx={{ minWidth: "auto", px: 2 }}
                      >
                        ✕
                      </Button>
                    </Box>
                  )}
                  
                  {/* Botón añadir otra opción */}
                  {!showOtrosInput && (
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => setShowOtrosInput(true)}
                      sx={{ 
                        justifyContent: "flex-start",
                        textTransform: "none",
                        color: "primary.main"
                      }}
                    >
                      + Añadir otra opción
                    </Button>
                  )}
                </Grid>
              </Grid>
            </FormControl>
          </Box>

{/* Next Button */}
          <section className="form-grid-2-cols">
            <Button
              variant="outlined"
              sx={buttonStyles.back}
            >
              Atras
            </Button>
            <Button
              variant="contained"
              sx={buttonStyles.next}
              onClick={handleSubmit}
              disabled={!currentFarm} // Deshabilitar si no hay granja seleccionada
            >
              Siguiente
            </Button>
          </section>
        </Box>
      </Paper>
    </Box>
  );
};

export default DescriptionFarmSectionStep1;