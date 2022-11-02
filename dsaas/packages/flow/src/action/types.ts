import { Application } from '../application';
import { Dict, Value } from '../types';

export type ActionValues = {
  [id: string]: any;
};

export interface ActionInputDefinition {
  id: string;
  type: string;
  required?: boolean;
  label?: string;
}

export interface ActionOutputDefinition {
  id: string;
  type: string;
  label?: string;
}

export interface ActionDefinition {
  id: string;
  inputs?: ActionInputDefinition[];
  validate?: {};
  outputs?: ActionOutputDefinition[];
  run(inputs: ActionValues, application: Application): any | Promise<any>;
  label?: string;
  description?: string;
}

export enum ACTION_STATUS {
  not_run = 'not_run',
  running = 'running',
  done = 'done'
}

export interface ActionInstance {
  id: string;
  actionType: string;
  status?: ACTION_STATUS;
  options?: Dict<Value>;
  inputs?: Dict<any>;
  outputs?: Dict<any>;
  comment?: string;
}
