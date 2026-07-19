from fastapi import APIRouter
from services.portfolio_ai_service import analyze_portfolio
from schemas.portfolio_schema import PortfolioItem
from schemas.update_portfolio_schema import UpdatePortfolioItem

from services.portfolio_service import (
    add_stock,
    get_portfolio,
    get_portfolio_summary,
    delete_stock,
    update_stock,
    get_portfolio_analytics,
    get_portfolio_highlights
)

router = APIRouter(
    prefix="/api/portfolio",
    tags=["Portfolio"]
)


@router.post("/add")
def add(item: PortfolioItem):

    stock_id = add_stock(item.model_dump())

    return {
        "message": "Stock Added Successfully",
        "id": stock_id
    }


@router.get("/summary/{email}")
def portfolio_summary(email: str):

    return get_portfolio_summary(email)


@router.get("/{email}")
def portfolio(email: str):

    return get_portfolio(email)

@router.delete("/delete/{stock_id}")
def delete(stock_id: str):

    deleted = delete_stock(stock_id)

    if deleted == 0:
        return {
            "message": "Stock not found"
        }

    return {
        "message": "Stock Deleted Successfully"
    }

@router.put("/update/{stock_id}")
def update(stock_id: str, item: UpdatePortfolioItem):

    updated = update_stock(
        stock_id,
        item.quantity,
        item.buy_price
    )

    if updated == 0:
        return {
            "message": "Stock not found or no changes made"
        }

    return {
        "message": "Stock Updated Successfully"
    }

@router.get("/analytics/{email}")
def portfolio_analytics(email: str):

    return get_portfolio_analytics(email)

@router.get("/ai-analysis/{email}")
def portfolio_ai_analysis(email: str):
    portfolio = get_portfolio_summary(email)

    return analyze_portfolio(portfolio)

@router.get("/highlights/{email}")
def portfolio_highlights(email: str):

    return get_portfolio_highlights(email)