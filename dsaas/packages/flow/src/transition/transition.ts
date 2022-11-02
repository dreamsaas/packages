import { Action } from '../action';
import { Flow } from '../flow/flow';
import { Application } from '../application/application';
import { TransitionDefinition } from './types';

export class Transition {
  constructor(
    public transitionDefinition: TransitionDefinition,
    public fromAction: Action,
    public toAction: Action,
    public flow: Flow,
    public application: Application
  ) {}

  public getInputs() {
    return {
      ...(this.transitionDefinition.toInput &&
        this.transitionDefinition.fromOutput && {
          [this.transitionDefinition.toInput]: this.fromAction.outputs[
            this.transitionDefinition.fromOutput
          ]
        })
    };
  }
}
