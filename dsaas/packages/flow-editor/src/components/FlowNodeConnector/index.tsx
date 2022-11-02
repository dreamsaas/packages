import * as React from 'react';
import { FC } from 'react';
import { EmptyConnector, LinkedConnector, OptionalConnector, ErrorConnector } from '../Connector';

export const FlowNodeManualInputCircle: FC<{ active?: boolean; className?: string }> = ({
  active,
  className = '',
  ...props
}) => (
  <div
    {...props}
    className={`inline-block bg-white rounded-full w-2 h-2 ${
      active ? 'opacity-75' : 'opacity-25'
    } ${className}`}
  />
);

export const FlowNodeConnectorName: FC<{ className?: string }> = ({ className = '', ...props }) => (
  <label {...props} className={`text-gray-100 text-xs ${className}`} />
);

export const FlowNodeConnector: FC<{ name: string }> = ({ name, children, ...props }) => (
  <div {...props} className="inline-block">
    {/* <FlowNodeName>{name}</FlowNodeName>
    <FlowNodeBlock>{children}</FlowNodeBlock> */}
  </div>
);

const ConnectorMapping = {
  empty: EmptyConnector,
  linked: LinkedConnector,
  optional: OptionalConnector,
  error: ErrorConnector
};

export const FlowNodeInput: FC<{
  name?: string;
  connectorType?: keyof typeof ConnectorMapping;
  [id: string]: any;
}> = ({ name, connectorType = 'empty' }) => {
  const Connector = ConnectorMapping[connectorType];

  return (
    <div className="flex items-center justify-start -ml-5 mb-2 last:mb-0 mr-3">
      <Connector className="mr-1" />
      <FlowNodeConnectorName className="mr-1">{name}</FlowNodeConnectorName>
      <FlowNodeManualInputCircle />
    </div>
  );
};

export const FlowNodeOutput: FC<{
  name?: string;
  connectorType?: keyof typeof ConnectorMapping;
}> = ({ name, connectorType = 'empty' }) => {
  const Connector = ConnectorMapping[connectorType];

  return (
    <div className="flex items-center justify-end -mr-5 mb-2 last:mb-0  ml-1">
      <FlowNodeConnectorName className="mr-1">{name}</FlowNodeConnectorName>
      <Connector />
    </div>
  );
};
