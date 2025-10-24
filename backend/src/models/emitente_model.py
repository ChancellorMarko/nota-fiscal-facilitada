from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.abstract_base import AbstractBaseModel
from src.models.registry import table_registry


@table_registry.mapped_as_dataclass
class EmitenteModel(AbstractBaseModel):
    __tablename__ = 'emitentes'

    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    cnpj: Mapped[str] = mapped_column(
        String(20), unique=True, nullable=False, index=True
    )
    phone: Mapped[str] = mapped_column(String(20), nullable=True, index=True)
    email: Mapped[str] = mapped_column(String(100), nullable=True, index=True)
    active: Mapped[bool] = mapped_column(
        Boolean, default=True, server_default=text('true'), nullable=False
    )
