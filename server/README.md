# Redis Analytics Bitmaps API

## Prerequisites

-   Node - v12.19.0
-   NPM - v6.14.8
-   Docker - v19.03.13 (optional)

## Development

```
# copy file and set proper data inside
cp .env.example .env

# install dependencies
npm install

# run docker compose or install redis manually
docker network create global
docker-compose up -d --build

npm run dev

```
