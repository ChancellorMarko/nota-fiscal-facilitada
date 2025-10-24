from sqlalchemy import Boolean, String, text
from sqlalchemy.orm import Mapped, mapped_column

from src.models.abstract_base import AbstractBaseModel
from src.models.registry import table_registry


@table_registry.mapped_as_dataclass
class Destinatario(AbstractBaseModel):
    __tablename__ = 'destinatarios'

    nome: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    cnpj: Mapped[str] = mapped_column(
        String(20), unique=True, nullable=False, index=True
    )
    telefone: Mapped[str] = mapped_column(
        String(20), nullable=True, index=True
    )
    email: Mapped[str] = mapped_column(String(100), nullable=True, index=True)
    ativo: Mapped[bool] = mapped_column(
        Boolean, default=True, server_default=text('true'), nullable=False
    )
