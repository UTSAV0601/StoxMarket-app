from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")


@app.get("/api/stock/{symbol}")
def get_stock(symbol: str):
    url = "https://www.alphavantage.co/query"
    params = {
        "function": "GLOBAL_QUOTE",
        "symbol": symbol,
        "apikey": API_KEY
    }
    response = requests.get(url, params=params)
    return response.json()["Global Quote"]


@app.get("/api/search/{keyword}")
def search_symbol(keyword: str):
    url = "https://www.alphavantage.co/query"
    params = {
        "function": "SYMBOL_SEARCH",
        "keywords": keyword,
        "apikey": API_KEY
    }
    response = requests.get(url, params=params)
    return response.json()

@app.get("/api/history/{symbol}")
def get_stock_history(symbol: str):
    url = "https://www.alphavantage.co/query"
    params = {
        "function": "TIME_SERIES_DAILY",
        "symbol": symbol,
        "outputsize": "compact",
        "apikey": API_KEY
    }
    response = requests.get(url, params=params)
    return response.json()
