import { Box, Typography, Stepper, Step, StepLabel } from "@mui/material";
import { useState } from "react";
import PlanBienestarAnimalEquipamientoStep from "./PlanBienestarAnimalEquipamientoStep";
import PlanBienestarAnimalEutanasiaStep from "./PlanBienestarAnimalEutanasiaStep";
import PlanBienestarAnimalTransporteStep from "./PlanBienestarAnimalTransporteStep";
import PlanBienestarAnimalMutilacionesStep from "./PlanBienestarAnimalMutilacionesStep";

const steps = ["Equipamiento", "Eutanasia", "Transporte", "Mutilaciones"];

const MainPlanBienestarAnimal = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Renderiza el contenido del paso actual
  let stepContent = null;
  if (activeStep === 0) {
    stepContent = (
      <PlanBienestarAnimalEquipamientoStep onNext={() => setActiveStep(1)} />
    );
  } else if (activeStep === 1) {
    stepContent = (
      <PlanBienestarAnimalEutanasiaStep
        onNext={() => setActiveStep(2)}
        onBack={() => setActiveStep(0)}
      />
    );
  } else if (activeStep === 2) {
    stepContent = (
      <PlanBienestarAnimalTransporteStep
        onNext={() => setActiveStep(3)}
        onBack={() => setActiveStep(1)}
      />
    );
  } else {
    stepContent = (
      <PlanBienestarAnimalMutilacionesStep
        onNext={() => setActiveStep(0)}
        onBack={() => setActiveStep(2)}
      />
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3, bgcolor: "background.default" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 500 }}>
          Plan de Bienestar Animal
        </Typography>

        {/* Progress Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Form Content */}
        {stepContent}
      </Box>
    </Box>
  );
};

export default MainPlanBienestarAnimal;
