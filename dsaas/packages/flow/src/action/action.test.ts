import { Application } from '../application';
import { double } from '../__fixtures__/action-definitions';
import { Action } from './action';
import { ACTION_STATUS } from './types';

describe('Action', () => {
  it('should initialize', () => {
    const action = new Action({ actionType: 'double', id: 'double' }, double, new Application());
    expect(action.status === ACTION_STATUS.not_run);

    expect(action).toBeDefined();
  });

  it('should run action', async () => {
    const action = new Action({ actionType: 'double', id: 'double' }, double, new Application());
    const result = await action.run({ number: 1 });

    expect(result).toMatchObject({ number: 2 });
  });

  it('should set action statuses', async () => {
    const action = new Action({ actionType: 'double', id: 'double' }, double, new Application());
    expect(action.status).toBe(ACTION_STATUS.not_run);
    await action.run({ number: 1 });

    expect(action.status).toBe(ACTION_STATUS.done);
  });
});
