FROM node:20

WORKDIR /usr/src/app

# copy package.json + package-lock.json first
COPY package*.json ./

# install deps
RUN npm install

COPY . .


CMD ["npm", "run", "dev", "--", "--host"]