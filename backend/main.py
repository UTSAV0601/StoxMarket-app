from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv
import time

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("FINNHUB_API_KEY")
BASE_URL = "https://finnhub.io/api/v1"


@app.get("/api/search/{keyword}")
def search_symbol(keyword: str):
    url = f"{BASE_URL}/search"
    params = {
        "q": keyword,
        "token": API_KEY
    }
    response = requests.get(url, params=params)
    data = response.json()
    results = data.get("result", [])

    mapped_results = [
        {
            "symbol": item.get("symbol"),
            "name": item.get("description"),  # Map description -> name for frontend
            "exchange": item.get("exchange")
        }
        for item in results
    ]
    return mapped_results


@app.get("/api/stock/{symbol}")
def get_stock(symbol: str):
    url = f"{BASE_URL}/quote"
    params = {
        "symbol": symbol,
        "token": API_KEY
    }
    response = requests.get(url, params=params)
    data = response.json()

    open_price = data.get("o")
    close_price = data.get("c")
    high_price = data.get("h")
    low_price = data.get("l")
    prev_close = data.get("pc")
    volume = data.get("v")
    timestamp = data.get("t")

    change = None
    percent_change = None
    if close_price is not None and prev_close:
        change = close_price - prev_close
        try:
            percent_change = (change / prev_close) * 100
        except ZeroDivisionError:
            percent_change = None

    return {
        "open": open_price,
        "close": close_price,
        "high": high_price,
        "low": low_price,
        "previous_close": prev_close,
        "current_price": close_price,
        "volume": volume,
        "timestamp": timestamp,
        "change": round(change, 2) if change is not None else None,
        "percent_change": round(percent_change, 2) if percent_change is not None else None
    }


@app.get("/api/history/{symbol}")
def get_stock_history(symbol: str):
    # Instead of candle API (not accessible on free tier), use /quote for today's data
    url = f"{BASE_URL}/quote"
    params = {
        "symbol": symbol,
        "token": API_KEY
    }
    response = requests.get(url, params=params)
    data = response.json()

    if not data or "c" not in data:
        return {"values": []}

    today_date = time.strftime('%Y-%m-%d', time.localtime(time.time()))

    candles = [{
        "datetime": today_date,
        "open": data.get("o"),
        "close": data.get("c"),
        "high": data.get("h"),
        "low": data.get("l"),
        "volume": data.get("v")
    }]

    return {"values": candles}


