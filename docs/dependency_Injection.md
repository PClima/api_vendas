## Dependency Injection
Now that we have the first feature available in the API, let's refactor this process of creating products using the tsyringe library.

`tsyringe` is a dependency injection library designed to be easy to use and integrate into TypeScript projects, providing an effective way to manage dependencies and facilitate [...]

Key features:

**`Dependency Injection:`** Allows injecting dependencies into classes without the need to manually instantiate the dependencies.
**`Decorators:`** Uses decorators such as @injectable, @inject, and @singleton to mark classes and manage dependencies.
**`Dependency Container:`** Provides a container that manages the instances of dependencies.
**`Automatic Resolution:`** Automatically resolves dependencies without the need for explicit configuration.
**`Install the library:`**

```shell
npm install tsyringe
```

There are several ways to register a class in the container.

### registerSingleton
`Usage`: Registers a single instance of a class to be used throughout the application.

`Behavior`: The first time the dependency is resolved, a new instance is created and then this same instance is reused for all subsequent resolutions.

`Ideal For`: Services or components that should have a single instance shared throughout the application, such as configuration services or state managers.

### registerInstance
`Usage`: Registers a specific instance of a class or object to be used as a dependency.

`Behavior`: The registered instance is used whenever the dependency is resolved.

`Ideal For`: When you already have an existing instance of a service or object and want to register it directly in the container.

### register
`Usage`: Allows registering a dependency with a custom configuration.

`Behavior`: Can be configured to register an instance, a factory of instances, or a class, and can specify whether the instance should be singleton or not. The default behavior is [...]

`Ideal For`: Situations where you need more control over how the dependency is resolved.

### The container.resolve() method
The container.resolve() method is essential for using dependency injection with tsyringe, allowing you to obtain instances of registered classes from the container easily [...]

### Decorator @injectable()
`Purpose`: Marks a class as available for dependency injection.

`Usage`: Should be used on any class you want to be injectable by the dependency injection container.

### @inject()
`Purpose`: Specifies that a dependency should be injected into a constructor parameter or property.

`Usage`: Should be used when you want to inject a specific dependency into a constructor parameter or property of a class.
