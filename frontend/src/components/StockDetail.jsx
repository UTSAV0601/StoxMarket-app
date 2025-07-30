import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

function StockDetail() {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStockDetail = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/stock/${symbol}`);
      setStockData(res.data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockDetail();
  }, [symbol]);

  const latestDate = stockData
    ? Object.keys(stockData["Time Series (Daily)"])[0]
    : null;

  const latestInfo = latestDate
    ? stockData["Time Series (Daily)"][latestDate]
    : null;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!latestInfo) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">No data found for {symbol}</Typography>
      </Box>
    );
  }

  return (
    <Box mt={4} display="flex" justifyContent="center">
      <Card sx={{ maxWidth: 500, padding: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {symbol} - {latestDate}
          </Typography>
          <Typography>Open: ${latestInfo["1. open"]}</Typography>
          <Typography>High: ${latestInfo["2. high"]}</Typography>
          <Typography>Low: ${latestInfo["3. low"]}</Typography>
          <Typography>Close: ${latestInfo["4. close"]}</Typography>
          <Typography>Volume: {latestInfo["5. volume"]}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default StockDetail;
