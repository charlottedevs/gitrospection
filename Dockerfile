FROM node:8.2
WORKDIR /usr/src/app
COPY package.json package-lock.json .
RUN npm install
COPY . .
