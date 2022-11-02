import { ActionDef } from '../action';
import { addContext, Context, updateContext } from '../context';
import { EventDef } from '../event';
import { FlowDef } from '../flow';

export interface App {
  actionDefs: ActionDef[];
  flowDefs: FlowDef[];
  events: EventDef[];
  settings: {
    validate: boolean;
    [key: string]: any;
  };
}

export type AppContext = Context<'app', App>;

const DEFAULT_APP_CONTEXT: App = {
  flowDefs: [],
  actionDefs: [],
  events: [],
  settings: {
    validate: false
  }
};

export const addAppContext = () => addContext('app', DEFAULT_APP_CONTEXT);

export const updateAppContext = (context: Partial<App>) => updateContext('app', context);
