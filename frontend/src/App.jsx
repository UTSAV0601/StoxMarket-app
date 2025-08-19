// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, CssBaseline } from "@mui/material";
import SearchBar from "./components/SearchBar";
import StockDetail from "./components/StockDetail";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <AppBar position="fixed" color="primary" sx={{ zIndex: 1100 }}>
                  <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{ cursor: "pointer" }}
                      onClick={() => (window.location.href = "/dashboard")}
                    >
                      StoxTrack
                    </Typography>
                    <Box sx={{ width: 300 }}>
                      <SearchBar />
                    </Box>
                  </Toolbar>
                </AppBar>
                <Box sx={{ marginTop: 8, padding: 2 }}>
                  <Dashboard />
                </Box>
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/stock/:symbol"
          element={
            <ProtectedRoute>
              <>
                <AppBar position="fixed" color="primary" sx={{ zIndex: 1100 }}>
                  <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{ cursor: "pointer" }}
                      onClick={() => (window.location.href = "/dashboard")}
                    >
                      StoxTrack
                    </Typography>
                    <Box sx={{ width: 300 }}>
                      <SearchBar />
                    </Box>
                  </Toolbar>
                </AppBar>
                <Box sx={{ marginTop: 8, padding: 2 }}>
                  <StockDetail />
                </Box>
              </>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
