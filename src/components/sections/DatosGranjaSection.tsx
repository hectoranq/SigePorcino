import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import useFarmFormStore from "../../_store/farm";
import useUserStore from "../../_store/user";
import { fetchParameters, parametersGroupsAndSpeciesGrouped } from "../../data/repository";
import { registerFarm } from "../../action/registerFarm";

export const DatosGranjaSection = () => {
  const currentFarm = useFarmFormStore((state) => state.currentFarm);
  const setCurrentFarm = useFarmFormStore((state) => state.setCurrentFarm);
  const updateFarm = useFarmFormStore((state) => state.updateFarm);
  const userId = useUserStore((state) => state.record.id);

  const [farmFormData, setFarmFormData] = useState({
    REGA: "",
    farm_name: "",
    locality: "",
    province: "",
    address: "",
    species: "",
    groups: "",
    zootechnical_classification: "",
    health_qualification: "",
  });

  const [provincias, setProvincias] = useState([]);
  const [groupSpeciesData, setGroupSpeciesData] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [isLoading, setIsLoading] = useState(false);

  // Cargar provincias y especies al montar
  useEffect(() => {
    console.log("🔄 Cargando parámetros...");
    fetchParameters().then((result) => {
      console.log("✅ Provincias cargadas:", result.length);
      setProvincias(result);
    }).catch(err => {
      console.error("❌ Error cargando provincias:", err);
    });
    
    parametersGroupsAndSpeciesGrouped().then((result) => {
      console.log("✅ Grupos y especies cargados:", result.length);
      setGroupSpeciesData(result);
    }).catch(err => {
      console.error("❌ Error cargando grupos/especies:", err);
    });
  }, []);

  // Cargar datos de la granja actual
  useEffect(() => {
    console.log("🏠 Granja actual cambió:", currentFarm);
    if (currentFarm) {
      console.log("📝 Llenando formulario con datos de granja:", {
        REGA: currentFarm.REGA,
        farm_name: currentFarm.farm_name,
        locality: currentFarm.locality,
        province: currentFarm.province,
        provinceLabel: getProvinciaLabel(currentFarm.province || ""),
      });
      
      setFarmFormData({
        REGA: currentFarm.REGA || "",
        farm_name: currentFarm.farm_name || "",
        locality: currentFarm.locality || "",
        province: currentFarm.province || "",
        address: currentFarm.address || "",
        species: currentFarm.species || "",
        groups: currentFarm.groups || "",
        zootechnical_classification: currentFarm.zootechnical_classification || "",
        health_qualification: currentFarm.health_qualification || "",
      });
    } else {
      console.warn("⚠️ No hay granja actual seleccionada");
    }
  }, [currentFarm]);

  // Función para obtener todas las especies
  const getAllSpecies = () => {
    const allSpecies = [];
    groupSpeciesData.forEach((group) => {
      if (group.species) {
        allSpecies.push(...group.species);
      }
    });
    const uniqueSpecies = allSpecies.filter(
      (species, index, self) => index === self.findIndex((s) => s.value === species.value)
    );
    return uniqueSpecies;
  };

  // Función para obtener el label de la provincia por su ID
  const getProvinciaLabel = (provinciaId: string) => {
    const provincia = provincias.find(p => p.country.value === provinciaId);
    return provincia ? provincia.country.label : provinciaId;
  };

  // Función para obtener ciudades de una provincia
  const getCiudadesByProvincia = (provinciaId: string) => {
    const provincia = provincias.find(p => p.country.value === provinciaId);
    return provincia ? provincia.cities || [] : [];
  };

  // Función para obtener el label de la ciudad por su ID
  const getCiudadLabel = (ciudadId: string) => {
    for (const provincia of provincias) {
      if (provincia.cities) {
        const ciudad = provincia.cities.find(c => c.value === ciudadId);
        if (ciudad) {
          return ciudad.label;
        }
      }
    }
    return ciudadId;
  };

  // Manejar cambios en el formulario
  const handleFarmInputChange = (e) => {
    const { name, value } = e.target;
    setFarmFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validar formulario
  const isFarmFormValid = () => {
    return Object.values(farmFormData).every((v) => v && v !== "");
  };

  // Guardar cambios
  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      if (!userId) {
        setSnackbarMessage("Error: No se encontró el ID de usuario");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        setIsLoading(false);
        return;
      }

      if (!currentFarm?.id) {
        setSnackbarMessage("Error: No hay una granja seleccionada");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        setIsLoading(false);
        return;
      }

      console.log("💾 Guardando cambios de granja...", farmFormData);

      // Convertir a FormData
      const formData = new FormData();
      Object.entries(farmFormData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value as string);
        }
      });

      // Actualizar granja
      const updatedFarm = await registerFarm(formData, userId);

      if (updatedFarm) {
        console.log("✅ Granja actualizada:", updatedFarm);
        
        // Actualizar en el store usando updateFarm
        updateFarm(currentFarm.id, updatedFarm as any);
        
        // También actualizar currentFarm
        setCurrentFarm({ ...currentFarm, ...updatedFarm } as any);
        
        setSnackbarMessage("✅ Datos de la granja actualizados exitosamente");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("❌ Error al actualizar granja:", error);
      setSnackbarMessage("Error al actualizar los datos. Por favor, intenta de nuevo.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelar cambios
  const handleCancelChanges = () => {
    // Restaurar datos originales de la granja
    if (currentFarm) {
      setFarmFormData({
        REGA: currentFarm.REGA || "",
        farm_name: currentFarm.farm_name || "",
        locality: currentFarm.locality || "",
        province: currentFarm.province || "",
        address: currentFarm.address || "",
        species: currentFarm.species || "",
        groups: currentFarm.groups || "",
        zootechnical_classification: currentFarm.zootechnical_classification || "",
        health_qualification: currentFarm.health_qualification || "",
      });
    }
  };

  if (!currentFarm) {
    return (
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" color="text.secondary" textAlign="center">
          No hay ninguna granja seleccionada. Por favor, selecciona una granja desde el menú lateral.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: "primary.main" }}>
        Datos de la Granja
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Edita la información de la granja seleccionada
      </Typography>

      {/* Mostrar valores actuales para debugging */}
      {currentFarm && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Valores actuales:
          </Typography>
          <Typography variant="caption" display="block">
            Provincia ID: {currentFarm.province} → {getProvinciaLabel(currentFarm.province)}
          </Typography>
          <Typography variant="caption" display="block">
            Localidad: {currentFarm.locality}
          </Typography>
        </Paper>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="R.E.G.A."
          variant="filled"
          name="REGA"
          value={farmFormData.REGA}
          onChange={handleFarmInputChange}
          fullWidth
        />

        <TextField
          label="Nombre de la granja"
          variant="filled"
          name="farm_name"
          value={farmFormData.farm_name}
          onChange={handleFarmInputChange}
          fullWidth
        />

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField
            variant="filled"
            select
            label="Provincia"
            name="province"
            value={farmFormData.province}
            onChange={handleFarmInputChange}
          >
            {provincias.map((item) => (
              <MenuItem key={item.country.value} value={item.country.value}>
                {item.country.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            variant="filled"
            label="Localidad"
            name="locality"
            value={farmFormData.locality}
            onChange={handleFarmInputChange}
            placeholder="Ej: Madrid, Barcelona..."
            fullWidth
          />
        </Box>

        <TextField
          label="Dirección de la granja"
          variant="filled"
          name="address"
          value={farmFormData.address}
          onChange={handleFarmInputChange}
          fullWidth
        />

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField
            variant="filled"
            select
            label="Especie"
            name="species"
            value={farmFormData.species}
            onChange={handleFarmInputChange}
          >
            {getAllSpecies().map((specie) => (
              <MenuItem key={specie.value} value={specie.value}>
                {specie.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            variant="filled"
            select
            label="Grupo"
            name="groups"
            value={farmFormData.groups}
            onChange={handleFarmInputChange}
          >
            {groupSpeciesData.map((item) => (
              <MenuItem key={item.group.value} value={item.group.value}>
                {item.group.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <TextField
          label="Clasificación zootécnica"
          variant="filled"
          name="zootechnical_classification"
          value={farmFormData.zootechnical_classification}
          onChange={handleFarmInputChange}
          fullWidth
        />

        <TextField
          label="Cualificación sanitaria"
          variant="filled"
          name="health_qualification"
          value={farmFormData.health_qualification}
          onChange={handleFarmInputChange}
          fullWidth
        />

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 2 }}>
          <Button variant="outlined" color="secondary" onClick={handleCancelChanges}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
            disabled={!isFarmFormValid() || isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default DatosGranjaSection;
