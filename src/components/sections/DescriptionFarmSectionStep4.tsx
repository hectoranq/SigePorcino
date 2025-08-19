import { useState } from "react"
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

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const DescriptionFarmSectionStep4: React.FC<Props> = ({ onBack }) => {
     const [barrasLed, setBarrasLed] = useState(false)
  const [addOption, setAddOption] = useState(false)
  const [waterEnergyConsumption, setWaterEnergyConsumption] = useState("")
  const [renewableEnergy, setRenewableEnergy] = useState("")
  const [rainwaterUse, setRainwaterUse] = useState("")
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
          <Box sx={{ display: "flex", gap: 4 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={barrasLed}
                  onChange={(e) => setBarrasLed(e.target.checked)}
                  sx={{ color: "#64748b", "&.Mui-checked": { color: "#0d9488" } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: "#475569" }}>
                  Barras Led
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={addOption}
                  onChange={(e) => setAddOption(e.target.checked)}
                  sx={{ color: "#64748b", "&.Mui-checked": { color: "#06b6d4" } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: "#06b6d4" }}>
                  Añadir otra opción
                </Typography>
              }
            />
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
              placeholder="Producción anual estimada de estiércoles"
              variant="filled"
              
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Tamaño y tipo de fosa en las naves"
              variant="filled"
              
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Frecuencia de vaciado del purín"
             variant="filled"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Sistema de recogida de estiércoles a almacenamiento"
             variant="filled"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Sistema de almacenamiento de estiércoles (líquidos)"
              variant="filled"
             
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Sistema de almacenamiento de estiércoles (sólidos)"
              variant="filled"
              
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Valorización agronómica de los estiércoles (y%)"
              variant="filled"
              
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Tratamiento autorizado de estiércoles (y%)"
              variant="filled"

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
              placeholder="Observaciones"
              variant="filled"
              
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
              placeholder="Observaciones"
              variant="filled"
             
            />
          </Box>
        </Box>
      </Box>

        <section className="form-grid-2-cols">
                    <Button
                      variant="outlined"
                      color="secondary"
                      className="btnatras"
                      sx={{ mr: 2 }}
                       onClick={onBack}
                    >
                      Atras
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      className="btnsiguiente"
                      
                    >
                      Finalizar
                    </Button>
                  </section>
    </Box>
  )
}


export default DescriptionFarmSectionStep4;