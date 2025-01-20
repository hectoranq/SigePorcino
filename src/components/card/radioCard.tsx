import React from 'react';
import { Card, CardContent, Typography, Radio, FormControlLabel, Box } from '@mui/material';

const RadioCard = ({ plan, isSelected, onSelect }) => {
  const handleCardClick = () => {
    onSelect(plan.id);
  };

  return (
    <Card 
      style={{ 
        cursor: 'pointer', 
        position: 'relative', 
        borderRadius: '16px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: isSelected ? '#00A5CF' : '#004E64', 
      }} 
      onClick={handleCardClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <FormControlLabel
            control={<Radio checked={isSelected} />}
            label={<Typography variant="h6">{plan.name}</Typography>}
          />
          <Box>
            <Typography variant="h6">{plan.price} €</Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.primary">
          {plan.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RadioCard;
