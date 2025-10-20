from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 1. Importe o novo router junto com os outros
from src.routers import auth, users, nota_fiscal_router

app = FastAPI()

# Configuração CORS (continua igual)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registra os routers existentes
app.include_router(users.router)
app.include_router(auth.router)

# 2. Adicione o router da nota fiscal à aplicação
app.include_router(nota_fiscal_router.router)