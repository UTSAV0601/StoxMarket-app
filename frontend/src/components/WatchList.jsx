// src/components/Watchlist.jsx
import React from "react";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function Watchlist({ watchlist, onRemove, onSelect }) {
  return (
    <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2, mt: 3 }}>
      <Typography variant="h6" fontWeight="bold">Watchlist</Typography>
      <Divider sx={{ my: 1 }} />
      <List>
        {watchlist.length === 0 && (
          <Typography variant="body2" sx={{ color: "gray", ml: 2 }}>
            No stocks added.
          </Typography>
        )}
        {watchlist.map((symbol) => (
          <ListItem
            key={symbol}
            secondaryAction={
              <IconButton edge="end" onClick={() => onRemove(symbol)}>
                <DeleteIcon />
              </IconButton>
            }
            button
            onClick={() => onSelect(symbol)}
          >
            <ListItemText primary={symbol.toUpperCase()} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Watchlist;
