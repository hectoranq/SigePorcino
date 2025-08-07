import { Box, Typography } from "@mui/material";
import MainIcon from '../../assets/svgs/mainIconOne.svg';

const MainSection = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "70vh",
      width: "100%",
    }}
  >
    <MainIcon width={250} height={250} />
    <Typography
      variant="h4"
      sx={{
        mt: 4,
        fontWeight: 700,
        color: "secondary.main",
        textAlign: "center",
      }}
    >
      Sistema de gestión Porcino y/o Granja
    </Typography>
  </Box>
);

export default MainSection;