export declare class RichError extends Error {
    constructor(error: {
        name: string;
        message: string;
    });
}
export declare const UNKNOWN_TARGET: RichError;
export declare const INVALID_CONFIG: RichError;
export declare const ALLOW_ATTRIBUTE_MISSING: RichError;
export declare const INVALID_URL: RichError;
export declare const INSECURE_CONTEXT: RichError;
