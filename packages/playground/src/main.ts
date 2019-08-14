import { createServer } from '@dreamsaas/core'
import UIPlugin from '@dreamsaas/ui'
import MyPlugin from './plugins/myplugin'

export const run = async () => {
  const config = require('./config.json')
  const server = await createServer(config)
  server.use(new UIPlugin())
  server.use(new MyPlugin())

  // Programmatically adding a hook
  server.hooks.addHook({ id: 'myhook' })
  await server.setup()
  await server.start()

  return server
}
