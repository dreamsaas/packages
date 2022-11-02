import { ActionDefinition } from '../action/types';

export const double: ActionDefinition = {
  id: 'double',
  inputs: [
    {
      id: 'number',
      label: 'Number',
      type: 'number'
      // schema: {
      //   __type__: 'object',
      //   // Cannot validate required anywhere other than runtime...
      //   username: ['string', 'email', 'required']
      // }
    }
  ],
  validate: {
    properties: {
      number: { type: ['number'] }
    },
    required: ['number']
  },
  run({ number }) {
    return {
      number: number * 2
    };
  }
};

export const convertToString: ActionDefinition = {
  id: 'convertToString',
  run({ number }) {
    return {
      text: number.value.toString()
    };
  }
};

export const customValue: ActionDefinition = {
  id: 'customValue',
  run({ value }) {
    return {
      value
    };
  }
};

export const wait: ActionDefinition = {
  id: 'wait',
  async run() {
    await new Promise(r => setTimeout(r, 3000));
    return {};
  }
};

export const flowStart: ActionDefinition = {
  id: 'flowStart',
  run({ input }) {
    return { input: input };
  }
};

export const flowEnd: ActionDefinition = {
  id: 'flowEnd',
  run({ output }) {
    // app.runEvent('log', { input: output });
    return { output };
  }
};

export const runEvent: ActionDefinition = {
  id: 'runEvent',
  run({ eventName, payload }, app) {
    return app.runEvent(eventName, payload);
  }
};

export const consoleLog: ActionDefinition = {
  id: 'consoleLog',
  run() {
    // console.log('logger', input);
    return {};
  }
};
