import os
import requests
from dotenv import load_dotenv

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
SYMBOL_MAP = {
    "RELIANCE.NS": "Reliance Industries",
    "TCS.NS": "Tata Consultancy Services",
    "INFY.NS": "Infosys",
    "HDFCBANK.NS": "HDFC Bank",
    "ICICIBANK.NS": "ICICI Bank",
    "SBIN.NS": "State Bank of India",
    "LT.NS": "Larsen & Toubro",
    "ITC.NS": "ITC",
    "BHARTIARTL.NS": "Bharti Airtel",
    "HINDUNILVR.NS": "Hindustan Unilever"
}


def get_stock_news(company_name: str):
    company_name = SYMBOL_MAP.get(company_name.upper(), company_name)
    try:
        url = "https://newsapi.org/v2/everything"

        params = {
                "qInTitle": company_name,
                "language": "en",
                "sortBy": "publishedAt",
                "pageSize": 5,
                "searchIn": "title,description",
                "apiKey": NEWS_API_KEY
                }

        response = requests.get(url, params=params)
        data = response.json()

        articles = []

        if "articles" not in data:
            return []

        for article in data["articles"]:
            articles.append({
                "title": article.get("title"),
                "description": article.get("description"),
                "url": article.get("url"),
                "image": article.get("urlToImage"),
                "publishedAt": article.get("publishedAt"),
                "source": article.get("source", {}).get("name")
            })

        return articles

    except Exception as e:
        return [{"error": str(e)}]