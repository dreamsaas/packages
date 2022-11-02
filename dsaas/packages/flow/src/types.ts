import { FlowDefinition } from './flow/types';

/**
 * Dictionary where keys are any ID and values are of the specified type.
 */
export type Dict<T> = {
  [id: string]: T;
};

export interface TypeDefinition {
  id: string;
  label: string;
  validation: any;
}

export interface Value {
  [key: string]: any;
}

export interface EventDefinition {
  id: string;
  flows?: string[];
}

export interface SettingsDefinition {
  id: string;
}

export interface Settings {
  [id: string]: any;
}

export interface Configuration {
  flowDefinitions: FlowDefinition[];
  eventDefinitions: EventDefinition[];
  settingsDefintiions?: SettingsDefinition[];
  settings?: Settings;
}
