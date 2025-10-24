from datetime import datetime

from sqlalchemy import Integer, func
from sqlalchemy.orm import Mapped, mapped_column

from src.models.registry import table_registry


@table_registry.mapped_as_dataclass
class AbstractBaseModel:
    """
    Classe base abstrata para modelos do banco de dados.

    - Define uma chave primária auto incrementável (id).
    - Registra a data de criação do registro (created_at).
    - Deve ser herdada por todas as entidades do domínio.
    """

    __abstract__ = True  # Indica que esta classe não será mapeada como tabela

    id: Mapped[int] = mapped_column(Integer, primary_key=True, init=False)
    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), nullable=False, init=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
        init=False,
    )
