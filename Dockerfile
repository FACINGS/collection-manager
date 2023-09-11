FROM node:18.17-alpine3.18 AS builder

ENV NODE_ENV production

WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile

RUN yarn build

FROM node:18.17-alpine3.18 AS runner

ENV NODE_ENV production
ENV PORT 3000

RUN adduser --disabled-password nftmanager && \
  mkdir -p /app && \
  chown -R nftmanager:nftmanager /app

WORKDIR /app

USER nftmanager

COPY --from=builder /app/.env .env

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nftmanager:nftmanager /app/.next/standalone ./
COPY --from=builder --chown=nftmanager:nftmanager /app/.next/static ./.next/static
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]