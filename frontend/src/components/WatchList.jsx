// Watchlist.jsx
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Watchlist({ watchlist, removeFromWatchlist }) {
  return (
    <>
      {watchlist.map((stock) => (
        <Card key={stock.symbol} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{stock.symbol}</Typography>
            <Typography variant="body2">{stock.name}</Typography>
            <IconButton onClick={() => removeFromWatchlist(stock.symbol)}>
              <DeleteIcon />
            </IconButton>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
