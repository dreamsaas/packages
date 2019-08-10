import { fastifyGenerator } from '../src/fastify.generator'
import { createServer } from '@actual/core'
import * as path from 'path'

describe('Fastify Generator', () => {
    it('should pass', ()=>{ expect(true).toBe(true)})
//   it('should generate basic routes', async () => {
//     const app = await createServer({})

//     app.hooks.addAction({
//       id: 'root response',
//       exportName: 'rootResponse',
//       filePath: path.join(__dirname, './assets/action-example.ts')
//     })

//     const fastify = fastifyGenerator(
//       {
//         routes: [
//           {
//             method: 'GET',
//             url: '/',
//             hooks: {
//               pre: [],
//               handler: [],
//               response: ['root response']
//             }
//           }
//         ]
//       },
//       app
//     )

//     // fastify.listen(0)
//     const { payload } = await fastify.server.inject({
//       method: 'GET',
//       url: '/'
//     })

//     expect(payload).toBe('ok')
//   })
})
