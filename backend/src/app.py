from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.routers import auth, notas_fiscais, users, cliente_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://localhost:3000',  
        'http://localhost:5173',  
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


app.include_router(users.router)
app.include_router(auth.router)
app.include_router(notas_fiscais.router)
app.include_router(cliente_router.router)