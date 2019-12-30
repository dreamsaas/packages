# Databases

Databases can be added to DreamSaaS using the Database plugin. This plugin
allows developers to create different database types that then allow for
creating new database connections on those types. Models are definitions of
entities/tables/collections that can be consumed by the database type and used
to interact with the databases. Models are assigned to a specific database
connection and pull compatible options from the connection's database type.

## Installing the Databases plugin

Installing the database plugin will make the necessary services available to the
context.

```typescript
const context = await createServer()(useDatabases())
```

## Creating a Database Type

The `Databases` plugin does not include any databases types by default. These
need to be applied to the context through plugins or directly.

```typescript
const context = await createServer()(
	useDatabases(),
	/*
	 * Create a new database type and pass
	 * configuration operators * to subcontext.
	 */
	createDatabaseType({ id: 'sequelize' })()
	//... Configuration operators.
)
```

### Configure Database Connection methods

A database type must configure how a connection will connect and disconnect.
This is dont by using the `onDatabaseConnect` and `onDatabaseDisconnect`
operators with the `createDatabaseType` subcontext.

```typescript
const context = await createServer()(
	useDatabases(),
	createDatabaseType({ id: 'sequelize' })(
		// Define how database connects
		onDatabaseConnect(async ({ connection, server }) => {
			// Create a new database connection instance
			// Optionally get connection options from the
			// connection object.
			const sequelize = new Sequelize('sqlite::memory:')

			// Return the new connection context with the instance.
			// Optionally modify other connection fields.
			return {
				connectionObject: sequelize
			}
		}),

		// Define how database disconnects
		onDatabaseDisconnect(async ({ connection, server }) => {
			await connection.connectionObject.close()
		})
	)
)
```

### Add Model Handlers

A database type must know how to handle the universal model system. This
includes mapping fields and handling migrations.

#### Custom field types

There are many databases in the wild, so, outside of the core field types, you
can optionally include custom field types for use with this database type.

```typescript
const context = await createServer()(
	useDatabases(),
	createDatabaseType({ id: 'sequelize' })(
        // ... connection options
        createModelFieldMapper()(
            // Include preexisting base field types
            includeModelFieldType('text')
            includeModelFieldType('number')
            // Create a custom type for this model
            // Optionally include other options on the object.
            createModelFieldType({id:'json')(
                setModelFieldTo(JSON.stringify),
                setModelFieldFrom(JSON.stringify),
            )
        )
	)
)
```

#### Create a query mapper

Create connection queries

```typescript
const context = await createServer()(
	useDatabases(),
	createDatabaseType({ id: 'sequelize' })(
		// ... connection options
		// ... model mapper
		createQueryMapper()(
			includeQueryType('findOne')(
				async ({ server, database, connection, options }) => {
					return await connection.connectionObject.findOne(options)
				}
			),
			createQueryType({ id: 'createMany' })(
				async ({ server, database, connection, options }) => {
					return await connection.connectionObject.createMany(options.items)
				}
			)
		)
	)
)
```

Create Model Queries

```typescript
const context = await createServer()(
	useDatabases(),
	createDatabaseType({ id: 'sequelize' })(
		// ... connection options
		// ... model mapper
		createQueryMapper()(
			includeQueryType('findOne')(
				async ({ server, database, connection, model, options }) => {
					return await model.findOne(options)
				}
			),
			createQueryType({ id: 'find' })(
				async ({ server, database, connection, model, options }) => {
					return await model.find(options)
				}
			)
		)
	)
)
```

#### Create Model Constructor

```typescript
const context = await createServer()(
	useDatabases(),
	createDatabaseType({ id: 'sequelize' })(
        // ... connection options
        defineModelOptions({/* ... */}),
        defineModelField
		constructModel((database, server, connection, model) => {
			const model = new Service.model({
				table: model.name,
				fields: model.fields.map(field => {
					return {
						column: field.type,
						default: field.default
					}
				})
			})
			return {
				// modified model object
			}
		}),
		defineModelQuery(
			'find',
			//TODO change to pipe and add options definitions.
			({ options, model, connection, database, server }) => {
				return model.find(options)
			}
		),
		defineConnectionQuery(
			'find',
			({ options, connection, database, server }) => {
				return connection.find(options)
			}
		)
	)
)
```
