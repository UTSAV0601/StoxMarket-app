import { useState } from "react";
import axios from "axios";
import {
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  Paper,
  Box,
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
    const value = e.target.value;
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
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
          sx: { backgroundColor: "white", borderRadius: 1 },
        }}
        sx={{ width: 300 }}
      />

      {suggestions.length > 0 && (
        <Paper sx={{ position: "absolute", width: "100%", zIndex: 10 }}>
          <List>
            {suggestions.map((item) => (
              <ListItem
                key={item["1. symbol"]}
                button
                onClick={() => handleSuggestionClick(item["1. symbol"])}
              >
                {item["1. symbol"]} - {item["2. name"]}
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default SearchBar;
