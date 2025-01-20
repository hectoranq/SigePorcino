import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton, Modal } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const LocationSelector = () => {
  const [location, setLocation] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const handleClick = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const onMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setLat(lat);
    setLng(lng);
    setLocation({ lat, lng });
    setOpenModal(false); 
  };

  return (
    <div>
      <TextField
        label="Ubicación de la granja"
        variant="filled"
        style={{ marginBottom: '25px', width: '100%' }}
        value={location ? `Lat: ${lat}, Lng: ${lng}` : ''}
        onClick={handleClick}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClick}>
                <MapIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Modal con el mapa */}
      <Modal open={openModal} onClose={handleClose}>
        <div
          style={{
            width: '80%',
            height: '60%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <LoadScript googleMapsApiKey="AIzaSyA3CQQ6fazJiog3a3xpx8-UoXDHBVbAAsk">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={{ lat: 19.432608, lng: -99.133209 }}
              zoom={10}
              onClick={onMapClick}
            >
              {location && (
                <Marker position={location}>
                  <InfoWindow position={location}>
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
        </div>
      </Modal>
    </div>
  );
};

export default LocationSelector;
