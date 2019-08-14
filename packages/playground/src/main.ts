import { createServer } from '@dreamsaas/core'
import {} from '@dreamsaas/types'

import UIPlugin from '@dreamsaas/ui'
import {} from '@dreamsaas/types'

export const run = async () => {
  const config = require('./config.json')
  const server = await createServer(config)
  server.use(new UIPlugin())

  // Programmatically adding a hook
  server.hooks.addHook({ id: 'myhook' })
  await server.setup()
  await server.start()

  return server
}
