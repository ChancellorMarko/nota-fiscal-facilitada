from http import HTTPStatus
from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_session
from src.models.user_model import UserModel
from src.models.notaFiscal_model import NotaFiscal
from src.repositories.nota_fiscal_repository import NotaFiscalRepository
from src.schemas.nota_fiscal_schema import NotaFiscalCreate, NotaFiscalList, NotaFiscalRead
from src.security import get_current_user

router = APIRouter(prefix='/notasfiscais', tags=['notasfiscais'])
Session = Annotated[AsyncSession, Depends(get_session)]
CurrentUser = Annotated[UserModel, Depends(get_current_user)]

def get_nota_fiscal_repo(session: Session):
    return NotaFiscalRepository(session)

Repo = Annotated[NotaFiscalRepository, Depends(get_nota_fiscal_repo)]

@router.post('/', status_code=HTTPStatus.CREATED, response_model=NotaFiscalRead)
async def create_nota_fiscal(
    nota_fiscal_in: NotaFiscalCreate,
    repo: Repo,
    current_user: CurrentUser,
):
    nota_fiscal = NotaFiscal(
        **nota_fiscal_in.model_dump(),
        user_id=current_user.id # Associa a nota ao usuário logado
    )
    return await repo.create(nota_fiscal)

@router.get('/', response_model=NotaFiscalList)
async def list_notas_fiscais(repo: Repo):
    notas = await repo.list()
    return {'notas_fiscais': notas}