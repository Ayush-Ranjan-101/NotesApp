FROM node:25-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .

RUN chown -R node:node /app

USER node

EXPOSE 8000

CMD ["node", "src/index.js"]
