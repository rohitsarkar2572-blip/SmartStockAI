from collections import Counter


def analyze_portfolio(portfolio):
    if not portfolio:
        return {
            "score": 0,
            "risk": "Unknown",
            "diversification": "Poor",
            "suggestions": ["Portfolio is empty."]
        }

    total_value = sum(stock.get("current_value", 0) for stock in portfolio)

    if total_value == 0:
        total_value = 1

    # Risk Calculation
    largest_holding = max(
        portfolio,
        key=lambda x: x.get("current_value", 0)
    )

    largest_weight = (
        largest_holding.get("current_value", 0) / total_value
    ) * 100

    if largest_weight > 50:
        risk = "High"
        score = 55
    elif largest_weight > 30:
        risk = "Medium"
        score = 75
    else:
        risk = "Low"
        score = 90

    # Diversification
    sectors = []

    for stock in portfolio:
        sector = stock.get("sector")

        if sector:
            sectors.append(sector)

    unique_sectors = len(set(sectors))

    if unique_sectors >= 5:
        diversification = "Excellent"
        score += 10
    elif unique_sectors >= 3:
        diversification = "Good"
        score += 5
    else:
        diversification = "Poor"

    score = min(score, 100)

    suggestions = []

    if diversification == "Poor":
        suggestions.append(
            "Consider investing in more sectors."
        )

    if risk == "High":
        suggestions.append(
            "One stock occupies too much of your portfolio."
        )

    if risk == "Medium":
        suggestions.append(
            "Portfolio is moderately concentrated."
        )

    if diversification in ["Good", "Excellent"]:
        suggestions.append(
            "Portfolio is well diversified."
        )

    suggestions.append(
        f"Largest Holding: {largest_holding['symbol']}"
    )

    return {
        "score": score,
        "risk": risk,
        "diversification": diversification,
        "largest_holding": largest_holding["symbol"],
        "suggestions": suggestions
    }