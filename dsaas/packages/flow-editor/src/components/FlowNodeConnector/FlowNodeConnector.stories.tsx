import * as React from 'react';
import { FlowNode } from '../FlowNode';
import { FlowNodeManualInputCircle, FlowNodeConnectorName, FlowNodeInput, FlowNodeOutput } from '.';

export default {
  title: 'Flow Node Input output'
};

export const Basic = () => (
  <div className="bg-gray-800 p-12">
    <FlowNode name="Node Name">
      <div>
        <FlowNodeInput name="Input Name" connectorType="empty" />
        <FlowNodeInput name="Input Name" connectorType="linked" />
        <FlowNodeInput name="Input Name" connectorType="optional" />
        <FlowNodeInput name="Input Name" connectorType="error" />
      </div>
      <div>
        <FlowNodeOutput name="Output" connectorType="empty" />
        <FlowNodeOutput name="Output" connectorType="linked" />
        <FlowNodeOutput name="Output" connectorType="optional" />
        <FlowNodeOutput name="Output" connectorType="error" />
      </div>
    </FlowNode>
  </div>
);
