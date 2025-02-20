import React, { useState } from "react";
import { TextField, MenuItem, FormControlLabel, Checkbox, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";

const EmpresaInfoBox = ({ onChange }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    farm_name: "",
    country: "",
    city: "",
    address: "",
    phone_code: "",
    phone_number: "",
    latitud: null,
    longitud: null,
  });

  const data = [
    { country: { value: "BO", label: "Bolivia", code: "+591" }, cities: ["La Paz", "Santa Cruz", "Cochabamba"] },
    { country: { value: "PE", label: "Perú", code: "+51" }, cities: ["Lima", "Cusco", "Arequipa"] },
  ];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    onChange({ ...formData, [name]: value });
  };

  const handleCountryChange = (event) => {
    const countryValue = event.target.value;
    const countryData = data.find((item) => item.country.value === countryValue);
    setFormData((prevData) => ({
      ...prevData,
      country: countryValue,
      phone_code: countryData ? countryData.country.code : "",
      city: "",
    }));
    onChange({
      ...formData,
      country: countryValue,
      phoneCode: countryData ? countryData.country.code : "",
      city: "",
    });
  };

  const handleCityChange = (event) => {
    const cityValue = event.target.value;
    setFormData((prevData) => ({ ...prevData, city: cityValue }));
    onChange({ ...formData, city: cityValue });
    };
    const handleLogin = () => {
      router.push("/");
    };
    const handleFarmRegister = () => {
      router.push("/register/gpsRegister");
    };

  return (
    <section className="form-grid-main" >
      <TextField
        label="CIF"
        variant="filled"
        name="farm_name"
        value={formData.farm_name}
        onChange={handleInputChange}
      />
      <TextField
        label="Nombre de la empresa"
        variant="filled"
        name="farm_name"
        value={formData.farm_name}
        onChange={handleInputChange}
      />
      <section className="form-grid-2-cols" style={{ display: 'grid', gridTemplateColumns: '0.8fr 2fr', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
        <TextField
            label="Código postal"
            variant="filled"
            name="phone_code"
            value={formData.phone_code}
            InputProps={{ readOnly: true }}
        />
        <TextField
            label="Número de teléfono"
            variant="filled"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
        />
      </section>
      <section className="form-grid-2-cols">
        <TextField
          variant="filled"
          select
          label="Localidad"
          name="country"
          value={formData.country}
          onChange={handleCountryChange}
        >
          {data.map((item) => (
            <MenuItem key={item.country.value} value={item.country.value}>
              {item.country.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          variant="filled"
          select
          label="Provincia"
          name="city"
          value={formData.city}
          onChange={handleCityChange}
        //   disabled={!formData.country}
        >
          {data
            .find((item) => item.country.value === formData.country)
            ?.cities.map((city, index) => (
              <MenuItem key={index} value={city}>
                {city}
              </MenuItem>
            ))}
        </TextField>
      </section>
      <TextField
        label="Dirección"
        variant="filled"
        name="farm_name"
        value={formData.farm_name}
        onChange={handleInputChange}
      />
      <TextField
        label="Correo electrónico"
        variant="filled"
        name="farm_name"
        value={formData.farm_name}
        onChange={handleInputChange}
      />
      <TextField
        label="Contraseña"
        variant="filled"
        name="farm_name"
        value={formData.farm_name}
        onChange={handleInputChange}
      />
      <TextField
        label="Confirmar contraseña"
        variant="filled"
        name="farm_name"
        value={formData.farm_name}
        onChange={handleInputChange}
      />
      <FormControlLabel
              control={<Checkbox defaultChecked />}
              label={<Typography variant="bodySRegular">Acepto los términos y condiciones</Typography>}
              style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
      />
      <section className="form-grid-2-cols">
          <Button
            variant="contained"
            color="secondary"
            className="button-1"
            onClick={handleLogin}
          >
            Ya tengo una cuenta
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="button"
            onClick={handleFarmRegister}
          >
            Siguiente
          </Button>
        </section>
    </section>
  );
};

export default EmpresaInfoBox;
