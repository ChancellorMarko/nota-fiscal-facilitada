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

# Configuração da URL do banco de dados
section = config.config_ini_section
config.set_section_option(section, "DATABASE_USER", os.getenv("DATABASE_USER", "postgres"))
config.set_section_option(section, "DATABASE_PASSWORD", os.getenv("DATABASE_PASSWORD", "postgres"))
config.set_section_option(section, "DATABASE_SERVER", os.getenv("DATABASE_SERVER", "localhost"))
config.set_section_option(section, "DATABASE_PORT", os.getenv("DATABASE_PORT", "5432"))
config.set_section_option(section, "DATABASE_DB", os.getenv("DATABASE_DB", "nfse-db"))

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
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

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