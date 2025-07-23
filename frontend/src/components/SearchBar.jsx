import axios from 'axios';
import {useState} from 'react';

function SearchBar() {
    const [symbol, setSymbol] = useState("");
    const [data, setData] = useState (null);

    const fetchStock = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/stock/${symbol}`);
      setData(res.data);
    } catch (err) {
      console.error("Error:", err);
    }
}
};