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

### Usuários
- `GET /api/users` - Lista todos os usuários
- `GET /api/users/:id` - Busca um usuário por ID
- `POST /api/users` - Cria um novo usuário
- `PUT /api/users/:id` - Atualiza um usuário
- `DELETE /api/users/:id` - Remove um usuário

### Eventos
- `GET /api/events` - Lista todos os eventos
- `GET /api/events/:id` - Busca um evento por ID
- `POST /api/events` - Cria um novo evento
- `PUT /api/events/:id` - Atualiza um evento
- `DELETE /api/events/:id` - Remove um evento

### Reservas
- `GET /api/bookings` - Lista todas as reservas
- `POST /api/bookings` - Cria uma nova reserva
- `DELETE /api/bookings/:id` - Remove uma reserva

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
