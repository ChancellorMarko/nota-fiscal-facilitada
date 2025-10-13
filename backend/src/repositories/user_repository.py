from sqlalchemy import ScalarResult, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.user_model import UserModel as User
from src.schemas.user_schema import (
    UserStatusChanger,
    UserUpdate,
)


class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, user: User) -> User:
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)

        return user

    async def get_by_id(self, user_id: int) -> User | None:
        return await self.session.scalar(
            select(User).where(User.id == user_id)
        )

    async def get_by_email(self, user_email: str) -> User | None:
        return await self.session.scalar(
            select(User)
            .where(User.email == user_email)
        )

    async def get_by_phone(self, user_phone: str) -> User | None:
        return await self.session.scalar(
            select(User)
            .where(User.phone == user_phone)
        )

    async def list_users(self) -> ScalarResult[User]:
        return await self.session.scalars(select(User))

    async def update(
        self,
        user_id: int,
        user_update: UserUpdate | UserStatusChanger
    ) -> User | None:
        user = await self.get_by_id(user_id)
        if not user:
            return None

        data = user_update.model_dump(exclude_unset=True)

        for field, value in data.items():
            if hasattr(user, field):
                setattr(user, field, value)

        await self.session.commit()
        await self.session.refresh(user)

        return user
