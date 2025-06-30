
import { useState } from "react"
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Paper,
  TableContainer,
  Breadcrumbs,
  Link,
  Collapse,
  ThemeProvider,
} from "@mui/material"
import {
  ExpandLess,
  ExpandMore,
  Settings,
  ExitToApp,
  Add,
  NavigateNext,
  Agriculture,
  People,
  Assignment,
  EventNote,
  CleaningServices,
  Restaurant,
  Pets,
  TrendingUp,
  Assessment,
} from "@mui/icons-material"
import { theme } from "./theme"
import { useRouter } from "next/router";
import MainIcon from '../../assets/svgs/mainIconOne.svg';
const drawerWidth = 320

const Home = () => {
    const router = useRouter();

    const [openPersonal, setOpenPersonal] = useState(true)
    const [openOtherSections, setOpenOtherSections] = useState<{ [key: string]: boolean }>({})

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
    // Dummy data for courses
    const courses = [
      { name: "Curso de Bioseguridad", hours: 8 },
      { name: "Manejo de animales", hours: 12 },
      { name: "Prevención de enfermedades", hours: 10 },
    ];
    
    const handleLogin = () => {
        router.push('/');
    };
     return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid",
              borderColor: "grey.200",
            },
          }}
        >
          {/* Logo */}
          <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "grey.200" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
               <MainIcon width={175} height={184.65} style={{ alignSelf: 'center', marginTop: '40px', marginBottom: '30px' }} />
            </Box>
          </Box>

          {/* Navigation Menu */}
          <Box sx={{ flexGrow: 1, p: 2 }}>
            <List disablePadding>
              {/* Información de la granja */}
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleToggle("granja")} sx={{ borderRadius: 2, mb: 0.5 }}>
                  <ListItemIcon>
                    <Agriculture sx={{ color: "primary" }} />
                  </ListItemIcon>
                  <ListItemText primary="Información de la granja" />
                  {openOtherSections.granja ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>

              {/* Información del personal */}
              <ListItem disablePadding>
                <Paper elevation={0} sx={{ width: "100%", bgcolor: "grey.50", borderRadius: 2, mb: 0.5 }}>
                  <ListItemButton onClick={() => handleToggle("personal")} sx={{ borderRadius: 2 }}>
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
                      <ListItemButton sx={{ borderRadius: 1, py: 0.5 }}>
                        <ListItemText
                          primary="Empresas vinculadas y gestores autorizados"
                          sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
                        />
                      </ListItemButton>
                      <ListItemButton sx={{ borderRadius: 1, py: 0.5 }}>
                        <ListItemText
                          primary="Registro de personal"
                          sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
                        />
                      </ListItemButton>
                      <ListItemButton sx={{ borderRadius: 1, py: 0.5 }}>
                        <ListItemText
                          primary="Registro de veterinario de explotación"
                          sx={{ "& .MuiTypography-root": { fontSize: "0.875rem", color: "secondary.main" } }}
                        />
                      </ListItemButton>
                      <ListItemButton sx={{ borderRadius: 1, py: 0.5 }}>
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
                { key: "limpieza", icon: CleaningServices, text: "Limpieza y mantenimiento" },
                { key: "alimentacion", icon: Restaurant, text: "Alimentación y consumo" },
                { key: "bienestar", icon: Pets, text: "Bienestar animal" },
                { key: "altas", icon: TrendingUp, text: "Altas y bajas" },
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

              <ListItem disablePadding>
                <ListItemButton sx={{ borderRadius: 2, mb: 0.5 }}>
                  <ListItemIcon>
                    <Assessment sx={{ color: "primary" }} />
                  </ListItemIcon>
                  <ListItemText primary="Reportes" />
                </ListItemButton>
              </ListItem>
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
                <ListItemButton sx={{ borderRadius: 2 }}>
                  <ListItemIcon>
                    <ExitToApp />
                  </ListItemIcon>
                  <ListItemText primary="Cerrar sesión" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
          {/* Breadcrumb */}
          <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
            <Link underline="hover" color="text.secondary">
              Información del personal
            </Link>
            <Typography color="secondary.main">Cursos de formación</Typography>
          </Breadcrumbs>

          {/* Page Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 4,
                  height: 32,
                  bgcolor: "secondary.light",
                  borderRadius: 2,
                }}
              />
              <Typography variant="h4" sx={{ color: "secondary.main" }}>
                Cursos de formación
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                bgcolor: "success.main",
                "&:hover": { bgcolor: "success.dark" },
                px: 3,
              }}
            >
              Agregar nuevo
            </Button>
          </Box>

          {/* Data Table */}
          <TableContainer component={Paper} elevation={1}>
            {/* Table Header */}
            <Box sx={{ bgcolor: "grey.100", p: 2, borderBottom: "1px solid", borderColor: "grey.200" }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 200px 200px", gap: 2, alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, color: "grey.700" }}>
                    Curso
                  </Typography>
                  <ExpandMore sx={{ fontSize: 16, color: "grey.400" }} />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, color: "grey.700" }}>
                    Horas lectivas
                  </Typography>
                  <ExpandMore sx={{ fontSize: 16, color: "grey.400" }} />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, color: "grey.700" }}>
                    Acciones
                  </Typography>
                  <ExpandMore sx={{ fontSize: 16, color: "grey.400" }} />
                </Box>
              </Box>
            </Box>

            {/* Table Rows */}
            <Box>
              {courses.map((course, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 200px 200px",
                    gap: 2,
                    alignItems: "center",
                    p: 2,
                    borderBottom: index < courses.length - 1 ? "1px solid" : "none",
                    borderColor: "grey.200",
                    "&:hover": { bgcolor: "grey.50" },
                  }}
                >
                  <Typography variant="body1" sx={{ color: "grey.900" }}>
                    {course.name}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "grey.900" }}>
                    {course.hours}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        bgcolor: "warning.main",
                        color: "black",
                        "&:hover": { bgcolor: "warning.dark" },
                        minWidth: 70,
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: "info.light",
                        color: "info.main",
                        "&:hover": { bgcolor: "info.light", borderColor: "info.main" },
                        minWidth: 80,
                      }}
                    >
                      Ver más
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </TableContainer>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Home;
