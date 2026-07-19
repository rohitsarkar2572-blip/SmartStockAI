import yfinance as yf
import pandas as pd


def get_stock_info(symbol: str):

    stock = yf.Ticker(symbol)

    info = stock.info

    return {
        "symbol": symbol,
        "name": info.get("longName"),
        "price": (
            info.get("currentPrice")
            or info.get("regularMarketPrice")
            or info.get("previousClose")
        ),
        "currency": info.get("currency"),
        "sector": info.get("sector"),
        "industry": info.get("industry"),
        "market_cap": info.get("marketCap")
    }


def get_stock_history(symbol: str, period: str = "1mo"):

    stock = yf.Ticker(symbol)

    history = stock.history(period=period)

    data = []

    for index, row in history.iterrows():

        data.append({
            "date": index.strftime("%Y-%m-%d"),
            "open": round(row["Open"], 2),
            "high": round(row["High"], 2),
            "low": round(row["Low"], 2),
            "close": round(row["Close"], 2),
            "volume": int(row["Volume"])
        })

    return data


def search_stock(query: str):

    search = yf.Search(query)

    quotes = search.quotes

    result = []

    for stock in quotes:

        result.append({
            "symbol": stock.get("symbol"),
            "name": stock.get("shortname") or stock.get("longname") or stock.get("symbol"),
            "exchange": stock.get("exchange")
        })

    return result[:10]


def get_market_overview():

    indices = [
        ("^GSPC", "S&P 500"),
        ("^DJI", "Dow Jones"),
        ("^IXIC", "NASDAQ")
    ]

    result = []

    for symbol, name in indices:

        stock = yf.Ticker(symbol)

        info = stock.fast_info

        history = stock.history(period="2d")

        change = 0

        if len(history) >= 2:

            previous_close = history["Close"].iloc[-2]
            current_price = history["Close"].iloc[-1]

            change = round(
                ((current_price - previous_close) / previous_close) * 100,
                2
            )

        result.append({
            "symbol": symbol,
            "name": name,
            "price": round(info["lastPrice"], 2),
            "change_percent": change
        })

    return result

def get_stock_recommendation(symbol):
    try:
        stock = yf.Ticker(symbol)

        # Last 6 months data
        hist = stock.history(period="6mo")

        if hist.empty:
            return {
                "symbol": symbol,
                "recommendation": "NO DATA",
                "score": 0,
                "current_price": 0,
                "ma20": 0,
                "ma50": 0,
                "reason": ["No historical data found."]
            }

        close = hist["Close"]

        current_price = round(float(close.iloc[-1]), 2)
        ma20 = round(float(close.rolling(window=20).mean().iloc[-1]), 2)
        ma50 = round(float(close.rolling(window=50).mean().iloc[-1]), 2)

        score = 50
        reasons = []

        # Price vs MA20
        if current_price > ma20:
            score += 15
            reasons.append("Price above 20-Day Moving Average")
        else:
            score -= 15
            reasons.append("Price below 20-Day Moving Average")

        # Price vs MA50
        if current_price > ma50:
            score += 20
            reasons.append("Price above 50-Day Moving Average")
        else:
            score -= 20
            reasons.append("Price below 50-Day Moving Average")

        # Trend Analysis
        if ma20 > ma50:
            score += 15
            reasons.append("Bullish Trend (MA20 > MA50)")

        elif ma20 < ma50:
            score -= 15
            reasons.append("Bearish Trend (MA20 < MA50)")

        else:
            reasons.append("Neutral Trend")

        # Strong Bullish Bonus
        if current_price > ma20 and current_price > ma50 and ma20 > ma50:
            score += 10
            reasons.append("Strong Bullish Confirmation")

        # Strong Bearish Penalty
        if current_price < ma20 and current_price < ma50 and ma20 < ma50:
            score -= 10
            reasons.append("Strong Bearish Confirmation")

        # Limit score
        score = max(0, min(score, 100))

        # Recommendation
        if score >= 80:
            recommendation = "BUY"
        elif score >= 50:
            recommendation = "HOLD"
        else:
            recommendation = "SELL"

        return {
            "symbol": symbol,
            "recommendation": recommendation,
            "score": score,
            "current_price": current_price,
            "ma20": ma20,
            "ma50": ma50,
            "reason": reasons
        }

    except Exception as e:
        return {
            "symbol": symbol,
            "recommendation": "ERROR",
            "score": 0,
            "current_price": 0,
            "ma20": 0,
            "ma50": 0,
            "reason": [str(e)]
        }