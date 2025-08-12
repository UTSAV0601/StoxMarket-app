from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4
from sqlalchemy.orm import Session

from database import SessionLocal
from models import WatchlistItem

router = APIRouter(prefix="/watchlist", tags=["watchlist"])

class WatchlistItemCreate(BaseModel):
    symbol: str
    price: Optional[float] = None
    changePercent: Optional[float] = None

class WatchlistItemOut(BaseModel):
    symbol: str
    price: Optional[float] = None
    changePercent: Optional[float] = None
    added_at: Optional[str] = None

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/{owner_id}", response_model=List[WatchlistItemOut])
def get_watchlist(owner_id: str, db: Session = Depends(get_db)):
    items = db.query(WatchlistItem).filter(WatchlistItem.owner_id == owner_id).all()
    out = []
    for it in items:
        out.append({
            "symbol": it.symbol,
            "price": it.price,
            "changePercent": it.change_percent,
            "added_at": it.added_at.isoformat() if it.added_at else None
        })
    return out

@router.post("/{owner_id}", response_model=WatchlistItemOut)
def add_or_update_watchlist(owner_id: str, payload: WatchlistItemCreate, db: Session = Depends(get_db)):
    symbol = payload.symbol.upper().strip()
    existing = db.query(WatchlistItem).filter(
        WatchlistItem.owner_id == owner_id,
        WatchlistItem.symbol == symbol
    ).first()

    if existing:
        existing.price = payload.price if payload.price is not None else existing.price
        existing.change_percent = payload.changePercent if payload.changePercent is not None else existing.change_percent
        db.add(existing)
        db.commit()
        db.refresh(existing)
        return {
            "symbol": existing.symbol,
            "price": existing.price,
            "changePercent": existing.change_percent,
            "added_at": existing.added_at.isoformat() if existing.added_at else None
        }

    item = WatchlistItem(
        id=str(uuid4()),
        owner_id=owner_id,
        symbol=symbol,
        price=payload.price,
        change_percent=payload.changePercent
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return {
        "symbol": item.symbol,
        "price": item.price,
        "changePercent": item.change_percent,
        "added_at": item.added_at.isoformat() if item.added_at else None
    }

@router.delete("/{owner_id}/{symbol}")
def delete_watchlist_item(owner_id: str, symbol: str, db: Session = Depends(get_db)):
    sym = symbol.upper().strip()
    item = db.query(WatchlistItem).filter(WatchlistItem.owner_id == owner_id, WatchlistItem.symbol == sym).first()
    if not item:
        raise HTTPException(status_code=404, detail="Symbol not found")
    db.delete(item)
    db.commit()
    return {"message": f"{sym} removed"}
