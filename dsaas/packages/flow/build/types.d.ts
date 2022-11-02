/**
 * Dictionary where keys are any ID and values are of the specified type.
 */
export declare type Dict<T> = {
    [id: string]: T;
};
export declare type ActionValues = {
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
    inputs?: Dict<ActionInputDefinition>;
    outputs?: Dict<ActionOutputDefinition>;
    run(inputs: ActionValues, options?: ActionValues): any | Promise<any>;
    label?: string;
    description?: string;
}
export declare enum ACTION_STATUS {
    not_run = "not_run",
    running = "running",
    done = "done"
}
export interface ActionInstance {
    id: string;
    actionType: string;
    status?: ACTION_STATUS;
    options?: Dict<Value>;
    inputs?: Dict<Value>;
    outputs?: Dict<Value>;
    comment?: string;
}
export interface Transition {
    from: string;
    to: string;
    map: {
        [output: string]: string;
    };
}
export interface TypeDefinition {
    id: string;
    label: string;
    validation: any;
}
export interface Value {
    type: string;
    value: any;
}
export interface Configuration {
    flowDefinitions: FlowDefinition[];
}
export interface FlowActionDefinition {
    id: string;
    actionType: string;
    options?: Dict<Value>;
    isFlowEnd?: boolean;
}
export interface FlowDefinition {
    id: string;
    actions: FlowActionDefinition[];
    transitions: Transition[];
}
