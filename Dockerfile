FROM node:lts-alpine AS base
WORKDIR /app

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    librsvg-dev \
    vips-dev \
    build-base

COPY package.json ./

FROM base AS prod-deps
RUN npm install --omit=dev
RUN npm install --platform=linuxmusl --arch=x64 sharp

FROM base AS build-deps
RUN npm install
RUN npm install --platform=linuxmusl --arch=x64 sharp

FROM build-deps AS build
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 4321

CMD [ "node", "./dist/server/entry.mjs" ]
