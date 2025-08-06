// src/components/StockDetail.jsx
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

function StockDetail() {
  const { symbol } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/stock/${symbol}`);
        setData(res.data);
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

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {symbol.toUpperCase()}
      </Typography>

      <Typography variant="h3" sx={{ color: isPositive ? "limegreen" : "red", mb: 2 }}>
        ${price.toFixed(2)} {isPositive ? "▲" : "▼"} {change.toFixed(2)} ({percent.toFixed(2)}%)
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#1f1f1f", color: "#e0e0e0", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Summary</Typography>
              <Typography>Open: ${parseFloat(data["02. open"]).toFixed(2)}</Typography>
              <Typography>High: ${parseFloat(data["03. high"]).toFixed(2)}</Typography>
              <Typography>Low: ${parseFloat(data["04. low"]).toFixed(2)}</Typography>
              <Typography>Prev Close: ${parseFloat(data["08. previous close"]).toFixed(2)}</Typography>
              <Typography>Volume: {Number(data["06. volume"]).toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ backgroundColor: "#1f1f1f", color: "#e0e0e0", boxShadow: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Stock Chart (Coming Soon)</Typography>
              <Box
                sx={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#2c2c2c",
                  borderRadius: "4px"
                }}
              >
                <Typography variant="body2" color="gray">
                  Stock chart will be shown here.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default StockDetail;
