FROM node:12

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

EXPOSE 3000

COPY . .

CMD [ "npm", "start" ]
