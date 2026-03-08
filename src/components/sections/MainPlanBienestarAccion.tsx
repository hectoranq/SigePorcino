import { useState } from "react";
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@mui/material";
import PlanBienestarAccionStep1 from "./PlanBienestarAccionStep1";
import PlanBienestarAccionStep2 from "./PlanBienestarAccionStep2";
import PlanBienestarAccionStep3 from "./PlanBienestarAccionStep3";
import PlanBienestarAccionStep4 from "./PlanBienestarAccionStep4";
import PlanBienestarAccionStep5 from "./PlanBienestarAccionStep5";
import PlanBienestarAccionStep6 from "./PlanBienestarAccionStep6";

const steps = [
  "Condiciones Generales",
  "Manejo y Personal",
  "Alimentación y Abrevado",
  "Material Manipulable",
  "Condiciones Ambientales",
  "Plan de Acción",
];

const MainPlanBienestarAccion = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: "primary.main" }}>
          Plan de Bienestar Animal y Plan de Acción
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Real Decreto 306/2020 - Complete todas las secciones para generar el plan de acción
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Box sx={{ mt: 3 }}>
        {activeStep === 0 && <PlanBienestarAccionStep1 onNext={handleNext} />}
        {activeStep === 1 && (
          <PlanBienestarAccionStep2 onNext={handleNext} onBack={handleBack} />
        )}
        {activeStep === 2 && (
          <PlanBienestarAccionStep3 onNext={handleNext} onBack={handleBack} />
        )}
        {activeStep === 3 && (
          <PlanBienestarAccionStep4 onNext={handleNext} onBack={handleBack} />
        )}
        {activeStep === 4 && (
          <PlanBienestarAccionStep5 onNext={handleNext} onBack={handleBack} />
        )}
        {activeStep === 5 && <PlanBienestarAccionStep6 onBack={handleBack} />}
      </Box>
    </Box>
  );
};

export default MainPlanBienestarAccion;
