from http import HTTPStatus
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_session
from src.models.emitente_model import EmitenteModel
from src.repositories.emitente_repository import EmitenteRepository
from src.schemas.emitente_schema import (
    EmitenteCreate,
    EmitenteRead,
    EmitenteToList,
    EmitenteUpdate,
)

router = APIRouter(prefix='/emitentes', tags=['emitentes'])


def get_emitente_repo(
    session: AsyncSession = Depends(get_session),
) -> EmitenteRepository:
    return EmitenteRepository(session)


EmitenteRepo = Annotated[EmitenteRepository, Depends(get_emitente_repo)]


@router.post('/', status_code=HTTPStatus.CREATED, response_model=EmitenteRead)
async def create_emitente(emitente_in: EmitenteCreate, repo: EmitenteRepo):
    if await repo.get_by_cnpj(emitente_in.cnpj):
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT,
            detail='Emitente with this CNPJ already exists!',
        )

    emitente = EmitenteModel(
        nome=emitente_in.nome,
        cnpj=emitente_in.cnpj,
        telefone=emitente_in.telefone,
        email=emitente_in.email,
    )

    return await repo.create(emitente)


@router.get('/', status_code=HTTPStatus.OK, response_model=EmitenteToList)
async def list_emitentes(repo: EmitenteRepo):
    emitentes = await repo.list_emitentes()
    return {'emitentes': emitentes}


@router.get(
    '/{emitente_id}', status_code=HTTPStatus.OK, response_model=EmitenteRead
)
async def get_emitente_by_id(emitente_id: int, repo: EmitenteRepo):
    db_emitente = await repo.get_by_id(emitente_id)

    if not db_emitente:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Emitente with this ID does not exist!',
        )

    return db_emitente


@router.get(
    '/search', status_code=HTTPStatus.OK, response_model=List[EmitenteRead]
)
async def search_emitentes(
    q: str = Query(..., min_length=2, description='Termo de busca'),
    repo: EmitenteRepository = Depends(get_emitente_repo)
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


@router.patch(
    '/{emitente_id}', status_code=HTTPStatus.OK, response_model=EmitenteRead
)
async def update_emitente(
    emitente_id: int, emitente_in: EmitenteUpdate, repo: EmitenteRepo
):
    db_emitente = await repo.get_by_id(emitente_id)

    if not db_emitente:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Emitente with this ID does not exist!',
        )

    updated_emitente = await repo.update(emitente_id, emitente_in)
    return updated_emitente


@router.patch(
    '/{emitente_id}/deactivate',
    status_code=HTTPStatus.OK,
    response_model=EmitenteRead,
)
async def deactivate_emitente(emitente_id: int, repo: EmitenteRepo):
    db_emitente = await repo.get_by_id(emitente_id)

    if not db_emitente:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Emitente with this ID does not exist!',
        )

    if not db_emitente.active:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail='Emitente already deactivated',
        )

    update_data = EmitenteUpdate(active=False)
    updated_emitente = await repo.update(emitente_id, update_data)
    return updated_emitente


@router.patch(
    '/{emitente_id}/activate',
    status_code=HTTPStatus.OK,
    response_model=EmitenteRead,
)
async def activate_emitente(emitente_id: int, repo: EmitenteRepo):
    db_emitente = await repo.get_by_id(emitente_id)

    if not db_emitente:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Emitente with this ID does not exist!',
        )

    if db_emitente.active:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail='Emitente already activated',
        )

    update_data = EmitenteUpdate(active=True)
    updated_emitente = await repo.update(emitente_id, update_data)
    return updated_emitente
