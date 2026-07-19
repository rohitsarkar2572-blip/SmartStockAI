from fastapi import FastAPI
from database.connection import db
from routes.auth import router as auth_router
from routes.stocks import router as stock_router
from routes.portfolio import router as portfolio_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Smart Stock AI API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(stock_router)
app.include_router(portfolio_router)

@app.get("/")
def home():
    return {
        "status": "success",
        "database": db.name
    }

