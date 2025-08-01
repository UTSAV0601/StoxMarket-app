import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import SearchBar from "./SearchBar";

function NavBar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#0d1b2a" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">StoxTrack</Typography>
        <Box>
          <SearchBar />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
