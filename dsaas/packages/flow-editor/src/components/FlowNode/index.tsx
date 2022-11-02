import * as React from 'react';
import { FC } from 'react';

export const FlowNodeBlock: FC = props => (
  <div
    {...props}
    className="inline-flex bg-teal-700 border border-teal-600 rounded-lg py-1 px-3 text-gray-100"
  />
);

export const FlowNodeName: FC = props => (
  <h2 {...props} className="text-gray-100 text-xs pl-2 pb-1 font-medium" />
);

export const FlowNode: FC<{ name?: string; style?: any }> = ({ name, children, ...props }) => (
  <div className="inline-block px-2 absolute" {...props}>
    <FlowNodeName>{name}</FlowNodeName>
    <FlowNodeBlock>{children}</FlowNodeBlock>
  </div>
);
