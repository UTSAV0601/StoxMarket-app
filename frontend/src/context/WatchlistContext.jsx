import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);

  // fetch watchlist from backend
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_BASE}/watchlist/`);
        setWatchlist(res.data || []);
      } catch (err) {
        console.error("Failed to fetch watchlist", err);
      }
    };
    fetch();
  }, []);

  const addToWatchlist = async (stock) => {
    try {
      const payload = {
        symbol: stock.symbol,
        price: stock.price ?? null,
        changePercent: stock.changePercent ?? null,
      };
      const res = await axios.post(`${API_BASE}/watchlist/`, payload);
      setWatchlist((prev) => {
        const without = prev.filter((s) => s.symbol !== res.data.symbol);
        return [...without, res.data];
      });
    } catch (err) {
      console.error("Add watchlist failed", err);
      throw err;
    }
  };

  const removeFromWatchlist = async (symbol) => {
    try {
      await axios.delete(`${API_BASE}/watchlist/${symbol}`);
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
