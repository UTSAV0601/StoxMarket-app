// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import SearchBar from "./components/SearchBar";
import StockDetail from "./components/StockDetail";

function App() {
  return (
    <Router>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
          <Typography 
            variant="h6"
            sx={{ cursor: "pointer" }}
            onClick={() => window.location.href = "/"}
          >
            StoxTrack
          </Typography>
          <SearchBar />
        </Toolbar>
      </AppBar>

      <Box sx={{ marginTop: 4, padding: 2 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stock/:symbol" element={<StockDetail />} />
        </Routes>
      </Box>
    </Router>
  );
}

function Home() {
  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h4" gutterBottom>
        Welcome to StoxTrack
      </Typography>
      <Typography variant="body1">
        Search and track stocks with real-time data.
      </Typography>
    </Box>
  );
}

export default App;
