var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { ALLOW_ATTRIBUTE_MISSING, INVALID_CONFIG, INVALID_URL, UNKNOWN_TARGET, } from "./utils/errors";
var CONNECT_TIMEOUT = 5000;
function isFunction(func) {
    return func instanceof Function;
}
var DigitalSambaEmbedded = /** @class */ (function () {
    function DigitalSambaEmbedded(options, instanceProperties, loadImmediately) {
        if (options === void 0) { options = {}; }
        if (instanceProperties === void 0) { instanceProperties = {}; }
        if (loadImmediately === void 0) { loadImmediately = true; }
        var _this = this;
        this.savedIframeSrc = "";
        this.allowedOrigin = "*";
        this.connected = false;
        this.frame = document.createElement("iframe");
        this.eventHandlers = {};
        this.reportErrors = false;
        this.mountFrame = function (loadImmediately) {
            var _b = _this.initOptions, url = _b.url, frame = _b.frame, root = _b.root;
            if (root) {
                root.appendChild(_this.frame);
            }
            else if (frame) {
                _this.frame = frame;
                if (!frame.allow) {
                    _this.logError(ALLOW_ATTRIBUTE_MISSING);
                }
            }
            else {
                document.body.appendChild(_this.frame);
            }
            if (url || (_this.frame.src && _this.frame.src !== window.location.href)) {
                try {
                    var frameSrc = new URL(url || _this.frame.src).toString();
                    _this.frame.src = frameSrc;
                    _this.savedIframeSrc = frameSrc;
                }
                catch (_c) {
                    _this.logError(INVALID_URL);
                }
            }
            if (!loadImmediately) {
                _this.savedIframeSrc = _this.frame.src;
                _this.frame.src = "";
            }
        };
        this.load = function (instanceProperties) {
            if (instanceProperties === void 0) { instanceProperties = {}; }
            _this.reportErrors = instanceProperties.reportErrors || false;
            _this.setFrameSrc();
            _this.applyFrameProperties(instanceProperties);
            _this.frame.style.display = "block";
        };
        this.on = function (type, handler) {
            _this.eventHandlers[type] = handler;
        };
        this.onMessage = function (event) {
            //     if (event.origin !== this.allowedOrigin) {
            //       // ignore messages from other sources;
            //       return;
            //     }
            if (typeof _this.eventHandlers["*"] === "function") {
                _this.eventHandlers["*"](event.data);
            }
            if (event.data.type) {
                var callback = _this.eventHandlers[event.data.type];
                if (isFunction(callback)) {
                    callback(event.data);
                }
            }
        };
        this.setFrameSrc = function () {
            var url = _this.savedIframeSrc;
            var _b = _this.initOptions, team = _b.team, room = _b.room, token = _b.token;
            if (team && room) {
                url = "https://".concat(team, ".digitalsamba.com/").concat(room);
            }
            if (url && token) {
                var urlObj = new URL(url);
                urlObj.searchParams.append("token", token);
                url = urlObj.toString(); //`${urlObj.origin}${urlObj.pathname}?${params}`;
            }
            if (url) {
                _this.frame.src = url;
            }
            else {
                _this.logError(INVALID_CONFIG);
                return;
            }
            var allowedURL = new URL(_this.frame.src);
            _this.allowedOrigin = allowedURL.origin;
            _this.frame.onload = function () { return _this.checkTarget(); };
        };
        this.logError = function (error) {
            if (_this.reportErrors) {
                throw error;
            }
        };
        this.applyFrameProperties = function (instanceProperties) {
            if (instanceProperties.frameAttributes) {
                // TODO: only allow specific attrs here; This is a heck to support
                Object.entries(instanceProperties.frameAttributes).forEach(function (_b) {
                    var _c = __read(_b, 2), attr = _c[0], value = _c[1];
                    if (value !== null && typeof value !== "undefined") {
                        _this.frame.setAttribute(attr, value.toString());
                    }
                    else {
                        _this.frame.removeAttribute(attr);
                    }
                });
            }
            if (instanceProperties.reportErrors) {
                _this.reportErrors = true;
            }
        };
        // commands
        this.enableVideo = function () {
            _this.sendMessage({ type: "enableVideo" });
        };
        this.disableVideo = function () {
            _this.sendMessage({ type: "disableVideo" });
        };
        this.toggleVideo = function (enable) {
            if (typeof enable === "undefined") {
                _this.sendMessage({ type: "toggleVideo" });
            }
            else {
                if (enable) {
                    _this.enableVideo();
                }
                else {
                    _this.disableVideo();
                }
            }
        };
        this.enableAudio = function () {
            _this.sendMessage({ type: "enableAudio" });
        };
        this.disableAudio = function () {
            _this.sendMessage({ type: "disableAudio" });
        };
        this.toggleAudio = function (enable) {
            if (typeof enable === "undefined") {
                _this.sendMessage({ type: "toggleAudio" });
            }
            else {
                if (enable) {
                    _this.enableAudio();
                }
                else {
                    _this.disableAudio();
                }
            }
        };
        this.startScreenshare = function () {
            _this.sendMessage({ type: "startScreenshare" });
        };
        this.stopScreenshare = function () {
            _this.sendMessage({ type: "stopScreenshare" });
        };
        this.initOptions = options;
        this.reportErrors = instanceProperties.reportErrors || false;
        this.frame.allow = "camera; microphone; display-capture; autoplay;";
        this.frame.setAttribute("allowFullscreen", "true");
        this.mountFrame(loadImmediately);
        if (loadImmediately) {
            this.load(instanceProperties);
        }
        else {
            this.frame.style.display = "none";
        }
        window.addEventListener("message", this.onMessage);
    }
    DigitalSambaEmbedded.prototype.checkTarget = function () {
        var _this = this;
        this.sendMessage({ type: "connect" });
        var confirmationTimeout = window.setTimeout(function () {
            _this.logError(UNKNOWN_TARGET);
        }, CONNECT_TIMEOUT);
        this.on("connected", function () {
            _this.connected = true;
            clearTimeout(confirmationTimeout);
        });
    };
    DigitalSambaEmbedded.prototype.sendMessage = function (message) {
        if (this.frame.contentWindow) {
            this.frame.contentWindow.postMessage(message, {
                targetOrigin: this.allowedOrigin,
            });
        }
    };
    var _a;
    _a = DigitalSambaEmbedded;
    DigitalSambaEmbedded.createControl = function (initOptions) {
        return new _a(initOptions, {}, false);
    };
    return DigitalSambaEmbedded;
}());
export { DigitalSambaEmbedded };
