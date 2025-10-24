from http import HTTPStatus
from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_session
from src.repositories.emitente_repository import EmitenteRepository
from src.schemas.emitente_schema import (
    EmitenteRead,
)

router = APIRouter(prefix='/emitentes', tags=['emitentes'])


def get_emitente_repo(
    session: AsyncSession = Depends(get_session),
) -> EmitenteRepository:
    return EmitenteRepository(session)


@router.get(
    '/search', status_code=HTTPStatus.OK, response_model=List[EmitenteRead]
)
async def search_emitentes(
    q: str = Query(..., min_length=2, description='Termo de busca'),
    repo: EmitenteRepository = Depends(get_emitente_repo),
):
    """
    Busca emitentes por nome ou CNPJ para autocomplete.
    Retorna no máximo 10 resultados.
    """
    # Remove caracteres especiais do CNPJ para busca
    q_clean = q.replace('.', '').replace('/', '').replace('-', '')

    # Busca por nome ou CNPJ
    emitentes = await repo.search(q, q_clean, limit=10)

    return emitentes
