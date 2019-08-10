# Introduction

Actual SaaS is an experimental GUI driven SaaS Generator with the goal of allowing developers to quickly create, customize, and deploy web services.

## Why?
Web application developers waste a lot of time recreating the same solutions to the same problems found in projects around the world. Whether it's a user system, a basic CRUD API for models, or email services, projects share many of the same needs, and developers recreate those solutions over and over again.

Many developers have tried to solve this problem by creating tools for code scaffolding, config based code generation, or attempting to create reusable code in a well separated module system. This project attempts to take the solution a step further to create an intuitive system where developers can configure the majority of their application without having to touch code, yet with the ability to write custom functionality when they need it.

## How?
### Configuration
Actual SaaS works on a configuration driven approach to bootstrapping a web application. Using the generated configurations, the bootstrapping system will read all of the settings for routes, models, rules, etc and generate the services on application startup.

### Developer UI
Working with complex configuration files is a poor developer experience. ActualSaaS comes with a user interface for not only editing the configurations, but also performing other developer related tasks such as: generating and running migrations, finding and installing plugins, running tests, viewing running server information, running custom tasks, and more...

### Custom Code
Attempting to be an all-in-one GUI solution for development would likely result in creating a terrible solution that no one would want to use. Instead, Actual Saas only attempts to provide solutions for common application structures and solutions. Custom business logic can either be injected using the Hook System, or made available to the project by writing a resuable plugin. When plugins are created, they can be deployed and made available for reuse by the community.