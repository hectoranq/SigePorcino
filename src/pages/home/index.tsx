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
  useMediaQuery
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu";
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
} from "@mui/icons-material"
import theme from "../../components/theme"
import { useRouter } from "next/router";

import MainSection from "../../components/sections/MainSection";
import useUserStore from "../../_store/user"; // Ajusta la ruta según tu proyecto
import { fetchFarmsByUserId } from "../../data/repository";
import MainDescriptionFarm from "../../components/sections/MainDescriptionFarm";
import TrainingCoursesPage from "../../components/sections/TrainingCoursesSection";
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

const drawerWidth = 320

const Home = () => {
    const router = useRouter();
    const [openPersonal, setOpenPersonal] = useState(false)
    const [openOtherSections, setOpenOtherSections] = useState<{ [key: string]: boolean }>({})
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    
    const [activeSection, setActiveSection] = useState<string>("main"); // valor por defecto
    const handleToggle = (section: string) => {
      if (section === "personal") {
        setOpenPersonal(!openPersonal)
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
      localStorage.clear();
      router.push('/');
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
        {/* Navigation Menu */}
        <Box sx={{ flexGrow: 1, p: 2 }}>
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
                  <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("gestores_autorizados")}>
                    <ListItemText
                      primary="Gestores autorizados"
                      sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
                    />
                  </ListItemButton>
                  <ListItemButton sx={{ borderRadius: 1, py: 0.5 }} onClick={() => setActiveSection("gestion_rega")}>
                    <ListItemText
                      primary="Gestión de REGA"
                      sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
                    />
                  </ListItemButton>
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

            {/* Other menu items */}
            {[
  { key: "planes", icon: Assignment, text: "Desarrollo de planes" },
  { key: "control", icon: EventNote, text: "Control diario" },
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

{/* Limpieza y mantenimiento con submenús */}
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

{/* Resto de menús sin submenús */}
{[
  { key: "alimentacion", icon: Restaurant, text: "Alimentación y consumo" },
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
              <ListItemButton sx={{ borderRadius: 2, mb: 0.5 }}>
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText primary="Configuración" />
              </ListItemButton>
            </ListItem>
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

    const token = useUserStore(state => state.token); // Ajusta el nombre según tu store

    const userId = useUserStore(state => state.record.id); // O el id que corresponda

    useEffect(() => {
      if (token) {
        fetchFarmsByUserId(userId, token)
          .then(() => {
            // Ya se guarda en zustand dentro de fetchFarmRecord
          })
          .catch((err) => {
            // Manejo de error si lo necesitas
            console.error(err);
          });
      }
    }, [userId]);

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
                {activeSection === "gestores_autorizados" && "Información de la granja"}
                {activeSection === "gestion_rega" && "Información de la granja"}
                {activeSection === "empresas_vinculadas" && "Información del personal"}
                {activeSection === "registro_personal" && "Información del personal"}
                {activeSection === "registro_veterinario" && "Información del personal"}
                {activeSection === "planes" && "Desarrollo de planes"}
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
                {activeSection === "alimentacion" && "Alimentación y consumo"}
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
                    case "gestores_autorizados":
                      return "Gestores autorizados";
                    case "gestion_rega":
                      return "Gestión de REGA";
                    case "empresas_vinculadas":
                      return "Empresas vinculadas y gestores autorizados";
                    case "registro_personal":
                      return "Registro de personal";
                    case "registro_veterinario":
                      return "Registro de veterinario de explotación";
                    case "planes":
                      return "Desarrollo de planes";
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
                    case "alimentacion":
                      return "Alimentación y consumo";
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
            {activeSection === "cursos_formacion" && <TrainingCoursesPage />}

            {activeSection === "main" && <MainSection />}

            {activeSection === "descripcion_granja" && <MainDescriptionFarm />}
            {activeSection === "datos_granja" && (
              <Typography variant="h5">Aquí van los datos de la granja</Typography>
            )}
            {activeSection === "gestores_autorizados" && (
              <Typography variant="h5">Aquí van los gestores autorizados</Typography>
            )}
            {activeSection === "gestion_rega" && (
              <Typography variant="h5">Aquí va la gestión de REGA</Typography>
            )}
            {activeSection === "empresas_vinculadas" && <LinkedCompaniesManagersPage />}
            {activeSection === "registro_personal" && <PersonalRegisterSection />}
            {activeSection === "registro_veterinario" && (
              <Typography variant="h5">Aquí va el registro de veterinario de explotación</Typography>
            )}

            {/* Nuevas secciones de Limpieza y mantenimiento */}
            {activeSection === "desratizacion" &&  <DesratizacionSection />}
{activeSection === "desinsectacion" && <DesinsectacionSection />}

{activeSection === "arco_desinfeccion" && <ArcoDesinfeccionSection />}
{activeSection === "limpieza_silos" && <LimpiezaDesinfeccionSection />}
{activeSection === "limpieza_tuberias" && <LimpiezaDesinfeccionTuberiasSection />}
{activeSection === "mantenimiento_equipos" && <MantenimientoEquiposSection />}
{activeSection === "recogida_cadaveres" && <RecogidaCadaveresSection />}
{activeSection === "recogida_residuos" && <RecogidaResiduosSection />}

{/* Secciones de Altas y bajas */}
{activeSection === "entrada_lechones" && <EntradaLechonesSection />}
{activeSection === "salida_matadero" && <SalidaMataderoSection />}
{activeSection === "baja_animales" && <BajaAnimalesSection />}
          </Box>
        </Box>
      </ThemeProvider>
    );
}

export default Home;
