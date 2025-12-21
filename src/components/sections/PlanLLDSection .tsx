import React, { useState } from "react"
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Select,
  MenuItem,
  Divider,
} from "@mui/material"

interface PlanLLDFormData {
  productos: {
    despedac: boolean
    zotal: boolean
    ratibromPellet: boolean
    ratibromCeboFresco: boolean
  }
  instalaciones: {
    paredes: boolean
    suelos: boolean
    comederosSilos: boolean
  }
  aparatos: {
    maquinasLavado: boolean
    pulverizadores: boolean
    desinfectante: boolean
  }
  trabajadorSeleccionado: string
  trabajadorNombre: string
  descripcionLimpieza: string
  descripcionDesinsectacion: string
  descripcionDesratizacion: string
  instalacionesPeriodicidad: string
  utiliajePeriodicidad: string
  trabajadorAnalisisSeleccionado: string
  trabajadorAnalisisNombre: string
  equiposPeriodicidad: string
  utensiliosPeriodicidad: string
  archivoGranja: boolean
}

export function PlanLLDSection() {
  const [formData, setFormData] = useState<PlanLLDFormData>({
    productos: {
      despedac: false,
      zotal: false,
      ratibromPellet: false,
      ratibromCeboFresco: false,
    },
    instalaciones: {
      paredes: false,
      suelos: false,
      comederosSilos: false,
    },
    aparatos: {
      maquinasLavado: false,
      pulverizadores: false,
      desinfectante: false,
    },
    trabajadorSeleccionado: "",
    trabajadorNombre: "",
    descripcionLimpieza: "",
    descripcionDesinsectacion: "",
    descripcionDesratizacion: "",
    instalacionesPeriodicidad: "",
    utiliajePeriodicidad: "",
    trabajadorAnalisisSeleccionado: "",
    trabajadorAnalisisNombre: "",
    equiposPeriodicidad: "",
    utensiliosPeriodicidad: "",
    archivoGranja: false,
  })

  const [productosExtra, setProductosExtra] = useState<string[]>([])
  const [instalacionesExtra, setInstalacionesExtra] = useState<string[]>([])
  const [aparatosExtra, setAparatosExtra] = useState<string[]>([])
  const [archivoExtra, setArchivoExtra] = useState<string[]>([])

  const handleCheckboxChange = (
    section: keyof Pick<PlanLLDFormData, "productos" | "instalaciones" | "aparatos">,
    field: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field],
      },
    }))
  }

  const handleInputChange = (field: keyof PlanLLDFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddOpcion = (type: "productos" | "instalaciones" | "aparatos" | "archivo") => {
    const opcion = prompt(`Ingrese nueva opción para ${type}:`)
    if (opcion && opcion.trim()) {
      switch (type) {
        case "productos":
          setProductosExtra([...productosExtra, opcion.trim()])
          break
        case "instalaciones":
          setInstalacionesExtra([...instalacionesExtra, opcion.trim()])
          break
        case "aparatos":
          setAparatosExtra([...aparatosExtra, opcion.trim()])
          break
        case "archivo":
          setArchivoExtra([...archivoExtra, opcion.trim()])
          break
      }
    }
  }

  const handleSubmit = () => {
    console.log("Datos del Plan LLD:", formData)
    console.log("Productos extra:", productosExtra)
    console.log("Instalaciones extra:", instalacionesExtra)
    console.log("Aparatos extra:", aparatosExtra)
    console.log("Archivo extra:", archivoExtra)
    alert("✅ Plan LLD registrado exitosamente")
  }

  const handleCancel = () => {
    // Resetear formulario
    setFormData({
      productos: {
        despedac: false,
        zotal: false,
        ratibromPellet: false,
        ratibromCeboFresco: false,
      },
      instalaciones: {
        paredes: false,
        suelos: false,
        comederosSilos: false,
      },
      aparatos: {
        maquinasLavado: false,
        pulverizadores: false,
        desinfectante: false,
      },
      trabajadorSeleccionado: "",
      trabajadorNombre: "",
      descripcionLimpieza: "",
      descripcionDesinsectacion: "",
      descripcionDesratizacion: "",
      instalacionesPeriodicidad: "",
      utiliajePeriodicidad: "",
      trabajadorAnalisisSeleccionado: "",
      trabajadorAnalisisNombre: "",
      equiposPeriodicidad: "",
      utensiliosPeriodicidad: "",
      archivoGranja: false,
    })
    setProductosExtra([])
    setInstalacionesExtra([])
    setAparatosExtra([])
    setArchivoExtra([])
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", p: 3 }}>
      <Container maxWidth="xl">
        {/* Form container */}
        <Paper elevation={1} sx={{ borderRadius: 2, p: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4, pb: 3, borderBottom: "4px solid #00bcd4" }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: "#00bcd4" }}>
              Registro de nuevo plan LDD
            </Typography>
          </Box>

          {/* Section 1: Productos utilizados */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", mb: 2 }}>
              Productos utilizados en las labores de LDD
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.productos.despedac}
                    onChange={() => handleCheckboxChange("productos", "despedac")}
                  />
                }
                label="Despedac"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.productos.zotal}
                    onChange={() => handleCheckboxChange("productos", "zotal")}
                  />
                }
                label="Zotal"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.productos.ratibromPellet}
                    onChange={() => handleCheckboxChange("productos", "ratibromPellet")}
                  />
                }
                label="Ratibrom pellet"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.productos.ratibromCeboFresco}
                    onChange={() => handleCheckboxChange("productos", "ratibromCeboFresco")}
                  />
                }
                label="Ratibrom cebo fresco"
              />
              {productosExtra.map((producto, index) => (
                <FormControlLabel
                  key={index}
                  control={<Checkbox />}
                  label={producto}
                />
              ))}
              <Button
                variant="text"
                sx={{ color: "#00bcd4", fontWeight: 600, justifyContent: "flex-start" }}
                onClick={() => handleAddOpcion("productos")}
              >
                Añadir otra opción
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Section 2: Instalaciones */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", mb: 2 }}>
              Instalaciones y utiliaje donde se aplica LDD
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.instalaciones.paredes}
                    onChange={() => handleCheckboxChange("instalaciones", "paredes")}
                  />
                }
                label="Paredes"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.instalaciones.suelos}
                    onChange={() => handleCheckboxChange("instalaciones", "suelos")}
                  />
                }
                label="Suelos"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.instalaciones.comederosSilos}
                    onChange={() => handleCheckboxChange("instalaciones", "comederosSilos")}
                  />
                }
                label="Comederos y silos"
              />
              {instalacionesExtra.map((instalacion, index) => (
                <FormControlLabel
                  key={index}
                  control={<Checkbox />}
                  label={instalacion}
                />
              ))}
              <Button
                variant="text"
                sx={{ color: "#00bcd4", fontWeight: 600, justifyContent: "flex-start" }}
                onClick={() => handleAddOpcion("instalaciones")}
              >
                Añadir otra opción
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Section 3: Trabajadores */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", mb: 2 }}>
              Listado de trabajadores encargados de aplicar el plan LDD
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <Select
                value={formData.trabajadorSeleccionado}
                onChange={(e) => handleInputChange("trabajadorSeleccionado", e.target.value)}
                displayEmpty
                variant="filled"
                fullWidth
              >
                <MenuItem value="">
                  <em>Seleccione gestor o empleado</em>
                </MenuItem>
                <MenuItem value="trabajador1">Juan Pérez</MenuItem>
                <MenuItem value="trabajador2">María García</MenuItem>
                <MenuItem value="trabajador3">Carlos López</MenuItem>
              </Select>
              <TextField
                fullWidth
                variant="filled"
                placeholder="Nombre de gestor o empleado ya seleccionado"
                value={formData.trabajadorNombre}
                onChange={(e) => handleInputChange("trabajadorNombre", e.target.value)}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Section 4: Aparatos y productos */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", mb: 2 }}>
              Aparatos y productos que se utilizan en el proceso de limpieza y desinfección
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.aparatos.maquinasLavado}
                    onChange={() => handleCheckboxChange("aparatos", "maquinasLavado")}
                  />
                }
                label="Máquinas de lavado con agua a presión"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.aparatos.pulverizadores}
                    onChange={() => handleCheckboxChange("aparatos", "pulverizadores")}
                  />
                }
                label="Pulverizadores"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.aparatos.desinfectante}
                    onChange={() => handleCheckboxChange("aparatos", "desinfectante")}
                  />
                }
                label="Desinfectante"
              />
              {aparatosExtra.map((aparato, index) => (
                <FormControlLabel
                  key={index}
                  control={<Checkbox />}
                  label={aparato}
                />
              ))}
              <Button
                variant="text"
                sx={{ color: "#00bcd4", fontWeight: 600, justifyContent: "flex-start" }}
                onClick={() => handleAddOpcion("aparatos")}
              >
                Añadir otra opción
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Section 5: Descripción de rutinas */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", mb: 2 }}>
              Descripción de las rutinas y procedimientos de LDD
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="filled"
                placeholder="Describa proceso y rutina de limpieza y desinfección"
                value={formData.descripcionLimpieza}
                onChange={(e) => handleInputChange("descripcionLimpieza", e.target.value)}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="filled"
                placeholder="Describa proceso y rutina de desinsectación"
                value={formData.descripcionDesinsectacion}
                onChange={(e) => handleInputChange("descripcionDesinsectacion", e.target.value)}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="filled"
                placeholder="Describa proceso y rutina de desratización"
                value={formData.descripcionDesratizacion}
                onChange={(e) => handleInputChange("descripcionDesratizacion", e.target.value)}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Section 6: Descripción de labores LDD */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", mb: 2 }}>
              Descripción de labores LDD para instalaciones y utiliaje según periodicidad
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <Select
                value={formData.instalacionesPeriodicidad}
                onChange={(e) => handleInputChange("instalacionesPeriodicidad", e.target.value)}
                displayEmpty
                variant="filled"
                fullWidth
              >
                <MenuItem value="">
                  <em>Para instalaciones</em>
                </MenuItem>
                <MenuItem value="diario">Diario</MenuItem>
                <MenuItem value="semanal">Semanal</MenuItem>
                <MenuItem value="mensual">Mensual</MenuItem>
                <MenuItem value="trimestral">Trimestral</MenuItem>
              </Select>
              <Select
                value={formData.utiliajePeriodicidad}
                onChange={(e) => handleInputChange("utiliajePeriodicidad", e.target.value)}
                displayEmpty
                variant="filled"
                fullWidth
              >
                <MenuItem value="">
                  <em>Para utiliaje</em>
                </MenuItem>
                <MenuItem value="diario">Diario</MenuItem>
                <MenuItem value="semanal">Semanal</MenuItem>
                <MenuItem value="mensual">Mensual</MenuItem>
                <MenuItem value="trimestral">Trimestral</MenuItem>
              </Select>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Section 7: Trabajadores análisis */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", mb: 2 }}>
              Listado de trabajadores encargados de análisis microbiológico
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <Select
                value={formData.trabajadorAnalisisSeleccionado}
                onChange={(e) => handleInputChange("trabajadorAnalisisSeleccionado", e.target.value)}
                displayEmpty
                variant="filled"
                fullWidth
              >
                <MenuItem value="">
                  <em>Seleccione gestor o empleado</em>
                </MenuItem>
                <MenuItem value="analista1">Dr. Pedro Martínez</MenuItem>
                <MenuItem value="analista2">Dra. Ana Rodríguez</MenuItem>
                <MenuItem value="analista3">Dr. Luis Fernández</MenuItem>
              </Select>
              <TextField
                fullWidth
                variant="filled"
                placeholder="Nombre de gestor o empleado ya seleccionado"
                value={formData.trabajadorAnalisisNombre}
                onChange={(e) => handleInputChange("trabajadorAnalisisNombre", e.target.value)}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Section 8: Análisis microbiológico */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", mb: 2 }}>
              Análisis microbiológico de los equipos y utensilios según periodicidad
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <Select
                value={formData.equiposPeriodicidad}
                onChange={(e) => handleInputChange("equiposPeriodicidad", e.target.value)}
                displayEmpty
                variant="filled"
                fullWidth
              >
                <MenuItem value="">
                  <em>Para equipos</em>
                </MenuItem>
                <MenuItem value="semanal">Semanal</MenuItem>
                <MenuItem value="quincenal">Quincenal</MenuItem>
                <MenuItem value="mensual">Mensual</MenuItem>
                <MenuItem value="trimestral">Trimestral</MenuItem>
              </Select>
              <Select
                value={formData.utensiliosPeriodicidad}
                onChange={(e) => handleInputChange("utensiliosPeriodicidad", e.target.value)}
                displayEmpty
                variant="filled"
                fullWidth
              >
                <MenuItem value="">
                  <em>Para utensilios</em>
                </MenuItem>
                <MenuItem value="semanal">Semanal</MenuItem>
                <MenuItem value="quincenal">Quincenal</MenuItem>
                <MenuItem value="mensual">Mensual</MenuItem>
                <MenuItem value="trimestral">Trimestral</MenuItem>
              </Select>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Section 9: Sistema de archivo */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", mb: 2 }}>
              Descripción del sistema de archivo de las hojas de control, fichas de seguridad y fichas
              técnicas de productos y resultados de análisis microbiológico
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.archivoGranja}
                    onChange={(e) => handleInputChange("archivoGranja", e.target.checked)}
                  />
                }
                label="Archivo de granja"
              />
              {archivoExtra.map((archivo, index) => (
                <FormControlLabel
                  key={index}
                  control={<Checkbox />}
                  label={archivo}
                />
              ))}
            </FormGroup>
            <Button
              variant="text"
              sx={{ color: "#00bcd4", fontWeight: 600, mt: 1 }}
              onClick={() => handleAddOpcion("archivo")}
            >
              Añadir otra opción
            </Button>
          </Box>

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              pt: 4,
              mt: 4,
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              sx={{
                py: 1.5,
                fontWeight: 600,
                fontSize: "1rem",
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                  bgcolor: "rgba(0, 188, 212, 0.04)",
                },
              }}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                py: 1.5,
                fontWeight: 600,
                fontSize: "1rem",
                bgcolor: "#00695c",
                "&:hover": {
                  bgcolor: "#004d40",
                },
              }}
              onClick={handleSubmit}
            >
              Registrar
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}