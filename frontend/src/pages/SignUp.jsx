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
import { useAuth } from "../context/AuthContext"; // <-- FIXED

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth(); // ✅ properly imported
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(username, password); // email optional
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to register. Try another username.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 12, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Create Account
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
            Sign Up
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/")}
          >
            Login
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default Signup;
