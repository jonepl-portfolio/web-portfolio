FROM node:20-alpine

WORKDIR /mail-server

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 587

CMD ["node", "server.js"]
