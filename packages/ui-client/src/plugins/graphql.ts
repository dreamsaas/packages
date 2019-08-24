import Vue from 'vue'
import VueApollo, { ApolloProvider } from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
Vue.use(VueApollo)

let apolloProvider:ApolloProvider

export const getApolloProvider = ()=>{
  if(apolloProvider) return {apolloProvider}
// HTTP connection to the API
const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: 'http://localhost:3003/graphql',
  })
  
  const wsLink = new WebSocketLink({
    uri: 'ws://localhost:3003/graphql',
    options: {
      reconnect: true,
    },
  })
  const link = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
    },
    wsLink,
    httpLink
  )
  // Cache implementation
  const cache = new InMemoryCache()
  
  // Create the apollo client
  const apolloClient = new ApolloClient({
    link,
    cache,
    connectToDevTools: true,
  })
  
  
  
  apolloProvider = new VueApollo({
      defaultClient: apolloClient,
    })

  return {apolloProvider}
}

