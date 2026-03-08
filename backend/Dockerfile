FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY .env ./
RUN bunx prisma generate

COPY src ./src/
COPY db.ts ./

EXPOSE 4000
CMD ["bun", "run", "start"]
