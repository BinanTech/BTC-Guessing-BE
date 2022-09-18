# Guessing BTC Price Change
## Description

It provides guessing panel for users to guess BTC price changes easily.

## Installation
### Dependencies

```bash
$ yarn install
```
### Setting up environment
```bash
NEST_ACCESS_TOKEN_EXPIRES=1h
NEST_REFRESH_TOKEN_EXPIRES=8h
NEST_JWT_SECRET={your jwt secret}
NEST_PER_MINUTES=1
NEST_MONGOOSE_URL=mongodb://localhost:27017/nest
NEST_PORT=8000
```
## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```
### Backend URL
 if you didn't set port in .env, visit https://localhost:5000
## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

