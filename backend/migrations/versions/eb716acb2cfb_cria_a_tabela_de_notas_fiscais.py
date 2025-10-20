"""Cria a tabela de notas fiscais

Revision ID: eb716acb2cfb
Revises: 64134d8a82d1
Create Date: 2025-10-20 00:01:03.778321

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'eb716acb2cfb'
down_revision: Union[str, Sequence[str], None] = '64134d8a82d1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
