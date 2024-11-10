FROM node:22.10-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm i
EXPOSE 3000
CMD [ "npm", "start" ]