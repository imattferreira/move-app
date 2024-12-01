## Move-App

 ### Status
 The main purpose of this project is primarily for studying and your status is in initial stages of development.

 With the Move-App I have applying various architecture concepts that I have studying in the last weeks, like [S.O.L.I.D Principles](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design), [Design Patterns](https://refactoring.guru/design-patterns), [Hexagonal Architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)), [Clean-Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) and [Domain-Driven Design](https://en.wikipedia.org/wiki/Domain-driven_design).

 ### About
 Move-App is the place where gives you the power to get where you want to go

 ### Technologies
 Move-App was designed to be lean and have your main parts developed with in-house solutions, but for the times that is not feasible to develop, I have been using the most popular technologies:
 - Typescript
 - Node.JS
 - Docker & Docker-Compose
 - PostgreSQL

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
