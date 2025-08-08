// src/pages/Dashboard.jsx
import { useContext } from "react";
import { WatchlistContext } from "../context/WatchlistContext";
import { Typography, Card, CardContent, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { watchlist, removeFromWatchlist } = useContext(WatchlistContext);
  const navigate = useNavigate();

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Your Watchlist
      </Typography>
      {watchlist.length === 0 ? (
        <Typography>No stocks added yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {watchlist.map((stock) => (
            <Grid item xs={12} sm={6} md={4} key={stock.symbol}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{stock.symbol}</Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: stock.changePercent >= 0 ? "green" : "red" }}
                  >
                    Price: ${stock.price} ({stock.changePercent}%)
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/stock/${stock.symbol}`)}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeFromWatchlist(stock.symbol)}
                    sx={{ mt: 1 }}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}

export default Dashboard;
