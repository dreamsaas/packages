import {
  Plugin,
  PluginSettingsUI,
  SettingConfiguration
} from '@dreamsaas/types'

class MyPlugin implements Plugin {
  id: string = 'my-plugin'

  settingsUI: PluginSettingsUI = {
    components: [
      {
        name: 'MyComponent',
        path: './src/plugins/mycustomcomponent.vue'
      }
    ],
    pages: [
      {
        id: 'custom-component-page',
        path: '/custom-component-page',
        heading: 'PAGE 2',
        description: `this is a description of page 2`,
        component: 'MyComponent'
      },
      {
        id: 'page-1',
        path: '/page-1',
        heading: 'PAGE 1',
        description: `this is a description of page 1`
      },
      {
        id: 'page-1-id',
        path: '/page-1/:id',
        heading: 'PAGE 1 id subpage',
        component: 'MyComponent'
      }
    ],
    sidebar: [
      {
        pageId: 'page-1',
        text: 'Page 1'
      },
      {
        pageId: 'custom-component-page',
        text: 'custom component'
      }
    ]
  }
}

export default MyPlugin
