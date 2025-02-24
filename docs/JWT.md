
# JWT Overview

## What is JWT?

[JWT](https://jwt.io/) is a secure way to transmit information between two parties, following the standard defined in RFC 7519.

Authentication is stateless, meaning the parties do not store access information, which is maintained in the token itself.

The token is composed of 3 parts:

* `Header` - information about the token itself, such as the type of algorithm used.

* `Payload` - contains the information we want to send between the two parties.

* `Verify Signature` - ensures that a token has not been altered; the result of this signature is a combination of the other three fields, and if something is modified in any of the fields, the signature will also change, rendering the token invalid.

To validate the token, and consequently the information, a secret key or public and private keys can be used. This same key is also used to sign the token when it is created.

[JWT](https://jwt.io/) is widely used as a form of authentication in APIs, but without the necessary knowledge to implement this functionality with best practices, the authentication system may present flaws that compromise the security of the application as a whole.

## JWT Installation

[JWT Installation](https://jwt.io/libraries?language=Node.js).

```bash
npm install jsonwebtoken

npm install -D @types/jsonwebtoken
```

Set the env variables to work with JWT

files `.env`, `.env.test` e `.env.example`:

```bash
JWT_SECRET=my_secret
JWT_EXPIRES_IN=86400    # 1 day in seconds
```
