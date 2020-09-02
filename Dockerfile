FROM node:12

WORKDIR /sidebar-service
COPY package*.json ./
RUN npm install

EXPOSE 3210

COPY . .

CMD [ "node", "server/server.js" ]