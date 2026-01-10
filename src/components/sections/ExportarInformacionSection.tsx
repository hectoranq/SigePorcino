"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material"
import {
  FileDownload,
  Description,
  Assessment,
  TableChart,
  PictureAsPdf,
} from "@mui/icons-material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import useUserStore from "../../_store/user"
import useFarmFormStore from "../../_store/farm"

// Importar todos los métodos de los archivos /action/
import { listConsumoAgua } from "../../action/ConsumoAguaPocket"
import { listConsumoElectricidad } from "../../action/ConsumoElectricidadPocket"
import { listEntradasCombustible } from "../../action/EntradasCombustiblePocket"
import { listVeterinarians } from "../../action/RegistroVeterinarioPocket"
import { listStaff } from "../../action/PersonalRegisterPocket"
import { listDesratizacion } from "../../action/DesratizacionPocket"
import { listDesinsectacion } from "../../action/DesinsectacionPocket"
import { listLimpiezaDesinfeccion } from "../../action/LimpiezaDesinfeccionPocket"
import { listLimpiezaDesinfeccionTuberias } from "../../action/LimpiezaDesinfeccionTuberiasPocket"
import { listArcoDesinfeccion } from "../../action/ArcoDesinfeccionPocket"
import { listRecogidaCadaveres } from "../../action/RecogidaCadaveresPocket"
import { listRecogidaResiduos } from "../../action/RecogidaResiduosPocket"
import { listMantenimientoEquipos } from "../../action/MantenimientoEquiposPocket"
import { listMantenimientoInstalaciones } from "../../action/MantenimientoInstalacionesPocket"
import { listEntradaLechones } from "../../action/EntradaLechonesPocket"
import { listSalidaMatadero } from "../../action/SalidaMataderoPocket"
import { listBajaAnimales } from "../../action/BajaAnimalesPocket"
import { listEtiquetasPienso } from "../../action/EtiquetasPiensoPocket"
import { listDescargaSacosPienso } from "../../action/DescargaSacosPiensoPocket"
import { listDescargaPiensoGranel } from "../../action/DescargaPiensoGranelPocket"

const theme = createTheme({
  palette: {
    primary: {
      main: "#0d9488", // teal-600
      light: "#f0fdfa", // teal-50
    },
    secondary: {
      main: "#22c55e", // green-500
    },
  },
})

