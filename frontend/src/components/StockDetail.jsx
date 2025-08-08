// src/components/StockDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Button,
  IconButton
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from "chart.js";
import { useWatchlist } from "../context/WatchlistContext";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

function StockDetail() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const isInWatchlist = watchlist.some((s) => s.symbol === symbol);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/stock/${symbol}`);
        setData(res.data);

        const timeSeries = await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`
        );
        const timeSeriesData = timeSeries.data["Time Series (Daily)"];

        if (timeSeriesData) {
          const labels = Object.keys(timeSeriesData).reverse().slice(-30);
          const prices = labels.map(date => parseFloat(timeSeriesData[date]["4. close"]));

          setChartData({
            labels,
            datasets: [{
              label: `${symbol} Price`,
              data: prices,
              fill: false,
              borderColor: "#1976d2",
              tension: 0.1,
              pointRadius: 0
            }]
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  const handleWatchlistClick = () => {
    if (!data) return;

    const price = parseFloat(data["05. price"]);
    const changePercent = parseFloat(data["10. change percent"]);

    if (isInWatchlist) {
      removeFromWatchlist(symbol);
    } else {
      addToWatchlist({
        symbol,
        price,
        changePercent
      });
    }
  };

  const handleBackClick = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Typography variant="h6" align="center">
        No data available for {symbol}
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Box maxWidth={900} mx="auto" mb={2} display="flex" alignItems="center">
        <IconButton onClick={handleBackClick} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {symbol} Details
        </Typography>
      </Box>

      <Card elevation={4} sx={{ borderRadius: 3, overflow: "hidden", maxWidth: 900, mx: "auto" }}>
        <Box sx={{ backgroundColor: "#1976d2", color: "white", p: 2 }}>
          <Typography variant="h5" fontWeight="bold">{data["01. symbol"]}</Typography>
          <Typography variant="subtitle2">Latest Trading Data</Typography>
        </Box>

        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}><Typography>Open: ${data["02. open"]}</Typography></Grid>
            <Grid item xs={6}><Typography>High: ${data["03. high"]}</Typography></Grid>
            <Grid item xs={6}><Typography>Low: ${data["04. low"]}</Typography></Grid>
            <Grid item xs={6}><Typography>Price: ${data["05. price"]}</Typography></Grid>
            <Grid item xs={6}><Typography>Volume: {data["06. volume"]}</Typography></Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: parseFloat(data["09. change"]) >= 0 ? "green" : "red" }}>
                Change: {data["09. change"]} ({data["10. change percent"]})
              </Typography>
            </Grid>
          </Grid>
          <Box mt={3}>
            <Button
              variant={isInWatchlist ? "outlined" : "contained"}
              color="primary"
              onClick={handleWatchlistClick}
              fullWidth
            >
              {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {chartData && (
        <Card elevation={4} sx={{ borderRadius: 3, mt: 4, maxWidth: 900, mx: "auto", p: 2 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            30-Day Price Trend
          </Typography>
          <Line data={chartData} />
        </Card>
      )}
    </Box>
  );
}

export default StockDetail;
