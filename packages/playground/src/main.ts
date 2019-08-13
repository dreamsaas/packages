import { createServer } from '@dreamsaas/core'
import {} from '@dreamsaas/types'

import UIPlugin from '@dreamsaas/ui'

export const run = async () => {
  // const config = require('../config.json')
  const server = await createServer({ logLevel: 'debug' })
  server.use(new UIPlugin())

  // Programmatically adding a hook
  server.hooks.addHook({ id: 'myhook' })
  await server.setup()
  await server.start()

  return server
}
