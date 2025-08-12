// src/context/WatchlistContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { getClientId } from "../utils/getClientId";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const clientId = getClientId();

  // fetch watchlist from backend
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_BASE}/watchlist/${clientId}`);
        setWatchlist(res.data || []);
      } catch (err) {
        console.error("Failed to fetch watchlist", err);
      }
    };
    fetch();
  }, [clientId]);

  const addToWatchlist = async (stock) => {
    // stock: { symbol, price?, changePercent? }
    try {
      const payload = {
        symbol: stock.symbol,
        price: stock.price ?? null,
        changePercent: stock.changePercent ?? null,
      };
      const res = await axios.post(`${API_BASE}/watchlist/${clientId}`, payload);
      // res.data = { symbol, price, changePercent, added_at }
      setWatchlist((prev) => {
        // replace if exists
        const without = prev.filter((s) => s.symbol !== res.data.symbol);
        return [...without, {
          symbol: res.data.symbol,
          price: res.data.price,
          changePercent: res.data.changePercent,
          added_at: res.data.added_at
        }];
      });
    } catch (err) {
      console.error("Add watchlist failed", err);
      throw err;
    }
  };

  const removeFromWatchlist = async (symbol) => {
    try {
      await axios.delete(`${API_BASE}/watchlist/${clientId}/${symbol}`);
      setWatchlist((prev) => prev.filter((s) => s.symbol !== symbol));
    } catch (err) {
      console.error("Remove watchlist failed", err);
      throw err;
    }
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export { WatchlistContext };
