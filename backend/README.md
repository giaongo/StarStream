## Backend Instructions

1. Construct .env in the backend dir with the following format:

* APP_SECRET=
* POSTGRES_USER=
* POSTGRES_PASSWORD=
* POSTGRES_DB=
* ADMIN_EMAIL=
* ADMIN_PASSWORD=
* JWT_SECRET=

2. How to run backend and postgresql
- Run docker containers:	`code` docker-compose up --build
- Stop docker containers:  `code` docker-compose down
- Get into the docker database: `code` docker exec -ti postgresql psql -U streamuser -d starstream_db
