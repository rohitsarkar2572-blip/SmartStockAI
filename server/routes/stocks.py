from fastapi import APIRouter, Query
from services.ai_service import analyze_stock
from services.news_service import get_stock_news

from services.stock_service import (
    get_stock_info,
    get_stock_history,
    search_stock,
    get_market_overview,
    get_stock_recommendation
)
router = APIRouter(
    prefix="/api/stocks",
    tags=["Stocks"]
)

# Search Stock
@router.get("/search")
def search(q: str):
    return search_stock(q)

@router.get("/market/overview")
def market_overview():
    return get_market_overview()

# Historical Data
@router.get("/history/{symbol}")
def history(
    symbol: str,
    period: str = Query("1mo")
):
    return get_stock_history(
        symbol.upper(),
        period
    )

# AI Recommendation
@router.get("/recommendation/{symbol}")
def recommendation(symbol: str):
    return get_stock_recommendation(symbol.upper())

@router.get("/news/{company}")
def stock_news(company: str):
    return get_stock_news(company)

# Stock Details (Always LAST)
@router.get("/{symbol}")
def get_stock(symbol: str):
    return get_stock_info(symbol.upper())

@router.get("/analyze/{symbol}")
def analyze(symbol: str):
    return analyze_stock(symbol.upper())