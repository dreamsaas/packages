"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
exports.getAppState = () => axios_1.default.get("http://localhost:3001/api/app");
exports.postAppConfig = (config) => axios_1.default.post("http://localhost:3001/api/app", config);
//# sourceMappingURL=dev-server.js.map