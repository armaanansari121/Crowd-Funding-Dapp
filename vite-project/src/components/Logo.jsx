import React from "react";
import { Box } from "@mui/material";

const Logo = () => {
  return (
    <Box
      component="img"
      sx={{
        height: 100, // Adjust this value as needed
        width: "auto",
        mr: 2, // Adds some margin to the right of the logo
      }}
      alt="Ethers Ensemble Logo"
      src="../../public/Logo-Transparent.png" // Adjust this path if needed
    />
  );
};

export default Logo;
