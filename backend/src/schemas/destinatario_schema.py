from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class DestinatarioBase(BaseModel):
    name: str
    cpf: str
    phone: str | None = None
    email: str | None = None


class Destinatario(DestinatarioBase):
    id: int
    created_at: datetime
    updated_at: datetime
    active: bool


class DestinatarioCreate(DestinatarioBase):
    model_config = ConfigDict(extra='forbid')

    name: str
    cpf: str
    phone: str | None = None
    email: EmailStr | None = None


class DestinatarioUpdate(BaseModel):
    model_config = ConfigDict(extra='forbid')

    name: str | None = None
    cpf: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    active: bool | None = None


class DestinatarioRead(DestinatarioBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
    active: bool


class DestinatarioList(BaseModel):
    destinatarios: list[DestinatarioRead]


class DestinatarioStatusChanger(BaseModel):
    active: bool
