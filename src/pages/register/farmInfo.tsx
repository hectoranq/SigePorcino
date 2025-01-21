import React, { useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import LocationSelector from "../../components/locationMap/locationMap";

const FarmInfo = ({ onChange }) => {
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

  const handleLocationChange = ({ lat, lng }) => {
    setFormData((prevData) => ({
      ...prevData,
      latitud: lat, 
      longitud: lng,
    }));
    onChange({
      ...formData,
      latitud: lat, 
      longitud: lng,
    });
  };
  

  return (
    <section className="form-grid-main">
      <TextField
        label="Nombre de la granja"
        variant="filled"
        name="farm_name"
        value={formData.farm_name}
        onChange={handleInputChange}
      />
      <section className="form-grid-2-cols">
        <TextField
          variant="filled"
          select
          label="País"
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
          label="Ciudad"
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
        name="address"
        value={formData.address}
        onChange={handleInputChange}
      />
      <section className="form-grid-2-cols">
        <TextField
          label="Código de país"
          variant="filled"
          name="phone_code"
          value={formData.phone_code}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Número de celular"
          variant="filled"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleInputChange}
        />
      </section>
      <LocationSelector onLocationChange={handleLocationChange} />
    </section>
  );
};

export default FarmInfo;
