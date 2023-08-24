"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSambaEvent = void 0;
const types_1 = require("../types");
const isSambaEvent = (eventName) => {
    return !!types_1.receiveMessagesTypes.find((type) => type === eventName);
};
exports.isSambaEvent = isSambaEvent;
