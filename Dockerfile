FROM node:16

WORKDIR /app

COPY package*.json ./

COPY /database/database.sql /docker-entrypoint-initdb.d/

RUN npm install

COPY . .

EXPOSE 30000

CMD ["npm", "start"]