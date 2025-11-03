import React, { useState, useEffect } from "react";
import { TextField, MenuItem, FormControlLabel, Checkbox, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import { fetchParameters, emailExistsValidate } from "../../data/repository";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import usePersonalStore from "../../_store/personal";

const PersonalInfoBox = () => {
  const router = useRouter();
  const setPersonalFormData = usePersonalStore((state) => state.setFormData);

  const [formData, setFormData] = useState({
    dni: "",
    name: "",
    surname: "",
    locality: "", // Campo libre de texto
    province: "", // Campo select (dropdown)
    address: "",
    postal_code: "",
    phone_code: "",
    email: "",
    password: "",
    passwordConfirm: "",
    accept_terms: false
  });

  // Estado para provincias
  const [provincias, setProvincias] = useState([]);
  
  useEffect(() => {
    // Cargar solo las provincias
    fetchParameters().then(setProvincias);
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = () => {
    router.push("/");
  };

  const handleFarmRegister = () => {
    setPersonalFormData(formData);
    localStorage.setItem('registro_tipo', 'persona_fisica');
    router.push("/register/gpsRegister");
  };

  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validatePassword = (password: string) => {
    // Al menos una mayúscula, un número y mínimo 8 caracteres
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const validateEmailFormat = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    if (formData.password && !validatePassword(formData.password)) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.");
    } else {
      setPasswordError("");
    }
    if (formData.passwordConfirm && formData.password !== formData.passwordConfirm) {
      setPasswordConfirmError("Las contraseñas no coinciden.");
    } else {
      setPasswordConfirmError("");
    }
  }, [formData.password, formData.passwordConfirm]);

  const handleEmailBlur = async () => {
    if (!validateEmailFormat(formData.email)) {
      setEmailError("El correo no es válido.");
      return;
    }
    const exists = await emailExistsValidate(formData.email);
    if (exists) {
      setEmailError("El correo ya está registrado.");
    } else {
      setEmailError("");
    }
  };

  const isFormValid = () => {
    const requiredFields = [
      "dni",
      "name",
      "surname",
      "province",
      "locality",
      "address",
      "postal_code",
      "phone_code",
      "email",
      "password",
      "passwordConfirm"
    ];
    const allFilled = requiredFields.every((field) => !!formData[field]);
    return (
      allFilled &&
      !passwordError &&
      !passwordConfirmError &&
      !emailError &&
      formData.accept_terms
    );
  };

  return (
    <section className="form-grid-main">
      <TextField
        label="DNI"
        variant="filled"
        name="dni"
        value={formData.dni}
        onChange={handleInputChange}
      />
      <section className="form-grid-2-cols">
        <TextField
          label="Nombres"
          variant="filled"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <TextField
          label="Apellidos"
          variant="filled"
          name="surname"
          value={formData.surname}
          onChange={handleInputChange}
        />
      </section>
      
      {/* CAMBIO PRINCIPAL: Provincia select, Localidad campo libre */}
      <section className="form-grid-2-cols">
        <TextField
          variant="filled"
          select
          label="Provincia"
          name="province"
          value={formData.province}
          onChange={handleInputChange}
        >
          {provincias.map((item) => (
            <MenuItem key={item.country.value} value={item.country.value}>
              {item.country.label}
            </MenuItem>
          ))}
        </TextField>
        
        {/* Campo LOCALIDAD ahora es LIBRE (sin select, sin disabled) */}
        <TextField
          variant="filled"
          label="Localidad"
          name="locality"
          value={formData.locality}
          onChange={handleInputChange}
          placeholder="Ej: Madrid, Barcelona, Sevilla..."
        />
      </section>
      
      <TextField
        label="Dirección"
        variant="filled"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
      />
      <section className="form-grid-2-cols" style={{ display: 'grid', gridTemplateColumns: '0.8fr 2fr', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
        <TextField
          label="Código postal"
          variant="filled"
          name="postal_code"
          value={formData.postal_code}
          onChange={handleInputChange}
        />
        <TextField
          label="Código de teléfono"
          variant="filled"
          name="phone_code"
          value={formData.phone_code}
          onChange={handleInputChange}
        />
      </section>
      <TextField
        label="Correo electrónico"
        variant="filled"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        onBlur={handleEmailBlur}
        error={!!emailError}
        helperText={emailError}
      />
      <TextField
        label="Contraseña"
        variant="filled"
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        error={!!passwordError}
        helperText={passwordError}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Confirmar contraseña"
        variant="filled"
        type={showPasswordConfirm ? "text" : "password"}
        name="passwordConfirm"
        value={formData.passwordConfirm}
        onChange={handleInputChange}
        error={!!passwordConfirmError}
        helperText={passwordConfirmError}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPasswordConfirm((prev) => !prev)}
                edge="end"
              >
                {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <FormControlLabel
        control={
          <Checkbox
            name="accept_terms"
            checked={formData.accept_terms || false}
            onChange={e => setFormData(prev => ({ ...prev, accept_terms: e.target.checked }))}
          />
        }
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
          disabled={!isFormValid()}
        >
          Siguiente
        </Button>
      </section>
    </section>
  );
};

export default PersonalInfoBox;
