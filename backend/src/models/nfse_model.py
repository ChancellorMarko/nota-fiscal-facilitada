from pydantic import BaseModel


class NotaFiscalBase(BaseModel):
    tomador: str
    valor: float
    servico: str

class NotaFiscalCreate(NotaFiscalBase):
    id: int
    numero: str
    data_emissao: str
    situacao: str

class NotaFiscalResponse(NotaFiscalBase):
    id: int
    numero: str
    data_emissao: str
    situacao: str

    class Config:
        from_attributes = True

