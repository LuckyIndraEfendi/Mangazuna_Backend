FROM node:18-alpine
WORKDIR /komik-api
ENV NODE_ENV=production
ENV API_KEY=U8Spin1sAF4y89guvaHy03mOphmhhM38
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
EXPOSE 5000
CMD [ "node", "index.js" ]
