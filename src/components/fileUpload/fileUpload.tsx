import React, { useState } from 'react';
import { TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';

const FileUpload = ({ onFileChange }) => { 
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    onFileChange(selectedFile);
  };

  const handleClick = () => {
    document.getElementById('file-input').click();
  };

  return (
    <div>
      <TextField
        label="Comprobante"
        variant="filled"
        style={{ marginBottom: '5px', width: '100%' }}
        value={file ? file.name : ''}
        onClick={handleClick}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <DescriptionIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {file && (
        <Typography variant="body2" color="text.primary" style={{ marginBottom: '10px' }}>
          Archivo seleccionado: {file.name}
        </Typography>
      )}

      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default FileUpload;
