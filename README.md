# api_vendas
Respository created for studies

# Run application
- `npm run dev`
- `yarn dev`
- `docker compose up -d` (to run the docker container)

# Path structure (Clean Architecture)
- Domain = business rule (Entities, Value Objects, Enums, Domain events, Repositories);
- Application = Use case and domain organization (Use cases, Application Services, Commands, Queries, External interfaces);
- Presentation = Entry point (Endpoints, Services, gRPC, Graphql, Middleware, Exceptions);
- Infrastructure = External uses (Databases, Identity providers, Repository IMPL, manage brokers, emails, cloud storage, http clients);

# Dependencies
- Dotenv = env variables
- Dotenv-cli = load the variables from .env
- express = microframework
- express-async-errors = manipule errors
- pg = PostgresSQL
- reflect-metadata = reflection
- typeorm = database relation with entities
- Zod = Schema declaration and validation library
- swagger UI = API interface
- swagger-jsdoc = generate API documentation
- Jest = Unit tests
