import { useRouter } from "next/router";
import { useState } from "react";
import PersonalInfo from "./personalInfo";
import FarmInfo from "./farmInfo";
import RegaInfo from "./regaInfo";
import { registerUser, saveFarm, saveRega } from "../../data/repository";
import { Snackbar, Alert, Typography, Divider, Button } from "@mui/material";

const Register = () => {
  const router = useRouter();

  const [personalData, setPersonalData] = useState({});
  const [farmData, setFarmData] = useState({});
  const [regaData, setRegaData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleRegister = async () => {
    try {
      const userResponse = await registerUser(personalData);
      const userId = userResponse.id;

      const farmResponse = await saveFarm({ ...farmData, owner: userId });
      const farmId = farmResponse.id;

      await saveRega({ ...regaData, farm: farmId });

      router.push({
        pathname: "/register/gpsRegister/paymentMethod",
        query: { userId: userId },
      });
    } catch (error) {
      console.error("Error en el registro:", error);

      if (
        error.response?.data?.data?.email?.code === "validation_not_unique"
      ) {
        setErrorMessage("El correo electrónico ya se encuentra registrado.");
      } else {
        setErrorMessage("Ocurrió un error durante el registro. Por favor, intenta nuevamente.");
      }

      setOpenSnackbar(true);
    }
  };

  const handleLogin = () => {
    router.push("/");
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <section className="container">
      <Typography
        variant="logintitle"
        gutterBottom
        style={{ marginBottom: "2px" }}
      >
        Registro
      </Typography>
      <Divider
        style={{
          borderBottom: "6px solid #00A5CF",
          width: "6%",
          marginBottom: "32px",
        }}
      />
      <Typography variant="bodySRegular" style={{ fontSize: 20 }} gutterBottom>
        ¡Juntos vamos a llevar la gestión de tu granja a otro nivel!
      </Typography>
      <Typography variant="logintitle" gutterBottom style={{ fontSize: 20 }}>
        Cuéntanos sobre ti
      </Typography>
      <PersonalInfo onChange={setPersonalData} />
      <Typography variant="logintitle" gutterBottom style={{ fontSize: 20 }}>
        Cuéntanos sobre tu granja
      </Typography>
      <FarmInfo onChange={setFarmData} />
      <Typography variant="logintitle" gutterBottom style={{ fontSize: 20 }}>
        Registra tu primer REGA
      </Typography>
      <RegaInfo onChange={setRegaData} />
      <section className="form-grid-2-cols">
        <Button
          variant="contained"
          color="secondary"
          className="button-1"
          onClick={handleLogin}
        >
          Atrás
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="button"
          onClick={handleRegister}
        >
          Siguiente
        </Button>
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

export default Register;
