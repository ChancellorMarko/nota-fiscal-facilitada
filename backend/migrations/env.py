from logging.config import fileConfig
import os
from dotenv import load_dotenv
from alembic import context
from sqlalchemy import engine_from_config, pool

from src.models.registry import table_registry

# Carrega as variáveis de ambiente
load_dotenv()

# Configuração do Alembic
config = context.config

# Interpretação do arquivo de configuração de logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Configura a URL do banco de dados a partir da variável de ambiente
database_url = os.getenv("DATABASE_URL")
if database_url:
    # Garante que está usando asyncpg
    if 'postgresql://' in database_url and 'asyncpg' not in database_url:
        database_url = database_url.replace('postgresql://', 'postgresql+asyncpg://')
    config.set_main_option("sqlalchemy.url", database_url)

# Metadata para o Alembic detectar os modelos
target_metadata = table_registry.metadata

def run_migrations_offline() -> None:
    """Executa migrações em modo 'offline'."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Executa migrações em modo 'online'."""

    from sqlalchemy import create_engine

    database_url = os.getenv("DATABASE_URL")
    if database_url and 'asyncpg' in database_url:
        # Converte para psycopg (síncrono) para o Alembic
        database_url = database_url.replace('postgresql+asyncpg://', 'postgresql+psycopg://')

    connectable = create_engine(database_url)

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()