FROM node:20-alpine
WORKDIR /usr/src/app

# 필요한 환경 변수 설정
ENV NODE_ENV production
ENV PNPM_HOME /pnpm
ENV PATH $PNPM_HOME:$PATH

# pnpm 설치
RUN apk add --no-cache libc6-compat
RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm

RUN pnpm install
ENV NODE_ENV="production"
COPY . .
CMD [ "pnpm", "start" ]
