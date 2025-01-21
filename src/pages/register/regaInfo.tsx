import { TextField } from "@mui/material";
import { useState } from "react";

const RegaInfo = ({ onChange }) => {
  const [formData, setFormData] = useState({
    rega_code: "",
    rega_name: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    onChange({ ...formData, [name]: value });
  };

  return (
    <section className="form-grid-main">
      <section className="form-grid-2-cols">
        <TextField
          label="R.E.G.A."
          variant="filled"
          name="rega_code"
          value={formData.rega_code}
          onChange={handleInputChange}
        />
        <TextField
          label="Nombre del R.E.G.A"
          variant="filled"
          name="rega_name"
          value={formData.rega_name}
          onChange={handleInputChange}
        />
      </section>
    </section>
  );
};

export default RegaInfo;
