import { HookOptions, HookService, ActionOptions } from './hook-service'

export interface HooksGeneratorConfig {
  hooks?: HookOptions[]
  actions?: ActionOptions[]
}

export const hooksGenerator = (
  { hooks = [], actions = [] }: HooksGeneratorConfig,
  hookService: HookService<any>
) => {
  actions.forEach(actionOptions => {
    hookService.addAction(actionOptions)
  })

  hooks.forEach(hookOptions => {
    hookService.addHook(hookOptions)
  })

  return hookService
}
