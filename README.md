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
  - [Decisões de Arquitetura \& Trade-offs](#decisões-de-arquitetura--trade-offs)
  - [Funcionalidades Implementadas](#funcionalidades-implementadas)
  - [Bônus](#bônus)

## Endpoints dos Services

### Wallet Service — `/wallets`

| Método | Endpoint      | Auth | Descrição                                | Status          |
| ------ | ------------- | ---- | ---------------------------------------- | --------------- |
| `POST` | `/wallets`    | Sim  | Cria carteira para o jogador autenticado | ✅ Implementado |
| `GET`  | `/wallets/me` | Sim  | Retorna carteira e saldo do jogador      | ✅ Implementado |

> Crédito e débito **não** são expostos via REST — acontecem via message broker.

### Game Service — `/games`

| Método | Endpoint                        | Auth | Descrição                                  | Status          |
| ------ | ------------------------------- | ---- | ------------------------------------------ | --------------- |
| `GET`  | `/games/rounds/current`         | Não  | Estado da rodada atual com apostas         | ⏳ Em progresso |
| `GET`  | `/games/rounds/history`         | Não  | Histórico paginado de rodadas              | ⏳ Em progresso |
| `GET`  | `/games/rounds/:roundId/verify` | Não  | Dados de verificação provably fair         | ⏳ Em progresso |
| `GET`  | `/games/bets/me`                | Sim  | Histórico de apostas do jogador (paginado) | ⏳ Em progresso |
| `POST` | `/games/bet`                    | Sim  | Fazer aposta na rodada atual               | ⏳ Em progresso |
| `POST` | `/games/bet/cashout`            | Sim  | Sacar no multiplicador atual               | ⏳ Em progresso |

## Arquitetura & Decisões

- **Backend**: Dois serviços independentes (Games e Wallets), cada um com DDD (domain, application, infrastructure, presentation).
- **Mensageria**: Kafka para comunicação assíncrona entre serviços (eventos de aposta, cashout, crédito/débito).
- **Banco**: PostgreSQL 18, schemas separados para cada serviço, migrations via Prisma.
- **API Gateway**: Kong roteando requests REST para /games e /wallets.
- **Auth**: Keycloak (realm, client e usuário de teste já configurados).
- **Frontend**: Vite + React, TanStack Query, Zustand, Tailwind v4, shadcn/ui.
- **WebSocket**: @nestjs/websockets + socket.io para eventos em tempo real.
- **Testes**: Vitest (unitários e E2E), Playwright (E2E UI).
- **Infra**: Docker Compose sobe tudo com um comando, sem passos manuais.
- **Variáveis de ambiente**: `.env` e `.env.example` em cada serviço.
- **CI (Github Actions)**: Roda testes quando sobe um push para main.

---

## Setup & Execução

Pré-requisitos: **Bun >= 1.x**, **NodeJs >= 22**, **Docker & Docker Compose**

```bash
git clone https://github.com/NathanRodriguesVieira99/fullstack-challenge-junglegaming
cd crash-game
bun install
bun run docker:up      # Sobe tudo (infra + serviços + frontend)
```

- Acesse o frontend: <http://localhost:5173>
- Kong Gateway: <http://localhost:8000>
- Kafka (UI): <http://localhost:8180>
- Game Service: <http://localhost:4001>
- Wallet Service: <http://localhost:4002>
- Keycloak: <http://localhost:8080> (admin/admin)

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

1. Modifique o schema Prisma em `prisma/schema.prisma` ou em `prisma/models`
2. Rode `bun run db:migrate` para aplicar as mudanças ao banco
3. Rode `bun run db:generate` para gerar o client atualizado

### Seed

O seed popula o banco com dados iniciais.

```bash
bun run db:seed
```

---

## Estrutura do Projeto

```
fullstack-challenge/
├── services/
│   ├── games/      # Ciclo de vida do jogo, apostas, provably fair, WebSocket
│   └── wallets/    # Carteira, crédito/débito, precisão monetária
├── frontend/       # UI, animações, integração REST/WebSocket
├── docker/         # Configuração de infra (Kong, Keycloak, Postgres)
├── docker-compose.yml
├── packages/       # Pacotes compartilhados
└── README.md
```

---

## Testes

- **Unitários**: Vitest
- **E2E**: Vitest + supertest
- **Frontend**: Vitest

Comandos:

```bash
cd services/wallets && bun test:cov:unit
cd services/games && bun test:cov:unit
cd services/wallets && bun test:e2e
cd services/games && bun test:e2e
cd frontend && bun test:unit
cd frontend && bun test:cov:unit
cd frontend && bun test:e2e:ui
cd frontend && bun test:e2e:headed
```

---

## Decisões de Arquitetura & Trade-offs

- **Mensageria**: Kafka escolhido pela robustez e integração pronta no NestJS.
- **Precisão monetária**: Todos os valores em centavos (Decimal) — nunca ponto flutuante.
- **DDD**: Separação clara de camadas e bounded contexts.
- **Infra**: Tudo automatizado via Docker Compose, sem dependências manuais.
- **Frontend**: Vite + React para maior controle e performance.
- **Orval + TanStack Query**: Optou-se pelo Orval para gerar as queries e mutations do TanStack Query automaticamente a partir do Swagger de cada serviço. Isso garante que todas as requisições HTTP sejam tipadas corretamente, refletindo os schemas e DTOs definidos nos backends. Qualquer mudança na API é automaticamente refletida no frontend, eliminando erros de tipagem manual e mantendo a consistência entre frontend e backend.

---

## Funcionalidades Implementadas

- [x] Setup infraestrutura (Docker, Kong, Keycloak, Kafka, PostgreSQL)
- [x] Wallet Service (criação, get, crédito via Kafka)
- [x] Game Service (rounds, bets, histórico)
- [x] Comunicação assíncrona entre serviços via Kafka
- [x] Autenticação OIDC (Keycloak)
- [x] Testes unitários Wallet Service
- [ ] Algoritmo Provably Fair
- [ ] WebSocket para eventos em tempo real
- [ ] UI completa do jogo (gráfico, animações)
- [ ] Testes E2E completos
- [ ] Liderboard, Auto bet/cashout, Efeitos sonoros

---

## Bônus

- [x] CI com GitHub Actions
- [x] Playwright configurado
- [x] Storybook configurado
- [ ] Orval configurado
- [ ] Observabilidade (OTel, Prometheus, Grafana)
- [ ] Outbox pattern
- [ ] Auto bet/cashout
- [ ] Efeitos sonoros
- [ ] Leaderboard

---
