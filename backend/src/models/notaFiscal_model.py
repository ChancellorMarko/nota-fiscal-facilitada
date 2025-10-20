from sqlalchemy import String, Numeric, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column

from src.models.abstract_base import AbstractBaseModel
from src.models.registry import table_registry

@table_registry.mapped_as_dataclass
class NotaFiscalModel(AbstractBaseModel):
    __tablename__ = "notas_fiscais"

    # --- Relacionamento com o Usuário que emitiu ---
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))

    # --- Dados do Tomador (Cliente) ---
    tomador_documento: Mapped[str] = mapped_column(String(14), index=True)
    tomador_nome: Mapped[str] = mapped_column(String(100))
    tomador_email: Mapped[str | None] = mapped_column(String(100))

    # --- Dados do Serviço Prestado ---
    discriminacao: Mapped[str] = mapped_column(Text) # Descrição do serviço
    codigo_servico: Mapped[str | None] = mapped_column(String(20))

    # --- Valores ---
    valor_servicos: Mapped[float] = mapped_column(Numeric(10, 2))
    aliquota_iss: Mapped[float] = mapped_column(Numeric(5, 2))

    # --- Controle Interno ---
    situacao: Mapped[str] = mapped_column(String(30), default="Rascunho", index=True)
    numero_nfse: Mapped[str | None] = mapped_column(String(50), unique=True)