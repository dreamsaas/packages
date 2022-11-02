import * as React from 'react';
import { FC } from 'react';

export const Connector: FC<{ className?: string }> = ({ className, ...props }) => (
  <div
    {...props}
    className={`flex items-center justify-center w-4 h-4 rounded-full text-gray-100 ${
      className ?? ''
    }`}
  />
);

export const EmptyConnector: FC<{ className?: string }> = ({ className, ...props }) => (
  <Connector {...props} className={`bg-gray-600 border-gray-500 border ${className ?? ''}`} />
);

export const GoodConnector: FC<{ className?: string }> = ({ className, ...props }) => (
  <Connector {...props} className={`bg-blue-600 border-blue-500 border ${className ?? ''}`} />
);

export const BadConnector: FC<{ className?: string }> = ({ className, ...props }) => (
  <Connector {...props} className={`bg-red-700 border-red-500 border ${className ?? ''}`} />
);

const ConnectorInnerCircle: FC = () => <span className="block bg-gray-100 w-2 h-2 rounded-full" />;

export const LinkedConnector: FC<{ className?: string }> = ({ ...props }) => (
  <GoodConnector {...props}>
    <ConnectorInnerCircle />
  </GoodConnector>
);

export const OptionalConnector: FC<{ className?: string }> = ({ ...props }) => (
  <EmptyConnector {...props}>
    <span className="text-xs">?</span>
  </EmptyConnector>
);

export const ErrorConnector: FC<{ className?: string }> = ({ ...props }) => (
  <BadConnector {...props}>
    <span className="text-xs">!</span>
  </BadConnector>
);
