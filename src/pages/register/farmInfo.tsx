import { TextField, MenuItem } from "@mui/material";
import LocationSelector from "../../components/locationMap/locationMap";
import { useState } from "react";

const FarmInfo = () => {
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [cities, setCities] = useState([]);

    const data = [
        {
            country: { value: 'US', label: 'United States', code: '+1' },
            cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'],
        },
        {
            country: { value: 'ES', label: 'Spain', code: '+34' },
            cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao'],
        },
        {
            country: { value: 'FR', label: 'France', code: '+33' },
            cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
        },
        {
            country: { value: 'DE', label: 'Germany', code: '+49' },
            cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
        },
        {
            country: { value: 'JP', label: 'Japan', code: '+81' },
            cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Sapporo'],
        },
    ];

    const handleCountryChange = (event) => {
        const countryValue = event.target.value;
        setSelectedCountry(countryValue);
        const countryData = data.find((item) => item.country.value === countryValue);
        setCities(countryData ? countryData.cities : []);
        setCountryCode(countryData ? countryData.country.code : '');
        setSelectedCity('');
    };

    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
    };

    return (
        <section className="form-grid-main" style={{ marginBottom: '2px' }}>
            <TextField label="Nombre de la granja" variant="filled" style={{ marginBottom: '2px' }} />
            <section className="form-grid-2-cols">
                <TextField
                    variant="filled"
                    select
                    label="País"
                    value={selectedCountry}
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
                    value={selectedCity}
                    onChange={handleCityChange}
                >
                    {cities.map((city, index) => (
                        <MenuItem key={index} value={city}>
                            {city}
                        </MenuItem>
                    ))}
                </TextField>
            </section>
            <section className="form-grid-1-col">
                <TextField label="Dirección" variant="filled" style={{ marginBottom: '2px' }} />
            </section>
            <section className="form-grid-2-cols">
                <TextField
                    variant="filled"
                    label="Código de país"
                    value={countryCode}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField label="Número de celular" variant="filled" style={{ marginBottom: '2px' }} />
            </section>
            <section className="form-grid-1-col">
                <LocationSelector />
            </section>
        </section>
    );
}

export default FarmInfo;
