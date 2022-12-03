<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

An example of a backend app powered by [Nest](https://github.com/nestjs/nest) framework.
The key points / features:
- Docker: using [Docker compose](https://docs.docker.com/compose/) the multicontainer app could be run. In that case,
1) a container for the backend app
2) a container for [Postgres](https://www.postgresql.org/)
3) a container to run [pgAdmin](https://www.pgadmin.org/) inside Docker (could be checked at http://localhost:5454/browser/ when the docker-compose is up and running)
- [Swagger](https://swagger.io/) is set up (could be checked at http://localhost:4000/api/docs when the docker-compose is up and running)
- [Sequelize](https://sequelize.org/) is set up
- [AutoMapper](https://automapperts.netlify.app/docs/nestjs) is set up
- versioning is set up
- a basic logger is set up
- a service for graceful shutdown is prepared

The app has only one module for CRUD operations for the /users endpoints.

## Installation

The project uses [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable).

```bash
$ yarn
```

## Running the app

```bash
$ docker-compose up
```
