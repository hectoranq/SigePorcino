import { useState, useEffect } from "react"
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  Breadcrumbs,
  Link,
  Collapse,
  ThemeProvider,
  IconButton,
  useMediaQuery,
  MenuItem,
  Select,
  FormControl,
  Divider,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import {
  ExpandLess,
  ExpandMore,
  Settings,
  ExitToApp,
  NavigateNext,
  Agriculture,
  People,
  Assignment,
  EventNote,
  CleaningServices,
  Restaurant,
  Pets,
  TrendingUp,
  FileDownload,
} from "@mui/icons-material"
import theme from "../../components/theme"
import { useRouter } from "next/router";

import MainSection from "../../components/sections/MainSection";
import useUserStore from "../../_store/user";
import { parametersGroupsAndSpeciesGrouped, fetchParameters } from "../../data/repository";
import { listFarms } from "../../action/FarmsPocket";
import { TrainingCoursesSection } from "../../components/sections/TrainingCoursesSection";
import { PersonalRegisterSection } from "../../components/sections/PersonalRegisterSection";
import LinkedCompaniesManagersPage from "../../components/sections/LinkedCompaniesManagersSection";
import { DesratizacionSection } from "../../components/sections/DesratizacionSection";
import { DesinsectacionSection } from "../../components/sections/DesinsectacionSection";
import { LimpiezaDesinfeccionSection } from "../../components/sections/LimpiezaDesinfeccionSection";
import { LimpiezaDesinfeccionTuberiasSection } from "../../components/sections/LimpiezaDesinfeccionTuberiasSection";
import { ArcoDesinfeccionSection } from "../../components/sections/ArcoDesinfeccionSection";
import { RecogidaCadaveresSection } from "../../components/sections/RecogidaCadaveresSection";
import { RecogidaResiduosSection } from "../../components/sections/RecogidaResiduosSection";
import { MantenimientoEquiposSection } from "../../components/sections/MantenimientoEquiposSection";
import { EntradaLechonesSection } from "../../components/sections/EntradaLechonesSection";
import { SalidaMataderoSection } from "../../components/sections/SalidaMataderoSection";
import { BajaAnimalesSection } from "../../components/sections/BajaAnimalesSection";
import { EtiquetasPiensoSection } from "../../components/sections/EtiquetasPiensoSection";
import { DescargaSacosPiensoSection } from "../../components/sections/DescargaSacosPiensoSection";
import { DescargaPiensoGranelSection } from "../../components/sections/DescargaPiensoGranelSection";
import { ConsumoAguaSection } from "../../components/sections/ConsumoAguaSection";
import { ConsumoElectricidadSection } from "../../components/sections/ConsumoElectricidadSection";
import { EntradasCombustibleSection } from "../../components/sections/EntradasCombustibleSection";
import useFarmFormStore from "../../_store/farm"
import type { FarmFormData } from "../../_store/farm"
import { registerFarm } from "../../action/registerFarm";
import { RegistroVeterinarioSection } from "../../components/sections/RegistroVeterinarioSection";
import { PlanLLDSection } from "../../components/sections/PlanLLDSection ";
import { MantenimientoInstalacionesSection } from "../../components/sections/MantenimientoInstalacionesSection";
import { PlanRecogidaCadaveresSection } from "../../components/sections/PlanRecogidaCadaveresSection";
import { PlanGestionResiduosSection } from "../../components/sections/PlanGestionResiduosSection";
import { PlanGestionAmbientalSection } from "../../components/sections/PlanGestionAmbientalSection";
import { PlanFormacionSection } from "../../components/sections/PlanFormacionSection";
import { PlanBioseguridadSection } from "../../components/sections/PlanBioseguridadSection";
import { PlanSanitarioSection } from "../../components/sections/PlanSanitarioSection";
import { DatosGranjaSection } from "../../components/sections/DatosGranjaSection";
import { ExportarInformacionSection } from "../../components/sections/ExportarInformacionSection";
import MainDescriptionFarm from "../../components/sections/MainDescriptionFarm";

const drawerWidth = 320

