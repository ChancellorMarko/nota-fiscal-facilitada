import uuid
from datetime import datetime
from typing import List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="API Mock NFSe Maringá")

class NotaFiscal(BaseModel):
    id: str
    numero: str
    tomador: str
    valor: float
    data_emissao: str
    servico: str
    situacao: str

# Banco em memória
notas_fiscais = []

@app.get("/notas-fiscais", response_model=List[NotaFiscal])
def listar_notas():
    return notas_fiscais

@app.post("/notas-fiscais", response_model=NotaFiscal)
def emitir_nota(tomador: str, valor: float, servico: str):
    nova_nota = NotaFiscal(
        id=str(uuid.uuid4()),
        numero=f"NF{len(notas_fiscais) + 1:06d}",
        tomador=tomador,
        valor=valor,
        data_emissao=datetime.now().isoformat(),
        servico=servico,
        situacao="EMITIDA"
    )
    notas_fiscais.append(nova_nota)
    return nova_nota

@app.get("/notas-fiscais/{nota_id}", response_model=NotaFiscal)
def consultar_nota(nota_id: str):
    for nota in notas_fiscais:
        if nota.id == nota_id:
            return nota
    raise HTTPException(status_code=404, detail="Nota não encontrada")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)