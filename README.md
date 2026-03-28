# Crash Game — Desafio Full-stack Jungle Gaming 🎮

## Sumário

- [Crash Game — Desafio Full-stack Jungle Gaming 🎮](#crash-game--desafio-full-stack-jungle-gaming-)
  - [Sumário](#sumário)
  - [Endpoints dos Services](#endpoints-dos-services)
    - [Wallet Service — `/wallets`](#wallet-service--wallets)
    - [Game Service — `/games`](#game-service--games)
  - [Arquitetura \& Decisões](#arquitetura--decisões)
  - [Setup \& Execução](#setup--execução)
  - [Prisma — Scripts do Banco de Dados](#prisma--scripts-do-banco-de-dados)
    - [Fluxo típico de desenvolvimento](#fluxo-típico-de-desenvolvimento)
    - [Seed](#seed)
  - [Estrutura do Projeto](#estrutura-do-projeto)
  - [Testes](#testes)
    - [Comandos](#comandos)
  - [Decisões de Arquitetura \& Trade-offs](#decisões-de-arquitetura--trade-offs)
  - [Funcionalidades Implementadas](#funcionalidades-implementadas)
    - [Infraestrutura](#infraestrutura)
    - [Wallet Service](#wallet-service)
    - [Game Service](#game-service)
    - [Frontend](#frontend)
    - [CI/CD](#cicd)
    - [Pendente](#pendente)
  - [Bônus](#bônus)

## Endpoints dos Services

### Wallet Service — `/wallets`

| Método | Endpoint      | Auth | Descrição                                | Status          |
| ------ | ------------- | ---- | ---------------------------------------- | --------------- |
| `POST` | `/wallets`    | Sim  | Cria carteira para o jogador autenticado | ✅ Implementado |
| `GET`  | `/wallets/me` | Sim  | Retorna carteira e saldo do jogador      | ✅ Implementado |

> Crédito e débito **não** são expostos via REST — acontecem via message broker (Kafka).

### Game Service — `/games`

| Método | Endpoint                        | Auth | Descrição                                  | Status          |
| ------ | ------------------------------- | ---- | ------------------------------------------ | --------------- |
| `GET`  | `/games/rounds/current`         | Não  | Estado da rodada atual com apostas         | ⚠️ Esqueleto    |
| `GET`  | `/games/rounds/history`         | Não  | Histórico paginado de rodadas              | ⚠️ Esqueleto    |
| `GET`  | `/games/rounds/:roundId/verify` | Não  | Dados de verificação provably fair         | ⚠️ Esqueleto    |
| `GET`  | `/games/bets/me`                | Sim  | Histórico de apostas do jogador (paginado) | ✅ Implementado |
| `POST` | `/games/bet`                    | Sim  | Fazer aposta na rodada atual               | ✅ Implementado |
| `POST` | `/games/bet/cashout`            | Sim  | Sacar no multiplicador atual               | ⚠️ Esqueleto    |

---

## Arquitetura & Decisões

- **Backend**: Dois serviços independentes (Games e Wallets), cada um com DDD (domain, application, infrastructure, presentation).
- **Mensageria**: Kafka para comunicação assíncrona entre serviços (eventos de aposta, cashout, crédito/débito).
- **Banco**: PostgreSQL 18, schemas separados para cada serviço (games e wallets), migrations via Prisma 7.
- **Precisão monetária**: `Decimal` via Prisma — nunca ponto flutuante para dinheiro.
- **API Gateway**: Kong roteando requests REST para `/games` e `/wallets`.
- **Auth**: Keycloak (realm `crash-game`, client `crash-game-client`, usuário teste `player`/`player123`).
- **Frontend**: Vite + React, TanStack Query, Zustand, Tailwind v4, shadcn/ui.
- **WebSocket**: `@nestjs/websockets` + `socket.io` — esqueleto do gateway configurado.
- **Testes**: Vitest (unitários e E2E), Playwright (E2E UI).
- **Infra**: Docker Compose sobe tudo com um comando, sem passos manuais.
- **Variáveis de ambiente**: `.env` e `.env.example` em cada serviço.
- **CI (GitHub Actions)**: Pipeline configurado rodando testes unitários e E2E.

---

## Setup & Execução

**Pré-requisitos:** **Bun >= 1.x**, **Node.js >= 22**, **Docker & Docker Compose**

```bash
git clone https://github.com/NathanRodriguesVieira99/fullstack-challenge-junglegaming
cd fullstack-challenge-junglegaming
bun install
bun run docker:up      # Sobe tudo (infra + serviços + frontend)
```

| Serviço        | URL                                                                        |
| -------------- | -------------------------------------------------------------------------- |
| Frontend       | <http://localhost:5173>                                                    |
| Kong Gateway   | <http://localhost:8000>                                                    |
| Kafka UI       | <http://localhost:8180>                                                    |
| Game Service   | <http://localhost:4001>                                                    |
| Wallet Service | <http://localhost:4002>                                                    |
| Keycloak Admin | <http://localhost:8080> (`admin`/`admin`)                                  |
| Keycloak Realm | `crash-game`                                                               |
| OIDC Discovery | `http://localhost:8080/realms/crash-game/.well-known/openid-configuration` |

> Para rodar localmente fora do Docker, copie os arquivos `.env.example` para `.env` em cada serviço.

---

## Prisma — Scripts do Banco de Dados

Cada serviço possui seus próprios schemas Prisma e banco de dados PostgreSQL separado:

| Script              | Descrição                                        |
| ------------------- | ------------------------------------------------ |
| `db:migrate`        | Cria/aplica migrations (desenvolvimento)         |
| `db:migrate:deploy` | Aplica migrations em produção                    |
| `db:generate`       | Gera o client Prisma baseado no schema           |
| `db:studio`         | Abre o Prisma Studio (interface visual do banco) |
| `db:seed`           | Popula o banco com dados iniciais                |

### Fluxo típico de desenvolvimento

```bash
# Games Service
cd services/games
bun run db:migrate   # Aplica migrations
bun run db:generate  # Gera client

# Wallets Service
cd services/wallets
bun run db:migrate
bun run db:generate
```

### Seed

```bash
cd services/games && bun run db:seed
cd services/wallets && bun run db:seed
```

---

## Estrutura do Projeto

```
fullstack-challenge/
├── services/
│   ├── games/                           # Game Service (NestJS)
│   │   ├── src/
│   │   │   ├── domain/entities/         # Round, Bet
│   │   │   ├── application/services/    # Lógica de domínio
│   │   │   ├── infrastructure/          # DB, Auth
│   │   │   └── presentation/           # Controllers, Gateways
│   │   ├── prisma/models/              # Schema do banco
│   │   ├── tests/unit/ & tests/e2e/   # Testes
│   │   └── package.json
│   └── wallets/                        # Wallet Service (NestJS)
│       ├── src/
│       │   ├── domain/entities/         # Wallet, Player, Transaction
│       │   ├── application/services/    # CreateWallet, Credit, Debit
│       │   ├── infrastructure/          # DB, Auth, Kafka
│       │   └── presentation/           # Controllers, DTOs
│       ├── prisma/models/              # Schema do banco
│       ├── tests/unit/ & tests/e2e/   # Testes
│       └── package.json
├── frontend/                           # Vite + React
│   ├── src/
│   │   ├── api/http/generated/         # Orval (gerado)
│   │   ├── presentation/components/ui/ # shadcn/ui
│   │   ├── integrations/               # TanStack Query, Zustand
│   │   └── lib/                        # Utils
│   └── package.json
├── packages/                           # Pacotes compartilhados
├── docker/
│   ├── kong/kong.yml                   # Rotas do API Gateway
│   ├── keycloak/realm-export.json      # Realm configurado
│   └── postgres/init-databases.sh      # Criação dos DBs
├── docker-compose.yml
├── .github/workflows/tests.yaml         # CI pipeline
└── README.md
```

---

## Testes

- **Unitários**: Vitest
- **E2E**: Vitest + supertest
- **Frontend**: Vitest + Playwright (configurado)
- **Storybook**: Configurado para components

### Comandos

```bash
# Games Service
cd services/games && bun test:unit
cd services/games && bun test:cov:unit
cd services/games && bun test:e2e

# Wallets Service
cd services/wallets && bun test:unit
cd services/wallets && bun test:cov:unit
cd services/wallets && bun test:e2e

# Frontend
cd frontend && bun test:unit
cd frontend && bun test:e2e:ui
cd frontend && bun test:e2e:headed
```

---

## Decisões de Arquitetura & Trade-offs

- **Mensageria**: Kafka escolhido pela robustez, escalabilidade e integração nativa com NestJS.
- **Precisão monetária**: `Decimal` via Prisma — elimina erros de ponto flutuante.
- **DDD**: Separação clara em bounded contexts (Game e Wallet) com camadas bem definidas.
- **Infraestrutura**: Tudo automatizado via Docker Compose — `bun run docker:up` sobe a stack completa.
- **Frontend**: Vite + React para melhor DX e performance de build.
- **Orval + TanStack Query**: Orval configurado para gerar queries tipadas automaticamente a partir dos schemas Swagger.

---

## Funcionalidades Implementadas

### Infraestrutura

- [x] Docker Compose completo (PostgreSQL, Kafka, Keycloak, Kong)
- [x] Kong API Gateway com rotas `/games` e `/wallets`
- [x] Keycloak com realm `crash-game` pré-configurado
- [x] Kafka com UI para visualização de mensagens

### Wallet Service

- [x] Schema Prisma (Wallet, Player, Transaction)
- [x] Domain entities com tipos
- [x] Repositories (contratos e implementações)
- [x] Application services (CreateWallet, GetWallet, Credit, Debit)
- [x] Controllers REST com validação
- [x] Integração Kafka (producer/consumer)
- [x] Unit tests (CreateWallet, Credit, Debit) (alguns com skip pois não deu tempo de implementar)
- [x] Swagger/OpenAPI

### Game Service

- [x] Schema Prisma (Round, Bet) com campos provably fair
- [x] Domain entities (Round, Bet)
- [x] Estados de round: WAITING, RUNNING, CRASHED, FINALIZED
- [x] Estados de bet: PENDING, WON, LOST, CASHED_OUT
- [x] WebSocket gateway (esqueleto)
- [x] Estrutura de controllers e services
- [x] Test configs (unit e e2e) prontos (alguns com skip pois não deu tempo de implementar)

### Frontend

- [x] Vite + React + TypeScript
- [x] Tailwind CSS v4 com shadcn/ui
- [x] TanStack Query provider
- [x] Zustand (store)
- [x] Orval configurado
- [x] Storybook configurado
- [x] Playwright configurado

### CI/CD

- [x] GitHub Actions workflow rodando testes

### Pendente

- [ ] Lógica de round (ciclo de vida completo)
- [ ] Algoritmo Provably Fair (geração e verificação)
- [ ] Endpoints Faltantes do Games Service
- [ ] WebSocket events (tempo real)
- [ ] UI completa do jogo
- [ ] Terminar E2E tests do Game Service
- [ ] Terminar Unit tests do Game Service
- [ ] Terminar E2E tests do Wallets Service
- [ ] Terminar Unit tests do Wallets Service

---

## Bônus

- [x] CI com GitHub Actions
- [x] Playwright configurado
- [x] Storybook configurado
- [x] Orval configurado (gerando client HTTP)
- [ ] Observabilidade (OTel, Prometheus, Grafana)
- [ ] Outbox pattern
- [ ] Auto bet/cashout
- [ ] Efeitos sonoros
- [ ] Leaderboard

---
