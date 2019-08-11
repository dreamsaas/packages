import { HookAction } from '@dreamsaas/types'

export interface HookOptions {
	//Hook id
	id: string
	// Array of action ids
	actions?: HookAction[]
}
export class Hook {
	// Hook id
	id: string
	// Array of action ids
	actions: HookAction[] = []

	constructor({ id, actions }: HookOptions) {
		if (!id) throw new Error('a new Hook requires a id')
		this.id = id
		this.actions = actions || []
	}

	addAction(hookAction: HookAction) {
		this.actions = this.actions.concat(hookAction)
	}
}
