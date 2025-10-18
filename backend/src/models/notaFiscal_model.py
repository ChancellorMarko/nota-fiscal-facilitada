from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column

from src.models.registry import table_registry
from src.models.abstract_base import AbstractBaseModel  

@table_registry.mapped_as_dataclass
class NotaFiscal(AbstractBaseModel):
    """
    Modelo que representa uma Nota Fiscal no sistema.

    Herda de AbstractBaseModel, que já fornece:
    - id (chave primária)
    - created_at (data de criação)
    - updated_at (data de atualização)
    """

    __tablename__ = "nota_fiscal"

    # Identificação da Nota Fiscal
    numero_nota: Mapped[str] = mapped_column(String(50), nullable=False)
    serie: Mapped[str] = mapped_column(String(20), nullable=False)
    cfop: Mapped[str] = mapped_column(String(10), nullable=False)

    # Dados do Emitente
    nome_emitente: Mapped[str] = mapped_column(String(100), nullable=False)
    cnpj_emitente: Mapped[str] = mapped_column(String(18), nullable=False)

    # Dados do Destinatário
    nome_destinatario: Mapped[str] = mapped_column(String(100), nullable=False)
    cpf_ou_cnpj_destinatario: Mapped[str] = mapped_column(String(18), nullable=False)

    # Valores e Impostos
    valor_total: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    icms: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)
    pis: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)
    cofins: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)
    desconto: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)

