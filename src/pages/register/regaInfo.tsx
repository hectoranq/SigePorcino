import { TextField } from "@mui/material";

const RegaInfo = () => {
    return (
        <section className="form-grid-main">
            <section className="form-grid-2-cols">
                <TextField label="R.E.:G.A." variant="filled" style={{ marginBottom: '2px' }} />
                <TextField label="Nombre del R.E.G.A" variant="filled" style={{ marginBottom: '2px' }} />
            </section>
        </section>
    );
}

export default RegaInfo;
