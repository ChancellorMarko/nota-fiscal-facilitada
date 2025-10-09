from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .db.database import Database
from .models.nfse_model import NotaFiscalCreate

app = FastAPI(
    title="NFSe API",
    description="API para emissão de notas fiscais de serviço",
    version="1.0.0",
)

# Configurar CORS para o frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = Database()


@app.get("/")
async def root():
    return {"message": "NFSe API - Backend funcionando!"}


@app.get("/api/notas-fiscais")
async def listar_notas_fiscais():
    try:
        notas = db.get_all_notas()
        return {"notas": notas}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/notas-fiscais", response_model=dict)
async def emitir_nota_fiscal(nota_data: NotaFiscalCreate):
    try:
        numero_nota = f"NF{int(datetime.now().timestamp())}"

        nota_id = db.create_nota(
            numero=numero_nota,
            tomador=nota_data.tomador,
            valor=nota_data.valor,
            servico=nota_data.servico,
        )

        return {
            "message": "Nota fiscal emitida com sucesso!",
            "nota_id": nota_id,
            "numero": numero_nota,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/notas-fiscais/{nota_id}")
async def consultar_nota_fiscal(nota_id: int):
    nota = db.get_nota_by_id(nota_id)
    if not nota:
        raise HTTPException(status_code=404, detail="Nota fiscal não encontrada")
    return nota
