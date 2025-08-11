import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
  InputAdornment,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function SearchBar() {
  const [symbol, setSymbol] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (symbol.trim() === "") {
        setSuggestions([]);
        return;
      }

      try 
      {
        const res = await axios.get(`http://localhost:8000/api/search/${symbol}`);
        setSuggestions(res.data || []);
      } 
      catch (error) 
      {
        console.error("Error fetching suggestions:", error);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [symbol]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!symbol.trim()) return;
    navigate(`/stock/${symbol.trim().toUpperCase()}`);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (match) => {
    navigate(`/stock/${match.symbol}`);
    setSymbol("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <form onSubmit={handleSearchSubmit}>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          placeholder="Search e.g. AAPL"
          value={symbol}
          onChange={(e) => {
            setSymbol(e.target.value);
            setShowSuggestions(true);
          }}
          autoComplete="off"    // <== This disables browser native autocomplete
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type="submit">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 10,
            maxHeight: 250,
            overflowY: "auto",
          }}
        >
          <List dense>
            {suggestions.map((match, index) => (
              <ListItem button key={index} onClick={() => handleSuggestionClick(match)}>
                <ListItemText
                  primary={`${match.symbol} - ${match.name}`}
                  secondary={match.exchange}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default SearchBar;
