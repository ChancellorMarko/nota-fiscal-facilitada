from http import HTTPStatus
from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_session
from src.repositories.destinatario_repository import DestinatarioRepository
from src.schemas.destinatario_schema import (
    DestinatarioRead,
)

router = APIRouter(prefix='/destinatarios', tags=['destinatarios'])


def get_destinatario_repo(
    session: AsyncSession = Depends(get_session),
) -> DestinatarioRepository:
    return DestinatarioRepository(session)


@router.get('/search', status_code=HTTPStatus.OK, response_model=List[DestinatarioRead])
async def search_destinatarios(
    q: str = Query(..., min_length=2, description="Termo de busca"),
    repo: DestinatarioRepository = Depends(get_destinatario_repo),
):
    """
    Busca destinatários por nome ou CPF/CNPJ para autocomplete.
    Retorna no máximo 10 resultados.
    """
    # Remove caracteres especiais do documento para busca
    q_clean = q.replace('.', '').replace('/', '').replace('-', '')

    # Busca por nome ou documento
    destinatarios = await repo.search(q, q_clean, limit=10)

    return destinatarios
