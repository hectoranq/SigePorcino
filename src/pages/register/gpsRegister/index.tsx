import React, { useState } from 'react';
import { Button, Divider, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const GpsRegister = () => {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const handleRegister = () => {
    router.push('/register');
  };

  const handlePaymentMethod = () => {
    router.push('/register/gpsRegister/paymentMethod');
  };

  const onMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setLat(lat);
    setLng(lng);
    setSelectedLocation({ lat, lng });
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
          marginBottom: '32px',
        }}
      />
      <Typography variant="bodySRegular" style={{ fontSize: 20 }} gutterBottom>
        Ayúdanos a localizar la ubicación exacta de tu granja
      </Typography>
      <Typography variant="logintitle" gutterBottom style={{ fontSize: 20 }}>
        ¿Dónde se ubica tu granja?
      </Typography>

      <LoadScript googleMapsApiKey="AIzaSyA3CQQ6fazJiog3a3xpx8-UoXDHBVbAAsk">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '400px', marginBottom: '30px'}}
          center={{ lat: 19.432608, lng: -99.133209 }} // Coordenadas iniciales
          zoom={10}
          onClick={onMapClick}
        >
          {selectedLocation && (
            <Marker position={selectedLocation}>
              <InfoWindow position={selectedLocation}>
                <div>
                  <h3>Ubicación seleccionada</h3>
                  <p>Latitud: {lat}</p>
                  <p>Longitud: {lng}</p>
                </div>
              </InfoWindow>
            </Marker>
          )}
        </GoogleMap>
      </LoadScript>

      <section className="form-grid-main">
        <section className="form-grid-2-cols">
          <Button variant="contained" color="primary" className="button-1" onClick={handleRegister}>
            Atrás
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="button"
            onClick={() => {
              if (lat && lng) {
                // Aquí puedes guardar las coordenadas lat y lng
                handlePaymentMethod();
              } else {
                alert('Por favor, selecciona una ubicación');
              }
            }}
          >
            Siguiente
          </Button>
        </section>
      </section>
    </section>
  );
};

export default GpsRegister;
