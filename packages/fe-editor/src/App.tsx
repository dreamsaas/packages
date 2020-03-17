import React, { FC, useContext, useEffect } from "react";
import { ComponentRegistryContext } from "./context/ComponentRegistry";
import { convertJsxToJson } from "./utils/jsxToJson";
import { ApplicationRenderer } from "./utils/Renderers";

const Application: JSX.Element = (
  <div className="p-3 bg-gray-900 text-white">
    Parent text
    <p className="p-3 mt-3 bg-gray-700">
      child text <button>This is a button</button>
    </p>
    more parent text
  </div>
);

export const App: FC = () => {
  const { setApplication, application, registerComponents } = useContext(
    ComponentRegistryContext
  );

  useEffect(() => {
    registerComponents([]);
    setApplication([convertJsxToJson(Application)]);
  }, []);

  return <ApplicationRenderer application={application} />;
};
