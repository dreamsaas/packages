import { AppContext } from '../application';
import { ActionDef } from './action.context';

export const addActions = (actionDefs: ActionDef[] = []) => ({ app, setapp }: AppContext) =>
  setapp({
    actionDefs: [...app.actionDefs, ...actionDefs]
  });
