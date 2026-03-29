from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import tax, investment, chat
import uvicorn

app = FastAPI(
    title="DhanSathi API",
    description="India's First AI Financial Advisor — Tax & Investment Intelligence",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tax.router,        prefix="/api/v1", tags=["Tax Advisor"])
app.include_router(investment.router, prefix="/api/v1", tags=["Investment Advisor"])
app.include_router(chat.router,       prefix="/api/v1", tags=["Chat"])

@app.get("/")
def root():
    return {"message": "DhanSathi API is live 🚀", "docs": "/docs"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
