import React, { useState } from 'react';
import { TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';

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
        style={{ marginBottom: '25px', width: '100%' }}
        value={file ? file.name : ''}
        onClick={handleClick}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <AttachFileIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {file && (
        <Typography variant="body2" color="text.primary" style={{ marginBottom: '25px' }}>
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
