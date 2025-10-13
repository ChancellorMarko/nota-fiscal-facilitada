from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from src.validators.phone_number_validator import PhoneNumber


class UserBase(BaseModel):
    name: str
    email: str
    phone: str


class User(UserBase):
    id: int
    active: bool
    password: str
    created_at: datetime
    updated_at: datetime


class UserCreate(UserBase):
    model_config = ConfigDict(extra='forbid')

    email: EmailStr
    phone: PhoneNumber
    password: str


class UserUpdate(BaseModel):
    model_config = ConfigDict(extra='forbid')

    name: str | None = None
    email: EmailStr | None = None
    phone: PhoneNumber | None = None
    password: str | None = None


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    active: bool
    created_at: datetime
    updated_at: datetime


class UserList(BaseModel):
    users: list[UserRead]


class UserStatusChanger(BaseModel):
    active: bool
