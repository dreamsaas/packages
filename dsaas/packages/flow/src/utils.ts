import { performance } from 'perf_hooks';

export const perfCheck = (perfName: string, count: number, func: Function) => {
  const t0 = performance.now();
  for (let index = 0; index < count; index++) {
    func();
  }
  const t1 = performance.now();
  console.log(`${perfName} took ${t1 - t0} milliseconds.`);
  return t1 - t0;
};

export const perfCheckAsync = async (perfName: string, count: number, func: Function) => {
  const t0 = performance.now();
  for (let index = 0; index < count; index++) {
    await func();
  }
  const t1 = performance.now();
  console.log(`${perfName} took ${t1 - t0} milliseconds.`);
  return t1 - t0;
};

export const perfCheckAsyncParallel = async (perfName: string, count: number, func: Function) => {
  const t0 = performance.now();
  const list = [];
  for (let index = 0; index < count; index++) {
    list.push(func);
  }

  await Promise.all(list);

  const t1 = performance.now();
  console.log(`${perfName} took ${t1 - t0} milliseconds.`);
  return t1 - t0;
};
