import { ActionDef } from '../action';
import { FlowDef } from '../flow';
import { EventDef } from '../event';

export const initEvent: EventDef = {
  id: 'init'
};

export const actionDefs: ActionDef[] = [
  {
    id: 'start',
    run({ input }: any) {
      return { output: input };
    }
  },
  {
    id: 'double',
    run({ number }: any) {
      return { number: number * 2 };
    }
  },
  {
    id: 'end',
    run({ input }: any) {
      return { output: input };
    }
  }
];

export const doubleFlow: FlowDef = {
  id: 'init',
  flowActionDefs: [
    {
      id: 'start',
      type: 'start'
    },
    {
      id: 'double',
      type: 'double'
    },
    { id: 'end', type: 'end' }
  ],
  onEvent: ['start'],
  transitions: [
    {
      from: ['start', 'output'],
      to: ['double', 'number']
    },
    {
      from: ['double', 'number'],
      to: ['end', 'input']
    }
  ]
};
