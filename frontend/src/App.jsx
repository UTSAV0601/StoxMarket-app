// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, CssBaseline } from "@mui/material";
import SearchBar from "./components/SearchBar";
import StockDetail from "./components/StockDetail";
import Dashboard from "./pages/Dashboard";
import { WatchlistProvider } from "./context/WatchlistContext";

function App() {
  return (
    <WatchlistProvider>
        <CssBaseline />
        <AppBar position="fixed" color="primary" sx={{ zIndex: 1100 }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
            <Typography
              variant="h6"
              sx={{ cursor: "pointer" }}
              onClick={() => (window.location.href = "/")}
            >
              StoxTrack
            </Typography>
            <Box sx={{ width: 300 }}> {/* Fixed width to avoid expansion */}
              <SearchBar />
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ marginTop: 8, padding: 2 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stock/:symbol" element={<StockDetail />} />
          </Routes>
        </Box>
    </WatchlistProvider>
  );
}

export default App;
