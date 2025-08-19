import { Box, Typography, Stepper, Step, StepLabel } from "@mui/material";
import { useState } from "react";


import DescriptionFarmSectionStep1 from "./DescriptionFarmSectionStep1";
import DescriptionFarmSectionStep2 from "./DescriptionFarmSectionStep2";
import DescriptionFarmSectionStep3 from "./DescriptionFarmSectionStep3";
import DescriptionFarmSectionStep4 from "./DescriptionFarmSectionStep4";
const steps = [
  "Datos generales",
  "Infraestructura",
  "Personal",
  "Finalizar"
];

const MainDescriptionFarm = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Renderiza el contenido del paso actual
  let stepContent = null;
  if (activeStep === 0) {
    stepContent = <DescriptionFarmSectionStep1 onNext={() => setActiveStep(1)} />;
  } else if (activeStep === 1) {
    stepContent = <DescriptionFarmSectionStep2 onNext={() => setActiveStep(2)} onBack={() => setActiveStep(0)} />;
  }else if (activeStep === 2) {
    stepContent = <DescriptionFarmSectionStep3 onNext={() => setActiveStep(3)} onBack={() => setActiveStep(1)} />;
  }
  else {
    stepContent = <DescriptionFarmSectionStep4 onNext={() => setActiveStep(3)} onBack={() => setActiveStep(1)} />;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3, bgcolor: "background.default" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 500 }}>
          Información de la granja
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

export default MainDescriptionFarm;