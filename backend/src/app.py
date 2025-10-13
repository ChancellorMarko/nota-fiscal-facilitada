from fastapi import FastAPI

from espumosa.routers import auth, categories, users

app = FastAPI()

app.include_router(users.router)
app.include_router(auth.router)
app.include_router(categories.router)
