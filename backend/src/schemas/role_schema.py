from datetime import datetime

from pydantic import BaseModel, ConfigDict


class RoleBase(BaseModel):
    name: str
    description: str


class Role(RoleBase):
    id: int
    active: bool
    created_at: datetime
    updated_at: datetime


class RoleCreate(RoleBase):
    model_config = ConfigDict(extra='forbid')


class RoleUpdate(BaseModel):
    model_config = ConfigDict(extra='forbid')

    name: str
    description: str


class RoleRead(RoleBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    active: bool
    created_at: datetime
    updated_at: datetime


class RoleList(BaseModel):
    roles: list[RoleRead]


class RoleStatusChanger(BaseModel):
    active: bool
