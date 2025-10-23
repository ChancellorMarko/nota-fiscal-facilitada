from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.emitente_model import Emitente


class EmitenteRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, emitente: Emitente) -> Emitente:
        self.session.add(emitente)
        await self.session.commit()
        await self.session.refresh(emitente)
        return emitente

    async def get_by_id(self, emitente_id: int):
        return await self.session.get(Emitente, emitente_id)

    async def list(self):
        query = select(Emitente)
        result = await self.session.execute(query)
        return result.scalars().all()
