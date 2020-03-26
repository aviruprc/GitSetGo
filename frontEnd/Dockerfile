FROM node
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV SERVER=https://8082-dot-11362060-dot-devshell.appspot.com/
EXPOSE 8080
CMD ["node", "server.js"]