# SSP Connect

Sistema web para abertura, acompanhamento e gerenciamento de chamados internos. O projeto e dividido em uma API Node.js/Express, uma interface Next.js e scripts SQL para criacao do banco MySQL.

## Tecnologias

- Backend: Node.js, Express, MySQL, JWT, bcrypt
- Frontend: Next.js, React, Axios, Tailwind CSS
- Banco de dados: MySQL

## Estrutura do projeto

```text
ssp-connect/
├── backend/      # API REST
├── frontend/     # Aplicacao web Next.js
├── database/     # Scripts SQL do banco
└── README.md
```

## Requisitos

- Node.js
- npm
- MySQL

## Configuracao do banco de dados

Execute os scripts da pasta `database` no MySQL, nesta ordem:

```sql
source database/01_create_database.sql;
source database/02_create_tables.sql;
source database/03_insert_initial_data.sql;
```

O script `04_checks.sql` pode ser usado apenas para conferencia das tabelas e dados.

Os scripts criam:

- Banco `ssp_connect`
- Tabelas `destinations`, `categories`, `users` e `tickets`
- Destinos e categorias iniciais

Observacao: os scripts iniciais nao criam usuario administrador. Para acessar a area administrativa, crie um usuario na tabela `users` com `role = 'ADMIN'` e senha criptografada com bcrypt.

## Configuracao do backend

Entre na pasta do backend e instale as dependencias:

```bash
cd backend
npm install
```

Crie o arquivo `.env` com base em `.env.example`:

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=ssp_connect
JWT_SECRET=gere_uma_string_longa_e_aleatoria_aqui
FRONTEND_URL=http://localhost:3000
```

Inicie a API em modo desenvolvimento:

```bash
npm run dev
```

Ou em modo producao:

```bash
npm start
```

Por padrao, a API roda em:

```text
http://localhost:3001
```

Health check:

```text
GET /
```

## Configuracao do frontend

Em outro terminal, entre na pasta do frontend e instale as dependencias:

```bash
cd frontend
npm install
```

Opcionalmente, crie um arquivo `.env.local` para apontar a URL da API:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Inicie o frontend:

```bash
npm run dev
```

Por padrao, a aplicacao roda em:

```text
http://localhost:3000
```

## Funcionalidades

- Login com JWT
- Perfis `ADMIN` e `USER`
- Area administrativa com gerenciamento de usuarios, chamados, fila, destinos e categorias
- Area do usuario para abertura e acompanhamento de chamados
- Controle de status dos chamados
- Consulta de posicao na fila

## Rotas principais da API

### Autenticacao

```text
POST /auth/login
```

### Usuarios

Rotas protegidas por autenticacao e perfil `ADMIN`.

```text
GET    /users
POST   /users
PUT    /users/:id
DELETE /users/:id
```

### Chamados

Rotas protegidas por autenticacao.

```text
GET    /tickets
POST   /tickets
GET    /tickets/:id
PUT    /tickets/:id/status
DELETE /tickets/:id
```

Observacoes:

- Apenas usuarios com perfil `USER` podem abrir chamados.
- Atualizacao de status e remocao de chamados exigem perfil `ADMIN`.

### Fila

```text
GET /queue
GET /queue/my-position/:ticketId
```

Observacoes:

- `GET /queue` exige perfil `ADMIN`.
- `GET /queue/my-position/:ticketId` exige usuario autenticado.

### Destinos

```text
GET    /destinations
POST   /destinations
PUT    /destinations/:id
DELETE /destinations/:id
```

### Categorias

```text
GET    /categories
POST   /categories
PUT    /categories/:id
DELETE /categories/:id
```

Observacao: listagem de destinos e categorias esta disponivel para qualquer usuario autenticado. Criacao, edicao e remocao exigem perfil `ADMIN`.

## Scripts disponiveis

Backend:

```bash
npm run dev
npm start
```

Frontend:

```bash
npm run dev
npm run build
npm start
npm run lint
```

## Fluxo basico de uso

1. Configure o banco MySQL.
2. Configure e inicie o backend.
3. Configure e inicie o frontend.
4. Acesse `http://localhost:3000/login`.
5. Entre com um usuario cadastrado.
6. Usuarios comuns podem abrir e acompanhar chamados.
7. Administradores podem gerenciar cadastros, fila e status dos chamados.
