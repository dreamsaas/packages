# DreamSaas architecture

The goal is to build up the application using small functional pieces of code. To make this process easier, a few utilities, defined below, were created to enable a useful developer experience. (pipe, invertedPipe, clone, merge). While a developer doesn't have to use functional concepts in their code, they will need to understand how there used here in order to create solutions that correctly function within the application.

## Core

Core of the application architecture.
Based on functional principals.

Server starts as an empty object, and then in manipulated through a pipeline that changes the server object in different ways suiting the application needs.

`createServer` allows a developer to initialize a new server with core operators and plugins applied and returns a pipe function for application specific operators and plugins.

### Operators

Operators are functions that will receive an object, typically the server object, and return either a new value or nothing. These functions can be used within pipes to perform muations on the server object.

```typescript
const operator = value => value + 1

const value = await pipe(operator, operator)(1)
// returns 3
```

### Pipes

Pipes are functions that receive a value and pass it through the provided operators, returning the final result. Pipes can await async functions as operators, so a pipe will always return a Promise. Because of this, pipes can also contain other pipes as operators to split up logic.

If an operator returns `undefined` or `Promise<undefined>`, then the pipe will not manipulate the value in the chain. This is good for one off or non awaited asynchronous actions.

```typescript
const operator = value => value + 1
// waits 1 second before resolving
const asyncOperator = () => new Promise(r => setTimeout(r, 1000))
// a pipe to be used inside another pipe
const add2 = pipe(operator, operator, asyncOperator)
// This pipe will wait for the async operator
const value = await pipe(add2)(1)

// returns 3
```

#### Inverted Pipes

The pattern of `pipe(...operators)(value)` is useful for using a pipe as an operator, as operators return a function that accepts the value. However, sometimes a developer may want to prepare a new value within a function, and return the operators afterward to allow for extending the chain. This can be done with `invertedPipe`.

```typescript
const usefulAbstraction = thing => invertedPipe(thing)

await usefulAbstraction({ my: 'value' })(...operatorsList)
```

An inverted pipe cannot be used as an operator directly, instead it would need to be returned by a function that takes the value.

```typescript
const usefulAbstraction = thing => invertedPipe(thing)

await pipe(value => usefulAbstraction(value)(...operatorsList))({ my: 'value' })
```

## Utilities

### Cloning, merging, and references

## Core Features

Config - stores configuration for application. Is manipulated by the devtools.

Plugins - Enables operators to return lifecyclehooks
Services - Shared services throughout the application
Actions - id references to functions that can be configured and run.
Hooks - Points in code where actions can be queued before code continuation.
Setup - After all plugins have been loaded, allows them to run setup functions that rely on other plugins being instantiated
Logger - enables console or other types of logging
Run - enables plugins to start services and do other things when the application loads
Settings - savable runtime settings for the application. Can be applied to other features to allow for one start time configurations. These are read by the devtools and allow for saving configurations/settings.
