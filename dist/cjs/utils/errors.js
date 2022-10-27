"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVALID_URL = exports.ALLOW_ATTRIBUTE_MISSING = exports.INVALID_CONFIG = exports.UNKNOWN_TARGET = exports.RichError = void 0;
var RichError = /** @class */ (function (_super) {
    __extends(RichError, _super);
    function RichError(error) {
        var _this = _super.call(this, error.message) || this;
        _this.name = error.name;
        return _this;
    }
    return RichError;
}(Error));
exports.RichError = RichError;
exports.UNKNOWN_TARGET = new RichError({
    name: "UNKNOWN_TARGET",
    message: "Could not verify the identity of target frame. Commands may not work",
});
exports.INVALID_CONFIG = new RichError({
    name: "INVALID_INIT_CONFIG",
    message: "Initializations options are invalid. Missing team name or room ID",
});
exports.ALLOW_ATTRIBUTE_MISSING = new RichError({
    name: "ALLOW_ATTRIBUTE_MISSING",
    message: "You've provided a frame that is mising 'allow' attribute. Some functionality may not work.",
});
exports.INVALID_URL = new RichError({
    name: "INVALID_URL",
    message: "Invalid frame url specified"
});
