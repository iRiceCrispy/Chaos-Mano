FROM node:16-alpine AS build-stage

WORKDIR /client

COPY client/. .

RUN npm install
RUN npm run build


FROM node:16-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .
COPY --from=build-stage /client/build ./client/build

EXPOSE 5000

CMD ["npm", "start"]