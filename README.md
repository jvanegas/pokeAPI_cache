# poplin_tech_assesment

## Installation

1. Clone the repository
2. Run `pnpm install` to install the dependencies
3. Run `pnpm docker:install` to start Redis and redis-commander
4. Create a `.env` file in the root directory and add the following variables:
    ```
    PORT=8000
    REDIS_HOST=localhost
    REDIS_PORT=6379
    ```
    There is an example `.env.example` file in the root directory.
5. Run `pnpm build` to create the `dist` folder
6. Run `pnpm start` to start the server
7. Start sending requests to `http://localhost:8000` (`port` can be changed in the `.env` file)
8. To shutdown docker containers, run `docker:uninstall`


## API Endpoints

## Health checks
- GET `/health/server` - Check if the server is running
- GET `/health/cache-system` - Check if the Redis server is running

## PokeAPI
- GET `/pokemon/:name` - Get the details of a pokemon by name
- GET `/ability/:name` - Get the details of an ability by name

The PokeAPI endpoints are protected by API key. Send a request with the header `x-api-key` with the value defined in .env file as `API_KEY`.

## Architecture and solution

The Poplin Tech Assesment asks to create an API that fetches data from the PokeAPI as a proxy. This is a part of a larger system. The main quality attributes of the system are:

* **Performance**
* **Scalability**
* **Reliability**

This solution was solved using (`Fastify`)[https://www.fastify.io/] as the web framework and (`Redis`)[https://redis.io/] as the cache system. Docker was used to create a container for Redis and redis-commander. The API is protected by an API key.

The architecture was defined to be a monolith using a modular approach. The code is divided into modules and each module has its own folder. The main modules are:

* **/src/modules/health-check** - Contains the health check routes. It was intended originally to be the Core module of the client system with all the business logic.
* **/src/modules/poke-api** - Contains the routes to fetch data from the PokeAPI. It was intended to be the Core module of the PokeAPI system with all the business logic. This module is protected by an API key and contain two subfolders: `pokemon` and `ability`, to fetch data from the PokeAPI.
* **src/shared** - Contains shared code between modules. It contains the auth function to be used in Fastify hooks.

It was intented that each of the modules could be extracted to a separate repository and be deployed independently with minor changes (creating a new `server.ts` file).

![Architecture](./diagram.png)

For each of the quality attributes, the following solutions were implemented:

* **Performance** - The API is protected by an API key. The API key can be used to limit the number of requests to the API with a Fastify plugin (like fastify-rate-limit)[https://github.com/fastify/fastify-rate-limit]. The data fetched from the PokeAPI is stored in Redis. The data is stored with a TTL of 1 hour. This way, the data is always fresh and the number of requests to the PokeAPI is limited. The data is stored in Redis with the key `pokemon:${name}` and `ability:${name}`.

* **Scalability** - The API is a monolith with modules. It can be easily split into different services independently deployable. `PNPM` is used, so `workspace` can be used to manage the dependencies of the different modules.

* **Reliability** - Docker used to create a container for Redis and redis-commander. This can help to deploy and manage events to restart the container in case of failure.

## Improvements

For each of the quality attributes, the following improvements can be made:

* **Performance**:
  - Implement a rate limiter to limit the number of requests to the API.
  - Implement ETAGs to cache the response in the client side reusing the PokeAPI weak ETAGs.

* **Scalability**: 
  - Improve repository with workspace to manage the dependencies of the different modules.

* **Reliability**:
  - Start the server in its own container and use a container orchestrator like Kubernetes to manage the containers.
  - Implement unit tests and integration tests to ensure the reliability of the system.
