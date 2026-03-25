FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json ./
RUN bun install

COPY . .

EXPOSE 4002

CMD ["sh", "-c", "bun db:migrate:deploy && bun run src/main.ts"]
