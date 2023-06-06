export class RichError extends Error {
    constructor(error) {
        super(error.message);
        this.name = error.name;
    }
}
export const UNKNOWN_TARGET = new RichError({
    name: 'UNKNOWN_TARGET',
    message: 'Could not verify the identity of target frame. Commands may not work',
});
export const INVALID_CONFIG = new RichError({
    name: 'INVALID_INIT_CONFIG',
    message: 'Initializations options are invalid. Missing team name or room ID',
});
export const ALLOW_ATTRIBUTE_MISSING = new RichError({
    name: 'ALLOW_ATTRIBUTE_MISSING',
    message: "You've provided a frame that is mising 'allow' attribute. Some functionality may not work.",
});
export const INVALID_URL = new RichError({
    name: 'INVALID_URL',
    message: 'Invalid room URL specified',
});
export const INSECURE_CONTEXT = new RichError({
    name: 'INSECURE_CONTEXT',
    message: 'Initializing embedded app in an insecure context, media capabilities unavailable. See https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts for details',
});
