import { createSlice } from "@reduxjs/toolkit";
import {
  IRegisteredComponent,
  IComponentInstance
} from "../context/ComponentRegistry";

export const componentsSlice = createSlice({
  name: "components",
  initialState: {
    components: [] as IRegisteredComponent[],
    application: [] as IComponentInstance[]
  },
  reducers: {
    addComponent(state, action: { payload: IRegisteredComponent }) {
      return { ...state, [action.payload.name]: action.payload };
    },
    setApplication(state, action: { payload: IComponentInstance[] }) {
      return { ...state, application: action.payload };
    }
  }
});
