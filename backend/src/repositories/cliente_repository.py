# Arquivo: src/repositories/cliente_repository.py

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.cliente_model import ClienteModel

class ClienteRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, cliente: ClienteModel) -> ClienteModel:
        self.session.add(cliente)
        await self.session.commit()
        await self.session.refresh(cliente)
        return cliente

    async def get_by_id(self, cliente_id: int) -> ClienteModel | None:
        return await self.session.get(ClienteModel, cliente_id)

    async def get_by_documento(self, documento: str) -> ClienteModel | None:
        query = select(ClienteModel).where(ClienteModel.documento == documento)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def list(self) -> list[ClienteModel]:
        query = select(ClienteModel)
        result = await self.session.execute(query)
        return list(result.scalars().all())