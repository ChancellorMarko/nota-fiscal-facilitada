from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_session
from src.models.user_model import UserModel
from src.repositories.user_repository import UserRepository
from src.schemas.user_schema import (
    UserCreate,
    UserList,
    UserRead,
    UserStatusChanger,
    UserUpdate,
)
from src.security import PasswordHasher

router = APIRouter(prefix='/users', tags=['users'])


# TODO: Adicionar validação de permissões.

# OBS:  Usuários MASTER podem realizar todas as operações


def get_user_repository(
    session: AsyncSession = Depends(get_session),
) -> UserRepository:
    return UserRepository(session)


UserRepo = Annotated[UserRepository, Depends(get_user_repository)]


@router.post('/', status_code=HTTPStatus.CREATED, response_model=UserRead)
async def create_user(user_in: UserCreate, repo: UserRepo):
    if await repo.get_by_email(user_in.email):
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT, detail='Email already exists'
        )

    user = UserModel(
        name=user_in.name,
        email=user_in.email,
        phone=user_in.phone,
        password=PasswordHasher.hash(user_in.password),
    )

    return await repo.create(user)


@router.get('/', status_code=HTTPStatus.OK, response_model=UserList)
async def list_users(repo: UserRepo):
    return {'users': await repo.list_users()}


@router.get(
    '/id/{user_id}', status_code=HTTPStatus.OK, response_model=UserRead
)
async def get_user_by_id(user_id: int, repo: UserRepo):
    db_user = await repo.get_by_id(user_id)

    if not db_user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='User not found'
        )

    return db_user


@router.get('/search', status_code=HTTPStatus.OK, response_model=UserRead)
async def get_user(
    repo: UserRepo,
    user_email: Annotated[str | None, Query()] = None,
    user_phone: Annotated[str | None, Query()] = None,
):
    if user_email and user_phone:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail='You must provide either user_email or user_phone',
        )

    if user_email is not None:
        db_user = await repo.get_by_email(user_email)
    elif user_phone is not None:
        db_user = await repo.get_by_phone(user_phone)
    else:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Missing search parameter'
        )

    if not db_user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='User not found'
        )

    return db_user


@router.patch(
    '/id/{user_id}', status_code=HTTPStatus.OK, response_model=UserRead
)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    repo: UserRepo,
):
    update_data = user_update.model_dump(exclude_unset=True)

    # Se a senha for fornecida, aplica um hash nela
    if 'password' in update_data:
        update_data['password'] = PasswordHasher.hash(update_data['password'])

    if 'email' in update_data:
        if await repo.get_by_email(update_data['email']):
            raise HTTPException(
                status_code=HTTPStatus.CONFLICT, detail='Email already exists'
            )

    updated_user_data = UserUpdate(**update_data)

    updated_user = await repo.update(user_id, updated_user_data)

    if not updated_user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='User not found'
        )

    return updated_user


@router.patch(
    '/id/{user_id}/deactivate',
    status_code=HTTPStatus.OK,
    response_model=UserRead,
)
async def deactivate_user(
    user_id: int,
    repo: UserRepo,
):
    user = await repo.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='User not found'
        )

    if not user.active:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail='User already deactivated',
        )

    user_deactivate = UserStatusChanger(active=False)
    return await repo.update(user_id, user_deactivate)


@router.patch(
    '/id/{user_id}/activate',
    status_code=HTTPStatus.OK,
    response_model=UserRead,
)
async def activate_user(
    user_id: int,
    repo: UserRepo,
):
    user = await repo.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='User not found'
        )

    if user.active:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST, detail='User already activated'
        )

    user_deactivate = UserStatusChanger(active=True)
    return await repo.update(user_id, user_deactivate)
