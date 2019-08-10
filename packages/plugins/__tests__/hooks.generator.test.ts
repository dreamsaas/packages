import { HookService } from '../src/hook-service'
import { hooksGenerator, HooksGeneratorConfig } from '../src/hooks.generator'
import * as path from 'path'

describe('hooksGenerator', () => {
  it('should create hooks', () => {
    const hookService = new HookService()
    const config: HooksGeneratorConfig = {
      hooks: [
        {
          name: 'hookName'
        }
      ]
    }

    hooksGenerator(config, hookService)

    const [returnedHook] = hookService.getHooks()
    expect(returnedHook.name).toBe(config.hooks[0].name)
  })

  it('should create actions', () => {
    const hookService = new HookService()
    const config: HooksGeneratorConfig = {
      actions: [
        {
          name: 'actionname',
          importName: 'doubleAction',
          location: path.join(__dirname, './assets/action-example.ts')
        }
      ]
    }

    hooksGenerator(config, hookService)

    const [returnedAction] = hookService.getActions()
    expect(returnedAction.name).toBe(config.actions[0].name)
  })

  it('should link hooks to actions', () => {
    const hookService = new HookService()
    const config: HooksGeneratorConfig = {
      hooks: [
        {
          name: 'hookName',
          actions: ['actionname']
        }
      ],
      actions: [
        {
          name: 'actionname',
          importName: 'doubleAction',
          location: path.join(__dirname, './assets/action-example.ts')
        }
      ]
    }

    hooksGenerator(config, hookService)

    const [returnedHook] = hookService.getHooks()
    expect(returnedHook.actions[0]).toBe(config.actions[0].name)
  })

  it('should import action funcs', async () => {
    const hookService = new HookService()
    const config: HooksGeneratorConfig = {
      hooks: [
        {
          name: 'hookName',
          actions: ['doubleValue']
        }
      ],
      actions: [
        {
          name: 'doubleValue',
          importName: 'doubleAction',
          location: path.join(__dirname, './assets/action-example.ts')
        }
      ]
    }

    hooksGenerator(config, hookService)

    const value = await hookService.runHook('hookName', 1)

    expect(value).toBe(2)
  })
})
