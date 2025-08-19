import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { WatchlistProvider } from "./context/WatchlistContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WatchlistProvider>
          <App />
        </WatchlistProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
