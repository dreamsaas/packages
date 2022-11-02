import { performance } from 'perf_hooks';
import { AppContext } from './application';

export const asyncPipe = (...funcs: Function[]) => async (context: any) => {
  let output: any = context;
  for (const func of funcs) {
    output = (await func(output)) || output;
  }

  return output;
};

/**
 * Passes the context through each of the provided functions.
 *
 * If the output of a function is null/undefined then it will use the previous
 * context.
 */
export const pipe = (...funcs: Function[]) => (context: any) => {
  let output: any = context;
  for (const func of funcs) {
    output = func(output) || output;
  }

  return output;
};

interface WithId {
  id: string;
}
/**
 * Finds an object in a list with a matching Id
 */
export const findById = <T extends WithId>(id: string, list: T[]) =>
  list.find(action => action.id === id);

export const debug = (callback?: ((context: AppContext) => void) | string) => (
  context: AppContext
) => {
  if (typeof callback === 'string') {
    const nesting = callback.split('.');

    const value = nesting.reduce((prev, curr, index, arr) => {
      const val = prev[curr];
      if (val === undefined)
        throw new Error(
          `Unable to debug ${callback}. Property "${curr}" does not exist on ${JSON.stringify(
            prev,
            null,
            4
          )}`
        );

      return val;
    }, context);

    console.log(JSON.stringify(value, null, 4));
  } else if (callback) {
    callback(context);
  } else {
    try {
      console.log(JSON.stringify(context, null, 4));
    } catch {
      console.log(context);
    }
  }
  return context;
};

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
