import { AppContext } from './application';

export interface EventDef {
  id: string;
}

export const addEvents = (events: EventDef[] = []) => ({ app, setapp }: AppContext) =>
  setapp({ events: [...app.events, ...events] });

export const triggerEvent = (id: string, payload: {}) => ({ app }: AppContext) => {
  const flows = app.flowDefs.filter(flow => flow.onEvent?.includes(id));
  //@ts-ignore
  return Promise.all(flows.map(flow => this.runFlow(flow.id, payload)));
};
