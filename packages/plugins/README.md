# `plugins`

The plugins module is used to inject extra features and configurations into other services. A plugin may inject exta features into the core services (such as new model or api types), run new setup logic for injecting code into hooks, or adding new predefined schema structures to make it easier to build out services.


## Architecture

Plugins leverage hooks to inject logic and settings, and are given runnable functions that get called at different lifecycle hooks of the application.

flow:
- Developer create plugin
    - Plugin contains
    setup function
    Server startup function
    server running function
    Plugin meta
- 
