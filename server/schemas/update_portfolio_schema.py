from pydantic import BaseModel

class UpdatePortfolioItem(BaseModel):
    quantity: int
    buy_price: float