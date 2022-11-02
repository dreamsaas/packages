import { ACTION_STATUS, FlowActionDefinition, Dict, Value } from './types';
import { Flow } from './flow';
import { Application } from './application';
export declare class Action {
    definition: FlowActionDefinition;
    flow: Flow;
    application: Application;
    inputs: {};
    outputs: {};
    options: {};
    status: ACTION_STATUS;
    description: string;
    label: string;
    id: string;
    actionType: string;
    private runFunction;
    constructor(definition: FlowActionDefinition, flow: Flow, application: Application);
    run(passedInputs?: Dict<Value>): Promise<any>;
}
