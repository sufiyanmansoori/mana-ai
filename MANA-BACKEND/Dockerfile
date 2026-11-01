FROM node:22-alpine AS build
WORKDIR /workspace
COPY package.json package-lock.json ./
COPY apps/mana_ai_api/package.json apps/mana_ai_api/package.json
RUN npm ci --workspace=@mana-ai/api --include-workspace-root=false
COPY apps/mana_ai_api/ apps/mana_ai_api/
RUN npm run build --workspace=@mana-ai/api

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/mana_ai_api/package.json apps/mana_ai_api/package.json
RUN npm ci --omit=dev --workspace=@mana-ai/api --include-workspace-root=false \
  && npm cache clean --force
COPY --from=build /workspace/apps/mana_ai_api/dist ./dist
COPY --from=build /workspace/apps/mana_ai_api/src/db/migrations ./dist/db/migrations
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
