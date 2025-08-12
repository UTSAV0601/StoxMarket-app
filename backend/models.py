
from sqlalchemy import Column, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class WatchlistItem(Base):
    __tablename__ = "watchlist_items"
   
    id = Column(String, primary_key=True, index=True)
    owner_id = Column(String, index=True)      
    symbol = Column(String, index=True)
    price = Column(Float, nullable=True)
    change_percent = Column(Float, nullable=True)
    added_at = Column(DateTime(timezone=True), server_default=func.now())
