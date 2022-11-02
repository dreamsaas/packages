import { TypeDefinition, Configuration, EventDefinition, Settings } from '../types';
import { Flow } from '../flow/flow';
import { flowStart, flowEnd, consoleLog } from '../__fixtures__/action-definitions';
import { ActionDefinition } from '../action/types';
import { FlowDefinition } from '../flow/types';
export class Application {
  actionDefinitions = new Map<string, ActionDefinition>();
  TypeDefinitions = new Map<string, TypeDefinition>();
  flowDefinitions = new Map<string, FlowDefinition>();
  eventDefinitions = new Map<string, EventDefinition>();
  settings: Settings = {};

  constructor() {
    this.defaultSetup();
  }

  /**
   * Loads the default included actions.
   */
  defaultSetup() {
    this.registerAction(flowStart);
    this.registerAction(flowEnd);
    this.registerAction(consoleLog);
  }

  /**
   * Applies provided configuration to application.
   */
  applyConfig(config: Configuration) {
    config.eventDefinitions.forEach(definition => this.registerEventDefinition(definition));
    config.flowDefinitions.forEach(definition => this.registerFlowDefinition(definition));
    this.settings = config.settings ?? {};
  }

  runEvent(id: string, payload: {} = {}) {
    const flows =
      this.eventDefinitions.get(id)?.flows?.map(name => {
        return this.flowDefinitions.get(name);
      }) || [];
    //@ts-ignore
    return Promise.all(flows.map(flow => this.runFlow(flow.id, payload)));
  }

  runFlow(id: string, input = {}) {
    const flowDefinition = this.findFlowDefinition(id);
    const flow = new Flow(flowDefinition, this);

    return flow.run(input);
  }

  registerTypeDefinition(definition: TypeDefinition) {
    this.TypeDefinitions.set(definition.id, definition);
  }

  registerAction(definition: ActionDefinition) {
    this.actionDefinitions.set(definition.id, definition);
  }

  registerActions(definitions: ActionDefinition[]) {
    definitions.forEach(definition => this.registerAction(definition));
  }

  registerFlowDefinition(definition: FlowDefinition) {
    this.flowDefinitions.set(definition.id, definition);
    const events =
      typeof definition.onEvent === 'string' ? [definition.onEvent] : definition.onEvent;

    events?.forEach(event => {
      const inst = this.eventDefinitions.get(event);
      inst?.flows?.push(definition.id);
    });
  }

  registerEventDefinition(definition: EventDefinition) {
    this.eventDefinitions.set(definition.id, { ...definition, flows: [] });
  }

  findActionDefinition(id: string) {
    const definition = this.actionDefinitions.get(id);

    if (!definition) throw new Error(`Action Definition ${id} not found.`);

    return definition;
  }

  findFlowDefinition(id: string) {
    const definition = this.flowDefinitions.get(id);

    if (!definition) throw new Error(`Flow Definition ${id} not found.`);

    return definition;
  }
}
