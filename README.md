# Event Booking Backend

Backend para sistema de reserva de eventos desenvolvido com Node.js, Express, TypeScript e Prisma.

## 🚀 Tecnologias

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Docker & Docker Compose

## 📋 Pré-requisitos

### Com Docker (Recomendado)
- Docker
- Docker Compose

### Sem Docker
- Node.js (versão 18 ou superior)
- PostgreSQL instalado e rodando
- npm ou yarn

## 🔧 Instalação

### Opção 1: Com Docker (Recomendado)

1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd event_booking_backend
```

2. Inicie os containers
```bash
# Desenvolvimento
docker-compose -f docker-compose.dev.yml up -d

# Produção
docker-compose up -d
```

Pronto! A aplicação estará rodando em `http://localhost:3000` e o PostgreSQL na porta `5432`.

### Opção 2: Sem Docker

1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd event_booking_backend
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure sua string de conexão do PostgreSQL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/event_booking?schema=public"
```

4. Execute as migrações do Prisma
```bash
npm run prisma:migrate
```

5. Gere o Prisma Client
```bash
npm run prisma:generate
```

## 🎮 Como usar

### Com Docker

#### Desenvolvimento
```bash
docker-compose -f docker-compose.dev.yml up
```

#### Produção
```bash
docker-compose up
```

#### Parar containers
```bash
docker-compose down
```

#### Ver logs
```bash
docker-compose logs -f app
## 📁 Estrutura do Projeto

```
event_booking_backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── BookingController.ts
│   │   ├── EventController.ts
│   │   └── UserController.ts
│   ├── middlewares/
│   │   └── errorHandler.ts
│   ├── routes/
│   │   ├── booking.routes.ts
│   │   ├── event.routes.ts
│   │   ├── user.routes.ts
│   │   └── index.ts
│   ├── app.ts
│   └── server.ts
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.dev.yml
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.dev
├── package.json
└── tsconfig.json
```

## 🐳 Docker

O projeto inclui suporte completo para Docker:

- **Dockerfile**: Imagem otimizada para produção com multi-stage build
- **Dockerfile.dev**: Imagem para desenvolvimento com hot-reload
- **docker-compose.yml**: Orquestração para ambiente de produção
- **docker-compose.dev.yml**: Orquestração para desenvolvimento com volumes montados
- **.dockerignore**: Arquivos ignorados no build da imagem

### Variáveis de Ambiente (Docker)

As variáveis de ambiente são configuradas automaticamente nos arquivos `docker-compose`:

- **Desenvolvimento**: PostgreSQL em `postgres:5432` (dentro da rede Docker)
- **Produção**: PostgreSQL em `postgres:5432` (dentro da rede Docker)

Não é necessário criar arquivo `.env` ao usar Docker.

#### Prisma Studio (Interface visual do banco)
```bash
npm run prisma:studio
```

## 📚 Rotas da API

Base URL: `http://localhost:3000/api`

### 🔐 Autenticação

A API utiliza **JWT (JSON Web Token)** para autenticação. Todas as rotas, exceto as de autenticação, requerem um token válido no header `Authorization`.

#### Como usar:
1. Registre um novo usuário ou faça login
2. Use o token retornado no header: `Authorization: Bearer {seu-token}`
3. O token expira em 7 dias (configurável)
4. Use o refresh token para renovar o token quando expirar

#### Registrar novo usuário
```http
POST /api/auth/register
Content-Type: application/json
```

**Body:**
```json
{
  "email": "usuario@example.com",
  "name": "Nome do Usuário",
  "password": "senha123456"
}
```

**Resposta (201):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@example.com",
    "name": "Nome do Usuário",
    "provider": "local",
    "createdAt": "2025-12-10T10:00:00.000Z",
    "updatedAt": "2025-12-10T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json
```

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "senha123456"
}
```

**Resposta (200):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@example.com",
    "name": "Nome do Usuário",
    "provider": "local",
    "createdAt": "2025-12-10T10:00:00.000Z",
    "updatedAt": "2025-12-10T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Renovar token
```http
POST /api/auth/refresh-token
Content-Type: application/json
```

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Resposta (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Obter usuário autenticado
```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@example.com",
  "name": "Nome do Usuário",
  "provider": "local",
  "createdAt": "2025-12-10T10:00:00.000Z",
  "updatedAt": "2025-12-10T10:00:00.000Z",
  "bookings": []
}
```

---

### 👤 Usuários

**⚠️ Todas as rotas de usuários requerem autenticação**

#### Listar todos os usuários
```http
GET /api/users
```

**Resposta (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "joao@example.com",
    "name": "João Silva",
    "createdAt": "2025-12-10T10:00:00.000Z",
    "updatedAt": "2025-12-10T10:00:00.000Z",
    "bookings": []
  }
]
```

#### Buscar usuário por ID
```http
GET /api/users/:id
```

**Resposta (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "joao@example.com",
  "name": "João Silva",
  "createdAt": "2025-12-10T10:00:00.000Z",
  "updatedAt": "2025-12-10T10:00:00.000Z",
  "bookings": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "eventId": "770e8400-e29b-41d4-a716-446655440002",
      "status": "confirmed",
      "event": {
        "title": "Workshop de Node.js",
        "date": "2025-12-20T14:00:00.000Z"
      }
    }
  ]
}
```

#### Criar novo usuário
```http
POST /api/users
Content-Type: application/json
```

**Body:**
```json
{
  "email": "joao@example.com",
  "name": "João Silva"
}
```

