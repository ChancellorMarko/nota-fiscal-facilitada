from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field


class NotaFiscalBase(BaseModel):
    numero_nota: str = Field(..., max_length=50)
    serie: str = Field(..., max_length=20)
    cfop: str = Field(..., max_length=10)

    nome_emitente: str = Field(..., max_length=100)
    cnpj_emitente: str = Field(..., max_length=18)

    nome_destinatario: str = Field(..., max_length=100)
    cpf_ou_cnpj_destinatario: str = Field(..., max_length=18)

    valor_total: Decimal = Field(..., gt=0)
    icms: Decimal | None = Field(None, ge=0)
    pis: Decimal | None = Field(None, ge=0)
    cofins: Decimal | None = Field(None, ge=0)
    desconto: Decimal | None = Field(None, ge=0)


class NotaFiscalCreate(NotaFiscalBase):
    # Proíbe campos extras no payload de criação
    model_config = ConfigDict(extra='forbid')


class NotaFiscalRead(NotaFiscalBase):
    # Permite leitura a partir de instâncias ORM/dataclasses
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class NotaFiscalList(BaseModel):
    notas_fiscais: list[NotaFiscalRead]
