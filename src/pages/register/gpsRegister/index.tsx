import Image from 'next/image';
import RegisterImage from '../../../assets/img/sigeRegister.jpg';

import { Button, Divider, TextField, Typography, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useFarmFormStore from '../../../_store/farm';
import { fetchParameters, parametersGroupsAndSpeciesGrouped } from '../../../data/repository';

const FarmRegister = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    rega: "",
    farm_name: "",
    locality: "", // Campo libre de texto
    province: "", // Campo select (dropdown)
    address: "",
    species: "",
    group: "",
    zootechnical_classification: "",
    health_qualification: "",
  });
  
  // Solo necesitamos provincias para el dropdown 
  const [provincias, setProvincias] = useState([]);
  const [groupSpeciesData, setGroupSpeciesData] = useState([]);

  useEffect(() => {
    // Cargar solo las provincias
    fetchParameters().then((result) => {
      setProvincias(result);
      console.log("Provincias cargadas:", result);
    });
  }, []);

  useEffect(() => {
    parametersGroupsAndSpeciesGrouped().then((result) => {
      setGroupSpeciesData(result);
      console.log("Grupos y especies cargados:", result);
    });
  }, []);

  const handleIndexRegister = () => {
    router.push("/register");
  };
  
  const handlepaymentMethod = () => {
    // Mapear los campos del formulario al formato del store
    const mappedData = {
      REGA: formData.rega,
      farm_name: formData.farm_name,
      locality: formData.locality,
      province: formData.province,
      address: formData.address,
      groups: formData.group,
      species: formData.species,
      zootechnical_classification: formData.zootechnical_classification,
      health_qualification: formData.health_qualification,
    };
    setFarmFormData(mappedData); // Guarda en Zustand con los nombres correctos
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

  // Función para obtener todas las especies de todos los grupos
  const getAllSpecies = () => {
    const allSpecies = [];
    groupSpeciesData.forEach(group => {
      if (group.species) {
        allSpecies.push(...group.species);
      }
    });
    // Eliminar duplicados por value
    const uniqueSpecies = allSpecies.filter((species, index, self) => 
      index === self.findIndex(s => s.value === species.value)
    );
    return uniqueSpecies;
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
          
          {/* CAMBIO PRINCIPAL: Provincia primero (dropdown), Localidad segundo (campo libre) */}
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
            label="Dirección de la granja"
            variant="filled"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
          <section className="form-grid-2-cols">
            {/* ESPECIE ahora es INDEPENDIENTE (sin disabled, sin dependencia de grupo) */}
            <TextField
              variant="filled"
              select
              label="Especie"
              name="species"
              value={formData.species}
              onChange={handleInputChange}
            >
              {getAllSpecies().map((specie) => (
                <MenuItem key={specie.value} value={specie.value}>
                  {specie.label}
                </MenuItem>
              ))}
            </TextField>
            
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
