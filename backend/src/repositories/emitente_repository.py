from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.emitente_model import EmitenteModel
from src.schemas.emitente_schema import EmitenteUpdate


class EmitenteRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, emitente: EmitenteModel) -> EmitenteModel:
        self.session.add(emitente)
        await self.session.commit()
        await self.session.refresh(emitente)
        return emitente

    async def get_by_id(self, emitente_id: int):
        return await self.session.get(EmitenteModel, emitente_id)

    async def get_by_cnpj(self, cnpj: str):
        return await self.session.scalar(
            select(EmitenteModel).where(EmitenteModel.cnpj == cnpj)
        )

    async def list_emitentes(self):
        query = select(EmitenteModel)
        result = await self.session.execute(query)
        return result.scalars().all()

    async def search(self, query: str, query_clean: str, limit: int = 10):
        """
        Busca emitentes por nome ou CNPJ.
        query: termo de busca original
        query_clean: termo de busca sem formatação (para CNPJ)
        limit: número máximo de resultados
        """
        stmt = (
            select(EmitenteModel)
            .where(
                or_(
                    EmitenteModel.name.ilike(f'%{query}%'),
                    EmitenteModel.cnpj.ilike(f'%{query_clean}%'),
                )
            )
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def update(
        self, emitente_id: int, emitente_update: EmitenteUpdate
    ) -> EmitenteModel:
        """
        Atualiza um emitente com os dados fornecidos
        """
        db_emitente = await self.get_by_id(emitente_id)

        if not db_emitente:
            return None

        # Atualiza os campos
        update_data = emitente_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_emitente, field, value)

        await self.session.commit()
        await self.session.refresh(db_emitente)
        return db_emitente
