FROM node:22.10.0-slim

WORKDIR /nms

RUN apt-get update

RUN apt-get install -y ffmpeg

COPY package.json .

RUN npm install --force --loglevel verbose

COPY . .

EXPOSE 1935

EXPOSE 8000

EXPOSE 8443

CMD [ "npm", "start"]