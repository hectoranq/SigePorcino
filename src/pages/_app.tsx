
import '../index.css';  

import { ThemeProvider } from '@mui/material/styles';
import theme from '../components/theme';
import Home from '.';


function MyApp() {
  return (
      <ThemeProvider theme={theme}>
          <Home />
      {/* <Component {...pageProps} /> */}
    </ThemeProvider>
  );
}

export default MyApp;
