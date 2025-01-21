import { TextField } from "@mui/material";
import { useState } from "react";

const PersonalInfo = ({ onChange }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    username: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    passwordConfirm: "",
    email: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "email") {
      validateEmail(value);
    }

    if (name === "password" || name === "passwordConfirm") {
      validatePassword(value, name);
    }

    onChange({
      ...formData,
      [name]: value,
      name: `${formData.firstName} ${formData.lastName}`,
    });
  };

  const validateEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "El correo electrónico no es válido.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "",
      }));
    }
  };

  const validatePassword = (value, fieldName) => {
    if (fieldName === "password" || fieldName === "passwordConfirm") {
      if (value.length < 8) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldName]: "La contraseña debe tener al menos 8 caracteres.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldName]: "",
        }));
      }
    }

    if (fieldName === "passwordConfirm" && value !== formData.password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordConfirm: "Las contraseñas no coinciden.",
      }));
    } else if (fieldName === "passwordConfirm" && value === formData.password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordConfirm: "",
      }));
    }
  };

  return (
    <section className="form-grid" style={{ marginBottom: "2px" }}>
      <TextField
        label="Nombre del propietario"
        variant="filled"
        name="firstName"
        value={formData.firstName}
        onChange={handleInputChange}
      />
      <TextField
        label="Apellido del propietario"
        variant="filled"
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
      />
      <TextField
        label="Correo electrónico"
        variant="filled"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        error={!!errors.email}
        helperText={errors.email}
      />
      <TextField
        label="Contraseña"
        variant="filled"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleInputChange}
        error={!!errors.password}
        helperText={errors.password}
      />
      <TextField
        label="Confirmar Contraseña"
        variant="filled"
        name="passwordConfirm"
        type="password"
        value={formData.passwordConfirm}
        onChange={handleInputChange}
        error={!!errors.passwordConfirm}
        helperText={errors.passwordConfirm}
      />
      <TextField
        label="Usuario"
        variant="filled"
        name="username"
        value={formData.username}
        onChange={handleInputChange}
      />
    </section>
  );
};

export default PersonalInfo;
