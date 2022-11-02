import { Dict, Value } from '../types';
import { Flow } from '../flow/flow';
import { Application } from '../application/application';
import { Transition } from 'transition/transition';
import AJV from 'ajv';
import { ActionDefinition, ACTION_STATUS } from './types';
import { FlowActionDefinition } from '../flow/types';

const ajv = new AJV();

export class Action {
  public inputs = {};
  public outputs = {};
  public options = {};
  public status: ACTION_STATUS = ACTION_STATUS.not_run;
  public description: string = '';
  public label: string = '';
  public id: string = '';
  public actionType: string = '';
  private runFunction: Function = () => {};
  public transitionsTo: Transition[] = [];
  public transitionsFrom: Transition[] = [];
  public errors: any;

  constructor(
    public flowActionDefinition: FlowActionDefinition,
    public actionDefinition: ActionDefinition,
    public application: Application
  ) {
    const {
      description = '',
      inputs = {},
      label = '',
      outputs = {},
      id,
      run
    } = this.actionDefinition;

    this.description = description;
    this.inputs = inputs;
    this.label = label;
    this.outputs = outputs;
    this.id = flowActionDefinition.id;
    this.actionType = id;

    this.runFunction = run;
  }

  async run(passedInputs: Dict<any> = {}) {
    if (this.application.settings.validate && this.actionDefinition.validate) {
      const validate = ajv.compile({
        $async: true,
        ...this.actionDefinition.validate
      });
      try {
        await validate(passedInputs);
      } catch (e) {
        this.errors = e.errors;
        throw new Error('validation error');
      }
    }

    this.status = ACTION_STATUS.running;

    this.outputs = await this.runFunction(passedInputs, this.application);

    this.status = ACTION_STATUS.done;

    return this.outputs;
  }
}
