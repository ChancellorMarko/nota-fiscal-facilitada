from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.destinatario_model import DestinatarioModel


class DestinatarioRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self, destinatario: DestinatarioModel
    ) -> DestinatarioModel:
        self.session.add(destinatario)
        await self.session.commit()
        await self.session.refresh(destinatario)
        return destinatario

    async def get_by_id(self, destinatario_id: int):
        return await self.session.get(DestinatarioModel, destinatario_id)

    async def get_by_cpf_cnpj(self, documento: str):
        return await self.session.scalar(
            select(DestinatarioModel).where(
                DestinatarioModel.cpf_cnpj == documento
            )
        )

    async def list_destinatarios(self):
        query = select(DestinatarioModel)
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
            select(DestinatarioModel)
            .where(
                or_(
                    DestinatarioModel.name.ilike(f'%{query}%'),
                    DestinatarioModel.cpf_cnpj.ilike(f'%{query_clean}%'),
                )
            )
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def update(
        self, destinatario_id: int, destinatario_update: dict
    ) -> DestinatarioModel:
        """
        Atualiza um destinatário com os dados fornecidos
        """
        db_destinatario = await self.get_by_id(destinatario_id)

        if not db_destinatario:
            return None

        # Atualiza os campos
        update_data = destinatario_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_destinatario, field, value)

        await self.session.commit()
        await self.session.refresh(db_destinatario)
        return db_destinatario
