import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (query) {
      navigate(`/stock/${query}`);
    }
  };

  const handleSuggestionClick = (symbol) => {
    navigate(`/stock/${symbol}`);
  };

  const fetchSuggestions = async (value) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/search/${value}`);
      setSuggestions(res.data.bestMatches || []);
    } catch (err) {
      console.error("Suggestion fetch failed", err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <input
        value={query}
        onChange={handleChange}
        placeholder="Search stock (e.g. apple)"
        style={{ padding: "0.5rem", width: "250px" }}
      />
      <button onClick={handleSearch} style={{ marginLeft: "0.5rem" }}>
        🔍
      </button>

      {suggestions.length > 0 && (
        <ul style={{ listStyle: "none", marginTop: "0.5rem" }}>
          {suggestions.map((item, idx) => (
            <li
              key={idx}
              onClick={() => handleSuggestionClick(item["1. symbol"])}
              style={{
                cursor: "pointer",
                padding: "0.3rem",
                border: "1px solid #ccc",
                marginTop: "2px",
              }}
            >
              {item["1. symbol"]} – {item["2. name"]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
