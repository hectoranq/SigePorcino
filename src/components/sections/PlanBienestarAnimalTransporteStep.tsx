import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { Info } from "@mui/icons-material";
import { buttonStyles } from "./buttonStyles";

interface TransporteStepProps {
  onNext: () => void;
  onBack: () => void;
}

const PlanBienestarAnimalTransporteStep: React.FC<TransporteStepProps> = ({
  onNext,
  onBack,
}) => {
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
          Plan de Bienestar Animal – Transporte
        </Typography>

        <Box
          sx={{
            bgcolor: "info.lighter",
            border: "1px solid",
            borderColor: "info.light",
            borderRadius: 2,
            p: 3,
            display: "flex",
            gap: 2,
          }}
        >
          <Info color="info" sx={{ mt: 0.5 }} />
          <Box>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              Se asegurará que los animales que van a ser transportados han sido
              examinados y son aptos para el transporte. En el plan de bienestar animal
              se incluirá la persona encargada para esta tarea, sin perjuicio de los
              controles veterinarios que sean pertinentes de acuerdo con la normativa
              vigente. En el apartado de equipamiento se incluye una mención a las rampas
              para asegurar un manejo adecuado de los animales durante la carga.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button variant="outlined" onClick={onBack} sx={buttonStyles.cancel}>
            Atrás
          </Button>
          <Button variant="contained" onClick={onNext} sx={buttonStyles.primary}>
            Siguiente
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PlanBienestarAnimalTransporteStep;
