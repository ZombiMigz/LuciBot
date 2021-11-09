# specifies Node and version 16
FROM node:16
# Sets current director
WORKDIR /usr/src/app
#copies over package.json and package-lock.json
COPY package*.json ./
# install node packages
RUN npm install
#copies files
COPY . .
#runs bot
CMD ["node", "."]