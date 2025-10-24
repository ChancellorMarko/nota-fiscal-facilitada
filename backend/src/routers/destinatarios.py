from http import HTTPStatus
from http.client import BAD_REQUEST, HTTPException
from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_session
from src.repositories.destinatario_repository import DestinatarioRepository
from src.schemas.destinatario_schema import (
    DestinatarioList,
    DestinatarioRead,
    DestinatarioStatusChanger,
)

router = APIRouter(prefix='/destinatarios', tags=['destinatarios'])


def get_destinatario_repo(
    session: AsyncSession = Depends(get_session),
) -> DestinatarioRepository:
    return DestinatarioRepository(session)


DestrinetarioRepo = Annotated[DestinatarioRepository, Depends(get_destinatario_repo)]


@router.post('/', status_code=HTTPStatus.CREATED, response_model=List[DestinatarioRead])
async def create_destinatario(destinatario_in: DestinatarioCreate, repo: DestrinetarioRepo):
    if await repo.get_by_cpf_cnpj(destinatario_in.cpf_cnpj):
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT, detail='User with this CPF/CNPJ already exists!'
        )

    destinatario = DestinatarioModel(
        nome=destinatario_in.nome,
        cpf_cnpj=destinatario_in.cpf_cnpj,
        telefone=destinatario_in.telefone,
        email=destinatario_in.email,
    )

    return await repo.create(destinatario)


@router.get('/', status_code=HTTPStatus.OK, response_model=List[DestinatarioList])
async def list_destinatarios(repo: DestrinetarioRepo):
    return {'destinatarios': await repo.list_destinatarios()}


@router.get('/{destinatario_id}', status_code=HTTPStatus.OK, reponse_model=DestinatarioRead)
async def get_detisnatario_by_id(destinatario_id: int, repo: DestrinetarioRepo):
    db_destinatario = await repo.get_by_id(destinatario_id)

    if not db_destinatario:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Destinatario with this ID does not Exist!'
        )

    return db_destinatario


@router.get('/search', status_code=HTTPStatus.OK, response_model=List[DestinatarioRead])
async def search_destinatarios(
    q: str = Query(..., min_length=2, description="Termo de busca"),
    repo: DestrinetarioRepo,
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


@router.patch('/{destinatario_id}', status_code=HTTPStatus.OK, response_model=DestinatarioRead)
async def update_destinatario(
    destinatario_id: int,
    destinatario_in: DestinatarioUpdate,
    repo: DestrinetarioRepo,
):
    db_destinatario = await repo.get_by_id(destinatario_id)

    if not db_destinatario:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Destinatario with this ID does not Exist!'
        )

    updated_destinatario = await repo.update(destinatario_id, destinatario_in)

    return updated_destinatario

@router.patch('/{destinatario_id}', status_code=HTTPStatus.OK, response_model=DestinatarioRead)
async def deactivate_destinatario(
    destinatario_id: int,
    repo: DestrinetarioRepo,
):
    db_destinatario = await repo.get_by_id(destinatario_id)

    if not db_destinatario:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Destinatario with this ID does not Exist!',
        )

    if not db_destinatario.active:
        raise.HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail='User alreaady deactivated',
        )

    updated_destinatario = DestinatarioStatusChanger(active=False)
    return await repo.update(destinatario_id, updated_destinatario)