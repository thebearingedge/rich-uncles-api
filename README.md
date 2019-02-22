rich-uncles-api
--

Backend coding challenge.

### Setting Up the Project

1. Clone the repo.
2. Install the dependencies with NPM.
3. Set up the environment...

Create a `.env` file in the root of the project before getting started. Then copy the environment variables from `.env.example` (or add your own).

### Setting up the Database

If you are running Docker Compose ~1.32, you can run the `db:start` npm script to set up a local Postgres database. Otherwise, just be sure to create a Postgres database and set the connection string as the `POSTGRES_URL` environment variable in `.env`. Then run the migration script:

`npm run db:up`

### Running the Tests

`npm test`

### Generating a Test Coverage Report

`npm run cover`

### Start the API Server

`npm start`

### Project Description

With given sample Postgres DB, create a RESTful Node.js API with four endpoints - signup, login, create a transaction and get all transactions for a user.

Develop this test project same as you would develop a real-world application with tests, security, configurability, and scalability.
