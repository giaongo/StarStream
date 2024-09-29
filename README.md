## Star Stream Application

The project contains the custom streaming server and a web platform supporting streaming and viewing the events hosted by
Nokia.

## How to run

- Instruction to develop and test the web platform

1. Construct .env in the backend dir with the following format:

- APP_SECRET=
- POSTGRES_USER=
- POSTGRES_PASSWORD=
- POSTGRES_DB=
- ADMIN_EMAIL=
- ADMIN_PASSWORD=
- JWT_SECRET=

2. How to run frontend, backend and postgresql

- Open command prompt and go to main directory where docker-compose.yaml locates
- Run docker containers: `code` docker-compose up --build
- Stop and remove docker containers: `code` docker-compose down
- Get into the docker database for further inspection: `code` docker exec -ti postgresql psql -U streamuser -d starstream_db
- When there are fronend code changes, frontend react auto-reloads the frontend container
- When changes need to be made in backend, manual restarting backend container is necessary by: `code` docker-compose restart backend
