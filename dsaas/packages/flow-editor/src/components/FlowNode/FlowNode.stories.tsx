import * as React from 'react';
import { FlowNodeName, FlowNodeBlock, FlowNode } from './index';

export default {
  title: 'Flow Node'
};

export const Basic = () => (
  <div className="bg-gray-800 p-12">
    <FlowNodeName>The name</FlowNodeName>
    <FlowNodeBlock>some content</FlowNodeBlock>
    <br />
    <br />
    <FlowNode name="Node Name">Some content</FlowNode>
  </div>
);
