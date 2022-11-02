/// <reference types="node" />
import { Action } from './action';
import { Transition, FlowDefinition, FlowActionDefinition } from './types';
import { Application } from './application';
import { EventEmitter } from 'events';
export declare class Flow {
    definition: FlowDefinition;
    application: Application;
    actions: Map<string, Action>;
    transitions: Transition[];
    events: EventEmitter;
    constructor(definition: FlowDefinition, application: Application);
    run(input: any): Promise<unknown>;
    runAction(id: string, values?: any): Promise<void>;
    registerAction(definition: FlowActionDefinition): void;
    private findActionInstance;
    private findTransitionsToAction;
    private findTransitionsFromAction;
    private countInstanceStatus;
}
