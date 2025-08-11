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
  IconButton,
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
  Legend,
} from "chart.js";
import { useWatchlist } from "../context/WatchlistContext";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

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
      let stockData = res.data;

      if (
        (stockData.change === undefined || stockData.percent_change === undefined) &&
        stockData.close !== undefined &&
        stockData.previous_close !== undefined
      ) {
        const change = stockData.close - stockData.previous_close;
        const percent_change = ((change / stockData.previous_close) * 100).toFixed(2);
        stockData = { ...stockData, change: change.toFixed(2), percent_change };
      }

      setData(stockData);

      const historyRes = await axios.get(`http://localhost:8000/api/history/${symbol}`);

      // Check if data is in expected format and has values
      if (
        !historyRes.data ||
        !Array.isArray(historyRes.data.values) ||
        historyRes.data.values.length === 0
      ) {
        setChartData(null);
        return;
      }

      const historyData = historyRes.data.values;

      const sortedData = [...historyData].sort((a, b) =>
        new Date(a.datetime) - new Date(b.datetime)
      );

      const labels = sortedData.map((item) => item.datetime);
      const prices = sortedData.map((item) => item.close);

      setChartData({
        labels,
        datasets: [
          {
            label: `${symbol} Price`,
            data: prices,
            fill: false,
            borderColor: "#1976d2",
            tension: 0.1,
            pointRadius: 0,
          },
        ],
      });
    } catch (err) {
      console.error(err);
      setChartData(null);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [symbol]);


  const handleWatchlistClick = () => {
    if (!data) return;

    const price = parseFloat(data.close);
    const changePercent = parseFloat(data.percent_change);

    if (isInWatchlist) {
      removeFromWatchlist(symbol);
    } else {
      addToWatchlist({
        symbol,
        price,
        changePercent,
      });
    }
  };

  const handleBackClick = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
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
      <Box
        maxWidth={900}
        mx="auto"
        mb={2}
        display="flex"
        alignItems="center"
      >
        <IconButton onClick={handleBackClick} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {symbol} Details
        </Typography>
      </Box>

      <Card
        elevation={4}
        sx={{ borderRadius: 3, overflow: "hidden", maxWidth: 900, mx: "auto" }}
      >
        <Box sx={{ backgroundColor: "#1976d2", color: "white", p: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            {data.symbol}
          </Typography>
          <Typography variant="subtitle2">Latest Trading Data</Typography>
        </Box>

        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography>Open: ${data.open}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>High: ${data.high}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Low: ${data.low}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Price: ${data.close}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Volume: {data.volume || "N/A"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                sx={{
                  color:
                    parseFloat(data.change) >= 0 ? "green" : "red",
                }}
              >
                Change: {data.change} ({data.percent_change}%)
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

      {chartData ? (
        <Card
          elevation={4}
          sx={{ borderRadius: 3, mt: 4, maxWidth: 900, mx: "auto", p: 2 }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2}>
            {chartData?.labels?.length === 1 ? "Today's Price" : "30-Day Price Trend"}
          </Typography>
          <Box sx={{ height: 300 }}>
            <Line data={chartData} />
          </Box>
        </Card>
      ) : (
        !loading && (
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            mt={2}
          >
            No chart data available for {symbol}
          </Typography>
        )
      )}
    </Box>
  );
}

export default StockDetail;
