import { ActionDef, addActions } from '../action';
import { addEvents, EventDef } from '../event';
import { addFlows } from '../flow';
import { debug, pipe } from '../utils';
import { addAppContext, App, AppContext, updateAppContext } from './app.context';

export const applyConfig = (config: Partial<App>) => (context: AppContext) =>
  pipe(
    addActions(config.actionDefs),
    addEvents(config.events),
    addFlows(config.flowDefs),
    updateAppContext({
      settings: {
        ...context.app.settings,
        ...config.settings
      }
    })
  )(context);

export const createApplication = (initialConfig: Partial<App> = {}) => {
  const application: AppContext = pipe(addAppContext(), applyConfig(initialConfig))({});

  const registerActions = (actionDefs: ActionDef[]) => addActions(actionDefs)(application);
  const config = (config: Partial<App>) => applyConfig(config)(application);
  const registerEvents = (events: EventDef[]) => addEvents(events)(application);

  return {
    ...application,
    registerActions,
    registerEvents,
    config
  };
};
