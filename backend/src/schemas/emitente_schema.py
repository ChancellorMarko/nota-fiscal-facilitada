from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class EmitenteBase(BaseModel):
    name: str
    cnpj: str
    phone: str | None = None
    email: str | None = None


class Emitente(EmitenteBase):
    id: int
    created_at: datetime
    updated_at: datetime


class EmitenteCreate(EmitenteBase):
    model_config = ConfigDict(extra='forbid')

    name: str
    cnpj: str
    phone: str | None = None
    email: EmailStr | None = None


class EmitenteUpdate(BaseModel):
    model_config = ConfigDict(extra='forbid')

    name: str | None = None
    cnpj: str | None = None
    phone: str | None = None
    email: EmailStr | None = None


class EmitenteRead(EmitenteBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class EmitenteList(BaseModel):
    emitentes: list[EmitenteRead]
