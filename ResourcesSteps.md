## Create a new migration for postgres with typeorm
* Create the migration file with typeorm
```sh
npm run typeorm migration:create <Migration Files Path>/FileName
```

## Define fields in created migration
* Define Up and down functions

## Run migration in postgres
```sh
npm run typeorm:migration:run
```
* script defined in package.json
* Ensure file `index.ts` in `src\common\infrastructure\typeorm\testing` are configurated to run the migrations file with `migrations` tag

## Create files structure
* Create `Application`, `Domain` and `Infrastructure` folders on the module folder

## Create Data model
* In `Domain`, create the model file

## Create entity used for Typeorm
* In `Infrastructure\typeorm\entities`, create the entity file

## Create repository
* In `domain\repositories`, create the repository file to define model implementation

## Create in-memory repository
* In `Infrastructure\in-memory\repositories`, create the repository file to implements the in-memory methods

## Create Helper
* Create the helper for tests

## Create the unit tests
* In `Infrastructure\in-memory\repositories`, create the unit tests files to test methods implemented

* **To run unit tests `npm run test:unit -- <test_file_name>.repository`**

## Create Container to implements dependency injection
In `Infrastructure\container`, create the index file to implements all injectable dependencies

## Create the Typeorm repository
In `Infrastructure\typeorm\repositories`, create the repository file to implements the typeorm methods

## Create the integration tests

* In `Infrastructure\typeorm\repositories`, create the integration tests files to test methods implemented

* **To run unit tests `npm run test:int -- <test_file_name>.repository`**

## Create Use cases
* In `Application\usecases`, create the usecase file
