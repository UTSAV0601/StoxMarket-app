// src/pages/Login.jsx
import { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 12, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Login to StoxTrack
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don’t have an account?{" "}
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default Login;
