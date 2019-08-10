module.exports = {
    title: 'DreamSaaS',
    description: 'Application generator',
    themeConfig: {
        sidebar: [
            ['/','Introduction'],
            ['/getting-started','Getting Started'],
            {
                title: 'Architecture',
                collapsable: true,
                children: [
                  ['/modules/core','Core'],
                  // ['/modules/hooks','Hooks'],
                  // ['/modules/model','Model'],
                  // ['/modules/fastify','Fastify'],
                  // ['/modules/graphql','GraphQL'],
                  // ['/modules/ui','UI']
                ]
              },
        ]
      }
  }