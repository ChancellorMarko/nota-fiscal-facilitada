from sqlalchemy import Boolean, String, text
from sqlalchemy.orm import Mapped, mapped_column

from src.models.abstract_base import AbstractBaseModel
from src.models.registry import table_registry


@table_registry.mapped_as_dataclass
class UserModel(AbstractBaseModel):
    __tablename__ = 'users'

    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    email: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False, index=True
    )
    phone: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    active: Mapped[bool] = mapped_column(
        Boolean, default=True, server_default=text('true'), nullable=False
    )
