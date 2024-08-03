FROM node:lts-slim

WORKDIR /usr/src/app

COPY . .

RUN npm i
ENV MONGO_URL=mongodb://host.docker.internal:27017/
EXPOSE 3000
CMD [ "npm", "start" ]