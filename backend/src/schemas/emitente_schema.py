from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class EmitenteBase(BaseModel):
    nome: str = Field(alias='name')
    cnpj: str
    telefone: str | None = Field(None, alias='phone')
    email: str | None = None


class Emitente(EmitenteBase):
    id: int
    created_at: datetime
    updated_at: datetime


class EmitenteCreate(EmitenteBase):
    model_config = ConfigDict(extra='forbid', populate_by_name=True)

    nome: str
    cnpj: str
    telefone: str | None = None
    email: EmailStr | None = None


class EmitenteUpdate(BaseModel):
    model_config = ConfigDict(extra='forbid', populate_by_name=True)

    nome: str | None = None
    cnpj: str | None = None
    telefone: str | None = None
    email: EmailStr | None = None


class EmitenteRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nome: str
    cnpj: str
    telefone: str | None = None
    email: str | None = None
    created_at: datetime
    updated_at: datetime


class EmitenteList(BaseModel):
    emitentes: list[EmitenteRead]
