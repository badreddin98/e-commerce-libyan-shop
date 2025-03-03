FROM node:18

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/

RUN npm install
RUN cd frontend && npm install

COPY . .

RUN cd frontend && npm run build

ENV NODE_ENV=production

EXPOSE $PORT

CMD ["npm", "start"]
