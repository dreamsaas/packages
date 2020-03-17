import React, { FC, useContext } from "react";
import {
  ComponentRegistryContext,
  IComponentInstance
} from "../context/ComponentRegistry";

export const ComponentRenderer: FC<{ component: IComponentInstance }> = ({
  component
}) => {
  const { components } = useContext(ComponentRegistryContext);
  const foundComponent = components[component.name];
  if (typeof component === "string") return component;
  console.log(component, foundComponent, components);

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
    <foundComponent.component
      {...component.props}
      children={
        component.props?.children?.map(child => (
          <ComponentRenderer component={child} />
        )) || []
      }
    />
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
