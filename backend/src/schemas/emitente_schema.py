from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class EmitenteBase(BaseModel):
    name: str
    cnpj: str
    phone: str
    email: str


class Emitente(EmitenteBase):
    id: int
    created_at: datetime
    updated_at: datetime
    active: bool


class EmitenteCreate(EmitenteBase):
    model_config = ConfigDict(extra='forbid', populate_by_name=True)

    name: str
    cnpj: str
    phone: str
    email: EmailStr


class EmitenteUpdate(BaseModel):
    model_config = ConfigDict(extra='forbid', populate_by_name=True)

    name: str
    cnpj: str
    phone: str
    email: EmailStr
    active: bool


class EmitenteRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    cnpj: str
    phone: str
    email: str
    created_at: datetime
    updated_at: datetime
    active: bool


class EmitenteToList(BaseModel):
    emitentes: list[EmitenteRead]


class EmitenteStatusChanget(BaseModel):
    active: bool
