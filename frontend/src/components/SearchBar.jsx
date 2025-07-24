import axios from 'axios';
import { useState } from 'react';

function SearchBar() {
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState(null);

  const fetchStock = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/stock/${symbol}`);
      setData(res.data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <input
        placeholder="Enter stock symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
      />
      <button onClick={fetchStock}>Search</button>
      <pre>{data ? JSON.stringify(data, null, 2) : 'No data yet'}</pre>
    </div>
  );
}

export default SearchBar;
