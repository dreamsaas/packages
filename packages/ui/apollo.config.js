module.exports = {
  client: {
    service: {
      name: "my-app",
      // URL to the GraphQL API
      url: "http://localhost:3003/graphql"
    },
    // Files processed by the extension
    includes: ["src/**/*.ts", "src/**/*.graphql"]
  }
};
