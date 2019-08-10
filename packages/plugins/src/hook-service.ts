/**
 *  TODO: consider adding a hook/action type
 * TODO: add context to running actions to accessing other services.
 *
 */
export interface ActionOptions {
  // Action Name
  name: string
  // absolute path of function's holding file
  location?: string
  // in functions file export const [importName]...
  importName?: string
}
export class Action {
  name: string
  location: string
  importName: string
  func?: Function

  constructor({ name, location, importName }: ActionOptions) {
    if (!name) throw new Error('A new action requires name')
    this.name = name
    this.location = location
    this.importName = importName
  }

  // Imports a function from its file and calls by reference in run
  importFunc() {
    if (this.importName && this.location) {
      const actionFile = require(this.location)
      const actionFunction = actionFile[this.importName]
      this.func = actionFunction
    } else {
      this.func = value => value
    }
  }

  async run(value) {
    if (typeof this.func === 'function') {
      return await this.func(value)
    }

    return value
  }
}

export interface HookOptions {
  //Hook name
  name: string
  // Array of action names
  actions?: string[]
}
export class Hook {
  // Hook name
  name: string
  // Array of action names
  actions: string[] = []

  constructor({ name, actions }: HookOptions) {
    if (!name) throw new Error('a new Hook requires a name')
    this.name = name
  }

  addAction(actionName: string | string[]) {
    this.actions = this.actions.concat(actionName)
  }
}

interface HookServiceOptions<Context> {
  context?: Context
}
export class HookService<Context> {
  name: 'HookService'
  hooks: Hook[] = []
  actions: Action[] = []
  context: Context
  constructor({ context }: HookServiceOptions<Context> = {}) {
    this.context = context
  }

  getHooks() {
    return this.hooks
  }

  getHook(name: string) {
    return this.hooks.find(hook => hook.name === name)
  }

  addHook(hook: HookOptions) {
    if (this.getHook(hook.name))
      throw new Error('HookService cannot accept hooks with duplicate names.')

    const newHook = new Hook(hook)
    this.hooks = this.hooks.concat(newHook)

    if (Array.isArray(hook.actions)) {
      this.addHookAction(newHook.name, hook.actions)
    }

    return newHook
  }

  getActions() {
    return this.actions
  }

  getAction(name: string) {
    return this.actions.find(action => action.name === name)
  }

  addAction(action: ActionOptions) {
    if (this.getHook(action.name))
      throw new Error('HookService cannot accept actions with duplicate names.')

    const newAction = new Action(action)
    newAction.importFunc()
    this.actions = this.actions.concat(newAction)

    return newAction
  }

  addHookAction(hookName: string, actionName: string | string[]) {
    const hook = this.hooks.find(hook => hook.name === hookName)
    if (!hook) throw new Error(`Cannot find hook ${hookName}`)

    hook.addAction(actionName)

    return hook
  }

  async runHook(hookName: string, value: any) {
    const hook = this.getHook(hookName)
    if (!hook) throw new Error(`runHook failed: hook ${hookName} not found`)

    const actions = hook.actions.map(actionName => this.getAction(actionName))

    let finalValue = value
    for (const action of actions) {
      if (typeof action.func === 'function')
        finalValue = await action.func(finalValue, this.context)
    }

    return finalValue
  }
}
