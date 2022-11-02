
// TODO: update to capitalized setter when https://github.com/microsoft/TypeScript/pull/40336 is available.
export type Context<S extends string, T extends {}> = Record<S, T> & Record<`set${S}`, (newContext: Partial<T>)=> void>


/**
 * Creates a mutable context object for controlled effects.
 *
 * Context always references the same object.
 */
export const createContext = <S extends string, T extends {}>(contextName: S, initialValue: T):Context<S, T> => {
  /**
   * Since contexts are treated as mutable, any default context objects end up
   * being the same object in memory. Must copy the initial value when creating a new 
   * context to prevent shared mutable context issues.
   */
  let context: T = JSON.parse(JSON.stringify(initialValue));

  /**
   * merge root  key/values into mutable context.
   */
  const setContext = (newContext: Partial<T>) => {
    Object.entries(newContext).forEach(([key, value]) => {
      context[key] = value;
    });
  };

  // @ts-ignore
  return {
    [contextName]: context,
    [`set${contextName}`]:setContext
  };
};


export const addContext = <S extends string,T extends {},>(contextName: S, initial: T) => <C extends {}>(
  existingContext: C
): C & Record<S, Context<S,T>> => {
  //@ts-ignore
  if(existingContext[contextName]) throw new Error(`Context ${contextName} already exists`);

  const newContext = createContext(contextName, initial);

  //@ts-ignore
  return {
    ...existingContext,
    ...newContext
  };
};

export const updateContext = <S extends string, T extends {}>(contextName: S, newContext: T) => <C extends {}>(
  existingContext: C
): C => {
    //@ts-ignore
  if(!existingContext[contextName]) throw new Error(`Context "${contextName}" does not exist`);

  existingContext[`set${contextName}`](newContext)

  return existingContext
};

export const removeContext = <S extends string>(contextName: S) => <C extends {}>({
  [contextName]: old,
  //@ts-ignore
  [`set${contextName}`]: oldSetter,
  ...rest
}: C): Omit<Omit<C,`set${S}`>, S> => {
  //@ts-ignore
  return rest;
};
