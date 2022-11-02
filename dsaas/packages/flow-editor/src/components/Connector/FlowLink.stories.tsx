import * as React from 'react';
import {
  Connector,
  EmptyConnector,
  GoodConnector,
  BadConnector,
  LinkedConnector,
  OptionalConnector,
  ErrorConnector
} from './index';

export default {
  title: 'Flow Links'
};

export const Basic = () => (
  <div className="bg-gray-800 p-12">
    <Connector className="bg-red-500" />
    <EmptyConnector />
    <GoodConnector />
    <BadConnector />
    <LinkedConnector />
    <OptionalConnector />
    <ErrorConnector />
  </div>
);
