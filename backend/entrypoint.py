#!/usr/bin/env python3
import subprocess
import sys
import os

print("🚀 Iniciando container...")
print(f"Python executable: {sys.executable}")
print(f"PATH: {os.environ.get('PATH', '')}")

# Executa as migrações do Alembic
try:
    subprocess.run([sys.executable, "-m", "alembic", "upgrade", "head"], check=True)
except subprocess.CalledProcessError as e:
    print(f"⚠️ Erro ao executar migrações: {e}")
    # Continua mesmo assim, caso as migrações já estejam aplicadas

# Inicia o servidor Uvicorn
subprocess.run([
    sys.executable, "-m", "uvicorn", "src.app:app",
    "--host", "0.0.0.0",
    "--port", "8000"
])
