from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr


class DestinatarioBase(BaseModel):
    name: str
    cpf_cnpj: str
    phone: str
    email: str


class Destinatario(DestinatarioBase):
    id: int
    created_at: datetime
    updated_at: datetime
    active: bool


class DestinatarioCreate(DestinatarioBase):
    model_config = ConfigDict(extra='forbid', populate_by_name=True)

    name: str
    cpf_cnpj: str
    phone: str
    email: EmailStr


class DestinatarioUpdate(BaseModel):
    model_config = ConfigDict(extra='forbid', populate_by_name=True)

    name: Optional[str] = None
    cpf_cnpj: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    active: Optional[bool] = None


class DestinatarioRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    cpf_cnpj: str
    phone: str
    email: str
    created_at: datetime
    updated_at: datetime
    active: bool


class DestinatarioList(BaseModel):
    destinatarios: list[DestinatarioRead]


class DestinatarioStatusChanger(BaseModel):
    active: bool
