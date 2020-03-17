import React, { createContext, FC, useState, useCallback } from "react";
const noop = () => {};

type IPropTypes =
  | "string"
  | "number"
  | "boolean"
  | IRegisteredComponent[]
  | undefined;

export interface IRegisteredComponent {
  name: string;
  component: FC<any>;
  props: {
    [propName: string]: IPropTypes;
    children?: IRegisteredComponent[];
  };
}

export interface IComponentInstance {
  name: string;
  props: {
    [propName: string]: any;
    children?: IComponentInstance[];
  };
}

export const ComponentRegistryContext = createContext<{
  registerComponent(component: IRegisteredComponent): void;
  registerComponents(component: IRegisteredComponent[]): void;
  getComponent(componentName: string): IRegisteredComponent | null;
  components: {
    [componentName: string]: IRegisteredComponent;
  };
  application: IComponentInstance[];
  setApplication(application: IComponentInstance[]): void;
}>({
  registerComponent: noop,
  registerComponents: noop,
  getComponent: () => null,
  components: {},
  application: [],
  setApplication: noop
});

export const ComponentRegistryProvider: FC = props => {
  const [components, setComponents] = useState<{
    [componentName: string]: IRegisteredComponent;
  }>({});

  const [application, setApplication] = useState<IComponentInstance[]>([]);

  const registerComponent = (component: IRegisteredComponent) => {
    setComponents({ ...components, [component.name]: component });
  };
  const registerComponents = (componentsInput: IRegisteredComponent[]) => {
    setComponents({
      ...components,
      ...componentsInput.reduce(
        (prev, cur) => ({ ...prev, [cur.name]: cur }),
        {}
      )
    });
  };

  const getComponent = (componentName: string) =>
    components[componentName] || null;

  return (
    <ComponentRegistryContext.Provider
      value={{
        application,
        setApplication,
        components,
        registerComponent,
        registerComponents,
        getComponent
      }}
      {...props}
    />
  );
};
