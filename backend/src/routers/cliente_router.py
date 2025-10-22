# Arquivo: src/routers/cliente_router.py

from http import HTTPStatus
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_session
from src.models.user_model import UserModel
from src.models.cliente_model import ClienteModel, TipoPessoa
from src.repositories.cliente_repository import ClienteRepository
from src.schemas.cliente_schema import ClienteCreate, ClienteList, ClienteRead
from src.security import get_current_user

router = APIRouter(prefix='/clientes', tags=['clientes'])
Session = Annotated[AsyncSession, Depends(get_session)]
CurrentUser = Annotated[UserModel, Depends(get_current_user)]

def get_cliente_repo(session: Session) -> ClienteRepository:
    return ClienteRepository(session)

Repo = Annotated[ClienteRepository, Depends(get_cliente_repo)]

@router.post('/', status_code=HTTPStatus.CREATED, response_model=ClienteRead)
async def create_cliente(cliente_in: ClienteCreate, repo: Repo, user: CurrentUser):
    if await repo.get_by_documento(cliente_in.documento):
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT,
            detail='Já existe um cliente com este documento.'
        )
    
    cliente = ClienteModel(**cliente_in.model_dump())
    return await repo.create(cliente)


@router.get('/', response_model=ClienteList)
async def list_clientes(repo: Repo, user: CurrentUser):
    clientes = await repo.list()
    return {'clientes': clientes}


@router.get('/{cliente_id}', response_model=ClienteRead)
async def get_cliente(cliente_id: int, repo: Repo, user: CurrentUser):
    cliente = await repo.get_by_id(cliente_id)
    if not cliente:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Cliente não encontrado.'
        )
    return cliente
