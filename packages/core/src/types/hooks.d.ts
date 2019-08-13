import { HookService } from '../plugins/hooks/hook-service'

declare module '@dreamsaas/types' {
  export interface HookAction {
    actionId: string
    uniqueId?: string //maybe not needed
    options?: any
  }

  interface Config {
    hooks?: {
      [hookId: string]: {
        actions?: HookAction[]
      }
    }
  }
  export interface Server {
    hooks?: HookService
  }
}
