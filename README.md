# Venue Booking Backend

Backend para sistema de reserva de locais para eventos desenvolvido com Node.js, Express, TypeScript e Prisma.

## 📌 Conceito

Este sistema gerencia **locais (venues)** e **reservas (bookings)**:

- **Venues**: São os locais físicos onde eventos podem acontecer (salas, auditórios, espaços, etc.)
- **Bookings**: São as reservas desses locais para eventos específicos, com horários definidos
- **Validação de Conflitos**: O sistema impede que múltiplos eventos sejam agendados no mesmo local com horários sobrepostos

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
│   │   ├── AuthController.ts
│   │   ├── BookingController.ts
│   │   ├── VenueController.ts
│   │   └── UserController.ts
│   ├── middlewares/
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── booking.routes.ts
│   │   ├── venue.routes.ts
│   │   ├── user.routes.ts
│   │   └── index.ts
│   ├── utils/
│   │   └── jwt.ts
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

### 🏢 Locais (Venues)

**⚠️ Todas as rotas de locais requerem autenticação**

#### Listar todos os locais
```http
GET /api/venues
Authorization: Bearer {token}
```

**Resposta (200):**
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "name": "Auditório Principal",
    "description": "Auditório com capacidade para 100 pessoas",
    "location": "São Paulo - SP, Rua Exemplo 123",
    "capacity": 100,
    "isHighlight": true,
    "createdAt": "2025-12-10T10:00:00.000Z",
    "updatedAt": "2025-12-10T10:00:00.000Z",
    "bookings": []
  }
]
```

#### Listar locais em destaque
```http
GET /api/venues/highlights
Authorization: Bearer {token}
```

**Resposta (200):**
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "name": "Auditório Principal",
    "description": "Auditório com capacidade para 100 pessoas",
    "location": "São Paulo - SP, Rua Exemplo 123",
    "capacity": 100,
    "isHighlight": true,
    "createdAt": "2025-12-10T10:00:00.000Z",
    "updatedAt": "2025-12-10T10:00:00.000Z",
    "bookings": []
  }
]
```

#### Buscar local por ID
```http
GET /api/venues/:id
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "name": "Auditório Principal",
  "description": "Auditório com capacidade para 100 pessoas",
  "location": "São Paulo - SP, Rua Exemplo 123",
  "capacity": 100,
  "isHighlight": true,
  "createdAt": "2025-12-10T10:00:00.000Z",
  "updatedAt": "2025-12-10T10:00:00.000Z",
  "bookings": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "eventName": "Workshop de Node.js",
      "date": "2025-12-20T00:00:00.000Z",
      "startTime": "2025-12-20T14:00:00.000Z",
      "endTime": "2025-12-20T18:00:00.000Z",
      "user": {
        "name": "João Silva",
        "email": "joao@example.com"
      }
    }
  ]
}
```

#### Criar novo local
```http
POST /api/venues
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Auditório Principal",
  "description": "Auditório com capacidade para 100 pessoas",
  "location": "São Paulo - SP, Rua Exemplo 123",
  "capacity": 100,
  "isHighlight": true
}
```

**Resposta (201):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "name": "Auditório Principal",
  "description": "Auditório com capacidade para 100 pessoas",
  "location": "São Paulo - SP, Rua Exemplo 123",
  "capacity": 100,
  "isHighlight": true,
  "createdAt": "2025-12-10T10:00:00.000Z",
  "updatedAt": "2025-12-10T10:00:00.000Z"
}
```

#### Atualizar local
```http
PUT /api/venues/:id
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Auditório Principal Renovado",
  "description": "Auditório reformado com capacidade para 150 pessoas",
  "location": "São Paulo - SP, Rua Exemplo 123",
  "capacity": 150,
  "isHighlight": false
}
```

**Resposta (200):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "name": "Auditório Principal Renovado",
  "description": "Auditório reformado com capacidade para 150 pessoas",
  "location": "São Paulo - SP, Rua Exemplo 123",
  "capacity": 150,
  "isHighlight": false,
  "createdAt": "2025-12-10T10:00:00.000Z",
  "updatedAt": "2025-12-10T12:00:00.000Z"
}
```

#### Deletar local
```http
DELETE /api/venues/:id
Authorization: Bearer {token}
```

**Resposta (204):** Sem conteúdo

---

### 📅 Reservas (Bookings)

**⚠️ Todas as rotas de reservas requerem autenticação**

As reservas representam eventos que serão realizados em um local específico, com horário de início e término.

#### Listar todas as reservas
```http
GET /api/bookings
Authorization: Bearer {token}
```

