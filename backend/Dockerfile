FROM node:20
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["sh", "-c", "sleep 5 && node src/server.js"]