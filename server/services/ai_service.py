import yfinance as yf


def analyze_stock(symbol: str):

    stock = yf.Ticker(symbol)

    hist = stock.history(period="1mo")

    if hist.empty:
        return {
            "error": "No Data"
        }

    current = hist["Close"].iloc[-1]
    previous = hist["Close"].iloc[0]

    change = ((current - previous) / previous) * 100

    if change > 5:
        signal = "BUY"

    elif change < -5:
        signal = "SELL"

    else:
        signal = "HOLD"

    return {
        "symbol": symbol,
        "current_price": round(current, 2),
        "change_percent": round(change, 2),
        "signal": signal
    }