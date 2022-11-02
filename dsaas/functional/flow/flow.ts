import {
  Action,
  ActionContext,
  addActionContext,
  removeActionContext,
  updateActionContext
} from '../action';
import { AppContext } from '../application';
import { asyncPipe, debug, findById, pipe } from '../utils';
import { addFlowContext, FlowContext, FlowDef, updateFlowContext } from './flow.context';

export const addFlows = (flowDefs: FlowDef[] = []) => ({ app, setapp }: AppContext) =>
  setapp({
    flowDefs: [...app.flowDefs, ...flowDefs]
  });

export const initializeFlowContext = (id: string, input: {} = {}) => (context: FlowContext) => {
  const flow = findById(id, context.app.flowDefs);
  if (!flow) throw new Error();

  return pipe(updateFlowContext({ ...flow, input }))(context);
};

export const findAndApplyActionToContext = (id: string) => (context: ActionContext) => {
  let action = findById(id, context.flow.actions);
  if (!action) throw new Error();

  return updateActionContext(action)(context);
};

export const initializeFlowActions = () => (context: FlowContext) => {
  const actions: Action[] = context.flow.flowActionDefs.map(def => {
    return {
      ...def,
      hasRun: false,
      inputs: {},
      outputs: {},
      tos: context.flow.transitions.filter(tran => tran.to?.[0] === def.id),
      froms: context.flow.transitions.filter(tran => tran.from?.[0] === def.id)
    };
  });

  return updateFlowContext({ actions })(context);
};

export const runUpflowActions = () => () => {};

export const collectActionInputs = () => (context: ActionContext) => {
  const inputs =
    context.action.tos.length !== 0
      ? context.action.tos.reduce((current, { from, to }) => {
          const fromAction = findById(from[0], context.flow.actions);
          if (!fromAction) throw new Error();

          const outputKey = from[1];

          const value = fromAction.outputs?.[outputKey];

          return { ...current, [to[1]]: value };
        }, {})
      : context.flow.input;

  return updateActionContext({ inputs })(context);
};

const runFromActions = () => async (context: ActionContext) => {
  const froms = context.action.froms.map(from => runFlowAction(from.to[0]));

  await Promise.all([...froms.map(func => func(context))]);
};

const runAction = () => async (context: ActionContext) => {
  const actionDef = findById(context.action.type, context.app.actionDefs);
  if (!actionDef) throw new Error('Action definition not defined');
  if (!context.action.inputs) throw new Error('Action inputs have not been set');

  const outputs = await actionDef.run(context.action.inputs);

  return pipe(
    updateActionContext({ outputs, hasRun: true }),
    updateFlowContext({
      actions: context.flow.actions.map(action => {
        if (action.id === context.action.id) {
          return { ...action, outputs, hasRun: true };
        }
        return action;
      })
    })
  )(context);
};

const setFlowOutputIfEnd = () => (context: ActionContext) => {
  if (context.action.type === 'end') {
    updateFlowContext({ output: context.action.outputs })(context);
  }
};

export const runFlowAction = (id: string) => (context: FlowContext) => {
  const ctx = pipe(
    // Remove previous context first if exists
    removeActionContext(),
    addActionContext(),
    findAndApplyActionToContext(id)
  )(context);

  return asyncPipe(
    runUpflowActions(),
    collectActionInputs(),
    runAction(),
    setFlowOutputIfEnd(),
    runFromActions()
  )(ctx);
};

export const runFlow = (id: string, input: {}) => (context: AppContext) => {
  const ctx = pipe(
    addFlowContext(),
    initializeFlowContext(id, input),
    initializeFlowActions()
  )(context);

  return runFlowAction('start')(ctx);
};
