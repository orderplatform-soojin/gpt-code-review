FROM node:20-alpine
WORKDIR /github/workspace

ENV NODE_ENV="production"

# 번들링된 dist 디렉토리만 복사
COPY dist ./dist

CMD [ "node", "dist/index.js" ]
