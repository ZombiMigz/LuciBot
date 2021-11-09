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
#installs nano
RUN apt-get update
RUN apt-get -y install vim nano
#runs bot
CMD ["node", "."]