import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function StockDetail() {
  const { symbol } = useParams();
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const [quoteRes, historyRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/stock/${symbol}`),
          axios.get(`http://localhost:8000/api/history/${symbol}`),
        ]);
        setData(quoteRes.data);

        const timeSeries = historyRes.data["Time Series (Daily)"];
        const labels = Object.keys(timeSeries).slice(0, 10).reverse();
        const prices = labels.map((date) =>
          parseFloat(timeSeries[date]["4. close"])
        );

        setHistory({ labels, prices });
      } catch (err) {
        console.error("Failed to fetch stock data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [symbol]);

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  if (!data || !data["05. price"]) {
    return <Typography sx={{ m: 4 }}>Stock data unavailable for "{symbol}"</Typography>;
  }

  const price = parseFloat(data["05. price"]);
  const change = parseFloat(data["09. change"]);
  const percent = parseFloat(data["10. change percent"]);
  const isPositive = change >= 0;

  const chartData = {
    labels: history.labels,
    datasets: [
      {
        label: "Closing Price",
        data: history.prices,
        fill: false,
        borderColor: isPositive ? "limegreen" : "red",
        tension: 0.2,
      },
    ],
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {symbol.toUpperCase()}
      </Typography>

      <Typography variant="h3" sx={{ color: isPositive ? "limegreen" : "red", mb: 2 }}>
        ${price.toFixed(2)} {isPositive ? "▲" : "▼"} {change.toFixed(2)} ({percent.toFixed(2)}%)
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#1e1e1e" }}>
            <CardContent>
              <Typography variant="h6">Summary</Typography>
              <Typography>Open: ${parseFloat(data["02. open"]).toFixed(2)}</Typography>
              <Typography>High: ${parseFloat(data["03. high"]).toFixed(2)}</Typography>
              <Typography>Low: ${parseFloat(data["04. low"]).toFixed(2)}</Typography>
              <Typography>Prev Close: ${parseFloat(data["08. previous close"]).toFixed(2)}</Typography>
              <Typography>Volume: {Number(data["06. volume"]).toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ backgroundColor: "#1e1e1e", height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Stock Chart</Typography>
              <Line data={chartData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default StockDetail;
