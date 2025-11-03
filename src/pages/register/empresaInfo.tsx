import React, { useState, useEffect } from "react";
import { TextField, MenuItem, FormControlLabel, Checkbox, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import useUserFormStore from "../../_store";
import { emailExistsValidate, fetchParameters } from "../../data/repository";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

const EmpresaInfoBox = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    tipo_usuario: "empresa",
    cif: "",
    company_name: "",
    city: "",
    province: "",
    locality: "", // Campo libre de texto
    address: "",
    postal_code: "",
    phone_number: "",
    email: "",
    password: "",
    passwordConfirm: "",
    accept_terms: false,
  });

  // Estado para provincias (ya no necesitamos localidades en dropdown)
  const [provincias, setProvincias] = useState([]);
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    // Cargar solo las provincias
    fetchParameters().then(setProvincias);
  }, []);

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
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

  const validateEmailFormat = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = () => {
    router.push("/");
  };

  const handleFarmRegister = async () => {
    try {
      useUserFormStore.getState().setFormData({
        email: formData.email,
        password: formData.password,
        company_name: formData.company_name,
        cif: formData.cif,
        locality: formData.locality,
        province: formData.province,
        address: formData.address,
        postal_code: formData.postal_code,
        phone_number: formData.phone_number,
        accept_terms: formData.accept_terms,
        emailVisibility: true,
        passwordConfirm: formData.passwordConfirm,
      });
      localStorage.setItem('registro_tipo', 'empresa');
      console.log('/register/gpsRegister');
      router.push('/register/gpsRegister');
    } catch (error) {
      console.error('Error registrando la empresa:', error);
    }
  };

  const isFormValid = () => {
    const requiredFields = [
      "cif",
      "company_name",
      "province",
      "locality",
      "address",
      "postal_code",
      "phone_number",
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
    <section className="form-grid-main" >
      <TextField
        label="CIF"
        variant="filled"
        name="cif"
        value={formData.cif}
        onChange={handleInputChange}
      />
      <TextField
        label="Nombre de la empresa"
        variant="filled"
        name="company_name"
        value={formData.company_name}
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
          label="Número de teléfono"
          variant="filled"
          name="phone_number"
          value={formData.phone_number}
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
            checked={formData.accept_terms}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                accept_terms: e.target.checked,
              }))
            }
          />
        }
        label={<Typography variant="bodySRegular">Acepto los términos y condiciones</Typography>}
        style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
      />
      <section className="form-grid-2-cols">
        <Button
          variant="contained"
          color="secondary"
          className="btnatras"
          onClick={handleLogin}
        >
          Ya tengo una cuenta
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="btnsiguiente"
          onClick={handleFarmRegister}
          disabled={!isFormValid()}
        >
          Siguiente
        </Button>
      </section>
    </section>
  );
};

export default EmpresaInfoBox;
