import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#004E64', 
    },
    secondary: {
      main: '#00A5CF',
    },
  },
  typography: {
    fontFamily: 'Murecho, Nunito, Arial, sans-serif',
    logintitle: {
      fontFamily: 'Murecho',
      fontSize: '48px',
      fontWeight: 600,
      lineHeight: '69.5px',
      textAlign: 'left',
      color: '#004E64',
    },
    bodytext: {
      fontFamily: 'Nunito',
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '19.6px',
      letterSpacing: '0.5px',
      textAlign: 'left',
      color: '#32335C',
    },
    inputtext: {
      fontFamily: 'Nunito',
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '24px',
      letterSpacing: '0.5px',
      textAlign: 'left',
    },
    bodySRegular: {
      fontFamily: 'Murecho',
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '17.38px',
      textAlign: 'left',
      textUnderlinePosition: 'from-font',
      textDecorationSkipInk: 'none',
      color: '#3E3F72',
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'filled', 
      },
      styleOverrides: {
        root: {
          marginBottom: '16px', 
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontFamily: 'Nunito', 
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '24px',
          letterSpacing: '0.5px',
          textAlign: 'left',
          color: '#004E64', 
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'Nunito', 
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '24px',
          letterSpacing: '0.5px',
          textAlign: 'left',
          color: '#004E64', 
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#F6F7F9', 
          '&:hover': {
            backgroundColor: '#F6F7F9', 
          },
          '&.Mui-focused': {
            backgroundColor: '#F6F7F9', 
            borderColor: '#004E64',
          },
        },
      },
    },
  },
});

export default theme;
