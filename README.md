# Aplicação para facilitar a geração de boletos

---

Projeto feito com FastAPI, SQLAlchemy, asyncio e Alembic. Este projeto tem como função ajudar na organização e facilitar a geração de boletos utilizando uma arquitetura em Python com a facilidade de contêineres Docker.

---

## Tecnologias Utilzadas

### Backend:

- **Python 3.13**: Linguagem de programação principal.
- **FastAPI**: Framework web moderno e rápido para construir APIs.
- **SQLAlchemy 2.0**: ORM (Object Relational Mapper) para interação com o banco de dados, configurado com suporte a `asyncio` para operações assíncronas.
- **Alembic**: Ferramenta de migração de banco de dados para SQLAlchemy.
- **Bcrypt**: Para hashing seguro de senhas.
- **PyJWT**: Para manipulação de JSON Web Tokens (JWT) para autenticação.
- **Pydantic-settings**: Para gerenciamento de configurações da aplicação.
- **Psycopg[binary]**: Adaptador PostgreSQL para Python.
- **Poetry**: Ferramenta de gerenciamento de dependências e empacotamento para Python.
- **Docker & Docker Compose**: Para conteinerização e orquestração do ambiente de desenvolvimento e produção.
- **Ruff**: Linter e formatador de código Python.
- **Taskipy**: Para automação de tarefas via `pyproject.toml`.

## Frontend:

- A definir.

---

## Backend - API
###  ***Execução do Projeto***

### Com Docker Compose

Esta é a forma recomendada de executar o projeto, pois garante que todas as dependências e serviços (como o banco de dados PostgreSQL) sejam configurados corretamente.
1.  **Configure as variáveis de ambiente:**

O projeto utiliza variáveis de ambiente para configurações, como a string de conexão do banco de dados. Crie um arquivo `.env` e um arquivo `.env.docker` na raiz do projeto com as seguintes variáveis:
    
- .env:
    ```env
    # Token Settings
    SECRET_KEY=sua_chave_secreta_aqui
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30

    # Database Settings
    DATABASE_SCHEME=postgresql+asyncpg
    DATABASE_USER=postgres
    DATABASE_PASSWORD=postgres
    DATABASE_DB=nfse-db
    DATABASE_PORT=5432
    DATABASE_SERVER=localhost
    DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/nfse-db

    # App Settings
    APP_PORT=8000
    ```

- .env.docker

    ```env
    # Token Settings
    SECRET_KEY=sua_chave_secreta_aqui
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30

    # Database Settings
    DATABASE_SCHEME=postgresql+asyncpg
    DATABASE_USER=postgres
    DATABASE_PASSWORD=postgres
    DATABASE_DB=nfse-db
    DATABASE_PORT=5432
    DATABASE_SERVER=database
    DATABASE_URL=postgresql+asyncpg://postgres:postgres@database:5432/nfse-db

    # App Settings
    APP_PORT=8000
    ```

    **Importante**: Substitua `sua_chave_secreta_aqui` por uma string aleatória e segura. E **lembre-se** da diferença entre o `.env` que necessita a acessar via localhost e o `.env.docker` Aplicação para facilitar a geração de boletos

---

Projeto feito com FastAPI, SQLAlchemy, asyncio e Alembic. Este projeto tem como função ajudar na organização e facilitar a geração de boletos utilizando uma arquitetura em Python com a facilidade de contêineres Docker.

---

## Tecnologias Utilzadas

### Backend:

- **Python 3.13**: Linguagem de programação principal.
- **FastAPI**: Framework web moderno e rápido para construir APIs.
- **SQLAlchemy 2.0**: ORM (Object Relational Mapper) para interação com o banco de dados, configurado com suporte a `asyncio` para operações assíncronas.
- **Alembic**: Ferramenta de migração de banco de dados para SQLAlchemy.
- **Bcrypt**: Para hashing seguro de senhas.
- **PyJWT**: Para manipulação de JSON Web Tokens (JWT) para autenticação.
- **Pydantic-settings**: Para gerenciamento de configurações da aplicação.
- **Psycopg[binary]**: Adaptador PostgreSQL para Python.
- **Poetry**: Ferramenta de gerenciamento de dependências e empacotamento para Python.
- **Docker & Docker Compose**: Para conteinerização e orquestração do ambiente de desenvolvimento e produção.
- **Ruff**: Linter e formatador de código Python.
- **Taskipy**: Para automação de tarefas via `pyproject.toml`.

