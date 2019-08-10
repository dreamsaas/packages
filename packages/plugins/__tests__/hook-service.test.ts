import { HookService, Action } from '../src/hook-service'
import * as path from 'path'
describe('HookService', () => {
  it('should instantiate', () => {
    const hookService = new HookService()
    expect(hookService).toBeDefined()
  })

  it('should return hooks', () => {
    const hookService = new HookService()
    const hooks = hookService.getHooks()
    expect(Array.isArray(hooks)).toBe(true)
  })

  it('should add a hook', () => {
    const hookService = new HookService()
    const hook = hookService.addHook({ name: 'hookname' })
    const [returnedHook] = hookService.getHooks()
    expect(returnedHook).toBe(hook)
  })

  it('should return hook by name', () => {
    const hookService = new HookService()
    const hook = hookService.addHook({ name: 'hookname' })
    const returnedHook = hookService.getHook('hookname')
    expect(returnedHook).toBe(hook)
  })

  it('should return actions', () => {
    const hookService = new HookService()
    const actions = hookService.getActions()
    expect(Array.isArray(actions)).toBe(true)
  })

  it('should add an action', () => {
    const hookService = new HookService()
    const action = hookService.addAction({ name: 'actionName' })
    const [returnedAction] = hookService.getActions()
    expect(returnedAction).toBe(action)
  })

  it('should return hook by name', () => {
    const hookService = new HookService()
    const action = hookService.addAction({ name: 'actionName' })
    const returnedAction = hookService.getAction('actionName')
    expect(returnedAction).toBe(action)
  })

  it('should add action to hook', () => {
    const hookService = new HookService()
    const hook = hookService.addHook({ name: 'hookname' })
    const action = hookService.addAction({ name: 'actionName' })

    hookService.addHookAction(hook.name, action.name)

    expect(hook.actions[0]).toBe(action.name)
  })

  it('should import action funcs', () => {
    const hookService = new HookService()
    const location = path.join(__dirname, './assets/action-example.ts')
    const action = hookService.addAction({
      name: 'double',
      importName: 'doubleAction',
      location
    })

    expect(typeof action.func).toBe('function')
    const runResult = action.func(1)
    expect(runResult).toBe(2)
  })

  it('should run all actions for a hook', async () => {
    const location = path.join(__dirname, './assets/action-example.ts')
    const hookService = new HookService()
    hookService.addHook({ name: 'hookname' })
    hookService.addAction({
      name: 'double',
      importName: 'doubleAction',
      location
    })
    hookService.addAction({
      name: 'triple',
      importName: 'tripleAction',
      location
    })
    hookService.addHookAction('hookname', 'double')
    hookService.addHookAction('hookname', 'triple')

    const value = await hookService.runHook('hookname', 1)
    expect(value).toBe(6)
  })

  it('should run promise actions for a hook', async () => {
    const location = path.join(__dirname, './assets/action-example.ts')
    const hookService = new HookService()
    hookService.addHook({ name: 'hookname' })
    hookService.addAction({
      name: 'numberToStringPromise',
      importName: 'numberToStringPromise',
      location
    })
    hookService.addHookAction('hookname', 'numberToStringPromise')

    const value = await hookService.runHook('hookname', 1)
    expect(value).toBe('1')
  })
})
