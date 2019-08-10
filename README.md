# DreamSaaS (experimental)

DreamSaaS is a UI driven web application local development tool.

Many web application developers rewrite the same solutions again, and again.. and again. Most often than not most of these solutions could have been generalized into something reusable. Unforunately, writing highly reusable and generalizable utilties can take as long, and some times far longer, than writing the original implementation directly. The end result can be a few pieces of hard to understand custom general tools in a sea of normal business logic.

This project aims to go to the extreme and try to make an entire web application out of configuration driven approaches. Configuration heavy apps are often difficult to work with, so this project's end result should be UI driven.

Inspiration for this comes from: Vue-cli UI, Hasura Console, and WordPress(DreamSaaS hooks, and UI manageability).

## Goals

- Use a UI to configure JSON representing a web application.
- Use code generators to generate required files by some libraries.
- Construct all needed services and links between them from JSON.
- Use Hooks system for injecting reusable core or custom code into generated application.
- Allow for plugins/extensions for easily configuring common features.
- Allow developers to include multiple sources for filestorage, databases, external data sources, server libraries, and more with an easy common configuration through adapters for each.

- Build and maintain the UI service with DreamSaaS Core.
- Provide the same reusability and extendability with a robust and costomizable front-end CMS for web applications driven by Vue.
