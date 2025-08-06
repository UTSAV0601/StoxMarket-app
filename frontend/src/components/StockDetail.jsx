// src/pages/StockDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography, Grid, Divider, CircularProgress, Card, CardContent } from "@mui/material";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

function StockDetail() {
    const { symbol } = useParams();
    const [data, setData] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/stock/${symbol}`);
                setData(res.data);

                const timeSeries = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`);
                const timeSeriesData = timeSeries.data["Time Series (Daily)"];
                const labels = Object.keys(timeSeriesData).reverse().slice(-30);
                const prices = labels.map(date => parseFloat(timeSeriesData[date]["4. close"]));
                setChartData({
                    labels,
                    datasets: [
                        {
                            label: `${symbol} Price`,
                            data: prices,
                            fill: false,
                            borderColor: "#1976d2",
                            tension: 0.1,
                            pointRadius: 0
                        }
                    ]
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [symbol]);

    if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress /></Box>;
    if (!data) return <Typography variant="h6" align="center">No data available for {symbol}</Typography>;

    return (
        <Box sx={{ p: 4, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom align="center">{symbol} Details</Typography>

            <Card elevation={4} sx={{ borderRadius: 3, overflow: "hidden", maxWidth: 900, mx: "auto" }}>
                {/* Header */}
                <Box sx={{ backgroundColor: "#1976d2", color: "white", p: 2 }}>
                    <Typography variant="h5" fontWeight="bold">{data["01. symbol"]}</Typography>
                    <Typography variant="subtitle2">Latest Trading Data</Typography>
                </Box>

                {/* Content */}
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="textSecondary">Price</Typography>
                            <Typography variant="h6">${parseFloat(data["05. price"]).toFixed(2)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="textSecondary">Volume</Typography>
                            <Typography variant="h6">{data["06. volume"]}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="textSecondary">Open</Typography>
                            <Typography variant="body1">${data["02. open"]}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="textSecondary">High</Typography>
                            <Typography variant="body1">${data["03. high"]}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="textSecondary">Low</Typography>
                            <Typography variant="body1">${data["04. low"]}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="textSecondary">Latest Trading Day</Typography>
                            <Typography variant="body1">{data["07. latest trading day"]}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="textSecondary">Previous Close</Typography>
                            <Typography variant="body1">${data["08. previous close"]}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="textSecondary">Change</Typography>
                            <Typography variant="body1">${data["09. change"]}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="textSecondary">Change Percent</Typography>
                            <Typography variant="body1">{data["10. change percent"]}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Chart */}
            {chartData && (
                <Card elevation={4} sx={{ borderRadius: 3, mt: 4, maxWidth: 900, mx: "auto", p: 2 }}>
                    <Typography variant="h6" fontWeight="bold" mb={2}>30-Day Price Trend</Typography>
                    <Line data={chartData} />
                </Card>
            )}
        </Box>
    );
}

export default StockDetail;
