# Base
FROM --platform=linux/amd64 node:16.19-bullseye-slim AS base
WORKDIR /app
COPY package*.json ./

# Build stage
FROM base AS build
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "test"]