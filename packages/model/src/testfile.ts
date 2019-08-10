import FastifyPlugin from '@actual/fastify'
import {createServer} from '@actual/core'

const run = async ()=>{
    const server = await createServer({})
    server.use(new FastifyPlugin())
}

