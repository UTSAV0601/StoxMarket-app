import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function StockDetail() {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`http://localhost:8000/api/stock/${symbol}`);
        setStockData(res.data);
      } catch (error) {
        console.error("Failed to fetch stock data", error);
      }
    }
    fetchData();
  }, [symbol]);

  const getLatestData = () => {
    if (
      stockData &&
      stockData["Time Series (Daily)"] &&
      Object.keys(stockData["Time Series (Daily)"]).length > 0
    ) {
      const date = Object.keys(stockData["Time Series (Daily)"])[0];
      return {
        date,
        ...stockData["Time Series (Daily)"][date],
      };
    }
    return null;
  };

  const latest = getLatestData();

  if (!latest) return <div>Loading stock data...</div>;

  return (
    <div style={{ margin: "2rem", padding: "2rem", border: "1px solid #ddd", borderRadius: "8px", maxWidth: "400px" }}>
      <h2>{symbol.toUpperCase()} - Stock Details</h2>
      <p><strong>Date:</strong> {latest.date}</p>
      <p><strong>Open:</strong> {latest["1. open"]}</p>
      <p><strong>High:</strong> {latest["2. high"]}</p>
      <p><strong>Low:</strong> {latest["3. low"]}</p>
      <p><strong>Close:</strong> {latest["4. close"]}</p>
      <p><strong>Volume:</strong> {latest["5. volume"]}</p>
    </div>
  );
}

export default StockDetail;
