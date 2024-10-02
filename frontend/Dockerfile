FROM node

WORKDIR /frontend

COPY package.json .

RUN npm install

# production
RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE  5173

# development
# CMD ["npm", "run", "dev"]

# production
CMD ["serve", "-s", "dist", "-l", "5173"]

