import { useRouter } from 'next/router';
import MainIcon from '../assets/svgs/mainIcon.svg';
import { Typography, Button, TextField, FormControlLabel, Checkbox, Divider, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';

const Login = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const handleLogin = () => {
        router.push('/home');
    };
    const handleLogin1 = () => {
        router.push('/register');
    };
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return <section style={{ display: 'flex', flex: 1, }}>
        <article style={{ display: 'flex', flex: 2, height: '100vh', position: 'relative' }}>
            <img
                
                src={"https://s3-alpha-sig.figma.com/img/da13/45c1/3da60dd48a5b6aab7298c7e487c814f3?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=D-BYhChS5HdGdFpiQxrjj-t7VOT-3scycC0zs1FQNGLSX6tN26i7LSPr4156b5j58SHr5Tpv0dbD~S5MxX4QwDe9QdOFghfz~uIzwebPFJuNaBgqqrCkQgnxptih9kAi8Pd9PToC8byhnyLse5XIAqPULMzbWt1J6OjnMkpLO7rwFUT~75I6sbxPLA-eipsFwa5moSuEOE7bmlMH9SPhoE-ysYBN7e-yS5eq2PrHayE6XAJ86-zwA06x6yLuSIijwH8AdLHtEKpN6FKoaswXCwAFz1ls0q0EU0Kx4ug-3KQF-Y9ACWFwhAIO3HwfVIsVgPdokHrLEcmXHJ8Ms0LG0w__"}
                style={{
                    objectFit: 'cover',
                    objectPosition: 'center left',
                    width: '100%',
                    height: '100%'
                }}
            />
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#3E3F7266',
                zIndex: 1, 
            }} />
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
            <Divider 
                style={{ 
                    borderBottom: '6px solid #00A5CF', 
                    width: '20%',
                    marginBottom: '16px'
                }} 
            />
            <Typography variant="bodytext" gutterBottom>
                Para ingresar al sistema de gestión de porcinos debes ingresar tu usuario y contraseña.
            </Typography>
            <MainIcon width={151} height={184.65} style={{ alignSelf: 'center', marginTop: '40px', marginBottom: '30px' }} />
            <TextField
                id="filled-basic"
                label="Usuario"
                variant="filled"
                style={{ marginBottom: '16px' }}
            />
            <TextField
                    id="filled-basic"
                    label="Contraseña"
                    variant="filled"
                    style={{ marginBottom: '16px' }}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                    style={{ padding: 20 }}
                                >
                                    {showPassword ? (
                                        <VisibilityOff style={{ color: '#004E64' }} />
                                    ) : (
                                        <Visibility style={{ color: '#004E64' }} />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            <section style={{ display: 'flex', alignSelf: 'end', marginBottom: '8px'}}>
                <Typography variant="bodySRegular" gutterBottom>
                    ¿Olvidaste tu contraseña?
                </Typography>
            </section>
            <section style={{ display: 'flex', alignSelf: 'center', marginBottom: '16px' }}>
                <FormControlLabel 
                    control={<Checkbox defaultChecked />} 
                    label={
                    <Typography variant="bodySRegular">
                        Recordar usuario y contraseña
                    </Typography>
                    } 
                />
            </section>
            <Button variant="contained" color="primary" className="button" onClick={handleLogin} style={{ marginBottom: '16px' }}>
                Iniciar sesión
            </Button>
            <Button variant="contained" color="primary" className="button-1" onClick={handleLogin1}>
                Registrarme
            </Button>
        </section>
    </section>
}

export default Login;
