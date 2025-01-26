FROM node:20
WORKDIR /app
COPY package.json .
RUN rm -rf node_modules package-lock.json && \
    npm install && \
    npm install rollup@latest
COPY . .
CMD ["npm", "run", "dev"]