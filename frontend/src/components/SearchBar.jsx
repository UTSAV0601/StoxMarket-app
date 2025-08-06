import { useState } from "react";
import axios from "axios";
import {
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItemButton,
  Paper,
  Box,
  Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const fetchSuggestions = async (keyword) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/search/${keyword}`);
      setSuggestions(res.data.bestMatches || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setInput(value);
    if (value.length >= 2) fetchSuggestions(value);
    else setSuggestions([]);
  };

  const handleSearch = () => {
    if (input.trim()) {
      navigate(`/stock/${input.trim().toUpperCase()}`);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (symbol) => {
    setInput(symbol);
    setSuggestions([]);
    navigate(`/stock/${symbol}`);
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <TextField
        size="small"
        placeholder="Search stocks..."
        value={input}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        name="search"                   // ✅ added
        autoComplete="off"              // ✅ added
        autoCapitalize="none"
        spellCheck="false"
        sx={{ width: 300 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
          sx: { backgroundColor: "#fff", borderRadius: 1 } // white input box
        }}
      />

      {suggestions.length > 0 && (
        <Paper
          sx={{
            position: "absolute",
            width: "100%",
            zIndex: 10,
            maxHeight: 250,
            overflowY: "auto",
            backgroundColor: "#1e1e1e",
            color: "#e0e0e0"
          }}
        >
          <List disablePadding>
            {suggestions.map((item) => (
              <ListItemButton
                key={item["1. symbol"]}
                onClick={() => handleSuggestionClick(item["1. symbol"])}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item["1. symbol"]}
                </Typography>
                <Typography variant="body2" sx={{ ml: 1, color: "#aaa" }}>
                  — {item["2. name"]}
                </Typography>
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default SearchBar;
