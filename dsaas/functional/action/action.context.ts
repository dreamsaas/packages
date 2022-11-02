import { addContext, Context, removeContext, updateContext } from '../context';
import { FlowContext } from '../flow';
import { Transition } from '../transition';

export interface FlowActionDef {
  id: string;
  type: string;
}

export interface Action extends FlowActionDef {
  /** Has the action been run. */
  hasRun: boolean;
  /** stores the action inputs */
  inputs: {
    [key: string]: any;
  };
  /** stores the action outputs */
  outputs: {
    [key: string]: any;
  };
  /** All transitions that send outputs to this action */
  froms: Transition[];
  /** All transitions that this action sends outputs to */
  tos: Transition[];
}

export interface ActionDef {
  id: string;
  run(inputs: { [key: string]: any }): {};
}

export type ActionContext = Context<'action', Action> & FlowContext;

export const DEFAULT_ACTION_CONTEXT: Partial<Action> = {
  inputs: {},
  outputs: {},
  froms: [],
  tos: []
};

export const addActionContext = () => addContext('action', DEFAULT_ACTION_CONTEXT);

export const updateActionContext = (context: Partial<Action>) => updateContext('action', context);

export const removeActionContext = () => removeContext('action');
