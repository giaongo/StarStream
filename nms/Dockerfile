FROM node

WORKDIR /nms

COPY package.json .

RUN npm install

RUN apt-get update

RUN apt-get install -y ffmpeg

COPY . .

EXPOSE 1935

EXPOSE 8000

EXPOSE 8443

CMD [ "npm", "run", "dev"]