import { ActionDefinition, TypeDefinition, FlowDefinition, Configuration } from './types';
export declare class Application {
    actionDefinitions: Map<string, ActionDefinition>;
    TypeDefinitions: Map<string, TypeDefinition>;
    flowDefinitions: Map<string, FlowDefinition>;
    constructor();
    loadDefault(): void;
    load(config: Configuration): void;
    runFlow(id: string, input?: {}): Promise<unknown>;
    registerTypeDefinition(definition: TypeDefinition): void;
    registerAction(definition: ActionDefinition): void;
    registerActions(definitions: ActionDefinition[]): void;
    registerFlowDefinition(definition: FlowDefinition): void;
    findActionDefinition(id: string): ActionDefinition;
    findFlowDefinition(id: string): FlowDefinition;
}