## Frontend:

- A definir.

---

## Backend - API
###  ***Execução do Projeto***

### Com Docker Compose

Esta é a forma recomendada de executar o projeto, pois garante que todas as dependências e serviços (como o banco de dados PostgreSQL) sejam configurados corretamente.
1.  **Configure as variáveis de ambiente:**

O projeto utiliza variáveis de ambiente para configurações, como a string de conexão do banco de dados. Crie um arquivo `.env` e um arquivo `.env.docker` na raiz do projeto com as seguintes variáveis:
    
- .env:
    ```env
    # Token Settings
    SECRET_KEY=sua_chave_secreta_aqui
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30

    # Database Settings
    DATABASE_SCHEME=postgresql+asyncpg
    DATABASE_USER=postgres
    DATABASE_PASSWORD=postgres
    DATABASE_DB=nfse-db
    DATABASE_PORT=5432
    DATABASE_SERVER=localhost
    DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/nfse-db

    # App Settings
    APP_PORT=8000
    ```

- .env.docker

    ```env
    # Token Settings
    SECRET_KEY=sua_chave_secreta_aqui
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30

    # Database Settings
    DATABASE_SCHEME=postgresql+asyncpg
    DATABASE_USER=postgres
    DATABASE_PASSWORD=postgres
    DATABASE_DB=nfse-db
    DATABASE_PORT=5432
    DATABASE_SERVER=database
    DATABASE_URL=postgresql+asyncpg://postgres:postgres@database:5432/nfse-db

    # App Settings
    APP_PORT=8000
    ```

    **Importante**: Substitua `sua_chave_secreta_aqui` por uma string aleatória e segura. E **lembre-se** da diferença entre o `.env` que necessita a acessar via localhost e o `.env.docker` que necessita acessar via docker, ou seja, database.

2.  **Construa e inicie os serviços Docker:**

    Navegue até o diretório raiz do projeto (`src/`) e execute:

    ```bash
    docker compose up --build -d
    ```

    - `--build`: Reconstrói as imagens Docker (necessário na primeira vez ou após alterações no `Dockerfile`).
    - `-d`: Executa os contêineres em segundo plano (detached mode).

3.  **Verifique o status dos serviços:**

    ```bash
    docker compose ps
    ```

4.  **Acesse a API:**

    A API estará disponível em `http://localhost:8000`.
    Você pode acessar a documentação interativa (Swagger UI) em `http://localhost:8000/docs`.

5.  **Parar os serviços:**

    Para parar e remover os contêineres, redes e volumes criados pelo Docker Compose:

    ```bash
    docker compose down -v
    ```

    - `-v`: Remove também os volumes de dados (útil para limpar o banco de dados).

## Migrações de Banco de Dados

O projeto utiliza Alembic para gerenciar as migrações do banco de dados. As migrações são essenciais para evoluir o esquema do banco de dados de forma controlada.

### Gerar uma nova migração

Após fazer alterações nos modelos SQLAlchemy (`src/models/`), você pode gerar uma nova migração:

1.  **Adicione o model da nova tabela em `__init__.py`:**

    ```bash
    from src.models import arquivo_model as arquivo_model

    ```

2.  **Ative o ambiente virtual do Poetry:**

    ```bash
    poetry shell
    ```

3.  **Gere a migração:**

    ```bash
    alembic revision --autogenerate -m "Descrição da nova migração"
    ```

    Isso criará um novo arquivo de migração em `migrations/versions/`.
    
### Aplicar migrações

Para aplicar as migrações pendentes ao seu banco de dados:

