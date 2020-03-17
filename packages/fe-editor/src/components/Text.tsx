import React, { FC } from "react";
import { IRegisteredComponent } from "../context/ComponentRegistry";

export const Div: FC<{ className?: string }> = ({ ...props }) => (
  <div {...props}>{props.children}</div>
);

export const DivDescription: IRegisteredComponent = {
  name: Div.name,
  props: {
    className: "string"
  },
  component: Div
};
