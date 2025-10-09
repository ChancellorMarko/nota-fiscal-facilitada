import sqlite3
from contextlib import contextmanager
from typing import Any, Dict, List, Optional


class Database:
    def __init__(self, db_path: str = "nfse.db"):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        with self._get_connection() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS notas_fiscais (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    numero TEXT UNIQUE NOT NULL,
                    tomador TEXT NOT NULL,
                    valor REAL NOT NULL,
                    data_emissao TEXT NOT NULL,
                    servico TEXT NOT NULL,
                    situacao TEXT NOT NULL
                )
            """)

    @contextmanager
    def _get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    def create_nota(self, numero: str, tomador: str, valor: float, servico: str) -> int:
        with self._get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO notas_fiscais 
                (numero, tomador, valor, data_emissao, servico, situacao)
                VALUES (?, ?, ?, datetime('now'), ?, 'EMITIDA')
            """,
                (numero, tomador, valor, servico),
            )
            return cursor.lastrowid

    def get_all_notas(self) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.execute("""
                SELECT * FROM notas_fiscais 
                ORDER BY data_emissao DESC
            """)
            return [dict(row) for row in cursor.fetchall()]

    def get_nota_by_id(self, nota_id: int) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM notas_fiscais WHERE id = ?", (nota_id,)
            )
            row = cursor.fetchone()
            return dict(row) if row else None
