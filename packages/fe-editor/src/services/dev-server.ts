import axios from "axios";

export const getAppState = () => axios.get("http://localhost:3001/api/app");

export const postAppConfig = (config: any) =>
  axios.post("http://localhost:3001/api/app", config);
