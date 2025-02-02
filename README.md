# api_vendas
Respository created for studies

# Run application
- npm run dev
- yarn dev

# Path structure (Clean Architecture)
- Domain = business rule (Entities, Value Objects, Enums, Domain events, Repositories);
- Application = Use case and domain organization (Use cases, Application Services, Commands, Queries, External interfaces);
- Presentation = Entry point (Endpoints, Services, gRPC, Graphql, Middleware, Exceptions);
- Infrastructure = External uses (Databases, Identity providers, Repository IMPL, manage brokers, emails, cloud storage, http clients);

# Dependencies
- Dotenv = env variables
- express = microframework 
- express-async-errors = manipule errors
- pg = PostgresSQL
- reflect-metadata = reflection
- typeorm = ORM
