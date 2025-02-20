import Image from 'next/image';
import RegisterImage from '../../../assets/img/sigeRegister.jpg';

import { Button, Divider, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/router';

const FarmRegister = () => {
  const router = useRouter();
    const [formData ] = useState({
      farm_name: "",
      country: "",
      city: "",
      address: "",
      phone_code: "",
      phone_number: "",
      latitud: null,
      longitud: null,
    });
    const handleIndexRegister = () => {
      router.push("/register");
    };
    const handlepaymentMethod = () => {
      router.push("/register/gpsRegister/paymentMethod");
    };
  return (
    <section style={{ display: 'flex', height: '100vh' }}>
      <article style={{ flex: 0.75, position: 'relative' }}>
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
          justifyContent: 'center',
          padding: '5% 2%',
          backgroundColor: 'white',
        }}
      >
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
            width: "10%",
            marginBottom: "20px",
          }}
        />
        <Typography variant="bodySRegular" style={{ fontSize: 16 }} gutterBottom>
          Coméntanos un poco sobre tu granja antes de comenzar
        </Typography>
        <Typography variant="logintitle" gutterBottom style={{ fontSize: 24 }}>
          Cuéntanos sobre tu granja
        </Typography>
        <section className="form-grid-main" >
          <TextField
            label="R.E.G.A."
            variant="filled"
            name="farm_name"
            value={formData.farm_name}
            // onChange={handleInputChange}
          />
          <TextField
            label="Nombre de la granja"
            variant="filled"
            name="farm_name"
            value={formData.farm_name}
            // onChange={handleInputChange}
          />
          <TextField
              variant="filled"
              select
              label="Localidad"
              name="country"
              value={formData.country}
              // onChange={handleCountryChange}
          />
          <TextField
              variant="filled"
              select
              label="Provincia"
              name="country"
              value={formData.country}
              // onChange={handleCountryChange}
          />
          <TextField
            label="Dirección de la granja"
            variant="filled"
            name="farm_name"
            value={formData.farm_name}
            // onChange={handleInputChange}
          />
          <section className="form-grid-2-cols">
            <TextField
              variant="filled"
              select
              label="Especie"
              name="country"
              value={formData.country}
              // onChange={handleCountryChange}
            />
            <TextField
              variant="filled"
              select
              label="Grupo"
              name="city"
              value={formData.city}
              // onChange={handleCityChange}
            //   disabled={!formData.country}
            />
          </section>
          <TextField
            label="Clasificación zootécnica"
            variant="filled"
            name="farm_name"
            value={formData.farm_name}
            // onChange={handleInputChange}
          />
          <TextField
            label="Cualificación sanitaria"
            variant="filled"
            name="farm_name"
            value={formData.farm_name}
            // onChange={handleInputChange}
          />
          <section className="form-grid-2-cols" style={{paddingTop:30}}>
              <Button
                variant="contained"
                color="secondary"
                className="button-1"
                onClick={handleIndexRegister}
              >
                Atrás
              </Button>
              <Button
                variant="contained"
                color="primary"
                className="button"
                onClick={handlepaymentMethod}
              >
                Siguiente
              </Button>
          </section>
        </section>
      </section>
    </section>
  );
};

export default FarmRegister;
