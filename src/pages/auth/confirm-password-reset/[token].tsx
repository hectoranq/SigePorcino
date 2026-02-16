import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Typography, Divider, Snackbar, Alert, IconButton, InputAdornment } from '@mui/material';
import { ArrowBack, Close, Visibility, VisibilityOff } from '@mui/icons-material';
import MainIcon from '../../../assets/svgs/mainIconOne.svg';
import Image from 'next/image';
import PigImage from '../../../assets/img/sigeonline.jpg';
import { confirmPasswordReset } from '../../../action/RequestPasswordResetPocket';

const ConfirmPasswordReset = () => {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success'>('error');

  useEffect(() => {
    // Verificar que el token esté presente
    if (!token && router.isReady) {
      setErrorMessage('Token inválido o expirado');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [token, router.isReady]);

  const handleConfirmReset = async () => {
    // Validaciones
    if (!password || !passwordConfirm) {
      setErrorMessage('Por favor, completa todos los campos.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage('Las contraseñas no coinciden.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (password.length < 8) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!token) {
      setErrorMessage('Token inválido o expirado.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const result = await confirmPasswordReset(
        token as string,
        password,
        passwordConfirm
      );
      setSuccessMessage(result.message);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error: any) {
      console.error('Error al restablecer contraseña', error);
      setErrorMessage(error?.message || 'Error al restablecer la contraseña. Por favor, solicita un nuevo correo de recuperación.');
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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowPasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
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
          Nueva Contraseña
        </Typography>
        <Divider style={{ borderBottom: '6px solid #00A5CF', width: '20%', marginBottom: '16px', alignSelf: 'center' }} />
        
        <Typography variant="bodytext" gutterBottom style={{ textAlign: 'center', marginBottom: '32px' }}>
          Por favor, ingresa tu nueva contraseña.
        </Typography>

        <TextField
          id="new-password"
          label="Nueva Contraseña"
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

        <TextField
          id="confirm-password"
          label="Confirmar Nueva Contraseña"
          variant="filled"
          style={{ marginBottom: '32px' }}
          type={showPasswordConfirm ? 'text' : 'password'}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPasswordConfirm} edge="end" style={{ padding: 20 }}>
                  {showPasswordConfirm ? <VisibilityOff style={{ color: '#004E64' }} /> : <Visibility style={{ color: '#004E64' }} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button 
          variant="contained" 
          color="primary" 
          className="button" 
          onClick={handleConfirmReset}
          style={{ marginBottom: '16px' }}
          disabled={!token}
        >
          CAMBIAR CONTRASEÑA
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

export default ConfirmPasswordReset;
