import { useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Typography, Divider, Snackbar, Alert, IconButton } from '@mui/material';
import { ArrowBack, Close } from '@mui/icons-material';
import MainIcon from '../assets/svgs/mainIconOne.svg';
import Image from 'next/image';
import PigImage from '../assets/img/sigeonline.jpg';
import { requestPasswordReset } from '../action/RequestPasswordResetPocket';

const ResetPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success'>('error');

  const validateEmailFormat = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendEmail = async () => {
    if (!email) {
      setErrorMessage('Por favor, ingresa tu correo electrónico.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    if (!validateEmailFormat(email)) {
      setErrorMessage('Por favor, ingresa un correo electrónico válido.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    try {
      const result = await requestPasswordReset(email);
      setSuccessMessage(result.message);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      // Opcional: redirigir después de unos segundos
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error: any) {
      console.error('Error al enviar correo de recuperación', error);
      setErrorMessage(error?.message || 'Error al enviar el correo. Por favor, intenta nuevamente.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleBack = () => {
    router.push('/');
  };

  const handleClose = () => {
    router.push('/');
  };

  return (
    <section style={{ display: 'flex', flex: 1 }}>
      <article className="image-container" style={{ display: 'flex', flex: 2, height: '100vh', position: 'relative' }}>
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
          position: 'relative',
        }}
      >
        <IconButton
          onClick={handleBack}
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            backgroundColor: '#F5F5F5',
            borderRadius: '50%',
            padding: '12px',
          }}
        >
          <ArrowBack style={{ color: '#004E64' }} />
        </IconButton>
        <IconButton
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            backgroundColor: '#F5F5F5',
            borderRadius: '50%',
            padding: '12px',
          }}
        >
          <Close style={{ color: '#004E64' }} />
        </IconButton>

        <MainIcon width={175} height={184.65} style={{ alignSelf: 'center', marginBottom: '40px' }} />

        <Typography variant="logintitle" gutterBottom style={{ marginBottom: '4px', textAlign: 'center' }}>
          Cambio de Contraseña
        </Typography>
        <Divider style={{ borderBottom: '6px solid #00A5CF', width: '20%', marginBottom: '16px', alignSelf: 'center' }} />
        
        <Typography variant="bodytext" gutterBottom style={{ textAlign: 'center', marginBottom: '32px' }}>
          Por favor, ingresa tu correo electrónico. Te enviaremos un correo para restablecer tu contraseña.
        </Typography>

        <TextField
          id="email-reset"
          label="Correo electrónico"
          variant="filled"
          style={{ marginBottom: '32px' }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="yours@example.com"
        />

        <Button 
          variant="contained" 
          color="primary" 
          className="button" 
          onClick={handleSendEmail}
          style={{ marginBottom: '16px' }}
        >
          ENVIAR CORREO
        </Button>
      </section>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarSeverity === 'error' ? errorMessage : successMessage}
        </Alert>
      </Snackbar>
    </section>
  );
};

export default ResetPassword;
