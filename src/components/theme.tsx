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
      textUnderlinePosition: 'from-font',
      textDecorationSkipInk: 'none',
      color:'#004E64'
    },
    bodytext: {
      fontFamily: 'Nunito',
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '19.6px',
      letterSpacing: '0.5px',
      textAlign: 'left',
      textUnderlinePosition: 'from-font',
      textDecorationSkipInk: 'none',
      color:'#32335C'
    },
    buttontext: {
      fontFamily: 'Murecho',
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '20.27px',
      textAlign: 'center',
      textUnderlinePosition: 'from-font',
      textDecorationSkipInk: 'none',
      color: '#FDFDFD'
    },
    buttontext1: {
      fontFamily: 'Murecho',
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '20.27px',
      textAlign: 'center',
      textUnderlinePosition: 'from-font',
      textDecorationSkipInk: 'none',
      color:'#004E64'
    },
    inputtext: {
      fontFamily: 'Nunito',
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '24px',
      letterSpacing: '0.5px',
      textAlign: 'left',
      textUnderlinePosition: 'from-font',
      textDecorationSkipInk: 'none',
    },
  },
});

export default theme;
