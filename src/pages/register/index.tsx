import Image from 'next/image';
import RegisterImage from '../../assets/img/sigeRegister.jpg';

import { Divider, Typography, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import {useState } from 'react';
import PersonalInfoBox from './personalInfoBox';
import EmpresaInfoBox from './empresaInfo';

const Register = () => {
  const [selectedOption, setSelectedOption] = useState('persona_fisica');
  const [setPersonalData] = useState({});
  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
     localStorage.setItem('registro_tipo', event.target.value);
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
            marginBottom: "5px",
          }}
        />
        <Typography variant="logintitle" gutterBottom style={{ fontSize: 24 }}>
          ¡Juntos vamos a llevar la gestión de tu granja a otro nivel!
        </Typography>
        <Typography variant="bodySRegular" style={{ fontSize: 14, fontWeight: 'bold' }} gutterBottom>
          Quiero registrarme como:
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            row
            name="registro_tipo"
            value={selectedOption}
            onChange={handleRadioChange}
            style={{ marginBottom: '2px' }}
          >
            <FormControlLabel
              value="empresa"
              control={<Radio />}
              label="Empresa"
            />
            <FormControlLabel
              value="persona_fisica"
              control={<Radio />}
              label="Persona Física"
            />
          </RadioGroup>
        </FormControl>
        {selectedOption === 'persona_fisica' ? (
          <PersonalInfoBox  />
        ) : (
          <EmpresaInfoBox onChange={setPersonalData} />
        )}
      </section>
    </section>
  );
};

export default Register;
