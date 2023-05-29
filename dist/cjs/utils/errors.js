"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSECURE_CONTEXT = exports.INVALID_URL = exports.ALLOW_ATTRIBUTE_MISSING = exports.INVALID_CONFIG = exports.UNKNOWN_TARGET = exports.RichError = void 0;
class RichError extends Error {
    constructor(error) {
        super(error.message);
        this.name = error.name;
    }
}
exports.RichError = RichError;
exports.UNKNOWN_TARGET = new RichError({
    name: 'UNKNOWN_TARGET',
    message: 'Could not verify the identity of target frame. Commands may not work',
});
exports.INVALID_CONFIG = new RichError({
    name: 'INVALID_INIT_CONFIG',
    message: 'Initializations options are invalid. Missing team name or room ID',
});
exports.ALLOW_ATTRIBUTE_MISSING = new RichError({
    name: 'ALLOW_ATTRIBUTE_MISSING',
    message: "You've provided a frame that is mising 'allow' attribute. Some functionality may not work.",
});
exports.INVALID_URL = new RichError({
    name: 'INVALID_URL',
    message: 'Invalid room URL specified',
});
exports.INSECURE_CONTEXT = new RichError({
    name: 'INSECURE_CONTEXT',
    message: 'Initializing embedded app in an insecure context, media capabilities unavailable. See https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts for details',
});
