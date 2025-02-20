import { useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Typography, Divider, InputAdornment, IconButton, Checkbox, FormControlLabel, Snackbar, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import MainIcon from '../assets/svgs/mainIconOne.svg';
import { login } from '../data/repository';
import Image from 'next/image';
import PigImage from '../assets/img/sigeonline.jpg';

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await login({ identity: email, password });
      console.log('Login exitoso', response);
      router.push('/home');
    } catch (error) {
      console.error('Error de autenticación', error);
      setErrorMessage('Inicio de sesión incorrecto. Por favor, verifica tus credenciales.');
      setSnackbarOpen(true);
    }
  };

  const handleLogin1 = () => {
    router.push('/register');
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <section style={{ display: 'flex', flex: 1 }}>
      <article style={{ display: 'flex', flex: 2, height: '100vh', position: 'relative' }}>
      <Image
          src={PigImage}
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
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100vh',
          paddingLeft: '9%',
          paddingRight: '10%',
          backgroundColor: 'white',
        }}
      >
        <Typography variant="logintitle" gutterBottom style={{ marginBottom: '4px' }}>
          Iniciar sesión
        </Typography>
        <Divider style={{ borderBottom: '6px solid #00A5CF', width: '20%', marginBottom: '16px' }} />
        <Typography variant="bodytext" gutterBottom>
          Para ingresar al sistema de gestión de porcinos debes ingresar tu usuario y contraseña.
        </Typography>
        <MainIcon width={175} height={184.65} style={{ alignSelf: 'center', marginTop: '40px', marginBottom: '30px' }} />
        <TextField
          id="filled-basic"
          label="Correo electrónico"
          variant="filled"
          style={{ marginBottom: '16px' }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="filled-basic"
          label="Contraseña"
          variant="filled"
          style={{ marginBottom: '16px' }}
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end" style={{ padding: 20 }}>
                  {showPassword ? <VisibilityOff style={{ color: '#004E64' }} /> : <Visibility style={{ color: '#004E64' }} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <section style={{ display: 'flex', alignSelf: 'end', marginBottom: '8px' }}>
          <Typography variant="bodySRegular" gutterBottom>
            ¿Olvidaste tu contraseña?
          </Typography>
        </section>
        <section style={{ display: 'flex', alignSelf: 'start', marginBottom: '16px' }}>
          <FormControlLabel control={<Checkbox defaultChecked />} label={<Typography variant="bodySRegular">Recordar usuario y contraseña</Typography>} />
        </section>
        <Button variant="contained" color="primary" className="button" onClick={handleLogin} style={{ marginBottom: '16px' }}>
          Iniciar sesión
        </Button>
        <Button variant="contained" color="secondary" className="button-1" onClick={handleLogin1}>
          Registrarme
        </Button>
      </section>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </section>
  );
};

export default Login;
