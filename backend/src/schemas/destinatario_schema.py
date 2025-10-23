from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class DestinatarioBase(BaseModel):
    nome: str = Field(alias='name')
    cpf_cnpj: str = Field(alias='cpf')
    telefone: str | None = Field(None, alias='phone')
    email: str | None = None


class Destinatario(DestinatarioBase):
    id: int
    created_at: datetime
    updated_at: datetime
    ativo: bool = Field(alias='active')


class DestinatarioCreate(DestinatarioBase):
    model_config = ConfigDict(extra='forbid', populate_by_name=True)

    nome: str
    cpf_cnpj: str
    telefone: str | None = None
    email: EmailStr | None = None


class DestinatarioUpdate(BaseModel):
    model_config = ConfigDict(extra='forbid', populate_by_name=True)

    nome: str | None = None
    cpf_cnpj: str | None = None
    telefone: str | None = None
    email: EmailStr | None = None
    ativo: bool | None = None


class DestinatarioRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nome: str
    cpf_cnpj: str = Field(validation_alias='cnpj')
    telefone: str | None = None
    email: str | None = None
    created_at: datetime
    updated_at: datetime
    ativo: bool


class DestinatarioList(BaseModel):
    destinatarios: list[DestinatarioRead]


class DestinatarioStatusChanger(BaseModel):
    ativo: bool = Field(alias='active')
