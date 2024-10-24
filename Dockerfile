FROM node:22.10-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm i
ENV MONGO_URL=mongodb://host.docker.internal:27017/
EXPOSE 3000
CMD [ "npm", "start" ]