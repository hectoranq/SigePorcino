import '../index.css';  
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../components/theme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
