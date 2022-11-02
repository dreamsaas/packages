import { addActions } from '../action';
import { addAppContext } from '../application';
import { doubleFlow, actionDefs } from '../application/fixtures';
import { asyncPipe, debug, perfCheckAsync, pipe } from '../utils';
import { addFlows, initializeFlowActions, initializeFlowContext, runFlow } from './flow';
import { addFlowContext, DEFAULT_FLOW_CONTEXT, FlowContext } from './flow.context';

describe('flow', () => {
  describe('addFlowContext', () => {
    it('should add flow context', () => {
      const result: FlowContext = pipe(addFlowContext())({});

      expect(result).toMatchObject({ flow: {} });
      expect(typeof result.setflow).toBe('function');
    });
  });

  describe('initializeFlowContext', () => {
    it('should initialize flow context', () => {
      const result: FlowContext = pipe(
        addAppContext(),
        addFlows([doubleFlow]),
        addFlowContext(),
        initializeFlowContext(doubleFlow.id)
      )({});

      expect(result.flow).toMatchObject({ ...doubleFlow, ...DEFAULT_FLOW_CONTEXT });
    });
  });

  describe('initializeFlowActions', () => {
    it('should initialize flow actions', () => {
      const double = () => (value: number) => value * 2;
      pipe(double())(1);

      const result: FlowContext = pipe(
        addAppContext(),
        addFlows([doubleFlow]),
        addFlowContext(),
        initializeFlowContext(doubleFlow.id),
        initializeFlowActions()
      )({});

      expect(result.flow).toMatchObject(doubleFlow);
      result.flow.actions.forEach(action => {
        expect(action).toMatchObject({ inputs: {}, outputs: {} });
      });
    });
  });

  it.only('should run actions', async () => {
    const ctx = pipe(
      addAppContext(),
      addActions(actionDefs),
      addFlows([doubleFlow])
      // debug('flow.output')
    )({});

    await perfCheckAsync('test', 1, () => runFlow(doubleFlow.id, { input: 1 })(ctx));
  });
});
