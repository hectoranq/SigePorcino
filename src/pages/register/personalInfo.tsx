import { TextField } from "@mui/material";

const PersonalInfo = () => {
    return (
        <section className="form-grid" style={{ marginBottom: '2px' }}>
            <TextField label="Nombre del propietario" variant="filled" style={{ marginBottom: '2px' }} />
            <TextField label="Apellido del propietario" variant="filled" style={{ marginBottom: '2px' }} />
            <TextField label="Correo electrónico" variant="filled" style={{ marginBottom: '2px' }} />
            <TextField label="Contraseña" variant="filled" style={{ marginBottom: '2px' }} />
        </section>
    );
}

export default PersonalInfo;
