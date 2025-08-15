
from sqlalchemy import Column, String, Float, DateTime, Integer, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class WatchlistItem(Base):
    __tablename__ = "watchlist_items"
   
    id = Column(String, primary_key=True, index=True)
    owner_id = Column(String, index=True)      
    symbol = Column(String, index=True)
    price = Column(Float, nullable=True)
    change_percent = Column(Float, nullable=True)
    added_at = Column(DateTime(timezone=True), server_default=func.now())

class StockPriceHistory(Base):
    __tablename__ = "stock_price_history"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    price = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())