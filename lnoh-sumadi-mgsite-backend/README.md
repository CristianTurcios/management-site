<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>
  
  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

### Databases

This project use two different database: Postgresql which is the principal database and MongoDB (future implementation).
In order to run this project you need to create a database and pass some configurations in the ```.env``` file

### Database Schema

- `User`
- `Role`
- `RefreshToken`

1. Before Create Users and generate Refresh Token automatically. You need to add Roles in your database. Roles schema consist in:

- id: 1
- role: Admin

- id: 2
- role: Viewer

- id: 3
- role: etc...

### Environment Variables

1. Create the .env file in the root level (at the same level of `src` folder and `package.json` file)
2. Add the following .env variables in the file and put the value folling by `=` example `PORT=1337`:

- `MONGO_DB_CONTAINER_CONNECTION_STRING`
- `MONGO_DB_USER`
- `MONGO_DB_PASSWORD`
- `MONGO_DB_DATABASE`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_USERNAME`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`
- `PORT`
- `API_URL`
- `JWT_SECRET`
- `MANDRILL_API_KEY`
- `MANDRILL_EMAIL_FROM`

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Cristian J. Turcios](https://www.facebook.com/cristian.turcios2/)
- Twitter - [Cristian J. Turcios](https://twitter.com/Cris_Turcios)
- Email - cturcioscolindres01@gmail.com


## License

  Nest is [MIT licensed](LICENSE).
