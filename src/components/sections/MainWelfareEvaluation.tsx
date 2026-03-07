import { Box, Typography, Stepper, Step, StepLabel } from "@mui/material";
import { useState } from "react";

import WelfareEvaluationStep1 from "./WelfareEvaluationStep1";
import WelfareEvaluationStep2 from "./WelfareEvaluationStep2";
import WelfareEvaluationStep3 from "./WelfareEvaluationStep3";
import WelfareEvaluationStep4 from "./WelfareEvaluationStep4";

const steps = [
  "Ficha Descriptiva",
  "Factores de Riesgo",
  "Plan de Acción",
  "Seguimiento"
];

const MainWelfareEvaluation = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [evaluationId, setEvaluationId] = useState<string | null>(null);

  // Renderiza el contenido del paso actual
  let stepContent = null;
  if (activeStep === 0) {
    stepContent = (
      <WelfareEvaluationStep1 
        onNext={() => setActiveStep(1)} 
        evaluationId={evaluationId}
        setEvaluationId={setEvaluationId}
      />
    );
  } else if (activeStep === 1) {
    stepContent = (
      <WelfareEvaluationStep2 
        onNext={() => setActiveStep(2)} 
        onBack={() => setActiveStep(0)}
        evaluationId={evaluationId}
      />
    );
  } else if (activeStep === 2) {
    stepContent = (
      <WelfareEvaluationStep3 
        onNext={() => setActiveStep(3)} 
        onBack={() => setActiveStep(1)}
        evaluationId={evaluationId}
      />
    );
  } else {
    stepContent = (
      <WelfareEvaluationStep4 
        onNext={() => setActiveStep(3)} 
        onBack={() => setActiveStep(2)}
        evaluationId={evaluationId}
      />
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3, bgcolor: "background.default" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 500 }}>
          Evaluación de Bienestar Animal
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

export default MainWelfareEvaluation;
