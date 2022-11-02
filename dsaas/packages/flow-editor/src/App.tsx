import * as React from 'react';
import { useState, useRef } from 'react';
import { useMachine } from '@xstate/react';
import machine, { IContext, Item, Transition } from './machine';
import { FlowNode } from './components/FlowNode';
import { FlowNodeInput, FlowNodeOutput } from './components/FlowNodeConnector';

type Position = [number, number];

const OutputAnchor: React.FC<{ onDragOut?: (position: Position) => void }> = ({ onDragOut }) => {
  const [mouseDown, setMouseDown] = useState(false);
  return (
    <span
      onMouseDown={e => {
        setMouseDown(true);
      }}
      onMouseLeave={e => {
        if (mouseDown) {
          setMouseDown(false);
          if (onDragOut) onDragOut([e.clientX, e.clientY]);
        }
      }}
      style={{ position: 'absolute', right: 0, bottom: 0, zIndex: 1000 }}
      className="select-none"
    >
      >
    </span>
  );
};

const InputAnchor: React.FC = () => {
  return (
    <span
      style={{ position: 'absolute', left: 0, top: 0, zIndex: 1000 }}
      onMouseOver={() => console.log('mouse over')}
    >
      >
    </span>
  );
};

const Card: React.FC<{
  item: Item;
  onDragOutput?: (position: Position, output: any, action: Item) => void;
  onMouseDown: any;
}> = ({ item, onDragOutput = () => {}, ...props }) => {
  const { left, top } = item;

  const outputs = Object.keys(item.outputs || {}).map(key => (
    <FlowNodeOutput
      // onDragOut={position => {
      //   onDragOutput(position, key, item);
      // }}
      name="name"
    />
  ));
  const inputs = Object.keys(item.inputs || {}).map(key => <FlowNodeInput name="name" />);

  return (
    <FlowNode
      name="name"
      style={{
        left,
        top
      }}
      {...props}
      key={item.id}
    >
      <div>{inputs}</div>
      <div>{outputs}</div>
    </FlowNode>
  );
};

export function App() {
  const [current, send] = useMachine<IContext, any>(machine, {
    devTools: true,
    context: {
      mousePosition: [0, 0],
      items: [
        {
          id: '0',
          left: 0,
          top: 0,
          outputs: {
            value: true
          }
        },
        {
          id: '1',
          left: 150,
          top: 50,
          padding: 40,
          outputs: {
            value: true
          },
          inputs: {
            value: true
          }
        },
        {
          id: '2',
          left: 300,
          top: 100,
          inputs: {
            value: true
          }
        }
      ]
    }
  });

  const items = current.context.items;

  return (
    <div
      className="bg-gray-900 overflow-hidden text-gray-100"
      style={{ position: 'relative', width: '100vw', height: '100vh' }}
      onMouseMove={e => {
        e.stopPropagation();
        send(e.nativeEvent);
      }}
      onMouseDown={e => {
        const { type } = e.nativeEvent;
        send({ type, isContainer: true });
      }}
      onMouseUp={e => {
        send(e.nativeEvent);
      }}
    >
      {items.map((item, i) => (
        <Card
          item={item}
          children={item.children}
          onMouseDown={(e: React.MouseEvent) => {
            e.stopPropagation();
            const { x, y, type, offsetX, offsetY } = e.nativeEvent;
            console.log(x, y, e.nativeEvent);
            send({ x, y, offsetX, offsetY, type, isNode: true, ...item });
          }}
          key={i}
        />
      ))}
    </div>
  );
}
