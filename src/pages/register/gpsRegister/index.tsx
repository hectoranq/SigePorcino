import Image from 'next/image';
import RegisterImage from '../../../assets/img/sigeRegister.jpg';

import { Button, Divider, TextField, Typography, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getProvincesAndLocalities } from "../../../action/parametersPocket";
import { getGroupsAndSpeciesGrouped } from "../../../action/parametersSpecies"; // Asegúrate de que esta función esté definida en tu archivo action/parametersPocket.js
import useFarmFormStore from '../../../_store/farm';

const FarmRegister = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    rega: "",
    farm_name: "",
    locality: "",
    province: "",
    address: "",
    species: "",
    group: "",
    zootechnical_classification: "",
    health_qualification: "",
  });
  const [data, setData] = useState([]);
  const [groupSpeciesData, setGroupSpeciesData] = useState([]);

  useEffect(() => {
    getProvincesAndLocalities().then((result) => {
      setData(result);
      console.log("Provincias y localidades cargadas:", result);
    });
  }, []);

  useEffect(() => {
    getGroupsAndSpeciesGrouped().then((result) => {
      setGroupSpeciesData(result);
      console.log("Grupos y especies cargados:", result);
    });
  }, []);


  const handleIndexRegister = () => {
    router.push("/register");
  };
  const handlepaymentMethod = () => {
    setFarmFormData(formData); // Guarda en Zustand
    router.push("/register/gpsRegister/paymentMethod");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const setFarmFormData = useFarmFormStore((state) => state.setFormData);

  const isFormValid = () => {
    return Object.values(formData).every((v) => v && v !== "");
  };

  return (
    <section style={{ display: 'flex', height: '100vh', flexDirection: 'row' }}>
      <article className="image-container" style={{ flex: 0.75, position: 'relative' }}>
        <Image
          src={RegisterImage}
          alt="Pig"
          layout="fill"
          objectFit="cover"
          objectPosition="center left"
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#3E3F7233',
            zIndex: 1,
          }}
        />
      </article>

      <section
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          padding: '2% 2%',
          backgroundColor: 'white',
          overflowY: 'auto',
          height: '100vh',
        }}
      >
        <Typography
          variant="logintitle"
          gutterBottom
          style={{ marginBottom: "2px" }}
        >
          Registro
        </Typography>
        <Divider
          style={{
            borderBottom: "6px solid #00A5CF",
            width: "10%",
            marginBottom: "20px",
          }}
        />
        <Typography variant="bodySRegular" style={{ fontSize: 16 }} gutterBottom>
          Coméntanos un poco sobre tu granja antes de comenzar
        </Typography>
        <Typography variant="logintitle" gutterBottom style={{ fontSize: 24 }}>
          Cuéntanos sobre tu granja
        </Typography>
        <section className="form-grid-main" >
          <TextField
            label="R.E.G.A."
            variant="filled"
            name="rega"
            value={formData.rega}
            onChange={handleInputChange}
          />
          <TextField
            label="Nombre de la granja"
            variant="filled"
            name="farm_name"
            value={formData.farm_name}
            onChange={handleInputChange}
          />
          <TextField
              variant="filled"
              select
              label="Localidad"
              name="locality"
              value={formData.locality}
              onChange={handleInputChange}
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
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              disabled={!formData.locality}
            >
              {(data.find((item) => item.country.value === formData.locality)?.cities || []).map((city) => (
                <MenuItem key={city.value} value={city.value}>
                  {city.label}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            label="Dirección de la granja"
            variant="filled"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
          <section className="form-grid-2-cols">
            <TextField
              variant="filled"
              select
              label="Grupo"
              name="group"
              value={formData.group}
              onChange={handleInputChange}
            >
              {groupSpeciesData.map((item) => (
                <MenuItem key={item.group.value} value={item.group.value}>
                  {item.group.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              variant="filled"
              select
              label="Especie"
              name="species"
              value={formData.species}
              onChange={handleInputChange}
              disabled={!formData.group}
            >
              {(groupSpeciesData.find((item) => item.group.value === formData.group)?.species || []).map((specie) => (
                <MenuItem key={specie.value} value={specie.value}>
                  {specie.label}
                </MenuItem>
              ))}
            </TextField>
          </section>
          <TextField
            label="Clasificación zootécnica"
            variant="filled"
            name="zootechnical_classification"
            value={formData.zootechnical_classification}
            onChange={handleInputChange}
          />
          <TextField
            label="Cualificación sanitaria"
            variant="filled"
            name="health_qualification"
            value={formData.health_qualification}
            onChange={handleInputChange}
          />
          <section className="form-grid-2-cols" style={{paddingTop:30}}>
              <Button
                variant="contained"
                color="secondary"
                className="button-1"
                onClick={handleIndexRegister}
              >
                Atrás
              </Button>
              <Button
                variant="contained"
                color="primary"
                className="button"
                onClick={handlepaymentMethod}
                disabled={!isFormValid()}
              >
                Siguiente
              </Button>
          </section>
        </section>
      </section>
    </section>
  );
};

export default FarmRegister;
