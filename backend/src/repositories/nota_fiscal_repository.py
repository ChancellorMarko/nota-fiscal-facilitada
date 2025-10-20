from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.notaFiscal_model import NotaFiscal

class NotaFiscalRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, nota_fiscal: NotaFiscal) -> NotaFiscal:
        self.session.add(nota_fiscal)
        await self.session.commit()
        await self.session.refresh(nota_fiscal)
        return nota_fiscal

    async def get_by_id(self, nota_fiscal_id: int):
        return await self.session.get(NotaFiscal, nota_fiscal_id)

    async def list(self):
        query = select(NotaFiscal)
        result = await self.session.execute(query)
        return result.scalars().all()