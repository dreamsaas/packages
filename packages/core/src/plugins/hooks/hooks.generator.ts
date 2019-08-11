import { HookService } from './hook-service'
import { HookOptions } from './hook'
import { Action } from '@dreamsaas/core'

export interface HooksGeneratorConfig {
	hooks?: HookOptions[]
	actions?: Action[]
}

export const hooksGenerator = (
	{ hooks = [], actions = [] }: HooksGeneratorConfig,
	hookService: HookService
) => {
	actions.forEach(actionOptions => {
		hookService.addAction(actionOptions)
	})

	hooks.forEach(hookOptions => {
		hookService.addHook(hookOptions)
	})

	return hookService
}
