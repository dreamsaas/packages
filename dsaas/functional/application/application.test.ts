import { createApplication } from '.';
import { perfCheck } from '../utils';
import { doubleFlow, actionDefs, initEvent } from './fixtures';
describe('application', () => {
  it('should create application', () => {
    const app = createApplication();

    expect(app).toMatchObject({
      app: {
        flowDefs: [],
        actionDefs: [],
        events: [],
        settings: { validate: false }
      }
    });
  });

  it('should initialize definitions', () => {
    const app = createApplication({ actionDefs, flowDefs: [doubleFlow], events: [initEvent] });

    expect(app).toMatchObject({
      app: {
        flowDefs: [doubleFlow],
        actionDefs,
        events: [initEvent],
        settings: { validate: false }
      }
    });
  });

  describe('registerActions', () => {
    it('should merge actions', () => {
      const [initialAction, ...restActions] = actionDefs;
      const app = createApplication({
        actionDefs: [initialAction],
        flowDefs: [doubleFlow],
        events: [initEvent]
      });

      app.registerActions(restActions);

      expect(app).toMatchObject({
        app: {
          actionDefs
        }
      });
    });
  });

  describe('registerEvents', () => {
    it('should merge events', () => {
      const app = createApplication({
        actionDefs: [],
        flowDefs: [],
        events: [initEvent]
      });

      app.registerEvents([{ id: 'ev2' }]);

      expect(app).toMatchObject({
        app: {
          events: [initEvent, { id: 'ev2' }]
        }
      });
    });
  });

  describe('config', () => {
    it('should merge configs', () => {
      const [initialAction, ...restActions] = actionDefs;
      const app = createApplication({
        actionDefs: [initialAction],
        flowDefs: [doubleFlow],
        events: [initEvent]
      });

      app.config({
        actionDefs: restActions
      });

      expect(app).toMatchObject({
        app: {
          actionDefs
        }
      });
    });
  });

  it('performance check', () => {
    const ms = perfCheck('create app', 1000, () =>
      createApplication({ actionDefs, flowDefs: [doubleFlow] })
    );
    expect(ms).toBeLessThan(30);
  });
});
