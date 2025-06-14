import { Button, CircularProgress, Divider, Typography, Snackbar, Alert, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import RadioCard from "../../../../components/card/radioCard";
import { fetchPlans, postPaymentRecord } from "../../../../data/repository";
import FileUpload from "../../../../components/fileUpload/fileUpload";
import Image from 'next/image';
import RegisterImage from '../../../../assets/img/sigeRegister.jpg';
import useUserFormStore from "../../../../_store/index"; // Ajusta la ruta si es necesario
import usePersonalInfoStore from "../../../../_store/personal"; // Ajusta la ruta si es necesario
import useFarmFormStore from "../../../../_store/farm"; // Ajusta la ruta si es necesario
import { registerCompany } from "../../../../action/registerCompany"; // Ajusta la ruta si es necesario
import { registerFarm } from "../../../../action/registerFarm";
import { registerPayment } from "../../../../action/registerPayment";

const PaymentMethod = () => {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);

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
    router.push('/register/gpsRegister');
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

  localStorage.removeItem('last_user_id');

  const handleSubmit = async () => {
    const registroTipo = localStorage.getItem('registro_tipo');
    console.log("Tipo:", registroTipo);

    if (registroTipo === "empresa") {
     

      if (!selectedPlanId || !selectedFile) {
        alert("Por favor, selecciona un plan y un archivo.");
        return;
      }
       const companyData = useUserFormStore.getState().formData;
      console.log("Datos de empresa:", companyData);
      // Convertir companyData a FormData
      const formData = new FormData();
      Object.entries(companyData).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      const farmData = useFarmFormStore.getState().formData;
      console.log("Datos de granja:", farmData);
      const formDataFarm = new FormData();
      Object.entries(farmData).forEach(([key, value]) => {
        formDataFarm.append(key, value as string);
      });
      // Llamar a registerCompany

      let userId = localStorage.getItem('last_user_id');
      let user = null;

      try {

        if (!userId) {
            user = await registerCompany(formData);
            if (!user.success) {
              console.error("Error al registrar la empresa:", user.message);
              setOpenSnackbar(true);
              setErrorMessage("Error al guardar datos:"+user.message || "Error al registrar la empresa");
              return;
            }
            userId = user.data.id;
            localStorage.setItem('last_user_id', userId);
        }
      
        await registerFarm(formDataFarm, user.data.id);
        // Aquí puedes continuar con el flujo (por ejemplo, mostrar éxito o navegar)
        const file = selectedFile;
        await registerPayment({ user_id: userId, plan_id: selectedPlanId, file });
        setSuccessMessage("¡Registro exitoso!");
        setOpenSuccessSnackbar(true);
        router.push('/'); // Si quieres redirigir después, puedes poner un setTimeout
      } catch (error) {
        console.error("Error al registrar empresa:", error);
      }


    } else if (registroTipo === "persona_fisica") {
      const personData = usePersonalInfoStore.getState().formData;
      console.log("Datos de persona física:", personData);
    } else {
      console.log("Tipo de registro no definido en localStorage.");
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <section style={{ display: 'flex', height: '100vh', flexDirection: 'row'}}>
      <article className="image-container" style={{ flex: 0.75, position: 'relative' }}>
        <Image
          src={RegisterImage}
          alt="Pig"
          layout="fill"
          objectFit="cover"
          objectPosition="center left"
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#3E3F7233',
            zIndex: 1,
          }}
        />
      </article>
      <section
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          padding: '2% 2%',
          backgroundColor: 'white',
          overflowY: 'auto',
          height: '100vh', 
        }}
      >
        <Typography variant="logintitle" gutterBottom style={{ marginBottom: '2px' }}>
        Registro
      </Typography>
      <Divider 
        style={{ 
          borderBottom: '6px solid #00A5CF', 
          width: '6%',
          marginBottom: '5px'
        }} 
      />

      <Typography variant="logintitle" gutterBottom style={{ fontSize: 24 }}>
        ¡Ya casi terminamos! Elige un plan y el método de pago que prefieras
      </Typography>
      <Typography variant="bodySRegular" style={{ fontSize: 16 ,marginBottom: '20px' }} gutterBottom>
        Selecciona un plan de tu preferencia
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

      <Typography variant="logintitle" gutterBottom style={{ fontSize: 20 }}>
        Método de pago
      </Typography>
      <Typography variant="bodySRegular" style={{ fontSize: 20, marginBottom: '20px',lineHeight: 1.5 }} gutterBottom>
        Debes realizar una transferencia a la cuenta 
        <span style={{ fontWeight: 'bold' }}> 15133364884 </span> 
        del Banco Santander al Nombre 
        <span style={{ fontWeight: 'bold' }}> Juan José Torrez Galindo </span> 
        y cargar el comprobante.
      </Typography>
      <FileUpload onFileChange={handleFileChange}/>
      <Typography variant="bodySRegular" style={{ fontSize: 16 ,marginBottom: '10px', marginTop:'10px' }} gutterBottom>
        ¿Tienes un cupón de descuento? (Opcional)
      </Typography>
      <TextField
        label="Código de cupón"
        variant="filled"
        name="farm_name"
        // value={formData.farm_name}
        // onChange={handleInputChange}
      />
      <section className="form-grid-main">
        <section className="form-grid-2-cols">
          <Button variant="contained" color="secondary" className="button-1" onClick={handleRegister}>
            Atrás
          </Button>
          <Button variant="contained" color="primary" className="button" onClick={handleSubmit}>
            Finalizar registro
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
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSuccessSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      </section>
    </section>
  );
};

export default PaymentMethod;
