// src/context/WatchlistContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const WatchlistContext = createContext();
export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const { api } = useAuth();

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await api.get(`/watchlist/`);
        setWatchlist(res.data || []);
      } catch (err) {
        console.error("Failed to fetch watchlist", err);
      }
    };
    fetchWatchlist();
  }, [api]);

  const addToWatchlist = async (stock) => {
    try {
      const payload = {
        symbol: stock.symbol,
        price: stock.price ?? null,
        changePercent: stock.changePercent ?? null,
      };
      const res = await api.post(`/watchlist/`, payload);
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
      await api.delete(`/watchlist/${symbol}`);
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
