from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class NotaFiscalBase(BaseModel):
    tomador_documento: str
    tomador_nome: str
    tomador_email: str | None = None
    discriminacao: str
    codigo_servico: str | None = None
    valor_servicos: float = Field(..., gt=0)
    aliquota_iss: float = Field(..., ge=0)

class NotaFiscalCreate(NotaFiscalBase):
    model_config = ConfigDict(extra='forbid')

class NotaFiscalRead(NotaFiscalBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    situacao: str
    numero_nfse: str | None
    created_at: datetime

class NotaFiscalList(BaseModel):
    notas_fiscais: list[NotaFiscalRead]