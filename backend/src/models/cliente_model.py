# Arquivo: src/models/cliente_model.py

from sqlalchemy import String, Enum
from sqlalchemy.orm import Mapped, mapped_column
import enum

from src.models.abstract_base import AbstractBaseModel
from src.models.registry import table_registry

class TipoPessoa(str, enum.Enum):
    FISICA = "Física"
    JURIDICA = "Jurídica"

@table_registry.mapped_as_dataclass
class ClienteModel(AbstractBaseModel):
    __tablename__ = "clientes"

    nome: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    documento: Mapped[str] = mapped_column(String(18), unique=True, nullable=False, index=True)
    tipo: Mapped[TipoPessoa] = mapped_column(Enum(TipoPessoa), nullable=False)
    email: Mapped[str | None] = mapped_column(String(100))
    endereco: Mapped[str | None] = mapped_column(String(255))
    telefone: Mapped[str | None] = mapped_column(String(20))