export const ExportarInformacionSection = () => {
  const [exporting, setExporting] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  })

  const token = useUserStore((state) => state.token)
  const userId = useUserStore((state) => state.record.id)
  const currentFarm = useFarmFormStore((state) => state.currentFarm)

  /**
   * Convierte un array de objetos a formato CSV
   */
  const convertToCSV = (data: any[], headers: string[]): string => {
    if (data.length === 0) return ""

    const csvRows = []
    
    // Agregar headers
    csvRows.push(headers.join(","))
    
    // Agregar datos
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header]
        // Escapar comas y comillas en los valores
        if (value === null || value === undefined) return ""
        const escaped = String(value).replace(/"/g, '""')
        return `"${escaped}"`
      })
      csvRows.push(values.join(","))
    }
    
    return csvRows.join("\n")
  }

  /**
   * Descarga un archivo CSV
   */
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob(["\ufeff" + content], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /**
   * Recopila todos los datos del sistema y genera un CSV completo
   */
  const exportAllDataToCSV = async () => {
    if (!token || !userId || !currentFarm?.id) {
      setSnackbar({
        open: true,
        message: "Error: No hay usuario o granja seleccionada",
        severity: "error",
      })
      return
    }

    try {
      setExporting(true)
      
      const allData: any = {
        granja: currentFarm,
        secciones: {},
      }

      // Recopilar datos de todas las secciones
      console.log("📦 Recopilando datos de todos los módulos...")

      // 1. Consumo de Agua
      try {
        const aguaData = await listConsumoAgua(token, userId, currentFarm.id, 1, 1000)
        allData.secciones.consumo_agua = aguaData.data.items || []
        console.log(`✅ Consumo Agua: ${allData.secciones.consumo_agua.length} registros`)
      } catch (error) {
        console.warn("⚠️ Error al cargar consumo agua:", error)
        allData.secciones.consumo_agua = []
      }

      // 2. Consumo de Electricidad
      try {
        const electricidadData = await listConsumoElectricidad(token, userId, currentFarm.id, 1, 1000)
        allData.secciones.consumo_electricidad = electricidadData.data.items || []
        console.log(`✅ Consumo Electricidad: ${allData.secciones.consumo_electricidad.length} registros`)
      } catch (error) {
        console.warn("⚠️ Error al cargar consumo electricidad:", error)
        allData.secciones.consumo_electricidad = []
      }

      // 3. Entradas de Combustible
      try {
        const combustibleData = await listEntradasCombustible(token, userId, currentFarm.id, 1, 1000)
        allData.secciones.entradas_combustible = combustibleData.data.items || []
        console.log(`✅ Entradas Combustible: ${allData.secciones.entradas_combustible.length} registros`)
      } catch (error) {
        console.warn("⚠️ Error al cargar entradas combustible:", error)
        allData.secciones.entradas_combustible = []
      }

      // 4. Registro Veterinario
      try {
        const veterinariosData = await listVeterinarians(token, userId, currentFarm.id, 1, 1000)
        allData.secciones.veterinarios = veterinariosData.data.items || []
        console.log(`✅ Veterinarios: ${allData.secciones.veterinarios.length} registros`)
      } catch (error) {
        console.warn("⚠️ Error al cargar veterinarios:", error)
        allData.secciones.veterinarios = []
      }

      // 5. Registro de Personal
      try {
        const personalData = await listStaff(token, userId, currentFarm.id, 1, 1000)
        allData.secciones.personal = personalData.data.items || []
        console.log(`✅ Personal: ${allData.secciones.personal.length} registros`)
      } catch (error) {
        console.warn("⚠️ Error al cargar personal:", error)
        allData.secciones.personal = []
      }

      // 6. Desratización
      try {
        const desratizacionData = await listDesratizacion(token, userId, currentFarm.id, 1, 1000)
        allData.secciones.desratizacion = desratizacionData.data.items || []
        console.log(`✅ Desratización: ${allData.secciones.desratizacion.length} registros`)
      } catch (error) {
        console.warn("⚠️ Error al cargar desratización:", error)
        allData.secciones.desratizacion = []
      }

      // 7. Desinsectación
      try {
        const desinsectacionData = await listDesinsectacion(token, userId, currentFarm.id, 1, 1000)
        allData.secciones.desinsectacion = desinsectacionData.data.items || []
        console.log(`✅ Desinsectación: ${allData.secciones.desinsectacion.length} registros`)
      } catch (error) {
        console.warn("⚠️ Error al cargar desinsectación:", error)
        allData.secciones.desinsectacion = []
      }

      // 8. Limpieza y Desinfección
      try {
        const limpiezaData = await listLimpiezaDesinfeccion(token, userId, currentFarm.id, 1, 1000)
        allData.secciones.limpieza_desinfeccion = limpiezaData.data.items || []
        console.log(`✅ Limpieza y Desinfección: ${allData.secciones.limpieza_desinfeccion.length} registros`)
      } catch (error) {
        console.warn("⚠️ Error al cargar limpieza y desinfección:", error)
        allData.secciones.limpieza_desinfeccion = []
      }

      // 9. Limpieza de Tuberías
      try {
        const tuberiasData = await listLimpiezaDesinfeccionTuberias(token, userId, currentFarm.id, 1, 1000)
        allData.secciones.limpieza_tuberias = tuberiasData.data.items || []
        console.log(`✅ Limpieza Tuberías: ${allData.secciones.limpieza_tuberias.length} registros`)
      } catch (error) {
        console.warn("⚠️ Error al cargar limpieza tuberías:", error)
        allData.secciones.limpieza_tuberias = []
      }

      // 10. Arco de Desinfección
      try {
        const arcoData = await listArcoDesinfeccion(token, userId, currentFarm.id, 1, 1000)
        allData.secciones.arco_desinfeccion = arcoData.data.items || []
        console.log(`✅ Arco Desinfección: ${allData.secciones.arco_desinfeccion.length} registros`)
      } catch (error) {
        console.warn("⚠️ Error al cargar arco desinfección:", error)
        allData.secciones.arco_desinfeccion = []
      }

      // 11. Recogida de Cadáveres
      try {
        const cadaveresData = await listRecogidaCadaveres(token, userId, currentFarm.id, 1, 1000)
        allData.secciones.recogida_cadaveres = cadaveresData.data.items || []
        console.log(`✅ Recogida Cadáveres: ${allData.secciones.recogida_cadaveres.length} registros`)
      } catch (error) {
        console.warn("⚠️ Error al cargar recogida cadáveres:", error)
        allData.secciones.recogida_cadaveres = []
      }

      // 12. Recogida de Residuos
      try {
        const residuosData = await listRecogidaResiduos(token, userId, currentFarm.id, 1, 1000)
        allData.secciones.recogida_residuos = residuosData.data.items || []
        console.log(`✅ Recogida Residuos: ${allData.secciones.recogida_residuos.length} registros`)
      } catch (error) {
        console.warn("⚠️ Error al cargar recogida residuos:", error)
        allData.secciones.recogida_residuos = []
      }

      // 13. Mantenimiento de Equipos
      try {
        const equiposData = await listMantenimientoEquipos(token, userId, currentFarm.id, 1, 1000)
        allData.secciones.mantenimiento_equipos = equiposData.data.items || []
        console.log(`✅ Mantenimiento Equipos: ${allData.secciones.mantenimiento_equipos.length} registros`)
      } catch (error) {
        console.warn("⚠️ Error al cargar mantenimiento equipos:", error)
        allData.secciones.mantenimiento_equipos = []
      }

      // 14. Mantenimiento de Instalaciones
      try {
        const instalacionesData = await listMantenimientoInstalaciones(token, userId, currentFarm.id, 1, 1000)
        allData.secciones.mantenimiento_instalaciones = instalacionesData.data.items || []
        console.log(`✅ Mantenimiento Instalaciones: ${allData.secciones.mantenimiento_instalaciones.length} registros`)
      } catch (error) {
        console.warn("⚠️ Error al cargar mantenimiento instalaciones:", error)
        allData.secciones.mantenimiento_instalaciones = []
      }

      // 15. Entrada de Lechones
      try {
        const lechonesData = await listEntradaLechones(token, userId, currentFarm.id, 1, 1000)
        allData.secciones.entrada_lechones = lechonesData.data.items || []
        console.log(`✅ Entrada Lechones: ${allData.secciones.entrada_lechones.length} registros`)
      } catch (error) {
        console.warn("⚠️ Error al cargar entrada lechones:", error)
        allData.secciones.entrada_lechones = []
      }

      // 16. Salida a Matadero
      try {
        const mataderoData = await listSalidaMatadero(token, userId, currentFarm.id, 1, 1000)
        allData.secciones.salida_matadero = mataderoData.data.items || []
        console.log(`✅ Salida Matadero: ${allData.secciones.salida_matadero.length} registros`)
      } catch (error) {
        console.warn("⚠️ Error al cargar salida matadero:", error)
        allData.secciones.salida_matadero = []
      }

      // 17. Baja de Animales
      try {
        const bajaData = await listBajaAnimales(token, userId, currentFarm.id, 1, 1000)
        allData.secciones.baja_animales = bajaData.data.items || []
        console.log(`✅ Baja Animales: ${allData.secciones.baja_animales.length} registros`)
      } catch (error) {
        console.warn("⚠️ Error al cargar baja animales:", error)
        allData.secciones.baja_animales = []
      }

      // 18. Etiquetas de Pienso
      try {
        const etiquetasData = await listEtiquetasPienso(token, userId, currentFarm.id, 1, 1000)
        allData.secciones.etiquetas_pienso = etiquetasData.data.items || []
        console.log(`✅ Etiquetas Pienso: ${allData.secciones.etiquetas_pienso.length} registros`)
      } catch (error) {
        console.warn("⚠️ Error al cargar etiquetas pienso:", error)
        allData.secciones.etiquetas_pienso = []
      }

      // 19. Descarga de Sacos de Pienso
      try {
        const sacosData = await listDescargaSacosPienso(token, userId, currentFarm.id, 1, 1000)
        allData.secciones.descarga_sacos_pienso = sacosData.data.items || []
        console.log(`✅ Descarga Sacos Pienso: ${allData.secciones.descarga_sacos_pienso.length} registros`)
      } catch (error) {
        console.warn("⚠️ Error al cargar descarga sacos pienso:", error)
        allData.secciones.descarga_sacos_pienso = []
      }

      // 20. Descarga de Pienso a Granel
      try {
        const granelData = await listDescargaPiensoGranel(token, userId, currentFarm.id, 1, 1000)
        allData.secciones.descarga_pienso_granel = granelData.data.items || []
        console.log(`✅ Descarga Pienso Granel: ${allData.secciones.descarga_pienso_granel.length} registros`)
      } catch (error) {
        console.warn("⚠️ Error al cargar descarga pienso granel:", error)
        allData.secciones.descarga_pienso_granel = []
      }

      // Generar CSV por secciones
      let csvContent = ""
      
      // Información de la granja
      csvContent += "=== INFORMACIÓN DE LA GRANJA ===\n"
      csvContent += `Nombre de la Granja,${currentFarm.farm_name}\n`
      csvContent += `REGA,${currentFarm.REGA}\n`
      csvContent += `Provincia,${currentFarm.province}\n`
      csvContent += `Localidad,${currentFarm.locality}\n`
      csvContent += `Dirección,${currentFarm.address}\n`
      csvContent += `Especie,${currentFarm.species}\n`
      csvContent += `Grupo,${currentFarm.groups}\n`
      csvContent += `\n\n`

      // Generar CSV para cada sección con datos
      for (const [seccionNombre, datos] of Object.entries(allData.secciones)) {
        const dataArray = datos as any[]
        if (dataArray && dataArray.length > 0) {
          csvContent += `=== ${seccionNombre.toUpperCase().replace(/_/g, " ")} ===\n`
          
          // Obtener todos los headers únicos
          const headers = Array.from(
            new Set(
              dataArray.flatMap(item => Object.keys(item))
            )
          ).filter(key => key !== 'collectionId' && key !== 'collectionName')
          
          csvContent += convertToCSV(dataArray, headers)
          csvContent += "\n\n"
        }
      }

      // Generar nombre de archivo con fecha y hora
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)
      const filename = `Export_${currentFarm.farm_name}_${timestamp}.csv`

      // Descargar archivo
      downloadCSV(csvContent, filename)

      setSnackbar({
        open: true,
        message: `✅ Datos exportados correctamente a ${filename}`,
        severity: "success",
      })

      console.log("✅ Exportación completada")
    } catch (error) {
      console.error("❌ Error al exportar datos:", error)
      setSnackbar({
        open: true,
        message: "Error al exportar los datos. Por favor, inténtalo de nuevo.",
        severity: "error",
      })
    } finally {
      setExporting(false)
    }
  }

  const handleExport = async (type: string) => {
    if (type === "csv") {
      await exportAllDataToCSV()
    } else {
      setSnackbar({
        open: true,
        message: `La exportación en formato ${type} estará disponible próximamente`,
        severity: "info",
      })
    }
  }

  const exportOptions = [
      
    {
      title: "Exportar CSV",
      description: "Descarga los datos en formato CSV para análisis",
      icon: <Description sx={{ fontSize: 48, color: "#0284c7" }} />,
      format: "csv",
    },
    {
      title: "Informe Completo",
      description: "Genera un informe detallado con gráficos y estadísticas",
      icon: <Assessment sx={{ fontSize: 48, color: "#7c3aed" }} />,
      format: "report",
    },
  ]

  return (
    <ThemeProvider theme={theme}>
      <Box>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            bgcolor: "primary.light",
            borderLeft: 4,
            borderColor: "primary.main",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FileDownload sx={{ fontSize: 40, color: "primary.main" }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: "primary.main" }}>
                Exportar Información
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Descarga y exporta los datos de tu granja en diferentes formatos
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Descripción */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            Selecciona el formato en el que deseas exportar la información de tu granja. 
            Puedes descargar registros completos, informes detallados o datos para análisis.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            <strong>Nota:</strong> La exportación incluirá todos los registros de la granja seleccionada
            actualmente. Asegúrate de tener seleccionada la granja correcta antes de exportar.
          </Typography>
        </Paper>

        {/* Opciones de exportación */}
        <Grid container spacing={3}>
          {exportOptions.map((option) => (
            <Grid item xs={12} md={6} key={option.format}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                  <Box sx={{ mb: 2 }}>
                    {option.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {option.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<FileDownload />}
                    onClick={() => handleExport(option.format)}
                    disabled={exporting}
                    sx={{
                      textTransform: "none",
                      px: 3,
                      py: 1,
                      bgcolor: "primary.main",
                      "&:hover": {
                        bgcolor: "#0f766e",
                      },
                    }}
                  >
                    {exporting ? "Exportando..." : "Exportar"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  )
}