const Home = () => {
    const router = useRouter();
    const [openPersonal, setOpenPersonal] = useState(false)
    const [openOtherSections, setOpenOtherSections] = useState<{ [key: string]: boolean }>({})
    const [openConfig, setOpenConfig] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Store de granjas
    const farms = useFarmFormStore(state => state.farms);
    const currentFarm = useFarmFormStore(state => state.currentFarm);
    const setCurrentFarm = useFarmFormStore(state => state.setCurrentFarm);
    const setFarms = useFarmFormStore(state => state.setFarms);
    
    
    const [activeSection, setActiveSection] = useState<string>("main");

    // Estados para el modal de crear granja
    const [openCreateFarmModal, setOpenCreateFarmModal] = useState(false);
    const [farmFormData, setFarmFormData] = useState({
      REGA: "",
      farm_name: "",
      locality: "",
      province: "",
      address: "",
      species: "",
      group: "",
      zootechnical_classification: "",
      health_qualification: "",
    });

    // Estados para datos de provincias y especies
    const [provincias, setProvincias] = useState([]);
    const [groupSpeciesData, setGroupSpeciesData] = useState([]);

    // Cargar provincias y especies al montar
    useEffect(() => {
      fetchParameters().then((result) => {
        setProvincias(result);
      });
      parametersGroupsAndSpeciesGrouped().then((result) => {
        setGroupSpeciesData(result);
      });
    }, []);
    
    const handleToggle = (section: string) => {
      if (section === "personal") {
        setOpenPersonal(!openPersonal)
      } else if (section === "config") {
        setOpenConfig(!openConfig)
      } else {
        setOpenOtherSections((prev) => ({
          ...prev,
          [section]: !prev[section],
        }))
      }
    }

    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
      resetUser();
      localStorage.clear();
      router.push('/');
    };

    // Función para obtener todas las especies
    const getAllSpecies = () => {
      const allSpecies = [];
      groupSpeciesData.forEach(group => {
        if (group.species) {
          allSpecies.push(...group.species);
        }
      });
      const uniqueSpecies = allSpecies.filter((species, index, self) => 
        index === self.findIndex(s => s.value === species.value)
      );
      return uniqueSpecies;
    };

    // Manejar cambio de granja en el dropdown
    const handleFarmChange = (event) => {
      const selectedValue = event.target.value;
      
      if (selectedValue === "create_new") {
        // Abrir modal en lugar de redirigir
        setOpenCreateFarmModal(true);
      } else {
        // Buscar la granja seleccionada y establecerla como actual
        const selectedFarm = farms.find(farm => farm.id === selectedValue);
        if (selectedFarm) {
          setCurrentFarm(selectedFarm);
        }
      }
    };

    // Manejar cambios en el formulario de crear granja
    const handleFarmInputChange = (e) => {
      const { name, value } = e.target;
      setFarmFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    // Cerrar modal y resetear formulario
    const handleCloseCreateFarmModal = () => {
      setOpenCreateFarmModal(false);
      setFarmFormData({
        REGA: "",
        farm_name: "",
        locality: "",
        province: "",
        address: "",
        species: "",
        group: "",
        zootechnical_classification: "",
        health_qualification: "",
      });
    };

    // Validar formulario
    const isFarmFormValid = () => {
      return Object.values(farmFormData).every((v) => v && v !== "");
    };

    // Guardar nueva granja
    const handleSaveNewFarm = async () => {
      try {
        const userId = useUserStore.getState().record.id;

        if (!userId) {
          alert("Error: No se encontró el ID de usuario");
          return;
        }

        // Convertir a FormData
        const formData = new FormData();
        Object.entries(farmFormData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, value as string);
          }
        });

        // Registrar granja
        const newFarm = await registerFarm(formData, userId);
        
        if (newFarm) {
          // Agregar al store
         // addFarm(newFarm);
          
          // Establecer como granja actual
        //  setCurrentFarm(newFarm);
          
          // Cerrar modal
          handleCloseCreateFarmModal();
          
          alert("✅ Granja creada exitosamente");
        }
      } catch (error) {
        console.error("Error al crear granja:", error);
        alert("Error al crear la granja. Por favor, intenta de nuevo.");
      }
    };

    // Drawer content as a variable to reuse
    const drawerContent = (
      <>
        {/* Logo */}
        <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "grey.200" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "secondary.main",
                textAlign: "center",
                letterSpacing: 1,
              }}
            >
              Sistema de gestión Porcino y/o Granja
            </Typography>
          </Box>
        </Box>

        {/* Dropdown de selección de granja */}
        <Box sx={{ p: 2, bgcolor: "grey.50" }}>
          <FormControl fullWidth variant="filled">
            <Typography 
              variant="caption" 
              sx={{ 
                mb: 1, 
                color: "text.secondary",
                fontWeight: 500,
                display: "block"
              }}
            >
              Granja activa
            </Typography>
            <Select
              value={currentFarm?.id || ""}
              onChange={handleFarmChange}
              displayEmpty
              sx={{
                bgcolor: "white",
                borderRadius: 1,
                "& .MuiSelect-select": {
                  py: 1.5,
                },
              }}
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <Typography color="text.secondary">
                      Selecciona una granja
                    </Typography>
                  );
                }
                const farm = farms.find(f => f.id === selected);
                return (
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {farm?.farm_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      REGA: {farm?.REGA || "N/A"}
                    </Typography>
                  </Box>
                );
              }}
            >
              {/* Opciones de granjas existentes */}
              {farms.map((farm) => (
                <MenuItem key={farm.id} value={farm.id}>
                  <Box sx={{ py: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {farm.farm_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      REGA: {farm.REGA || "N/A"} • {farm.locality}, {farm.province}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
              
              {/* Divider antes de la opción de crear nueva */}
              {farms.length > 0 && <Divider />}
              
              {/* Opción para crear nueva granja */}
              <MenuItem 
                value="create_new"
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "primary.light",
                  },
                }}
              >
                <ListItemIcon>
                  <AddCircleOutlineIcon sx={{ color: "primary.main" }} />
                </ListItemIcon>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Crear nueva granja
                </Typography>
              </MenuItem>
            </Select>
          </FormControl>

          

         
        </Box>

        {/* Navigation Menu */}
        <Box sx={{ flexGrow: 1, p: 2, overflowY: "auto" }}>
          <List disablePadding>
            {/* Información de la granja */}
            <ListItem disablePadding>
               <Paper elevation={0} sx={{ width: "100%", bgcolor: "grey.50", borderRadius: 2, mb: 0.5 }}>
              <ListItemButton onClick={() => handleToggle("granja")} sx={{ borderRadius: 2, mb: 0.5 }}>
                <ListItemIcon>
                  <Agriculture sx={{ color: "primary" }} />
                </ListItemIcon>
                <ListItemText primary="Información de la granja" />
                {openOtherSections.granja ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openOtherSections.granja} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 4, pb: 1 }}>
                  <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("descripcion_granja")}>
                    <ListItemText
                      primary="Descripción de granja"
                      sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
                    />
                  </ListItemButton>
                  <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("datos_granja")}>
                    <ListItemText
                      primary="Datos de la granja"
                      sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
                    />
                  </ListItemButton>
                  {/* <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("gestores_autorizados")}>
                    <ListItemText
                      primary="Gestores autorizados"
                      sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
                    />
                  </ListItemButton> */}
                  {/* <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("gestion_rega")}>
                    <ListItemText
                      primary="Gestión de REGA"
                      sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
                    />
                  </ListItemButton> */}
                </List>
              </Collapse>
              </Paper>
            </ListItem>

            {/* Información del personal */}
            <ListItem disablePadding>
              <Paper elevation={0} sx={{ width: "100%", bgcolor: "grey.50", borderRadius: 2, mb: 0.5 }}>
                <ListItemButton onClick={() => setOpenPersonal(!openPersonal)} sx={{ borderRadius: 2 }}>
                  <ListItemIcon>
                    <People sx={{ color: "primary" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Información del personal"
                    sx={{ "& .MuiTypography-root": { color: "primary", fontWeight: 500 } }}
                  />
                  {openPersonal ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openPersonal} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 4, pb: 1 }}>
                    <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("empresas_vinculadas")}>
                      <ListItemText
                        primary="Empresas vinculadas y gestores autorizados"
                        sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
                      />
                    </ListItemButton>
                    <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("registro_personal")}>
                      <ListItemText
                        primary="Registro de personal"
                        sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
                      />
                    </ListItemButton>
                    <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("registro_veterinario")}>
                      <ListItemText
                        primary="Registro de veterinario de explotación"
                        sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
                      />
                    </ListItemButton>
                    <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("cursos_formacion")}>
                      <ListItemText
                        primary="Cursos de formación"
                        sx={{
                          "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main", fontWeight: 500 },
                        }}
                      />
                    </ListItemButton>
                  </List>
                </Collapse>
              </Paper>
            </ListItem>

            {/* Desarrollo de planes - CON SUBMENÚS */}
            <ListItem disablePadding>
              <Paper elevation={0} sx={{ width: "100%", bgcolor: "grey.50", borderRadius: 2, mb: 0.5 }}>
                <ListItemButton onClick={() => handleToggle("planes")} sx={{ borderRadius: 2 }}>
                  <ListItemIcon>
                    <Assignment sx={{ color: "primary" }} />
                  </ListItemIcon>
                  <ListItemText primary="Desarrollo de planes" />
                  {openOtherSections.planes ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openOtherSections.planes} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 4, pb: 1 }}>
                    <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("plan_lld")}>
                      <ListItemText
                        primary="LLD"
                        sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
                      />
                    </ListItemButton>
                    <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("plan_bioseguridad")}>
                      <ListItemText
                        primary="Bioseguridad"
                        sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
                      />
                    </ListItemButton>
                    <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("plan_sanitario")}>
                      <ListItemText
                        primary="Sanitario"
                        sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
                      />
                    </ListItemButton>
                    <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("plan_mantenimiento_instalaciones")}>
                      <ListItemText
                        primary="Mantenimiento de instalaciones"
                        sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
                      />
                    </ListItemButton>
                    <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("plan_formacion")}>
                      <ListItemText
                        primary="Formación"
                        sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
                      />
                    </ListItemButton>
                    <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("plan_recogida_cadaveres")}>
                      <ListItemText
                        primary="Recogida de cadáveres"
                        sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
                      />
                    </ListItemButton>
                    <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("plan_gestion_residuos")}>
                      <ListItemText
                        primary="Gestión de residuos"
                        sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
                      />
                    </ListItemButton>
                    <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("plan_gestion_ambiental")}>
                      <ListItemText
                        primary="Gestión ambiental"
                        sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
                      />
                    </ListItemButton>
                  </List>
                </Collapse>
              </Paper>
            </ListItem>

            {/* Control diario */}
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToggle("control")} sx={{ borderRadius: 2, mb: 0.5 }}>
                <ListItemIcon>
                  <EventNote sx={{ color: "primary" }} />
                </ListItemIcon>
                <ListItemText primary="Control diario" />
                {openOtherSections.control ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            {/* Limpieza y mantenimiento - mantener igual */}
            <ListItem disablePadding>
  <Paper elevation={0} sx={{ width: "100%", bgcolor: "grey.50", borderRadius: 2, mb: 0.5 }}>
    <ListItemButton onClick={() => handleToggle("limpieza")} sx={{ borderRadius: 2 }}>
      <ListItemIcon>
        <CleaningServices sx={{ color: "primary" }} />
      </ListItemIcon>
      <ListItemText primary="Limpieza y mantenimiento" />
      {openOtherSections.limpieza ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>
    <Collapse in={openOtherSections.limpieza} timeout="auto" unmountOnExit>
      <List component="div" disablePadding sx={{ pl: 4, pb: 1 }}>
        <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("desratizacion")}>
          <ListItemText
            primary="Desratización"
            sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
          />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("desinsectacion")}>
          <ListItemText
            primary="Desinsectación"
            sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
          />
        </ListItemButton>
       
        <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("arco_desinfeccion")}>
          <ListItemText
            primary="Arco o vado de desinfección"
            sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
          />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("limpieza_silos")}>
          <ListItemText
            primary="Limpieza de silos"
            sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
          />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("limpieza_tuberias")}>
          <ListItemText
            primary="Limpieza de tuberías de agua"
            sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
          />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("mantenimiento_equipos")}>
          <ListItemText
            primary="Mantenimiento de equipos"
            sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
          />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("recogida_cadaveres")}>
          <ListItemText
            primary="Recogida de cadáveres y SANDACH"
            sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
          />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("recogida_residuos")}>
          <ListItemText
            primary="Recogida de residuos peligrosos"
            sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
          />
        </ListItemButton>
      </List>
    </Collapse>
  </Paper>
