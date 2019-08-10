import { Server, Action as IAction } from "dreamsaas";

/**
 *  TODO: consider adding a hook/action type
 *
 */
  
  export class Action implements IAction {
    id: string
    filePath: string
    exportName: string
    
    func?( value:any,server:Server, options:{})
    handler?( value:any,server:Server, options:{})
  
    constructor(options: IAction) {
      if (!options.id) throw new Error('A new action requires id')
      if(!options.id && (!options.exportName && !options.filePath)) throw new Error('A new action requires either a handeler, or filepath and exportName')

      for(let key in options){
        this[key] = options[key]
      }
      if(typeof this.handler === 'function') this.func = this.handler
    }
  
    // Imports a function from its file and calls by reference in run
    importFunc() {
      // Skip if func already declared. This usually happens when a handler was passed.
      if(typeof this.func === 'function') return 
      
      if (this.exportName && this.filePath) {
        const actionFile = require(this.filePath)
        const actionFunction = actionFile[this.exportName]
        this.func = actionFunction
      } else {
        // Default to empty action
        this.func = (value:any, server:Server, options:{}) => value
      }
    }
  
    async run(value:any, server:Server, options:{}) {
      if (typeof this.func === 'function') {
        const result =  await this.func(value,server, options)
        if(typeof result === 'undefined') return value
        return result
      }
  
      return value
    }
  }