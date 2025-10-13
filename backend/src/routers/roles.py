from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_session
from src.models.role_model import RoleModel
from src.repositories.role_repository import RoleRepository
from src.schemas.role_schema import RoleCreate, RoleList, RoleRead

router = APIRouter(prefix='/roles', tags=['roles'])


def get_role_repository(
    session: AsyncSession = Depends(get_session),
) -> RoleRepository:
    return RoleRepository(session)


RoleRepo = Annotated[RoleRepository, Depends(get_role_repository)]


@router.post('/', status_code=HTTPStatus.CREATED, response_model=RoleRead)
async def create_role(role_in: RoleCreate, repo: RoleRepo):
    if await repo.get_by_name(role_in.name):
        return HTTPException(
            status_code=HTTPStatus.CONFLICT, detail='Name already exists'
        )

    role = RoleModel(name=role_in.name, description=role_in.description)

    return await repo.create(role)


@router.get('/', status_code=HTTPStatus.OK, response_model=RoleList)
async def list_roles(repo: RoleRepo):
    return {'roles': await repo.list_roles()}


@router.get(
    '/id/{role_id}', status_code=HTTPStatus.OK, response_model=RoleRead
)
async def get_role_by_id(role_id: int, repo: RoleRepo):
    db_role = await repo.get_by_id(role_id)

    if not db_role:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Role not found'
        )

    return db_role
