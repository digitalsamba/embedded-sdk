var _a;
import { ALLOW_ATTRIBUTE_MISSING, INVALID_CONFIG, INVALID_URL, UNKNOWN_TARGET, } from "./utils/errors";
const CONNECT_TIMEOUT = 5000;
function isFunction(func) {
    return func instanceof Function;
}
export class DigitalSambaEmbedded {
    constructor(options = {}, instanceProperties = {}, loadImmediately = true) {
        this.savedIframeSrc = "";
        this.allowedOrigin = "*";
        this.connected = false;
        this.frame = document.createElement("iframe");
        this.eventHandlers = {};
        this.reportErrors = false;
        this.mountFrame = (loadImmediately) => {
            const { url, frame, root } = this.initOptions;
            if (root) {
                root.appendChild(this.frame);
            }
            else if (frame) {
                this.frame = frame;
                if (!frame.allow) {
                    this.logError(ALLOW_ATTRIBUTE_MISSING);
                }
            }
            else {
                document.body.appendChild(this.frame);
            }
            if (url || (this.frame.src && this.frame.src !== window.location.href)) {
                try {
                    const frameSrc = new URL(url || this.frame.src).toString();
                    this.frame.src = frameSrc;
                    this.savedIframeSrc = frameSrc;
                }
                catch (_b) {
                    this.logError(INVALID_URL);
                }
            }
            if (!loadImmediately) {
                this.savedIframeSrc = this.frame.src;
                this.frame.src = "";
            }
        };
        this.load = (instanceProperties = {}) => {
            this.reportErrors = instanceProperties.reportErrors || false;
            this.setFrameSrc();
            this.applyFrameProperties(instanceProperties);
            this.frame.style.display = "block";
        };
        this.on = (type, handler) => {
            this.eventHandlers[type] = handler;
        };
        this.onMessage = (event) => {
            //     if (event.origin !== this.allowedOrigin) {
            //       // ignore messages from other sources;
            //       return;
            //     }
            if (typeof this.eventHandlers["*"] === "function") {
                this.eventHandlers["*"](event.data);
            }
            if (event.data.type) {
                const callback = this.eventHandlers[event.data.type];
                if (isFunction(callback)) {
                    callback(event.data);
                }
            }
        };
        this.setFrameSrc = () => {
            let url = this.savedIframeSrc;
            const { team, room, token } = this.initOptions;
            if (team && room) {
                url = `https://${team}.digitalsamba.com/${room}`;
            }
            if (url && token) {
                const urlObj = new URL(url);
                urlObj.searchParams.append("token", token);
                url = urlObj.toString();
            }
            if (url) {
                this.frame.src = url;
            }
            else {
                this.logError(INVALID_CONFIG);
                return;
            }
            const allowedURL = new URL(this.frame.src);
            this.allowedOrigin = allowedURL.origin;
            this.frame.onload = () => this.checkTarget();
        };
        this.logError = (error) => {
            if (this.reportErrors) {
                throw error;
            }
        };
        this.applyFrameProperties = (instanceProperties) => {
            if (instanceProperties.frameAttributes) {
                // TODO: only allow specific attrs here; This is a heck to support
                Object.entries(instanceProperties.frameAttributes).forEach(([attr, value]) => {
                    if (value !== null && typeof value !== "undefined") {
                        this.frame.setAttribute(attr, value.toString());
                    }
                    else {
                        this.frame.removeAttribute(attr);
                    }
                });
            }
            if (instanceProperties.reportErrors) {
                this.reportErrors = true;
            }
        };
        // commands
        this.enableVideo = () => {
            this.sendMessage({ type: "enableVideo" });
        };
        this.disableVideo = () => {
            this.sendMessage({ type: "disableVideo" });
        };
        this.toggleVideo = (enable) => {
            if (typeof enable === "undefined") {
                this.sendMessage({ type: "toggleVideo" });
            }
            else {
                if (enable) {
                    this.enableVideo();
                }
                else {
                    this.disableVideo();
                }
            }
        };
        this.enableAudio = () => {
            this.sendMessage({ type: "enableAudio" });
        };
        this.disableAudio = () => {
            this.sendMessage({ type: "disableAudio" });
        };
        this.toggleAudio = (enable) => {
            if (typeof enable === "undefined") {
                this.sendMessage({ type: "toggleAudio" });
            }
            else {
                if (enable) {
                    this.enableAudio();
                }
                else {
                    this.disableAudio();
                }
            }
        };
        this.startScreenshare = () => {
            this.sendMessage({ type: "startScreenshare" });
        };
        this.stopScreenshare = () => {
            this.sendMessage({ type: "stopScreenshare" });
        };
        this.startRecording = () => {
            this.sendMessage({ type: "startRecording" });
        };
        this.stopRecording = () => {
            this.sendMessage({ type: "stopRecording" });
        };
        this.showToolbar = () => {
            this.sendMessage({ type: "showToolbar" });
        };
        this.hideToolbar = () => {
            this.sendMessage({ type: "hideToolbar" });
        };
        this.changeLayoutMode = (mode) => {
            this.sendMessage({ type: "changeLayoutMode", data: mode });
        };
        this.toggleToolbar = (show) => {
            if (typeof show === "undefined") {
                this.sendMessage({ type: "toggleToolbar" });
            }
            else {
                if (show) {
                    this.showToolbar();
                }
                else {
                    this.hideToolbar();
                }
            }
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
    checkTarget() {
        this.sendMessage({ type: "connect" });
        const confirmationTimeout = window.setTimeout(() => {
            this.logError(UNKNOWN_TARGET);
        }, CONNECT_TIMEOUT);
        this.on("connected", () => {
            this.connected = true;
            clearTimeout(confirmationTimeout);
        });
    }
    sendMessage(message) {
        if (this.frame.contentWindow) {
            this.frame.contentWindow.postMessage(message, {
                targetOrigin: this.allowedOrigin,
            });
        }
    }
}
_a = DigitalSambaEmbedded;
DigitalSambaEmbedded.createControl = (initOptions) => {
    return new _a(initOptions, {}, false);
};
