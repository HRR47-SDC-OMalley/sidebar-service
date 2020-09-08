FROM node:10

WORKDIR /sidebar-service
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3210
CMD [ "node", "server/SDCserver.js" ]