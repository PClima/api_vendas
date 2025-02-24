## Class transformer

In this module, we will be installing and configuring the use of the `Class Transformer` library in our API.

[Class Transformer](https://github.com/typestack/class-transformer) is a JavaScript library that facilitates the conversion between TypeScript/JavaScript classes and plain objects. It is often used in conjunction with frameworks like NestJs to simplify data serialization and deserialization.

Class Transformer will allow, among other things, modifying how information from our Entities is returned, including omitting attributes we do not want to include in the responses.

Main features and benefits:

- `Serialization and deserialization`: Facilitates the transformation of class objects into formats like JSON and vice versa. This is especially useful when dealing with REST APIs, where data is usually transmitted in JSON.
- `Property mapping`: Allows mapping class properties to different names or formats in plain objects using decorators like @Expose, @Type, and @Transform.
- `Validation`: Can be integrated with validation libraries like class-validator to ensure data integrity during the transformation.
- `Code simplification`: Reduces the amount of boilerplate code needed for manual object conversion, making the code cleaner and more readable.

Example usage:

```ts
import { plainToClass, classToPlain } from 'class-transformer';

class User {
  id: number;
  firstName: string;
  lastName: string;
}

const userPlainObject = { id: 1, firstName: 'John', lastName: 'Doe' };
const userClassObject = plainToClass(User, userPlainObject); // Converts to class object
const plainObjectAgain = classToPlain(userClassObject); // Converts back to plain object
