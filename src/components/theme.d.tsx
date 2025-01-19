import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    logintitle: React.CSSProperties;
    bodytext: React.CSSProperties;
    buttontext: React.CSSProperties;
    buttontext1: React.CSSProperties;
    inputtext: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    logintitle?: React.CSSProperties;
    bodytext?: React.CSSProperties;
    buttontext?: React.CSSProperties;
    buttontext1?: React.CSSProperties;
    inputtext?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    logintitle: true;
    bodytext: true;
    buttontext: true;
    buttontext1: true;
    inputtext: true;
  }
}
