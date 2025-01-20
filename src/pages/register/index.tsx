import { Button, Divider, Typography } from "@mui/material";
import { useRouter } from "next/router";
import PersonalInfo from "./personalInfo";
import FarmInfo from "./farmInfo";
import RegaInfo from "./regaInfo";


const Register = () => {
    const router = useRouter();

    const handleLogin = () => {
        router.push('/');
    };
    const handleGpsRegister = () => {
        router.push('/register/gpsRegister/paymentMethod');
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
        <Typography variant="bodySRegular" style={{fontSize:20}} gutterBottom>
            ¡Juntos vamos a llevar la gestión de tu granja a otro nivel!
        </Typography>
        <Typography variant="logintitle" gutterBottom style={{ fontSize:20}}>
            Cuéntanos sobre ti
        </Typography>
        <PersonalInfo />
        <Typography variant="logintitle" gutterBottom style={{fontSize:20}}>
            Cuéntanos sobre tu granja
        </Typography>
        <FarmInfo />
        <Typography variant="logintitle" gutterBottom style={{fontSize:20}}>
            Registra tu primer REGA
        </Typography>
        <RegaInfo />
        <section className="form-grid-2-cols">
            <Button variant="contained" color="primary" className="button-1" onClick={handleLogin}>
                Atrás
            </Button>
            <Button variant="contained" color="primary" className="button" onClick={handleGpsRegister}>
                Siguiente
            </Button>
        </section>
      </section>
    );
}

export default Register;
