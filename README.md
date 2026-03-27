# Crash Game — Desafio Full-stack Jungle Gaming 🎮

## Sumário

- [Crash Game — Desafio Full-stack Jungle Gaming 🎮](#crash-game--desafio-full-stack-jungle-gaming-)
  - [Sumário](#sumário)
  - [Endpoints dos Services](#endpoints-dos-services)
    - [Wallet Service — `/wallets`](#wallet-service--wallets)
    - [Game Service — `/games`](#game-service--games)
  - [Arquitetura \& Decisões](#arquitetura--decisões)
  - [Setup \& Execução](#setup--execução)
  - [Estrutura do Projeto](#estrutura-do-projeto)
  - [Testes](#testes)
  - [Decisões de Arquitetura \& Trade-offs](#decisões-de-arquitetura--trade-offs)
  - [Funcionalidades Implementadas](#funcionalidades-implementadas)
  - [Bônus](#bônus)

## Endpoints dos Services

### Wallet Service — `/wallets`

| Método | Endpoint | Auth | Descrição | Status |

| Método | Endpoint      | Auth | Descrição                                | Status           |
| ------ | ------------- | ---- | ---------------------------------------- | ---------------- |
| `POST` | `/wallets`    | Sim  | Cria carteira para o jogador autenticado | ✔️ Implementado! |
| `GET`  | `/wallets/me` | Sim  | Retorna carteira e saldo do jogador      | ✔️ Implementado! |

> Crédito e débito **não** são expostos via REST — acontecem via message broker.

### Game Service — `/games`

| Método | Endpoint                        | Auth | Descrição                                  | Status       |
| ------ | ------------------------------- | ---- | ------------------------------------------ | ------------ |
| `GET`  | `/games/rounds/current`         | Não  | Estado da rodada atual com apostas         | ⌛ Fazendo.. |
| `GET`  | `/games/rounds/history`         | Não  | Histórico paginado de rodadas              | ⌛ Fazendo.. |
| `GET`  | `/games/rounds/:roundId/verify` | Não  | Dados de verificação provably fair         | ⌛ Fazendo.. |
| `GET`  | `/games/bets/me`                | Sim  | Histórico de apostas do jogador (paginado) | ⌛ Fazendo.. |
| `POST` | `/games/bet`                    | Sim  | Fazer aposta na rodada atual               | ⌛ Fazendo.. |
| `POST` | `/games/bet/cashout`            | Sim  | Sacar no multiplicador atual               | ⌛ Fazendo.. |

## Arquitetura & Decisões

- **Backend**: Dois serviços independentes (Games e Wallets), cada um com DDD (domain, application, infrastructure, presentation).
- **Mensageria**: Kafka para comunicação assíncrona entre serviços (eventos de aposta, cashout, crédito/débito).
- **Banco**: PostgreSQL 18, schemas separados para cada serviço, migrations.
- **API Gateway**: Kong roteando requests REST para /games e /wallets.
- **Auth**: Keycloak (realm, client e usuário de teste já configurados).
- **Frontend**: Vite + React, TanStack Query, Zustand, Tailwind v4, shadcn/ui.
- **WebSocket**: @nestjs/websockets + socket.io para eventos em tempo real.
- **Testes**: Vitest (unitários e E2E), Playwright (E2E UI).
- **Infra**: Docker Compose sobe tudo com um comando, sem passos manuais.
- **Variáveis de ambiente**: `.env` e `.env.example` exatamente iguais para facilitar o desenvolvimento (jamais usar assim em prod)
- **CI (Github Actions)**: Roda testes quando sobe um push para main (pipeline simples, necessário ocultar as variáveis de ambiente)

---

## Setup & Execução

Pré-requisitos: **Bun >= 1.x**, **NodeJs >= 20**, **Docker & Docker Compose**

```bash
git clone https://github.com/SEU_USUARIO/crash-game
cd crash-game
bun install
bun run docker:up      # Sobe tudo (infra + serviços + frontend)
```

- Acesse o frontend: <http://localhost:5173>
- Kong Gateway (UI): <http://localhost:8002>
- Kafka (UI): <http://localhost:8180>
- Game Service: <http://localhost:4001>
- Wallet Service: <http://localhost:4002>
- Keycloak: <http://localhost:8080> (admin/admin)

> Para rodar localmente fora do Docker, copie os arquivos `.env.example` para `.env` em cada serviço.

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

- **Unitários**: Vitest + supertest
- **E2E**: Vitest + supertest
- **Frontend**: Vitest + Playwright

Comandos:

```bash
cd services/games && bun test tests/unit
cd services/wallets && bun test tests/unit
cd services/games && bun test tests/e2e
cd frontend && bun test
```

---

## Decisões de Arquitetura & Trade-offs

- **Mensageria**: Kafka escolhido pela robustez e integração pronta no NestJS.
- **Precisão monetária**: Todos os valores em centavos (Decimal) — nunca ponto flutuante.
- **DDD**: Separação clara de camadas e bounded contexts.
- **Infra**: Tudo automatizado via Docker Compose, sem dependências manuais.
- **Frontend**: Vite + React para maior controle e performance.

---

## Funcionalidades Implementadas

- [ ] Ciclo completo do Crash Game (aposta, cashout, crash, histórico)
- [x] Comunicação assíncrona entre serviços
- [ ] WebSocket para eventos em tempo real
- [x] Autenticação OIDC (Keycloak)
- [ ] Testes unitários e E2E
- [ ] UI responsiva, dark mode, animações
- [x] Setup automatizado

---

## Bônus

- [ ] Outbox/Inbox transacional
- [ ] Auto cashout/auto bet
- [ ] Observabilidade (OpenTelemetry, Prometheus, Grafana)
- [ ] Leaderboard
- [ ] Storybook
- [ ] Playwright
- [ ] Rate limiting via Kong
- [ ] Seed determinística para E2E

---
