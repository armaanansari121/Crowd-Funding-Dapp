// components/Header.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import Logo from "./Logo";

const Header = ({ children }) => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#1976d2",
        padding: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingY: 1,
      }}
    >
      <Logo />
      <Typography
        variant="h4"
        component="h1"
        sx={{ color: "white", marginLeft: "5rem" }}
      >
        {children}
      </Typography>
    </Box>
  );
};

export default Header;
