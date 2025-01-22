import { Button, CircularProgress, Divider, Typography, Snackbar, Alert } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import RadioCard from "../../../../components/card/radioCard";
import { fetchPlans, postPaymentRecord } from "../../../../data/repository";
import FileUpload from "../../../../components/fileUpload/fileUpload";

const PaymentMethod = () => {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { userId } = router.query;

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await fetchPlans();
        setPlans(data);
      } catch (error) {
        console.error("Error al cargar los planes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  const handleRegister = () => {
    router.push('/register');
  };

  const handleLogin = () => {
    router.push('/');
  };

  const handleCardSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedPlanId || !selectedFile) {
      alert("Por favor, selecciona un plan y un archivo.");
      return;
    }
  
    if (typeof userId !== 'string') {
      console.error('El userId debe ser una cadena de texto.');
      return;
    }
  
    const data = new FormData();
    data.append("user_id", userId);
    data.append("plan_id", selectedPlanId); 
    data.append("file", selectedFile); 
  
    try {
      const response = await postPaymentRecord(data);
      console.log('Respuesta del servidor:', response);
      handleLogin();
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      setErrorMessage("Ocurrió un error al registrar tu plan. Por favor, intenta nuevamente.");
      setOpenSnackbar(true); 
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <section className="container">
      <Typography variant="logintitle" gutterBottom style={{ marginBottom: '2px' }}>
        Registro
      </Typography>
      <Divider 
        style={{ 
          borderBottom: '6px solid #00A5CF', 
          width: '6%',
          marginBottom: '32px'
        }} 
      />
      <Typography variant="bodySRegular" style={{ fontSize: 20 }} gutterBottom>
        ¡Ya casi terminamos! Elige un plan y el método de pago de tu preferencia
      </Typography>
      <Typography variant="logintitle" gutterBottom style={{ fontSize: 20 }}>
        Selecciona un plan
      </Typography>

      {loading ? (
        <Typography variant="bodySRegular" style={{ fontSize: 18 }}>
          <CircularProgress color="secondary" />
        </Typography>
      ) : (
        <section className="form-grid-3-cols">
          {plans.map((plan) => (
            <RadioCard
              key={plan.id}
              plan={plan}
              isSelected={plan.id === selectedPlanId}
              onSelect={handleCardSelect}
            />
          ))}
        </section>
      )}

      <Typography variant="logintitle" gutterBottom style={{ fontSize: 20, marginTop: '24px' }}>
        Método de pago
      </Typography>
      <Typography variant="bodySRegular" style={{ fontSize: 20, marginBottom: '25px' }} gutterBottom>
        Debes realizar una transferencia a la cuenta 
        <span style={{ fontWeight: 'bold' }}> 15133364884 </span> 
        del Banco Santander al Nombre 
        <span style={{ fontWeight: 'bold' }}> Juan José Torrez Galindo </span> 
        y cargar el comprobante.
      </Typography>
      <FileUpload onFileChange={handleFileChange}/>

      <section className="form-grid-main">
        <section className="form-grid-2-cols">
          <Button variant="contained" color="secondary" className="button-1" onClick={handleRegister}>
            Atrás
          </Button>
          <Button variant="contained" color="primary" className="button" onClick={handleSubmit}>
            Finalizar
          </Button>
        </section>
      </section>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </section>
  );
};

export default PaymentMethod;
