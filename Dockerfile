FROM node:18-slim
WORKDIR /usr/src/app
RUN pnpm install
ENV NODE_ENV="production"
COPY . .
CMD [ "pnpm", "start" ]