</ListItem>

{/* Altas y bajas con submenús */}
<ListItem disablePadding>
  <Paper elevation={0} sx={{ width: "100%", bgcolor: "grey.50", borderRadius: 2, mb: 0.5 }}>
    <ListItemButton onClick={() => handleToggle("altas")} sx={{ borderRadius: 2 }}>
      <ListItemIcon>
        <TrendingUp sx={{ color: "primary" }} />
      </ListItemIcon>
      <ListItemText primary="Altas y bajas" />
      {openOtherSections.altas ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>
    <Collapse in={openOtherSections.altas} timeout="auto" unmountOnExit>
      <List component="div" disablePadding sx={{ pl: 4, pb: 1 }}>
        <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("entrada_lechones")}>
          <ListItemText
            primary="Entrada de lechones"
            sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
          />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("salida_matadero")}>
          <ListItemText
            primary="Salida a matadero"
            sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
          />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("baja_animales")}>
          <ListItemText
            primary="Baja de animales"
            sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
          />
        </ListItemButton>
      </List>
    </Collapse>
  </Paper>
</ListItem>

{/* Alimentación y consumo with submenus */}
<ListItem disablePadding>
  <Paper elevation={0} sx={{ width: "100%", bgcolor: "grey.50", borderRadius: 2, mb: 0.5 }}>
    <ListItemButton onClick={() => handleToggle("alimentacion")} sx={{ borderRadius: 2 }}>
      <ListItemIcon>
        <Restaurant sx={{ color: "primary" }} />
      </ListItemIcon>
      <ListItemText primary="Alimentación y consumo" />
      {openOtherSections.alimentacion ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>
    <Collapse in={openOtherSections.alimentacion} timeout="auto" unmountOnExit>
      <List component="div" disablePadding sx={{ pl: 4, pb: 1 }}>
        <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("etiquetas_pienso")}>
          <ListItemText
            primary="Etiquetas pienso"
            sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
          />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("descarga_sacos_pienso")}>
          <ListItemText
            primary="Descarga de sacos pienso"
            sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
          />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("descarga_pienso_granel")}>
          <ListItemText
            primary="Descarga de sacos pienso a granel"
            sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
          />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("consumo_agua")}>
          <ListItemText
            primary="Consumo de agua"
            sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
          />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("consumo_electricidad")}>
          <ListItemText
            primary="Consumo de electricidad"
            sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
          />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("entradas_combustible")}>
          <ListItemText
            primary="Entradas de combustible"
            sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
          />
        </ListItemButton>
      </List>
    </Collapse>
  </Paper>
