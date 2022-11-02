import { TransitionDefinition } from '../transition/types';
import { Dict, Value } from '../types';

export interface FlowActionDefinition {
  id: string;
  actionType: string;
  options?: Dict<Value>;
  isFlowEnd?: boolean;
  /**
   * Editor UI properties.
   * This can be deleted for production configs.
   */
  editor?: {
    /** Line that connects outputs to inputs */
    position: {
      x: number;
      y: number;
    };
  };
}

export interface FlowDefinition {
  id: string;
  onEvent?: string[] | string;
  actions: FlowActionDefinition[];
  transitions: TransitionDefinition[];
}
