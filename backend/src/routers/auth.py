from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_session
from src.models.user_model import UserModel
from src.repositories.user_repository import UserRepository
from src.schemas.token_schema import Token
from src.security import (
    PasswordHasher,
    create_access_token,
    get_current_user,
)

INCORRECT_FIELDS = HTTPException(
    status_code=HTTPStatus.UNAUTHORIZED, detail='Incorrect email or password'
)

router = APIRouter(prefix='/auth', tags=['auth'])


def get_user_repository(
    session: AsyncSession = Depends(get_session),
) -> UserRepository:
    return UserRepository(session)


UserRepo = Annotated[UserRepository, Depends(get_user_repository)]


@router.post('/token', response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    user_repo: UserRepo,
):
    user = await user_repo.get_by_email(form_data.username)

    if not user:
        raise INCORRECT_FIELDS

    if not PasswordHasher.check(form_data.password, user.password):
        raise INCORRECT_FIELDS

    access_token = create_access_token({'sub': user.email})
    return {'access_token': access_token, 'token_type': 'Bearer'}


@router.post('/refresh_token', response_model=Token)
async def refresh_access_token(
    user: Annotated[UserModel, Depends(get_current_user)],
):
    new_access_token = create_access_token(data={'sub': user.email})

    return {'access_token': new_access_token, 'token_type': 'Bearer'}
