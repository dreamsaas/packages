# Plugins

The plugin system is the most critical piece making DreamSaaS extendable. Plugins are used at the very core of DreamSaaS to add all of the included features, and new functionality is added to the app by using external plugins.

## Plugin Capabilities

Developers can take advantage of a range of features to use plugins to add new functionaly. These include:

- Modifying the core server.
- Adding services.
- Registering and running hooks
- Registering and attaching actions to hooks
- Adding Admin UI settings
- Extending other plugins
- Adding TypeScript definitions to extend core and external plugin types.

## Using Plugins

Plugins can be added through a variety of methods, depending on a developer's needs.

### Config

A third party plugin can be NPM installed, registered, and configured in the DreamSaaS configuration

### UI

A third party plugin can be discovered, installed, registered, and configured in the DreamSaaS Admin UI. This simply modifies the DreamSaaS configuration file.

### Code

Either third party or custom project plugins can be added via code by using the `server.use()` method.

## Plugin Lifecycle

Plugins are loaded and have lifecycle hooks run at various steps of the application startup process.

- Server Create
  - Configuration registered plugins are loaded and have their `created()` methods called in order of registration.
- After Server create
  - Developer calls `server.use(new YourPlugin())` which registers in-project-code plugins and calls their `created()` methods.
- `server.setup()`.
  - Plugins are reordered based on their dependencies
  - Plugins have their `setup()` method called in order based on their registration order and dependency priority.
- `server.start()` called.
  - Any plugins running actions on the `SERVER_START` hook have their code run in order.

## How to write a plugin
//Include examples and explanation for writing plugins and best practices

A plugin can be defined using ethier an object, or a class. It requires a plugin `id` to represent the plugin name. The plugin definition must be exported as default from the file or NPM package as DreamSaaS doesn't know what the export name would be, and a developer may want to export other things for other uses.

```javascript
import { Plugin } from 'dreamsaas'

// Using an object
export default const MyPlugin: Plugin = {
    id: 'plugin-name'
}

// Using a class
export default class MyPlugin implements Plugin {
    id = 'plugin-name'
}

```
### Lifecycle Hooks

A plugin definition can optionally include one several lifecycle hooks.

**`created`** is called as soon as the plugin is registered. This hook receives a refrence to the server, as well as options that may have been passed in. The created hook may run before other plugins have been registered, so **DO NOT** add any functionality here that depends on another plugin's modificaitons, or functionality that another plugin may depend on. This is, however, a good place to add services and modifications to the core server, as well as register actions on hooks as the actions will not be called until the setup or running phase. Do not run any hooks in this phase. Do not modify the server configuration, and try not to read it in this phase, as other plugins may attempt to make changes.

**`setup`** The setup function is called when the developer runs `server.setup()` and will be called for every plugin in order. All plugins have been registered and their `created` methods have been called at this point. `setup` for plugins will be called in order of their dependencies, so, if a developer's plugin relies on changes made by other one, it will come afterward if that plugin was defined as a dependency. This is a good phase to read and modify the server configruration.

```javascript
import { Plugin, Server } from 'dreamsaas'

// Using a class
export default class MsyPlugin implements Plugin {
    id = 'plugin-name'

    async created(server: Server, options){
        // Run when the server is registered.
    }

    async setup(server: Server, options){
        // Run during server setup
    }
}

```

## Extending the server

The server object can be extended in the `created` lifecycle hook. The server object is an instance of a class, but a developer can directly add new properties and methods to be used by plugins and developers' custom code.

```javascript
import { Plugin, Server } from 'dreamsaas'

// Using a class
export default class MyPlugin implements Plugin {
    id = 'plugin-name'
    hooks = {
        MY_HOOK:'MY_HOOK'
    }
    async created(server: Server, options){
        sever.yourProperty = 'any property value'

        server.yourMethod = (prop)=>{
            //do something
        }
    }

    async setup(server: Server, options){
    }
}

```

### Hooks

Hooks can either be registered using the hooks service, or automatically registered by providing a `hooks` option.
Hooks should be either run directly in the `setup` lifecycle hook, or run within an action registration in the `created` lifecycle hook.

```javascript
import { Plugin, Server } from 'dreamsaas'

// Using a class
export default class MyPlugin implements Plugin {
    id = 'plugin-name'

    //Automatic registration
    hooks = {
        MY_HOOK:'MY_HOOK'
    }
    async created(server: Server, options){
        // Direct registration using the hooks service
        server.hooks.addHook({id:'MY_HOOK'})
    }

    async setup(server: Server, options){
        const somevalue = 'something to pass'
        /**
         * Some hooks are related to server setup, and can be run within the
         * setup lifecycle hook. the value is passed through all the actions
         * and is returned at the end. This can be useful for some types of
         * service setups.
         */
        const result =  server.hooks.runHook('MY_HOOK', someValue)

    }
}

```

## Adding Actions to Hooks
Action can be registered on hooks within the `created` lifecycle hook. This will run the selected action whenever that hook is run. Actions are added to the hook's actions list and run in order.

```javascript
import { Plugin, Server } from 'dreamsaas'

// Using a class
export default class MyPlugin implements Plugin {
    id = 'plugin-name'
    async created(server: Server, options){

        // Registering an action to run on server start.
        server.hooks.addHookAction('SERVER_START',{
            id:'YOUR_ACTION_NAME',
            handler(value){
                // do something
            }
        })
    }
}

```

### Registering Actions
Actions can be added directly as seen above, but they can also be registered independently of a hook.
Independent Action registration allows a developer to create actions that can be selected from in
the Admin UI.

```javascript
import { Plugin, Server } from 'dreamsaas'

// Using a class
export default class MyPlugin implements Plugin {
    id = 'plugin-name'
    async created(server: Server, options){
        server.hooks.addAction({
            id:'action-name',
            handler(value){},
            settings:{}
        })
    }
}

```

### Dependencies

### Settings