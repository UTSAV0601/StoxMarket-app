import React, { useState } from 'react';
import axios from 'axios';
import StockDetail from './StockDetail';

const SearchBar = () => {
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStock = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:8000/api/stock/${symbol}`);
      setData(res.data);
    } catch (err) {
      setError('Invalid symbol or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={symbol}
        placeholder="Enter stock symbol (e.g. AAPL)"
        onChange={(e) => setSymbol(e.target.value)}
      />
      <button onClick={fetchStock}>Search</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && <StockDetail data={data} />}
    </div>
  );
};

export default SearchBar;
