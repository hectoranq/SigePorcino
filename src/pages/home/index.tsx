import { Button } from "@mui/material";
import { useRouter } from "next/router";

const Home = () => {
    const router = useRouter();
    
    const handleLogin = () => {
        router.push('/');
    };
    return (
      <section className="container" >
        <h1>Página Principal</h1>
            <p>¡Bienvenido a Home!</p>
          <Button variant="contained" color="primary" className="button-1" onClick={handleLogin}>
              Regresar a Login
          </Button>
      </section >
      
    );
}

export default Home;