**Resposta (200):**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "venueId": "770e8400-e29b-41d4-a716-446655440002",
    "eventName": "Workshop de Node.js",
    "description": "Aprenda Node.js do zero ao avançado",
    "date": "2025-12-20T00:00:00.000Z",
    "startTime": "2025-12-20T14:00:00.000Z",
    "endTime": "2025-12-20T18:00:00.000Z",
    "status": "confirmed",
    "createdAt": "2025-12-10T10:30:00.000Z",
    "updatedAt": "2025-12-10T10:30:00.000Z",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "João Silva",
      "email": "joao@example.com"
    },
    "venue": {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "name": "Auditório Principal",
      "location": "São Paulo - SP"
    }
  }
]
```

#### Criar nova reserva
```http
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "venueId": "770e8400-e29b-41d4-a716-446655440002",
  "eventName": "Workshop de Node.js",
  "description": "Aprenda Node.js do zero ao avançado",
  "date": "2025-12-20T00:00:00.000Z",
  "startTime": "2025-12-20T14:00:00.000Z",
  "endTime": "2025-12-20T18:00:00.000Z"
}
```

**Resposta (201):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "venueId": "770e8400-e29b-41d4-a716-446655440002",
  "eventName": "Workshop de Node.js",
  "description": "Aprenda Node.js do zero ao avançado",
  "date": "2025-12-20T00:00:00.000Z",
  "startTime": "2025-12-20T14:00:00.000Z",
  "endTime": "2025-12-20T18:00:00.000Z",
  "status": "confirmed",
  "createdAt": "2025-12-10T10:30:00.000Z",
  "updatedAt": "2025-12-10T10:30:00.000Z",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "venue": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "name": "Auditório Principal",
    "location": "São Paulo - SP"
  }
}
```

**Erro - Conflito de horário (409):**
```json
{
  "error": "Time slot conflict",
  "message": "This venue already has a booking during the requested time",
  "conflictingBookings": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "eventName": "Workshop de TypeScript",
      "date": "2025-12-20T00:00:00.000Z",
      "startTime": "2025-12-20T13:00:00.000Z",
      "endTime": "2025-12-20T17:00:00.000Z"
    }
  ]
}
```

**Erro - Horário inválido (400):**
```json
{
  "error": "Start time must be before end time"
}
```

**Erro - Local não encontrado (404):**
```json
{
  "error": "Venue not found"
}
```

**Erro - Capacidade excedida (400):**
```json
{
  "error": "Venue is at full capacity for this time slot"
}
```

#### Atualizar status da reserva
```http
PUT /api/bookings/:id
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "status": "cancelled"
}
```

**Valores permitidos para status:** `confirmed`, `cancelled`, `pending`

**Resposta (200):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "venueId": "770e8400-e29b-41d4-a716-446655440002",
  "eventName": "Workshop de Node.js",
  "description": "Aprenda Node.js do zero ao avançado",
  "date": "2025-12-20T00:00:00.000Z",
  "startTime": "2025-12-20T14:00:00.000Z",
  "endTime": "2025-12-20T18:00:00.000Z",
  "status": "cancelled",
  "createdAt": "2025-12-10T10:30:00.000Z",
  "updatedAt": "2025-12-10T11:00:00.000Z",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "venue": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "name": "Auditório Principal",
    "location": "São Paulo - SP"
  }
}
```

#### Deletar reserva
```http
DELETE /api/bookings/:id
Authorization: Bearer {token}
```

**Resposta (204):** Sem conteúdo

---

## 🔍 Validação de Conflitos

O sistema automaticamente valida conflitos de horário ao criar uma nova reserva:

1. **Mesmo Local**: Verifica se já existe uma reserva para o mesmo local (venue)
2. **Mesma Data**: Compara apenas reservas na mesma data
3. **Sobreposição de Horários**: Um conflito ocorre quando:
   - O novo horário de início é antes do fim de uma reserva existente **E**
   - O novo horário de fim é depois do início de uma reserva existente
4. **Status**: Apenas reservas não canceladas são consideradas

### Exemplos de Conflito:

| Reserva Existente | Nova Reserva | Conflito? |
|------------------|--------------|-----------|
| 14:00 - 18:00    | 16:00 - 20:00 | ✅ Sim    |
| 14:00 - 18:00    | 18:00 - 20:00 | ❌ Não    |
| 14:00 - 18:00    | 10:00 - 14:00 | ❌ Não    |
| 14:00 - 18:00    | 15:00 - 17:00 | ✅ Sim    |
| 14:00 - 18:00    | 12:00 - 20:00 | ✅ Sim    |

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
- password (String, hash bcrypt)
- isAdmin (Boolean, padrão: false) - Indica se o usuário é administrador
- provider (String, padrão: "local")
- providerId (String, opcional - para OAuth)
- createdAt (DateTime)
- updatedAt (DateTime)

### Venue (Local)
- id (UUID)
- name (String) - Nome do local
- description (String, opcional) - Descrição do local
- location (String) - Endereço físico
- capacity (Int) - Capacidade máxima
- isHighlight (Boolean, padrão: false) - Indica se o local está em destaque
- createdAt (DateTime)
- updatedAt (DateTime)

### Booking (Reserva)
- id (UUID)
- userId (UUID) - Usuário que fez a reserva
- venueId (UUID) - Local reservado
- eventName (String) - Nome do evento a ser realizado
- description (String, opcional) - Descrição do evento
- date (DateTime) - Data do evento
- startTime (DateTime) - Horário de início
- endTime (DateTime) - Horário de término
- status (String, padrão: "confirmed") - Status: confirmed, cancelled, pending
- createdAt (DateTime)
- updatedAt (DateTime)

## 📄 Licença

ISC