**Resposta (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "joao@example.com",
  "name": "João Silva",
  "createdAt": "2025-12-10T10:00:00.000Z",
  "updatedAt": "2025-12-10T10:00:00.000Z"
}
```

#### Atualizar usuário
```http
PUT /api/users/:id
Content-Type: application/json
```

**Body:**
```json
{
  "email": "joao.novo@example.com",
  "name": "João Silva Santos"
}
```

**Resposta (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "joao.novo@example.com",
  "name": "João Silva Santos",
  "createdAt": "2025-12-10T10:00:00.000Z",
  "updatedAt": "2025-12-10T11:30:00.000Z"
}
```

#### Deletar usuário
```http
DELETE /api/users/:id
```

**Resposta (204):** Sem conteúdo

---

### 🎉 Eventos

**⚠️ Todas as rotas de eventos requerem autenticação**

#### Listar todos os eventos
```http
GET /api/events
```

**Resposta (200):**
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "title": "Workshop de Node.js",
    "description": "Aprenda Node.js do zero",
    "date": "2025-12-20T14:00:00.000Z",
    "location": "São Paulo - SP",
    "capacity": 50,
    "createdAt": "2025-12-10T10:00:00.000Z",
    "updatedAt": "2025-12-10T10:00:00.000Z",
    "bookings": []
  }
]
```

#### Buscar evento por ID
```http
GET /api/events/:id
```

**Resposta (200):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "title": "Workshop de Node.js",
  "description": "Aprenda Node.js do zero",
  "date": "2025-12-20T14:00:00.000Z",
  "location": "São Paulo - SP",
  "capacity": 50,
  "createdAt": "2025-12-10T10:00:00.000Z",
  "updatedAt": "2025-12-10T10:00:00.000Z",
  "bookings": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "status": "confirmed",
      "user": {
        "name": "João Silva",
        "email": "joao@example.com"
      }
    }
  ]
}
```

#### Criar novo evento
```http
POST /api/events
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Workshop de Node.js",
  "description": "Aprenda Node.js do zero",
  "date": "2025-12-20T14:00:00.000Z",
  "location": "São Paulo - SP",
  "capacity": 50
}
```

**Resposta (201):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "title": "Workshop de Node.js",
  "description": "Aprenda Node.js do zero",
  "date": "2025-12-20T14:00:00.000Z",
  "location": "São Paulo - SP",
  "capacity": 50,
  "createdAt": "2025-12-10T10:00:00.000Z",
  "updatedAt": "2025-12-10T10:00:00.000Z"
}
```

#### Atualizar evento
```http
PUT /api/events/:id
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Workshop Avançado de Node.js",
  "description": "Node.js avançado com TypeScript",
  "date": "2025-12-21T14:00:00.000Z",
  "location": "São Paulo - SP",
  "capacity": 60
}
```

**Resposta (200):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "title": "Workshop Avançado de Node.js",
  "description": "Node.js avançado com TypeScript",
  "date": "2025-12-21T14:00:00.000Z",
  "location": "São Paulo - SP",
  "capacity": 60,
  "createdAt": "2025-12-10T10:00:00.000Z",
  "updatedAt": "2025-12-10T12:00:00.000Z"
}
```

#### Deletar evento
```http
DELETE /api/events/:id
```

**Resposta (204):** Sem conteúdo

---

### 📅 Reservas

**⚠️ Todas as rotas de reservas requerem autenticação**

#### Listar todas as reservas
```http
GET /api/bookings
```

**Resposta (200):**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "eventId": "770e8400-e29b-41d4-a716-446655440002",
    "status": "confirmed",
    "createdAt": "2025-12-10T10:30:00.000Z",
    "updatedAt": "2025-12-10T10:30:00.000Z",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "João Silva",
      "email": "joao@example.com"
    },
    "event": {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "title": "Workshop de Node.js",
      "date": "2025-12-20T14:00:00.000Z",
      "location": "São Paulo - SP"
    }
  }
]
```

#### Criar nova reserva
```http
POST /api/bookings
Content-Type: application/json
```

**Body:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "eventId": "770e8400-e29b-41d4-a716-446655440002"
}
```

**Resposta (201):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "eventId": "770e8400-e29b-41d4-a716-446655440002",
  "status": "confirmed",
  "createdAt": "2025-12-10T10:30:00.000Z",
  "updatedAt": "2025-12-10T10:30:00.000Z",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "event": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "title": "Workshop de Node.js",
    "date": "2025-12-20T14:00:00.000Z"
  }
}
```

**Erro - Evento lotado (400):**
```json
{
  "error": "Event is at full capacity"
}
```

**Erro - Evento não encontrado (404):**
```json
{
  "error": "Event not found"
}
```

#### Deletar reserva
```http
DELETE /api/bookings/:id
```

**Resposta (204):** Sem conteúdo

---

### 📥 Importar no Postman

Você pode importar a collection completa no Postman através do arquivo `postman_collection.json` na raiz do projeto.

## 📁 Estrutura do Projeto

```
event_booking_backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── BookingController.ts
│   │   ├── EventController.ts
│   │   └── UserController.ts
│   ├── middlewares/
│   │   └── errorHandler.ts
│   ├── routes/
│   │   ├── booking.routes.ts
│   │   ├── event.routes.ts
│   │   ├── user.routes.ts
│   │   └── index.ts
│   ├── app.ts
│   └── server.ts
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

## 📝 Modelos do Banco de Dados

### User
- id (UUID)
- email (String, único)
- name (String)
- createdAt (DateTime)
- updatedAt (DateTime)

### Event
- id (UUID)
- title (String)
- description (String, opcional)
- date (DateTime)
- location (String)
- capacity (Int)
- createdAt (DateTime)
- updatedAt (DateTime)

### Booking
- id (UUID)
- userId (UUID)
- eventId (UUID)
- status (String, padrão: "confirmed")
- createdAt (DateTime)
- updatedAt (DateTime)

## 📄 Licença

ISC
