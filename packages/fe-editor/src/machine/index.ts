import { Machine, assign, StatesConfig } from "xstate";

export interface Item {
  id: string;
  left: number;
  top: number;
  inputs?: {
    [key: string]: any;
  };
  outputs?: {
    [key: string]: any;
  };
  [key: string]: any;
}

export interface Transition {
  fromAction: string;
  fromOutput: string;
  toAction: string;
  toInput: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}

export interface IContext {
  mousePosition: [number, number];
  items: Item[];
  transitions: Transition[];
  targetItem: Item | null;
  targetOutput: Item | null;
}

const machine = Machine<IContext>(
  {
    id: "machine",
    initial: "idle",
    context: {
      mousePosition: [0, 0],
      items: [],
      transitions: [],
      targetItem: null,
      targetOutput: null,
    },
    states: {
      idle: {
        id: "idle",
        entry: [{ type: "updateItemTarget", event: { isContainer: true } }],
        on: {
          mousedown: "mousedown",
        },
      },
      mousedown: {
        entry: ["updateItemTarget"],
        on: {
          "*": [
            {
              target: "draggingNode",
              cond: "isdraggingNode",
            },
            {
              target: "draggingOutput",
              cond: "isdraggingOutput",
            },
          ],
          mouseup: "idle",
        },
      },
      draggingNode: {
        entry: ["updateMousePosition", "updateItemTargetPosition"],
        on: {
          mousemove: {
            target: "draggingNode",
          },
          mouseup: "idle",
        },
      },
      draggingOutput: {
        entry: ["updateMousePosition", "updateItemTargetPosition"],
        on: {
          mousemove: {
            target: "draggingOutput",
          },
          mouseup: "idle",
        },
      },
    },
  },
  {
    guards: {
      isdraggingNode: (context, event) => {
        return context.targetItem?.isNode;
      },
      isdraggingOutput: (context, event) => context.targetItem?.isOutput,
    },
    actions: {
      updateMousePosition: assign({
        mousePosition: (context, event: any) => [event.x, event.y],
      }),
      updateItemTarget: assign({
        targetItem: (context, event: any) => (event.isContainer ? null : event),
      }),
      updateOutputTarget: assign({
        targetOutput: (context, event: any) => (event.isOutput ? null : event),
      }),
      updateItemTargetPosition: assign({
        items: (context, event) => {
          return context.items.map((item) => {
            if (item.id !== context.targetItem?.id) return item;

            return {
              ...item,
              top: event.y - context.targetItem.offsetY,
              left: event.x - context.targetItem.offsetX,
            };
          });
        },
      }),
    },
  }
);

export default machine;
