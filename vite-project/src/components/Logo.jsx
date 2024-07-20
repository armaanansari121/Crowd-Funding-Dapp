import React from "react";
import { Box } from "@mui/material";

const Logo = () => {
  return (
    <Box
      component="img"
      sx={{
        height: 100,
        width: "auto",
        mr: 2,
      }}
      alt="Ethers Ensemble Logo"
      src="../../public/Logo-Transparent.png"
    />
  );
};

export default Logo;
