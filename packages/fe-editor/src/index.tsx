import React, { useContext } from "react";
import ReactDOM from "react-dom";
import "./styles/tailwind.css";
import { App } from "./App.codesandox";
import * as serviceWorker from "./serviceWorker";
import { ComponentRegistryProvider } from "./context/ComponentRegistry";

// const originalUseState = React.useState;
// //@ts-ignore
// React.useState = (initial: any) => {
//   const [thing, setter] = originalUseState(initial);
//   const context = useContext(StateContext);
//   context.logState("Current state", thing);
//   // getCaller();
//   const setterWrapper = (value: any) => {
//     context.logState("setState", value);
//     setter(value);
//   };

//   return [thing, setterWrapper];
// };

ReactDOM.render(
  <ComponentRegistryProvider>
    <App />
  </ComponentRegistryProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

interface Value {
  type: string;
  value: any;
}

interface Type {
  type: string;
  schema: any;
}

const thing: Value = {
  type: "number",
  value: 4
};
