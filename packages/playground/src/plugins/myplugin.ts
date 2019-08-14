import { Plugin, PluginSettingsUI } from '@dreamsaas/types'

class MyPlugin implements Plugin {
  id: string = 'my-plugin'
  settingsUI: PluginSettingsUI = {
    pages: [
      {
        id: '/page-1',
        heading: 'PAGE 1',
        description: `this is a description of page 1`
      },
      {
        id: '/page-2',
        heading: 'PAGE 2',
        description: `this is a description of page 2`
      }
    ],
    sidebar: [
      {
        pageName: '/page-1',
        text: 'Page 1'
      },
      {
        pageName: '/page-2',
        text: 'Page 2'
      }
    ]
  }
}

export default MyPlugin
