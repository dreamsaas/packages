import React, { FC, useContext } from "react";
import {
  ComponentRegistryContext,
  IComponentInstance
} from "../context/ComponentRegistry";

export const StateContext = React.createContext({
  logState: (...values: any[]) => {}
});

export const StateProvider: FC<{ componentName: string }> = ({
  componentName,
  ...props
}) => {
  const logState = (...values: any[]) => {
    console.log(componentName, ...values);
  };

  return <StateContext.Provider value={{ logState }} {...props} />;
};

export const ComponentRenderer: FC<{ component: IComponentInstance }> = ({
  component
}) => {
  const { components } = useContext(ComponentRegistryContext);
  const foundComponent = components[component.name];

  if (typeof component === "string") return component;

  // return component as regular element
  if (!foundComponent) {
    const { children = [], ...props } = component.props;
    return (
      //@ts-ignore
      <component.name {...props}>
        {children.map(child => <ComponentRenderer component={child} />) || []}
      </component.name>
    );
  }

  return (
    <StateProvider componentName={component.name}>
      <foundComponent.component
        {...component.props}
        children={
          component.props?.children?.map(child => (
            <ComponentRenderer component={child} />
          )) || []
        }
      />
    </StateProvider>
  );
};

export const ApplicationRenderer: FC<{
  application: IComponentInstance[];
}> = ({ application }) => {
  console.log(application);
  return (
    <>
      {application.map((child, i) => (
        <ComponentRenderer component={child} />
      ))}
    </>
  );
};
