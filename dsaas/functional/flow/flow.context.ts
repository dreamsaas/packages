import { Action, FlowActionDef } from '../action';
import { AppContext } from '../application';
import { addContext, Context, updateContext } from '../context';
import { Transition } from '../transition';

export interface FlowDef {
  id: string;
  flowActionDefs: FlowActionDef[];
  transitions: Transition[];
  onEvent?: string[] | string;
}

export interface Flow extends FlowDef {
  actions: Action[];
  input: any;
  output: any;
}

export type FlowContext = Context<'flow', Flow> & AppContext;

export const DEFAULT_FLOW_CONTEXT: Partial<Flow> = {
  actions: [],
  input: null,
  output: null
};

export const addFlowContext = () => addContext('flow', DEFAULT_FLOW_CONTEXT);

export const updateFlowContext = (context: Partial<Flow>) => updateContext('flow', context);
