from datetime import datetime, timedelta
from http import HTTPStatus
from zoneinfo import ZoneInfo

import bcrypt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jwt import DecodeError, ExpiredSignatureError, decode, encode
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_session
from src.repositories.user_repository import UserRepository
from src.settings import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='auth/token')


def get_user_repository(
    session: AsyncSession = Depends(get_session),
) -> UserRepository:
    return UserRepository(session)


class PasswordHasher:
    @staticmethod
    def hash(password: str) -> str:
        """
        Método para criar um hash de senhas e
        garantir a codificação em padrão utf-8
        """
        utf_8_password = password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(utf_8_password, salt)

        return hashed_password.decode('utf-8')

    @staticmethod
    def check(password: str, hashed_password: str) -> bool:
        """
        Método que compara duas senhas hashed verificando
        se as duas são correspondentes
        """
        utf_8_password = password.encode('utf-8')
        utf_8_hashed_password = hashed_password.encode('utf-8')

        return bcrypt.checkpw(utf_8_password, utf_8_hashed_password)


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(tz=ZoneInfo('UTC')) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({'exp': expire})

    encoded_jwt = encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )

    return encoded_jwt


async def get_current_user(
    user_repo: UserRepository = Depends(get_user_repository),
    token: str = Depends(oauth2_scheme),
):
    credentials_exception = HTTPException(
        status_code=HTTPStatus.UNAUTHORIZED,
        detail='Could not validate credentials',
        headers={'WWW-Authenticate': 'Bearer'},
    )

    try:
        payload = decode(
            token, settings.SECRET_KEY, algorithms=settings.ALGORITHM
        )
        subject_email = payload.get('sub')
        if not subject_email:
            raise credentials_exception
    except DecodeError:
        raise credentials_exception

    except ExpiredSignatureError:
        raise credentials_exception

    user = await user_repo.get_by_email(subject_email)

    if not user:
        raise credentials_exception

    return user
