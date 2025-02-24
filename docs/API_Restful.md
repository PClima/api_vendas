# RESTful APIs

## Introduction

A RESTful API (Representational State Transfer) is an architectural style for designing networked applications. It relies on a stateless, client-server communication protocol, typically HTTP, and emphasizes scalability, simplicity, and performance. RESTful APIs use HTTP methods and resource-based URIs to perform CRUD (Create, Read, Update, Delete) operations. Allowing the backend support any numbers of frontend applications

## Key Concepts

### 1. Resources

Resources are the fundamental units of a RESTful API. They represent the data or functionality provided by the API. Each resource is identified by a unique URI (Uniform Resource Identifier). For example, `/users`, `/products`, and `/orders` could be resources in an e-commerce API.

### 2. HTTP Methods

RESTful APIs use standard HTTP methods to perform operations on resources:

- **GET**: Retrieve a representation of a resource.
- **POST**: Create a new resource.
- **PUT**: Update an existing resource.
- **DELETE**: Remove a resource.
- **PATCH**: Partially update an existing resource.

### 3. Statelessness

RESTful APIs are stateless, meaning each request from the client to the server must contain all the information needed to understand and process the request. The server does not store any client context between requests.

### 4. Representations

Resources can have multiple representations, such as JSON, XML, or HTML. Clients can specify their preferred representation using the `Accept` header in the HTTP request, and servers respond with the appropriate format.

### 5. URIs and Endpoints

Each resource is accessible via a unique URI. The URI structure should be intuitive and hierarchical. Example endpoints for an API managing a book collection might include:

- `GET /books` - Retrieve a list of books.
- `POST /books` - Create a new book.
- `GET /books/{id}` - Retrieve a specific book by its ID.
- `PUT /books/{id}` - Update a specific book by its ID.
- `DELETE /books/{id}` - Delete a specific book by its ID.

### 6. HATEOAS (Hypermedia as the Engine of Application State)

RESTful APIs should provide hypermedia links to guide clients through the available actions. This means that responses from the server include links to related resources, allowing clients to discover new actions dynamically.

### 7. Status Codes

HTTP status codes indicate the result of an API request. The structure for the codes is:

- `1xx`: Informative
- `2xx`: Success
- `3xx`: Redirect
- `4xx`: Client Errors
- `5xx`: Internal Server Error

Some Common status codes include:

- `200 OK`: Request succeeded.
- `201 Created`: Resource created successfully.
- `204 No Content`: Request succeeded with no content in the response.
- `400 Bad Request`: Client-side error.
- `401 Unauthorized`: Authentication required.
- `403 Forbidden`: Access denied.
- `404 Not Found`: Resource not found.
- `500 Internal Server Error`: Server-side error.

### 8. API endpoint example

* HTTP Method: `GET`
* Server: `localhost:3333`
* Resource: `users`


GET: https://localhost:3333/users/2
* Route Param: `2`

GET: https://localhost:3333/users?page=2
* Query Param: `page=2`


