## Move-App

### About

**Backend** is the application resposible to guarantee to all business is applied correctly and also manipulate all necessary data to populate your clients.

### Technologies

Move-App was designed to be lean and have your main parts developed with in-house solutions, but for the times that is not feasible to develop, I have been using the most popular technologies:

- Typescript
- Node.JS
- Docker & Docker-Compose
- PostgreSQL
- Jest

### Commands

As you can see in `package.json` file, this project has various commands and automations. Here you can see which command realizes:

- `docker:clean` => delete all containers created of docker-compose
- `docker:start` => create or start all containers of docker-compose
- `docker:stop` => stop all containers of docker-compose
- `lint` => lint source files
- `migration:apply` => manually apply database migrations
- `migration:compose` => compose migrations into a single one to be applied automatically during containers creating via `docker:start`
- `migration:create` => create a new migration file
- `start` => start the server
- `test` => run automated tests
- `test:coverage` => see tests code coverage
- `test:watch` => run automated tests in **watch** mode
