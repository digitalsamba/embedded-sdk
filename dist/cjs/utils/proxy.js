"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProxy = void 0;
const createHandler = (onChange) => {
    const handler = {
        get(target, key) {
            if (typeof target[key] === 'object' && target[key] !== null) {
                return new Proxy(target[key], handler);
            }
            return target[key];
        },
        set(target, prop, value) {
            target[prop] = value;
            onChange(target);
            return target;
        },
    };
    return handler;
};
const createProxy = (initialState, onChange) => new Proxy(initialState, createHandler(onChange));
exports.createProxy = createProxy;