</ListItem>

{/* Resto de menús sin submenús */}
{[
  { key: "bienestar", icon: Pets, text: "Bienestar animal" },
].map(({ key, icon: Icon, text }) => (
  <ListItem key={key} disablePadding>
    <ListItemButton onClick={() => handleToggle(key)} sx={{ borderRadius: 2, mb: 0.5 }}>
      <ListItemIcon>
        <Icon sx={{ color: "primary" }} />
      </ListItemIcon>
      <ListItemText primary={text} />
      {openOtherSections[key] ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>
  </ListItem>
))}

          </List>
        </Box>

        {/* Bottom Menu */}
        <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "grey.200" }}>
          <List disablePadding>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToggle("config")} sx={{ borderRadius: 2, mb: 0.5 }}>
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText primary="Configuración" />
                {openConfig ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openConfig} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4, borderRadius: 2, mb: 0.5 }}
                  onClick={() => setActiveSection("exportar-informacion")}
                >
                  <ListItemIcon>
                    <FileDownload />
                  </ListItemIcon>
                  <ListItemText primary="Exportar Información" />
                </ListItemButton>
              </List>
            </Collapse>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Cerrar sesión" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </>
    );

    const token = useUserStore(state => state.token);
    const userId = useUserStore(state => state.record.id);
    const isTokenValid = useUserStore(state => state.isTokenValid);
    const resetUser = useUserStore(state => state.resetUser);

    // Validar expiración del token periódicamente
    useEffect(() => {
      // Verificar inmediatamente al cargar el componente
      if (!isTokenValid()) {
        console.log("⚠️ Token expirado, cerrando sesión...");
        resetUser();
        localStorage.clear();
        router.push('/');
        return;
      }

      // Verificar cada 5 minutos
      const intervalId = setInterval(() => {
        if (!isTokenValid()) {
          console.log("⚠️ Token expirado, cerrando sesión...");
          resetUser();
          localStorage.clear();
          router.push('/');
        }
      }, 5 * 60 * 1000); // 5 minutos

      return () => clearInterval(intervalId);
    }, [isTokenValid, resetUser, router]);

    useEffect(() => {
      if (token && userId) {
        console.log("🔄 Cargando granjas para usuario:", userId);
        listFarms(token, userId)
          .then((response) => {
            if (response.success && response.data.items) {
              // Guardar las granjas en el store usando setFarms
              setFarms(response.data.items as FarmFormData[]);
              
              console.log("✅ Granjas cargadas:", response.data.items.length);
              
              // Si hay granjas y no hay una seleccionada, seleccionar la primera
              const currentFarm = useFarmFormStore.getState().currentFarm;
              
              if (response.data.items.length > 0 && !currentFarm) {
                console.log("📍 Estableciendo granja actual:", response.data.items[0].farm_name);
                setCurrentFarm(response.data.items[0] as FarmFormData);
              } else if (currentFarm) {
                console.log("📍 Granja actual ya establecida:", currentFarm.farm_name);
              }
            } else {
              console.warn("⚠️ No se pudieron cargar las granjas");
            }
          })
          .catch((err) => {
            console.error("❌ Error al cargar granjas:", err);
          });
      }
    }, [userId, token, setFarms, setCurrentFarm]);

    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
          {/* AppBar/Menu button for mobile */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ position: "fixed", top: 16, left: 16, zIndex: 1300 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Drawer */}
          <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isMobile ? mobileOpen : true}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                borderRight: "1px solid",
                borderColor: "grey.200",
              },
              display: { xs: isMobile ? "block" : "none", md: "block" }
            }}
          >
            {drawerContent}
          </Drawer>

          {/* Main Content */}
          <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
            <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
              <Link underline="hover" color="text.secondary">
                {activeSection === "cursos_formacion" && "Información del personal"}
                {activeSection === "descripcion_granja" && "Información de la granja"}
                {activeSection === "datos_granja" && "Información de la granja"}
                {/* {activeSection === "gestores_autorizados" && "Información de la granja"} */}
                {/* {activeSection === "gestion_rega" && "Información de la granja"} */}
                {activeSection === "empresas_vinculadas" && "Información del personal"}
                {activeSection === "registro_personal" && "Información del personal"}
                {activeSection === "registro_veterinario" && "Información del personal"}
                {(activeSection === "plan_lld" ||
                  activeSection === "plan_bioseguridad" ||
                  activeSection === "plan_sanitario" ||
                  activeSection === "plan_mantenimiento_instalaciones" ||
                  activeSection === "plan_formacion" ||
                  activeSection === "plan_recogida_cadaveres" ||
                  activeSection === "plan_gestion_residuos" ||
                  activeSection === "plan_gestion_ambiental") && "Desarrollo de planes"}
                {activeSection === "control" && "Control diario"}
                {(activeSection === "desratizacion" || 
                  activeSection === "desinsectacion" || 
                  activeSection === "limpieza_desinfeccion" || 
                  activeSection === "arco_desinfeccion" || 
                  activeSection === "limpieza_silos" || 
                  activeSection === "limpieza_tuberias" || 
                  activeSection === "mantenimiento_equipos" ||
                  activeSection === "recogida_cadaveres" ||
                  activeSection === "recogida_residuos") && "Limpieza y mantenimiento"}
                {(activeSection === "etiquetas_pienso" ||
                  activeSection === "descarga_sacos_pienso" ||
                  activeSection === "descarga_pienso_granel" ||
                  activeSection === "consumo_agua" ||
                  activeSection === "consumo_electricidad" ||
                  activeSection === "entradas_combustible") && "Alimentación y consumo"}
                {activeSection === "bienestar" && "Bienestar animal"}
                {(activeSection === "entrada_lechones" ||
                  activeSection === "salida_matadero" ||
                  activeSection === "baja_animales") && "Altas y bajas"}
                {activeSection === "reportes" && "Reportes"}
                {activeSection === "main" && ""}
              </Link>
              <Typography color="secondary.main">
                {(() => {
                  switch (activeSection) {
                    case "cursos_formacion":
                      return "Cursos de formación";
                    case "descripcion_granja":
                      return "Descripción de granja";
                    case "datos_granja":
                      return "Datos de la granja";
                    // case "gestores_autorizados":
                    //   return "Gestores autorizados";
                    // case "gestion_rega":
                    //   return "Gestión de REGA";
                    case "empresas_vinculadas":
                      return "Empresas vinculadas y gestores autorizados";
                    case "registro_personal":
                      return "Registro de personal";
                    case "registro_veterinario":
                      return "Registro de veterinario de explotación";
                    // Nuevas secciones de Desarrollo de planes
                    case "plan_lld":
                      return "LLD";
                    case "plan_bioseguridad":
                      return "Bioseguridad";
                    case "plan_sanitario":
                      return "Sanitario";
                    case "plan_mantenimiento_instalaciones":
                      return "Mantenimiento de instalaciones";
                    case "plan_formacion":
                      return "Formación";
                    case "plan_recogida_cadaveres":
                      return "Recogida de cadáveres";
                    case "plan_gestion_residuos":
                      return "Gestión de residuos";
                    case "plan_gestion_ambiental":
                      return "Gestión ambiental";
                    case "control":
                      return "Control diario";
                    case "desratizacion":
                      return "Desratización";
                    case "desinsectacion":
                      return "Desinsectación";
                    case "limpieza_desinfeccion":
                      return "Limpieza y desinfección";
                    case "arco_desinfeccion":
                      return "Arco o vado de desinfección";
                    case "limpieza_silos":
                      return "Limpieza de silos";
                    case "limpieza_tuberias":
                      return "Limpieza de tuberías de agua";
                    case "mantenimiento_equipos":
                      return "Mantenimiento de equipos";
                    case "recogida_cadaveres":
                      return "Recogida de cadáveres y SANDACH";
                    case "recogida_residuos":
                      return "Recogida de residuos peligrosos";
                    case "etiquetas_pienso":
                      return "Etiquetas pienso";
                    case "descarga_sacos_pienso":
                      return "Descarga de sacos pienso";
                    case "descarga_pienso_granel":
                      return "Descarga de sacos pienso a granel";
                    case "consumo_agua":
                      return "Consumo de agua";
                    case "consumo_electricidad":
                      return "Consumo de electricidad";
                    case "entradas_combustible":
                      return "Entradas de combustible";
                    case "bienestar":
                      return "Bienestar animal";
                    case "entrada_lechones":
                      return "Entrada de lechones";
                    case "salida_matadero":
                      return "Salida a matadero";
                    case "baja_animales":
                      return "Baja de animales";
                    case "reportes":
                      return "Reportes";
                    default:
                      return "";
                  }
                })()}
              </Typography>
            </Breadcrumbs>

            {/* Renderizado condicional del contenido */}
            {activeSection === "cursos_formacion" && <TrainingCoursesSection token={token}
                userId={userId}
                farmId={currentFarm?.id}/>}

            {activeSection === "main" && <MainSection />}

            {activeSection === "descripcion_granja" && <MainDescriptionFarm />}
            {activeSection === "datos_granja" && <DatosGranjaSection />}
            {/* {activeSection === "gestores_autorizados" && (
              <Typography variant="h5">Aquí van los gestores autorizados</Typography>
            )} */}
            {/* {activeSection === "gestion_rega" && (
              <Typography variant="h5">Aquí va la gestión de REGA</Typography>
            )} */}
            {activeSection === "empresas_vinculadas" && (
              <LinkedCompaniesManagersPage 
                token={token}
                userId={userId}
                farmId={currentFarm?.id}
              />
            )}
            {activeSection === "registro_personal" && <PersonalRegisterSection token={token}
                userId={userId}
                farmId={currentFarm?.id} />}
            {activeSection === "registro_veterinario" && <RegistroVeterinarioSection token={token}
                userId={userId}
                farmId={currentFarm?.id} />}

            {/* Nuevas secciones de Desarrollo de planes */}
            {activeSection === "plan_lld" && <PlanLLDSection />}
            {activeSection === "plan_bioseguridad" && <PlanBioseguridadSection />}
            {activeSection === "plan_sanitario" && <PlanSanitarioSection />}
            {activeSection === "plan_mantenimiento_instalaciones" && <MantenimientoInstalacionesSection />}
            
            {activeSection === "plan_formacion" && <PlanFormacionSection />}
            {activeSection === "plan_recogida_cadaveres" && <PlanRecogidaCadaveresSection />}
            {activeSection === "plan_gestion_residuos" && <PlanGestionResiduosSection />}
            {activeSection === "plan_gestion_ambiental" && <PlanGestionAmbientalSection />}

            {/* Secciones de Limpieza y mantenimiento - mantener igual */}
            {activeSection === "desratizacion" && <DesratizacionSection />}
            {activeSection === "desinsectacion" && <DesinsectacionSection />}
            {activeSection === "arco_desinfeccion" && <ArcoDesinfeccionSection />}
            {activeSection === "limpieza_silos" && <LimpiezaDesinfeccionSection />}
            {activeSection === "limpieza_tuberias" && <LimpiezaDesinfeccionTuberiasSection />}
            {activeSection === "mantenimiento_equipos" && <MantenimientoEquiposSection />}
            {activeSection === "recogida_cadaveres" && <RecogidaCadaveresSection />}
            {activeSection === "recogida_residuos" && <RecogidaResiduosSection />}

            {/* Secciones de Altas y bajas - mantener igual */}
            {activeSection === "entrada_lechones" && <EntradaLechonesSection />}
            {activeSection === "salida_matadero" && <SalidaMataderoSection />}
            {activeSection === "baja_animales" && <BajaAnimalesSection />}

            {/* Secciones de Alimentación y consumo - mantener igual */}
            {activeSection === "etiquetas_pienso" && <EtiquetasPiensoSection />}
            {activeSection === "descarga_sacos_pienso" && <DescargaSacosPiensoSection />}
            {activeSection === "descarga_pienso_granel" && <DescargaPiensoGranelSection />}
            {activeSection === "consumo_agua" && <ConsumoAguaSection />}
            {activeSection === "consumo_electricidad" && <ConsumoElectricidadSection />}
            {activeSection === "entradas_combustible" && <EntradasCombustibleSection />}

            {/* Sección de Configuración */}
            {activeSection === "exportar-informacion" && <ExportarInformacionSection />}
          </Box>
        </Box>

        {/* Modal para crear nueva granja */}
        <Dialog 
          open={openCreateFarmModal} 
          onClose={handleCloseCreateFarmModal}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            bgcolor: 'primary.main',
            color: 'white'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Crear Nueva Granja
            </Typography>
            <IconButton 
              onClick={handleCloseCreateFarmModal}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Completa la información de tu nueva granja
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
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
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
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
                  name="group"
                  value={farmFormData.group}
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
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCloseCreateFarmModal}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveNewFarm}
                  disabled={!isFarmFormValid()}
                >
                  Crear Granja
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    );
}

export default Home;
