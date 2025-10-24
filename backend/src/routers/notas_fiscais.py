from http import HTTPStatus

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_session
from src.models.notaFiscal_model import NotaFiscal
from src.models.user_model import UserModel
from src.repositories.nota_fiscal_repository import NotaFiscalRepository
from src.schemas.nota_fiscal_schema import (
    NotaFiscalCreate,
    NotaFiscalList,
    NotaFiscalRead,
)
from src.security import get_current_user

router = APIRouter(prefix='/nfse', tags=['notasfiscais'])


def get_nota_fiscal_repo(
    session: AsyncSession = Depends(get_session),
) -> NotaFiscalRepository:
    return NotaFiscalRepository(session)


@router.post(
    '/register', status_code=HTTPStatus.CREATED, response_model=NotaFiscalRead
)
async def create_nota_fiscal(
    nota_fiscal_in: NotaFiscalCreate,
    repo: NotaFiscalRepository = Depends(get_nota_fiscal_repo),
    current_user: UserModel = Depends(get_current_user),
):
    nota_fiscal = NotaFiscal(
        **nota_fiscal_in.model_dump(),
        # user_id=current_user.id,  # Associa a nota ao usuário logado
    )
    return await repo.create(nota_fiscal)


@router.get('/', response_model=NotaFiscalList)
async def list_notas_fiscais(
    repo: NotaFiscalRepository = Depends(get_nota_fiscal_repo),
):
    notas = await repo.list()
    return {'notas_fiscais': notas}
