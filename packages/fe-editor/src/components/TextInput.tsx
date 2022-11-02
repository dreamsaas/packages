import React, { FC, useState } from "react";
import {
  IRegisteredComponent,
  IComponentInstance
} from "../context/ComponentRegistry";

export const TextInput: FC<{
  className?: string;
  value?: any;
}> = ({ children, ...props }) => {
  const [state, setstate] = useState(props.value || "");

  return (
    <input
      type="text"
      {...props}
      value={state}
      onChange={e => setstate(e.target.value)}
    />
  );
};

export const TextInputDescription: IRegisteredComponent = {
  name: TextInput.name,
  props: {
    className: "string",
    value: "string"
  },
  component: TextInput
};
