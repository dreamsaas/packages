import { EventDefinition } from 'types';
import { FlowDefinition } from '../flow/types';
import { double } from '../__fixtures__/action-definitions';
import { Application } from './application';
// import Ajv from 'ajv';
// TODO self contain transitions and nodes under unique flows.
// organize flows under an application config. Start moving to pipes if possible.

// const LogFlow: FlowDefinition = {
//   id: 'log',
//   onEvent: 'log',
//   actions: [
//     { id: 'consoleLog', actionType: 'consoleLog' },
//     { id: 'flowStart', actionType: 'flowStart' }
//   ],
//   transitions: [
//     {
//       fromAction: 'flowStart',
//       toAction: 'consoleLog',
//       fromOutput: 'input',
//       toInput: 'input'
//     }
//   ]
// };

const exampleFlow: FlowDefinition = {
  id: 'flow1',
  onEvent: 'run',
  actions: [
    { id: 'double', actionType: 'double' },
    { id: 'flowStart', actionType: 'flowStart' },
    { id: 'flowEnd', actionType: 'flowEnd' }
  ],
  transitions: [
    {
      fromAction: 'flowStart',
      toAction: 'double',
      fromOutput: 'input',
      toInput: 'number'
    },
    {
      fromAction: 'double',
      toAction: 'flowEnd',
      fromOutput: 'number',
      toInput: 'output'
    }
  ]
};

const runEvent: EventDefinition = { id: 'run' };

describe('application', () => {
  it.only('should execute flow', async () => {
    const app = new Application();

    app.registerActions([double]);

    app.applyConfig({
      eventDefinitions: [runEvent],
      flowDefinitions: [exampleFlow]
    });

    const result = await app.runFlow(exampleFlow.id, { input: 2 });
    expect(result).toMatchObject({ output: 4 });
  });

  it('should execute flow from event', async () => {
    const app = new Application();

    app.registerActions([double]);

    app.applyConfig({
      settings: {
        validate: false
      },
      eventDefinitions: [runEvent],
      flowDefinitions: [exampleFlow]
    });

    const result = await app.runEvent(runEvent.id, { input: 2 });

    for (let index = 0; index < 10000; index++) {
      await app.runEvent(runEvent.id, { input: 2 });
    }

    expect(result).toMatchObject([{ output: 4 }]);
  });
  // it('should', () => {
  //   const ajv = new Ajv();
  //   var valid = ajv.validate(
  //     {
  //       type: 'object',
  //       properties: { value: { type: 'number' } },
  //       required: ['value']
  //     },
  //     {
  //       value: '0'
  //     }
  //   );
  //   if (valid) console.log('valid');
  //   if (!valid) console.log(ajv.errors);
  // });
});
