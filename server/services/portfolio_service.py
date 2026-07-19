from bson import ObjectId

from models.portfolio import portfolio_collection
from services.stock_service import get_stock_info


def add_stock(data: dict):
    """
    Add stock to portfolio
    """
    result = portfolio_collection.insert_one(data)
    return str(result.inserted_id)


def get_portfolio(email: str):
    """
    Get all stocks of a user
    """
    portfolio = list(
        portfolio_collection.find({"email": email})
    )

    for stock in portfolio:
        stock["_id"] = str(stock["_id"])

    return portfolio


def get_portfolio_summary(email: str):
    """
    Get portfolio with live prices and profit/loss
    """
    portfolio = get_portfolio(email)

    summary = []

    for stock in portfolio:

        try:
            live = get_stock_info(stock["symbol"])

            current_price = live.get("price")

            # Invalid stock symbol ko skip karo
            if current_price is None:
                print(f"⚠ Invalid Symbol: {stock['symbol']}")
                continue

            investment = stock["buy_price"] * stock["quantity"]

            current_value = current_price * stock["quantity"]

            profit = current_value - investment

            if investment != 0:
                profit_percent = round(
                    (profit / investment) * 100,
                    2
                )
            else:
                profit_percent = 0

            summary.append({
                "_id": stock["_id"],
                "symbol": stock["symbol"],
                "quantity": stock["quantity"],
                "buy_price": stock["buy_price"],
                "current_price": current_price,
                "investment": round(investment, 2),
                "current_value": round(current_value, 2),
                "profit": round(profit, 2),
                "profit_percent": profit_percent
            })

        except Exception as e:
            print(f"Error for {stock['symbol']}: {e}")
            continue

    return summary


def delete_stock(stock_id: str):
    """
    Delete stock from portfolio
    """
    result = portfolio_collection.delete_one(
        {"_id": ObjectId(stock_id)}
    )

    return result.deleted_count


def update_stock(stock_id: str, quantity: int, buy_price: float):
    """
    Update quantity and buy price of a stock
    """

    result = portfolio_collection.update_one(
        {"_id": ObjectId(stock_id)},
        {
            "$set": {
                "quantity": quantity,
                "buy_price": buy_price
            }
        }
    )

    return result.modified_count


def get_portfolio_analytics(email: str):
    """
    Get overall portfolio analytics
    """

    summary = get_portfolio_summary(email)

    total_investment = sum(
        stock["investment"] for stock in summary
    )

    current_value = sum(
        stock["current_value"] for stock in summary
    )

    total_profit = current_value - total_investment

    if total_investment != 0:
        return_percent = round(
            (total_profit / total_investment) * 100,
            2
        )
    else:
        return_percent = 0

    return {
        "total_investment": round(total_investment, 2),
        "current_value": round(current_value, 2),
        "total_profit": round(total_profit, 2),
        "return_percent": return_percent
    }


def get_portfolio_highlights(email: str):
    """
    Get Top Gainer and Top Loser
    """

    summary = get_portfolio_summary(email)

    if not summary:
        return {
            "top_gainer": None,
            "top_loser": None
        }

    top_gainer = max(
        summary,
        key=lambda stock: stock["profit"]
    )

    top_loser = min(
        summary,
        key=lambda stock: stock["profit"]
    )

    return {
        "top_gainer": {
            "symbol": top_gainer["symbol"],
            "profit": top_gainer["profit"],
            "profit_percent": top_gainer["profit_percent"]
        },
        "top_loser": {
            "symbol": top_loser["symbol"],
            "profit": top_loser["profit"],
            "profit_percent": top_loser["profit_percent"]
        }
    }