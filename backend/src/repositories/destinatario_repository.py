from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.destinatario_model import Destinatario


class DestinatarioRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, destinatario: Destinatario) -> Destinatario:
        self.session.add(destinatario)
        await self.session.commit()
        await self.session.refresh(destinatario)
        return destinatario

    async def get_by_id(self, destinatario_id: int):
        return await self.session.get(Destinatario, destinatario_id)

    async def list(self):
        query = select(Destinatario)
        result = await self.session.execute(query)
        return result.scalars().all()
