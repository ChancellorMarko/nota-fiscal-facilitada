from sqlalchemy import or_, select
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

    async def get_by_cpf_cnpj(self, documento: str):
        return await self.session.scalar(
            select(Destinatario).where(Destinatario.cnpj == documento)
        )

    async def list(self):
        query = select(Destinatario)
        result = await self.session.execute(query)
        return result.scalars().all()

    async def search(self, query: str, query_clean: str, limit: int = 10):
        """
        Busca destinatários por nome ou CNPJ.
        query: termo de busca original
        query_clean: termo de busca sem formatação (para CPF/CNPJ)
        limit: número máximo de resultados
        """
        stmt = (
            select(Destinatario)
            .where(
                or_(
                    Destinatario.nome.ilike(f'%{query}%'),
                    Destinatario.cnpj.ilike(f'%{query_clean}%'),
                )
            )
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()
