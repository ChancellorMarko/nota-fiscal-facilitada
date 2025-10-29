from http import HTTPStatus
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_session
from src.models.destinatario_model import DestinatarioModel
from src.models.user_model import UserModel
from src.repositories.destinatario_repository import DestinatarioRepository
from src.schemas.destinatario_schema import (
    DestinatarioCreate,
    DestinatarioList,
    DestinatarioRead,
    DestinatarioUpdate,
)
from src.security import get_current_user

router = APIRouter(prefix='/destinatarios', tags=['destinatarios'])


def get_destinatario_repo(
    session: AsyncSession = Depends(get_session),
) -> DestinatarioRepository:
    return DestinatarioRepository(session)


DestinatarioRepo = Annotated[
    DestinatarioRepository, Depends(get_destinatario_repo)
]


@router.post(
    '/', status_code=HTTPStatus.CREATED, response_model=DestinatarioRead
)
async def create_destinatario(
    destinatario_in: DestinatarioCreate,
    repo: DestinatarioRepo,
    current_user: UserModel = Depends(get_current_user),
):
    if await repo.get_by_cpf_cnpj(destinatario_in.cpf_cnpj):
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT,
            detail='Destinatario with this CPF/CNPJ already exists!',
        )

    destinatario = DestinatarioModel(
        name=destinatario_in.name,
        cpf_cnpj=destinatario_in.cpf_cnpj,
        phone=destinatario_in.phone,
        email=destinatario_in.email,
    )

    return await repo.create(destinatario)


@router.get('/', status_code=HTTPStatus.OK, response_model=DestinatarioList)
async def list_destinatarios(
    repo: DestinatarioRepo,
    current_user: UserModel = Depends(get_current_user),
):
    destinatarios = await repo.list_destinatarios()
    return {'destinatarios': destinatarios}


@router.get(
    '/search', status_code=HTTPStatus.OK, response_model=List[DestinatarioRead]
)
async def search_destinatarios(
    q: str = Query(..., min_length=2, description='Termo de busca'),
    repo: DestinatarioRepository = Depends(get_destinatario_repo),
    current_user: UserModel = Depends(get_current_user),
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


@router.get(
    '/{destinatario_id}',
    status_code=HTTPStatus.OK,
    response_model=DestinatarioRead,
)
async def get_destinatario_by_id(
    destinatario_id: int,
    repo: DestinatarioRepo,
    current_user: UserModel = Depends(get_current_user),
):
    db_destinatario = await repo.get_by_id(destinatario_id)

    if not db_destinatario:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Destinatario with this ID does not exist!',
        )

    return db_destinatario


@router.patch(
    '/{destinatario_id}',
    status_code=HTTPStatus.OK,
    response_model=DestinatarioRead,
)
async def update_destinatario(
    destinatario_id: int,
    destinatario_in: DestinatarioUpdate,
    repo: DestinatarioRepo,
    current_user: UserModel = Depends(get_current_user),
):
    db_destinatario = await repo.get_by_id(destinatario_id)

    if not db_destinatario:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Destinatario with this ID does not exist!',
        )

    updated_destinatario = await repo.update(destinatario_id, destinatario_in)
    return updated_destinatario


@router.patch(
    '/{destinatario_id}/deactivate',
    status_code=HTTPStatus.OK,
    response_model=DestinatarioRead,
)
async def deactivate_destinatario(
    destinatario_id: int,
    repo: DestinatarioRepo,
    current_user: UserModel = Depends(get_current_user),
):
    db_destinatario = await repo.get_by_id(destinatario_id)

    if not db_destinatario:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Destinatario with this ID does not exist!',
        )

    if not db_destinatario.active:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail='Destinatario already deactivated',
        )

    update_data = DestinatarioUpdate(active=False)
    updated_destinatario = await repo.update(destinatario_id, update_data)
    return updated_destinatario


@router.patch(
    '/{destinatario_id}/activate',
    status_code=HTTPStatus.OK,
    response_model=DestinatarioRead,
)
async def activate_destinatario(
    destinatario_id: int,
    repo: DestinatarioRepo,
    current_user: UserModel = Depends(get_current_user),
):
    db_destinatario = await repo.get_by_id(destinatario_id)

    if not db_destinatario:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Destinatario with this ID does not exist!',
        )

    if db_destinatario.active:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail='Destinatario already activated',
        )

    update_data = DestinatarioUpdate(active=True)
    updated_destinatario = await repo.update(destinatario_id, update_data)
    return updated_destinatario
