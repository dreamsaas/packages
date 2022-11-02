import { Action } from '../action';

import { Application } from '../application/application';
import { EventEmitter } from 'events';
import { Transition } from '../transition/transition';
import { FlowActionDefinition, FlowDefinition } from './types';
import { ACTION_STATUS } from '../action/types';
import { TransitionDefinition } from '../transition/types';

export class Flow {
  actions = new Map<string, Action>();
  transitions: Transition[] = [];
  events = new EventEmitter();

  constructor(public definition: FlowDefinition, public application: Application) {
    definition.actions.forEach(this.registerAction.bind(this));
    definition.transitions.forEach(this.registerTransition.bind(this));
  }

  run(input: any) {
    this.runAction('flowStart', input);

    return new Promise(resolve => {
      this.events.on('flowEnd', value => {
        resolve(value);
      });
    });
  }

  async runAction(id: string, values: any = {}) {
    const action = this.findActionInstance(id);

    const transitionsIn = action.transitionsTo;
    const fromInstances = transitionsIn.map(transition => transition.fromAction);

    const countOfRunningFromInstances = fromInstances
      ? this.countInstanceStatus(ACTION_STATUS.running, fromInstances)
      : 0;

    // Stop if upstream instances are still running
    if (countOfRunningFromInstances > 0) return;

    const countOfNotRunFromInstances = this.countInstanceStatus(
      ACTION_STATUS.not_run,
      fromInstances
    );

    // run upstream actions. These will recall this downstream
    if (countOfNotRunFromInstances > 0) {
      fromInstances.forEach(instance => {
        if (instance.status === ACTION_STATUS.not_run) {
          this.runAction(instance.id);
        }
      });
      return;
    }

    //Assume here all are done, but check just in case for now.
    if (!fromInstances.every(instance => instance.status === ACTION_STATUS.done)) {
      throw new Error('shouldnt get here because all instances should be done');
    }

    // get input action outputs
    const inputValuesFromActions = transitionsIn.reduce(
      (input, transition) => ({ ...input, ...transition.getInputs() }),
      {}
    );

    const output = await action.run({ ...values, ...inputValuesFromActions });

    const areAllActionsRun = ![...this.actions.values()].reduce(
      (count, action) => (action.status !== ACTION_STATUS.done ? count + 1 : count),
      0
    );

    // Trigger flow end if it's a flow end action
    if (action.actionType === 'flowEnd' || areAllActionsRun) {
      this.events.emit('flowEnd', output);
    }

    // Run downflow actions
    const transitionsOut = action.transitionsFrom;
    transitionsOut.forEach(transition => this.runAction(transition.toAction.id));
  }

  registerAction(definition: FlowActionDefinition) {
    const action = new Action(definition, this, this.application);
    this.actions.set(definition.id, action);
  }

  registerTransition(definition: TransitionDefinition) {
    const fromAction = this.findActionInstance(definition.fromAction);
    const toAction = this.findActionInstance(definition.toAction);

    const transition = new Transition(definition, fromAction, toAction, this, this.application);

    fromAction.transitionsFrom.push(transition);
    toAction.transitionsTo.push(transition);

    this.transitions.push(transition);
  }

  private findActionInstance(id: string) {
    const definition = this.actions.get(id);

    if (!definition) throw new Error(`Action Definition ${id} not found.`);

    return definition;
  }

  private countInstanceStatus(status: ACTION_STATUS, instances: Action[]) {
    return instances.reduce((count, instance) => {
      return instance.status === status ? count + 1 : count;
    }, 0);
  }
}
