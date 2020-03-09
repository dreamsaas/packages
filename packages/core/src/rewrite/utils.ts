import { IApplication } from './application'

export type PipeableFunction = (context: any) => any

/**
 * Create a pipeable function with arguments
 */
export const createOperator = <Props, Context = IApplication>(
	func: (args: Props, context: Context) => any
) => (args: Props): PipeableFunction => (context: any) => func(args, context)
