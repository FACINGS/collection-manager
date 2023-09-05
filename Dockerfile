FROM node:18.14.2-alpine3.16 AS builder

ENV NODE_ENV production

WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile

RUN yarn build

FROM node:18.14.2-alpine3.16 AS runner

ENV NODE_ENV production
ENV PORT 3000

RUN adduser --disabled-password soonmanager && \
  mkdir -p /app && \
  chown -R soonmanager:soonmanager /app

WORKDIR /app

USER soonmanager

COPY --from=builder /app/.env .env

COPY --from=builder /app/public ./public
COPY --from=builder --chown=soonmanager:soonmanager /app/.next/standalone ./
COPY --from=builder --chown=soonmanager:soonmanager /app/.next/static ./.next/static
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]