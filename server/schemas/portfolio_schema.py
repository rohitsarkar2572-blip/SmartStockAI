from pydantic import BaseModel

class PortfolioItem(BaseModel):
    email: str
    symbol: str
    quantity: int
    buy_price: float