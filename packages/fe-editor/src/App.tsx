import React, { FC, useContext, useEffect } from "react";
import { ComponentRegistryContext } from "./context/ComponentRegistry";
import { convertJsxToJson } from "./utils/jsxToJson";
import { ApplicationRenderer } from "./utils/Renderers";
import { TextInputDescription, TextInput } from "./components/TextInput";

const Application: JSX.Element = (
  <div className="p-3 bg-gray-900 text-white">
    <TextInput className="text-gray-900" />
  </div>
);

export const App: FC = () => {
  const { setApplication, application, registerComponents } = useContext(
    ComponentRegistryContext
  );

  useEffect(() => {
    registerComponents([TextInputDescription]);
    console.log([convertJsxToJson(Application)]);
    setApplication([convertJsxToJson(Application)]);
  }, []);

  return <ApplicationRenderer application={application} />;
};
