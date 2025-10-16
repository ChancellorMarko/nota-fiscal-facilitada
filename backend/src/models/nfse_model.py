from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.abstract_base import AbstractBaseModel
from src.models.registry import table_registry

@table_registry.mapped_as_dataclass
class NfseModel(AbstractBaseModel):
    __tablename__ = "nfse"

    tomador: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    numero: Mapped[str] = mapped_column(String(100), nullable=False)
    valor: Mapped[float] = mapped_column(String(100), nullable=False)
    servico: Mapped[str] = mapped_column(String(100), nullable=False)
    situacao: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
