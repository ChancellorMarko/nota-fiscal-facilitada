# Arquivo: src/schemas/cliente_schema.py

from pydantic import BaseModel, ConfigDict
from datetime import datetime

# Reutilizamos o Enum do modelo para garantir consistência
from src.models.cliente_model import TipoPessoa

class ClienteBase(BaseModel):
    nome: str
    documento: str
    tipo: TipoPessoa
    email: str | None = None
    endereco: str | None = None
    telefone: str | None = None

class ClienteCreate(ClienteBase):
    model_config = ConfigDict(extra='forbid')

class ClienteRead(ClienteBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    updated_at: datetime

class ClienteList(BaseModel):
    clientes: list[ClienteRead]