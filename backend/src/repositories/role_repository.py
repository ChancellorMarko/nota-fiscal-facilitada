from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.role_model import RoleModel as Role
from src.schemas.role_schema import RoleUpdate, RoleStatusChanger


class RoleRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, role: Role) -> Role:
        self.session.add(role)
        await self.session.commit()
        await self.session.refresh(role)

        return role

    async def get_by_id(self, role_id: int) -> Role | None:
        return await self.session.scalar(
            select(Role).where(Role.id == role_id)
        )

    async def get_by_name(self, role_name: str) -> Role | None:
        return await self.session.scalar(
            select(Role).where(Role.name == role_name)
        )

    async def list_by_name(self, role_name: str) -> list[Role]:
        result = await self.session.scalars(
            select(Role).filter(Role.name.ilike(f'%{role_name}%'))
        )
        return result.all()

    async def list_roles(self) -> list[Role]:
        result = await self.session.scalars(select(Role))
        return result.all()

    async def update(
        self, role_id: int, role_update: RoleUpdate | RoleStatusChanger
    ) -> Role | None:
        role = await self.get_by_id(role_id)
        if not role:
            return None

        data = role_update.model_dump(exclude_unset=True)

        for field, value in data.items():
            if hasattr(role, field):
                setattr(role, field, value)

        await self.session.commit()
        await self.session.refresh(role)

        return role
