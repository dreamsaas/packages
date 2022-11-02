import { performance } from 'perf_hooks';

const volume = 2;

const gena = [];
for (let index = 0; index < volume; index++) {
  gena.push({
    id: `a${index}`,
    type: 'double'
  });
}

const gent = [];
for (let index = 0; index < volume; index++) {
  if (index !== 0) {
    gent.push({
      from: [`a${index - 1}`, 'number'],
      to: [`a${index}`, 'input']
    });
  }
}

const actions: Action[] = [
  {
    id: 'start1',
    type: 'start'
  },
  ...gena,
  {
    id: 'end1',
    type: 'end'
  }
];

const flow = {
  actions,
  transitions: [
    {
      from: ['start1', 'output'],
      to: ['a0', 'number']
    },
    ...gent,
    {
      from: [`a${volume - 1}`, 'number'],
      to: ['end1', 'input']
    }
  ]
};

const defs: Def[] = [
  {
    id: 'double',
    run: ({ number }: any) => ({ number: number * 2 })
  },
  {
    id: 'start',
    run: ({ input }: any) => ({ output: input })
  },
  {
    id: 'end',
    run: ({ input }: any) => ({ output: input })
  }
];

export const run = async () => {
  const t0 = performance.now();

  // const list = [];
  const thing = arg => arg;
  // for (let index = 0; index < 10000; index++) {
  await pipe(createFlow(flow), runFlow())({ defs, input: { input: 1 } });
  // await thing();
  // list.push(pipe(createFlow(flow), runFlow()));
  // }
  // await pipe(...list)({ defs, input: { input: 1 } });
  // console.log(list.length);
  const t1 = performance.now();
  console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
};
