"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DigitalSambaEmbedded = void 0;
const events_1 = __importDefault(require("events"));
const PermissionManager_1 = require("./utils/PermissionManager");
const vars_1 = require("./utils/vars");
const proxy_1 = require("./utils/proxy");
const errors_1 = require("./utils/errors");
class DigitalSambaEmbedded extends events_1.default {
    constructor(options = {}, instanceProperties = {}, loadImmediately = true) {
        super();
        this.roomSettings = {};
        this.savedIframeSrc = '';
        this.allowedOrigin = '*';
        this.connected = false;
        this.frame = document.createElement('iframe');
        this.reportErrors = false;
        this.stored = Object.assign({}, vars_1.defaultStoredState);
        this.permissionManager = new PermissionManager_1.PermissionManager(this);
        this.mountFrame = (loadImmediately) => {
            const { url, frame, root } = this.initOptions;
            if (root) {
                root.appendChild(this.frame);
            }
            else if (frame) {
                this.frame = frame;
                if (!frame.allow) {
                    this.logError(errors_1.ALLOW_ATTRIBUTE_MISSING);
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
                    this.logError(errors_1.INVALID_URL);
                }
            }
            if (!loadImmediately) {
                this.savedIframeSrc = this.frame.src;
                this.frame.src = '';
            }
        };
        this.load = (instanceProperties = {}) => {
            this.reportErrors = instanceProperties.reportErrors || false;
            this.setFrameSrc();
            this.applyFrameProperties(instanceProperties);
            this.frame.style.display = 'block';
        };
        this.onMessage = (event) => {
            if (event.origin !== this.allowedOrigin) {
                // ignore messages from other sources;
                return;
            }
            const message = event.data.DSPayload;
            if (!message) {
                return;
            }
            if (message.type) {
                if (vars_1.internalEvents[message.type]) {
                    this.handleInternalMessage(event.data);
                }
                else {
                    this._emit(message.type, message);
                }
            }
        };
        this.setupInternalEventListeners = () => {
            this.on('userJoined', (event) => {
                const { user, type } = event.data;
                this.stored.users[user.id] = Object.assign(Object.assign({}, user), { kind: type });
                if (type === 'local') {
                    this.stored.userId = user.id;
                }
                this.emitUsersUpdated();
            });
            this.on('userLeft', (event) => {
                var _b, _c;
                if ((_c = (_b = event.data) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.id) {
                    delete this.stored.users[event.data.user.id];
                }
                this.emitUsersUpdated();
            });
            this.on('permissionsChanged', (event) => {
                if (this.stored.users[this.stored.userId]) {
                    let modifiedPermissions = [
                        ...(this.stored.users[this.stored.userId].dynamicPermissions || []),
                    ];
                    Object.entries(event.data).forEach(([permission, enabled]) => {
                        if (enabled && !modifiedPermissions.includes(permission)) {
                            modifiedPermissions.push(permission);
                        }
                        if (!enabled) {
                            modifiedPermissions = modifiedPermissions.filter((userPermission) => userPermission !== permission);
                        }
                    });
                    this.stored.users[this.stored.userId].dynamicPermissions =
                        modifiedPermissions;
                }
            });
            this.on('activeSpeakerChanged', (event) => {
                var _b, _c;
                this.stored.activeSpeaker = (_c = (_b = event.data) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.id;
            });
            this.on('videoEnabled', (event) => {
                var _b;
                if (((_b = event.data) === null || _b === void 0 ? void 0 : _b.type) === 'local') {
                    this.stored.roomState.media.videoEnabled = true;
                }
            });
            this.on('videoDisabled', (event) => {
                var _b;
                if (((_b = event.data) === null || _b === void 0 ? void 0 : _b.type) === 'local') {
                    this.stored.roomState.media.videoEnabled = false;
                }
            });
            this.on('audioEnabled', (event) => {
                var _b;
                if (((_b = event.data) === null || _b === void 0 ? void 0 : _b.type) === 'local') {
                    this.stored.roomState.media.audioEnabled = true;
                }
            });
            this.on('audioDisabled', (event) => {
                var _b;
                if (((_b = event.data) === null || _b === void 0 ? void 0 : _b.type) === 'local') {
                    this.stored.roomState.media.audioEnabled = false;
                }
            });
            this.on('layoutModeChanged', (event) => {
                this.stored.roomState.layout.mode = event.data.mode;
            });
            this.on('captionsSpokenLanguageChanged', (event) => {
                this.stored.roomState.captionsState.spokenLanguage = event.data.language;
            });
            this.on('captionsEnabled', () => {
                this.stored.roomState.captionsState.showCaptions = true;
            });
            this.on('captionsDisabled', () => {
                this.stored.roomState.captionsState.showCaptions = false;
            });
            this.on('captionsFontSizeChanged', (event) => {
                this.stored.roomState.captionsState.fontSize = event.data.fontSize;
            });
            this.on('virtualBackgroundChanged', (event) => {
                const { type, value, enforced } = event.data.virtualBackgroundConfig;
                this.stored.roomState.virtualBackground = {
                    enabled: true,
                    type,
                    value,
                    enforced,
                };
            });
            this.on('virtualBackgroundDisabled', (event) => {
                this.stored.roomState.virtualBackground = {
                    enabled: false,
                };
            });
        };
        this._emit = (eventName, ...args) => {
            this.emit('*', ...args);
            return this.emit(eventName, ...args);
        };
        this.handleInternalMessage = (event) => {
            const message = event.DSPayload;
            switch (message.type) {
                case 'roomJoined': {
                    const { users, roomState, activeSpeaker, permissionsMap } = message.data;
                    this.stored.users = Object.assign(Object.assign({}, this.stored.users), users);
                    this.stored.roomState = (0, proxy_1.createWatchedProxy)(Object.assign({}, roomState), this.emitRoomStateUpdated);
                    this.stored.activeSpeaker = activeSpeaker;
                    this.permissionManager.permissionsMap = permissionsMap;
                    this.emitUsersUpdated();
                    this.emitRoomStateUpdated();
                    this._emit('roomJoined', { type: 'roomJoined' });
                    break;
                }
                default: {
                    break;
                }
            }
        };
        this.emitUsersUpdated = () => {
            this._emit('usersUpdated', { type: 'usersUpdated', data: { users: this.listUsers() } });
        };
        this.emitRoomStateUpdated = () => {
            this._emit('roomStateUpdated', { type: 'roomStateUpdated', data: { state: this.roomState } });
        };
        this.setFrameSrc = () => {
            let url = this.savedIframeSrc;
            const { team, room, token } = this.initOptions;
            if (team && room) {
                url = `https://${team}.digitalsamba.com/${room}`;
            }
            if (url) {
                const urlObj = new URL(url);
                urlObj.searchParams.append('dsEmbedFrame', 'true');
                if (token) {
                    urlObj.searchParams.append('token', token);
                }
                url = urlObj.toString();
            }
            if (url) {
                this.frame.src = url;
            }
            else {
                this.logError(errors_1.INVALID_CONFIG);
                return;
            }
            const allowedURL = new URL(this.frame.src);
            this.allowedOrigin = allowedURL.origin;
            this.frame.onload = () => {
                this._emit('frameLoaded', { type: 'frameLoaded' });
                this.checkTarget();
            };
        };
        this.logError = (error) => {
            if (this.reportErrors) {
                throw error;
            }
            else {
                console.error(error);
            }
        };
        this.applyFrameProperties = (instanceProperties) => {
            if (instanceProperties.frameAttributes) {
                // TODO: only allow specific attrs here; This is a heck to support
                Object.entries(instanceProperties.frameAttributes).forEach(([attr, value]) => {
                    if (value !== null && typeof value !== 'undefined') {
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
            this.roomSettings.videoEnabled = true;
            this.sendMessage({ type: 'enableVideo' });
        };
        this.disableVideo = () => {
            this.roomSettings.videoEnabled = false;
            this.sendMessage({ type: 'disableVideo' });
        };
        this.toggleVideo = (enable) => {
            if (typeof enable === 'undefined') {
                this.sendMessage({ type: 'toggleVideo' });
            }
            else if (enable) {
                this.enableVideo();
            }
            else {
                this.disableVideo();
            }
        };
        this.enableAudio = () => {
            this.roomSettings.audioEnabled = true;
            this.sendMessage({ type: 'enableAudio' });
        };
        this.disableAudio = () => {
            this.roomSettings.audioEnabled = false;
            this.sendMessage({ type: 'disableAudio' });
        };
        this.toggleAudio = (enable) => {
            if (typeof enable === 'undefined') {
                this.sendMessage({ type: 'toggleAudio' });
            }
            else if (enable) {
                this.enableAudio();
            }
            else {
                this.disableAudio();
            }
        };
        this.startScreenshare = () => {
            this.sendMessage({ type: 'startScreenshare' });
        };
        this.stopScreenshare = () => {
            this.sendMessage({ type: 'stopScreenshare' });
        };
        this.startRecording = () => {
            this.sendMessage({ type: 'startRecording' });
        };
        this.stopRecording = () => {
            this.sendMessage({ type: 'stopRecording' });
        };
        this.showToolbar = () => {
            this.roomSettings.showToolbar = true;
            this.stored.roomState.layout.showToolbar = true;
            this.sendMessage({ type: 'showToolbar' });
        };
        this.hideToolbar = () => {
            this.roomSettings.showToolbar = false;
            this.stored.roomState.layout.showToolbar = false;
            this.sendMessage({ type: 'hideToolbar' });
        };
        this.changeLayoutMode = (mode) => {
            this.roomSettings.layoutMode = mode;
            this.sendMessage({ type: 'changeLayoutMode', data: mode });
        };
        this.leaveSession = () => {
            this.sendMessage({ type: 'leaveSession' });
        };
        this.endSession = () => {
            this.sendMessage({ type: 'endSession' });
        };
        this.toggleToolbar = (show) => {
            if (typeof show === 'undefined') {
                this.stored.roomState.layout.showToolbar = !this.stored.roomState.layout.showToolbar;
                this.sendMessage({ type: 'toggleToolbar' });
            }
            else if (show) {
                this.showToolbar();
            }
            else {
                this.hideToolbar();
            }
        };
        this.requestToggleAudio = (userId, shouldMute) => {
            if (typeof shouldMute === 'undefined') {
                this.sendMessage({ type: 'requestToggleAudio', data: userId });
            }
            else if (shouldMute) {
                this.requestMute(userId);
            }
            else {
                this.requestUnmute(userId);
            }
        };
        this.requestMute = (userId) => {
            this.sendMessage({ type: 'requestMute', data: userId });
        };
        this.requestUnmute = (userId) => {
            this.sendMessage({ type: 'requestUnmute', data: userId });
        };
        this.removeUser = (userId) => {
            this.sendMessage({ type: 'removeUser', data: userId });
        };
        this.listUsers = () => Object.values(this.stored.users);
        this.getUser = (userId) => { var _b; return (_b = this.stored.users) === null || _b === void 0 ? void 0 : _b[userId]; };
        this.showCaptions = () => {
            this.roomSettings.showCaptions = true;
            this.sendMessage({ type: 'showCaptions' });
        };
        this.hideCaptions = () => {
            this.roomSettings.showCaptions = false;
            this.sendMessage({ type: 'hideCaptions' });
        };
        this.toggleCaptions = (show) => {
            if (typeof show === 'undefined') {
                this.sendMessage({ type: 'toggleCaptions' });
            }
            else if (show) {
                this.showCaptions();
            }
            else {
                this.hideCaptions();
            }
        };
        this.configureCaptions = (options) => {
            this.sendMessage({ type: 'configureCaptions', data: options || {} });
        };
        this.raiseHand = () => {
            this.sendMessage({ type: 'raiseHand' });
        };
        this.lowerHand = (target) => {
            this.sendMessage({ type: 'lowerHand', data: target });
        };
        this.allowBroadcast = (userId) => {
            this.sendMessage({ type: 'allowBroadcast', data: userId });
        };
        this.disallowBroadcast = (userId) => {
            this.sendMessage({ type: 'disallowBroadcast', data: userId });
        };
        this.allowScreenshare = (userId) => {
            this.sendMessage({ type: 'allowScreenshare', data: userId });
        };
        this.disallowScreenshare = (userId) => {
            this.sendMessage({ type: 'disallowScreenshare', data: userId });
        };
        this.configureVirtualBackground = (options) => {
            this.roomSettings.virtualBackground = options;
            const optionsToState = {
                enabled: true,
                type: undefined,
                value: '',
                enforced: options.enforce,
            };
            const vbOptions = ['blur', 'image', 'imageUrl'];
            vbOptions.forEach((value) => {
                if (options[value]) {
                    optionsToState.type = value;
                    optionsToState.value = options[value];
                }
            });
            this.sendMessage({ type: 'configureVirtualBackground', data: options || {} });
        };
        this.enableVirtualBackground = (options) => this.configureVirtualBackground(options);
        this.disableVirtualBackground = () => {
            this.roomSettings.virtualBackground = undefined;
            this.sendMessage({ type: 'disableVirtualBackground' });
        };
        if (!window.isSecureContext) {
            this.logError(errors_1.INSECURE_CONTEXT);
        }
        this.initOptions = options;
        this.roomSettings = options.roomSettings || {};
        this.reportErrors = instanceProperties.reportErrors || false;
        this.frame.allow = 'camera; microphone; display-capture; autoplay;';
        this.frame.setAttribute('allowFullscreen', 'true');
        this.mountFrame(loadImmediately);
        if (loadImmediately) {
            this.load(instanceProperties);
        }
        else {
            this.frame.style.display = 'none';
        }
        window.addEventListener('message', this.onMessage);
        this.setupInternalEventListeners();
    }
    checkTarget() {
        this.sendMessage({ type: 'connect', data: this.roomSettings || {} });
        const confirmationTimeout = window.setTimeout(() => {
            this.logError(errors_1.UNKNOWN_TARGET);
        }, vars_1.CONNECT_TIMEOUT);
        this.on('connected', () => {
            this.connected = true;
            clearTimeout(confirmationTimeout);
        });
    }
    sendMessage(message) {
        if (this.frame.contentWindow) {
            if (!this.connected && message.type !== 'connect') {
                return;
            }
            this.frame.contentWindow.postMessage(message, {
                targetOrigin: this.allowedOrigin,
            });
        }
    }
    // getters
    get roomState() {
        return this.stored.roomState;
    }
    get localUser() {
        return this.stored.users[this.stored.userId];
    }
}
exports.DigitalSambaEmbedded = DigitalSambaEmbedded;
_a = DigitalSambaEmbedded;
DigitalSambaEmbedded.createControl = (initOptions) => new _a(initOptions, {}, false);
exports.default = DigitalSambaEmbedded;
