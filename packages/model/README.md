# `model`

The Model package is used to generate the data access layer. A model represents 
a single entity and configures itself to use a specific database connection. Models 
can use any data connection provided by the available plugins, and should be queryable 
across sources. For instance, the User model may exist in a postgres database, but the 
Todo Model may be in a preexisting mongo database and the Chat model in Dynamo or Firebase.

The idea is that developers can choose the data sources that make sense for their use case. As a result, all data access must use a limited set of options that can be shared across 
data access layers, though, additional options and features may be included for more 
specialized services.

## Architecture

The flow is:
- Create models schema
- Run code generation for each model where needed (types/entities)
- Create migration files where required
- Start server
- Generate each model
  - Import the generated type files
  - Run constructor for Model DB type
  - Set the database connection for each model
- Make models available to running application

Adding new connection types should be done via a consistent structure. The provided plugin should include methods for:

- generateFiles(modelSchema, outputDirectory)
- modelType - name used by model schema
- model - the custom model class


### ModelSchema

A model's schema contains all of the information required to create and use it.
Field | Type | Example | Description 
--- | --- | --- | ---
name | `string` | `Chat Message` | The human readable name of a model.
typeName | `string` | `ChatMessage` | The Classname/type generated for code consumption
pluralName | `string` | `ChatMessages` | Plural used for database (todo, get this from type instead)
modelType | `string` | `typeorm`,`firebase-rtdb` | sets which data access plugin to use for this model.
fields | `ModelSchemaField[]` | see type | List of fields used by this model
modelCode? (used by generator) | `string` | ... | optional field used by generator to temporarily store the generated model code when relevant (todo: see if needed)


 