1.  **Ative o ambiente virtual do Poetry:**

    ```bash
    poetry shell
    ```

2.  **Aplique as migrações:**

    ```bash
    alembic upgrade head
    ```

### Reverter migrações

Para reverter a última migração aplicada:

1.  **Ative o ambiente virtual do Poetry:**

    ```bash
    poetry shell
    ```

2.  **Reverta a migração:**

    ```bash
    alembic downgrade -1
    ```

---

## Frontend - App

### Scripts disponíveis

No diretório do projeto, você pode executar:

### npm start

```bash
npm start
```

Executa o aplicativo no modo de desenvolvimento.
Abra [http://localhost:3000](http://localhost:3000) para visualizá-lo em seu navegador.

A página será recarregada quando você fizer alterações.
Você também pode ver quaisquer erros de lint no console.

### npm test

```bash
npm test
```

Inicia o corredor de teste no modo de relógio interativo.

### npm run build

```bash
npm run build
```

Cria o aplicativo para produção na pasta `build'.
Ele empacota corretamente o React no modo de produção e otimiza a compilação para o melhor desempenho.
 que necessita acessar via docker, ou seja, database.

2.  **Construa e inicie os serviços Docker:**

    Navegue até o diretório raiz do projeto (`src/`) e execute:

    ```bash
    docker compose up --build -d
    ```

    - `--build`: Reconstrói as imagens Docker (necessário na primeira vez ou após alterações no `Dockerfile`).
    - `-d`: Executa os contêineres em segundo plano (detached mode).

3.  **Verifique o status dos serviços:**

    ```bash
    docker compose ps
    ```

4.  **Acesse a API:**

    A API estará disponível em `http://localhost:8000`.
    Você pode acessar a documentação interativa (Swagger UI) em `http://localhost:8000/docs`.

5.  **Parar os serviços:**

    Para parar e remover os contêineres, redes e volumes criados pelo Docker Compose:

    ```bash
    docker compose down -v
    ```

    - `-v`: Remove também os volumes de dados (útil para limpar o banco de dados).

## Migrações de Banco de Dados

O projeto utiliza Alembic para gerenciar as migrações do banco de dados. As migrações são essenciais para evoluir o esquema do banco de dados de forma controlada.

### Gerar uma nova migração

Após fazer alterações nos modelos SQLAlchemy (`src/models/`), você pode gerar uma nova migração:

1.  **Adicione o model da nova tabela em `__init__.py`:**

    ```bash
    from src.models import arquivo_model as arquivo_model

    ```

2.  **Ative o ambiente virtual do Poetry:**

    ```bash
    poetry shell
    ```

3.  **Gere a migração:**

    ```bash
    alembic revision --autogenerate -m "Descrição da nova migração"
    ```

    Isso criará um novo arquivo de migração em `migrations/versions/`.
    
### Aplicar migrações

Para aplicar as migrações pendentes ao seu banco de dados:

1.  **Ative o ambiente virtual do Poetry:**

    ```bash
    poetry shell
    ```

2.  **Aplique as migrações:**

    ```bash
    alembic upgrade head
    ```

### Reverter migrações

Para reverter a última migração aplicada:

1.  **Ative o ambiente virtual do Poetry:**

    ```bash
    poetry shell
    ```

2.  **Reverta a migração:**

    ```bash
    alembic downgrade -1
    ```

---

## Frontend - App

### Scripts disponíveis

No diretório do projeto, você pode executar:

### npm start

```bash
npm start
```

Executa o aplicativo no modo de desenvolvimento.
Abra [http://localhost:3000](http://localhost:3000) para visualizá-lo em seu navegador.

A página será recarregada quando você fizer alterações.
Você também pode ver quaisquer erros de lint no console.

### npm test

```bash
npm test
```

Inicia o corredor de teste no modo de relógio interativo.

### npm run build

```bash
npm run build
```

Cria o aplicativo para produção na pasta `build'.
Ele empacota corretamente o React no modo de produção e otimiza a compilação para o melhor desempenho.
