import sqlite3
from contextlib import contextmanager


class DatabaseMock:
    def __init__(self, db_name="nfse_mock.db"):
        self.db_name = db_name
        self._criar_tabela()

    def _criar_tabela(self):
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
        conn = sqlite3.connect(self.db_name)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        finally:
            conn.close()

    def inserir_nota(self, numero, tomador, valor, servico):
        with self._get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO notas_fiscais (numero, tomador, valor, data_emissao, servico, situacao)
                VALUES (?, ?, ?, datetime('now'), ?, 'EMITIDA')
            """,
                (numero, tomador, valor, servico),
            )
            return cursor.lastrowid

    def buscar_todas_notas(self):
        with self._get_connection() as conn:
            cursor = conn.execute("SELECT * FROM notas_fiscais")
            return [dict(row) for row in cursor.fetchall()]


# Exemplo de uso
#db = DatabaseMock()
#db.inserir_nota("NF000001", "Empresa ABC", 1500.00, "Consultoria TI")
#notas = db.buscar_todas_notas()
