FROM node:12

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
CMD npm run start
EXPOSE 80