var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import { EventEmitter } from 'events';
import { PermissionManager } from './utils/PermissionManager';
import { CONNECT_TIMEOUT, getDefaultStoredState, internalEvents, } from './utils/vars';
import { createWatchedProxy } from './utils/proxy';
import { ALLOW_ATTRIBUTE_MISSING, INVALID_CONFIG, INVALID_URL, INSECURE_CONTEXT, UNKNOWN_TARGET, } from './utils/errors';
export class DigitalSambaEmbedded extends EventEmitter {
    constructor(options = {}, instanceProperties = {}, loadImmediately = true) {
        super();
        this.roomSettings = {};
        this.savedIframeSrc = '';
        this.allowedOrigin = '*';
        this.connected = false;
        this.frame = document.createElement('iframe');
        this.reportErrors = false;
        this.permissionManager = new PermissionManager(this);
        this.queuedEventListeners = [];
        this.queuedUICallbacks = [];
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
                    let origString = url || this.frame.src;
                    if (!origString.includes('https://')) {
                        origString = 'https://' + origString;
                    }
                    const frameSrc = new URL(origString).toString();
                    this.frame.src = frameSrc;
                    this.savedIframeSrc = frameSrc;
                }
                catch (_b) {
                    this.logError(INVALID_URL);
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
        this.prepareRoomSettings = (settings) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            (_b = settings.mediaDevices) !== null && _b !== void 0 ? _b : (settings.mediaDevices = {});
            if (settings.mediaDevices) {
                const availabledevices = yield navigator.mediaDevices.enumerateDevices();
                Object.entries(settings.mediaDevices).forEach(([kind, deviceId]) => {
                    const match = availabledevices.find((device) => device.deviceId === deviceId);
                    if (match) {
                        settings.mediaDevices[kind] = match.label;
                    }
                });
            }
            if (settings.appLanguage) {
                this.stored.roomState.appLanguage = settings.appLanguage;
            }
            if (settings.initials) {
                try {
                    settings.initials = settings.initials.trim();
                }
                catch (_c) {
                    settings.initials = undefined;
                }
            }
            this.roomSettings = settings;
        });
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
                if (internalEvents[message.type]) {
                    this.handleInternalMessage(event.data);
                }
                else {
                    this._emit(message.type, message);
                }
            }
        };
        this.addFrameEventListener = (eventName, target, listener) => {
            const customEventName = `frameEvent_${eventName}_${target}`;
            if (this.connected) {
                if (!this.listenerCount(customEventName)) {
                    this.sendMessage({ type: 'connectEventListener', data: { eventName, target } });
                }
            }
            else {
                this.queuedEventListeners.push({
                    operation: 'connectEventListener',
                    event: eventName,
                    target,
                });
            }
            this.on(customEventName, listener);
        };
        this.removeFrameEventListener = (eventName, target, listener) => {
            const customEventName = `frameEvent_${eventName}_${target}`;
            this.off(customEventName, listener);
            if (this.connected) {
                if (!this.listenerCount(eventName)) {
                    this.sendMessage({ type: 'disconnectEventListener', data: { eventName, target } });
                }
            }
            else {
                this.queuedEventListeners.push({
                    operation: 'disconnectEventListener',
                    event: eventName,
                    target,
                });
            }
        };
        this.addUICallback = (name, listener) => {
            const customEventName = `UICallback_${name}`;
            if (this.connected) {
                if (!this.listenerCount(customEventName)) {
                    this.sendMessage({ type: 'connectUICallback', data: { name } });
                }
            }
            else {
                this.queuedUICallbacks.push({
                    operation: 'connectUICallback',
                    name,
                });
            }
            this.on(customEventName, listener);
        };
        this.removeUICallback = (name, listener) => {
            const customEventName = `UICallback_${name}`;
            this.off(customEventName, listener);
            if (this.connected) {
                if (!this.listenerCount(customEventName)) {
                    this.sendMessage({ type: 'disconnectUICallback', data: { name } });
                }
            }
            else {
                this.queuedUICallbacks.push({
                    operation: 'disconnectUICallback',
                    name,
                });
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
            this.on('appLanguageChanged', ({ data, }) => {
                this.stored.roomState.appLanguage = data.language;
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
            this.on('roleChanged', (event) => {
                const { userId, to } = event.data;
                if (this.stored.users[userId]) {
                    this.stored.users[userId].role = to;
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
                const { type, value, enforced, name } = event.data.virtualBackgroundConfig;
                this.stored.roomState.virtualBackground = {
                    enabled: true,
                    type,
                    value,
                    name,
                    enforced,
                };
            });
            this.on('virtualBackgroundDisabled', (event) => {
                this.stored.roomState.virtualBackground = {
                    enabled: false,
                };
            });
            this.on('localTileMinimized', () => {
                this.stored.roomState.layout.localTileMinimized = true;
            });
            this.on('localTileMaximized', () => {
                this.stored.roomState.layout.localTileMinimized = false;
            });
            this.on('userMaximized', ({ data }) => {
                this.stored.roomState.layout.content = {
                    userId: data.userId,
                    type: data.type,
                };
                this.stored.roomState.layout.contentMode = data.mode;
            });
            this.on('userMinimized', () => {
                this.stored.roomState.layout.content = undefined;
                this.stored.roomState.layout.contentMode = undefined;
            });
        };
        this._emit = (eventName, ...args) => {
            this.emit('*', ...args);
            return this.emit(eventName, ...args);
        };
        this.handleInternalMessage = (event) => __awaiter(this, void 0, void 0, function* () {
            const message = event.DSPayload;
            switch (message.type) {
                case 'roomJoined': {
                    const { users, roomState, activeSpeaker, permissionsMap, features } = message.data;
                    this.stored.users = Object.assign(Object.assign({}, this.stored.users), users);
                    this.stored.roomState = createWatchedProxy(Object.assign(Object.assign(Object.assign({}, this.stored.roomState), roomState), { media: Object.assign(Object.assign({}, this.stored.roomState.media), roomState.media) }), this.emitRoomStateUpdated);
                    this.stored.activeSpeaker = activeSpeaker;
                    this.stored.features = createWatchedProxy(Object.assign({}, features), this.emitFeatureSetUpdated);
                    this.permissionManager.permissionsMap = permissionsMap;
                    this.emitUsersUpdated();
                    this.emitFeatureSetUpdated();
                    this.emitRoomStateUpdated();
                    this._emit('roomJoined', { type: 'roomJoined' });
                    break;
                }
                case 'documentEvent': {
                    const { eventName, target, payload } = message.data;
                    const customEventName = `frameEvent_${eventName}_${target}`;
                    this._emit(customEventName, JSON.parse(payload));
                    break;
                }
                case 'UICallback': {
                    const { name } = message.data;
                    const customEventName = `UICallback_${name}`;
                    this._emit(customEventName, {});
                    break;
                }
                case 'internalMediaDeviceChanged': {
                    const data = message.data;
                    const devices = yield navigator.mediaDevices.enumerateDevices();
                    const matchingDevice = devices.find((device) => device.kind === data.kind && device.label === data.label);
                    if (matchingDevice) {
                        const previousDeviceId = this.stored.roomState.media.activeDevices[data.kind];
                        this._emit('mediaDeviceChanged', {
                            type: 'mediaDeviceChanged',
                            data: Object.assign(Object.assign({}, data), { previousDeviceId, deviceId: matchingDevice.deviceId }),
                        });
                        this.stored.roomState.media.activeDevices[data.kind] = matchingDevice.deviceId;
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        });
        this.emitUsersUpdated = () => {
            this._emit('usersUpdated', { type: 'usersUpdated', data: { users: this.listUsers() } });
        };
        this.emitRoomStateUpdated = () => {
            this._emit('roomStateUpdated', { type: 'roomStateUpdated', data: { state: this.roomState } });
        };
        this.emitFeatureSetUpdated = () => {
            this._emit('featureSetUpdated', {
                type: 'featureSetUpdated',
                data: { state: this.stored.features },
            });
        };
        this.setFrameSrc = () => {
            let url = this.savedIframeSrc;
            const { cname, team, room, token } = this.initOptions;
            if (team && room) {
                url = `https://${team}.digitalsamba.com/${room}`;
            }
            if (cname && room) {
                url = `https://${cname}/${room}`;
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
                if (!this.initOptions.url) {
                    this.logError(INVALID_CONFIG);
                }
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
        this.changeToolbarPosition = (side) => {
            this.sendMessage({ type: 'changeToolbarPosition', data: side });
        };
        this.changeBrandingOptions = (brandingOptionsConfig) => {
            this.sendMessage({ type: 'changeBrandingOptions', data: brandingOptionsConfig });
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
        this.muteFrame = () => {
            this.roomSettings.muteFrame = true;
            this.stored.roomState.frameMuted = true;
            this.sendMessage({ type: 'muteFrame' });
        };
        this.unmuteFrame = () => {
            this.roomSettings.muteFrame = false;
            this.stored.roomState.frameMuted = false;
            this.sendMessage({ type: 'unmuteFrame' });
        };
        this.toggleMuteFrame = (mute) => {
            if (typeof mute === 'undefined') {
                this.roomSettings.muteFrame = !this.roomSettings.muteFrame;
                this.stored.roomState.frameMuted = !this.stored.roomState.frameMuted;
                this.sendMessage({ type: 'toggleMuteFrame' });
            }
            else if (mute) {
                this.muteFrame();
            }
            else {
                this.unmuteFrame();
            }
        };
        this.minimizeLocalTile = () => {
            this.sendMessage({ type: 'minimizeLocalTile' });
        };
        this.maximizeLocalTile = () => {
            this.sendMessage({ type: 'maximizeLocalTile' });
        };
        this.pinUser = (userId, tile = 'media') => {
            this.sendMessage({ type: 'pinUser', data: { tile, userId } });
        };
        this.unpinUser = () => {
            this.minimizeContent();
        };
        this.maximizeUser = (userId, tile = 'media') => {
            this.sendMessage({ type: 'maximizeUser', data: { tile, userId } });
        };
        this.minimizeUser = () => {
            this.minimizeContent();
        };
        this.minimizeContent = () => {
            this.sendMessage({ type: 'minimizeContent' });
        };
        this.changeRole = (userId, role) => {
            this.sendMessage({ type: 'changeRole', data: { userId, role } });
        };
        this.stored = getDefaultStoredState();
        this.stored.roomState = createWatchedProxy(Object.assign({}, this.stored.roomState), this.emitRoomStateUpdated);
        if (!window.isSecureContext) {
            this.logError(INSECURE_CONTEXT);
        }
        this.initOptions = options;
        this.prepareRoomSettings(options.roomSettings || {});
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
        return __awaiter(this, void 0, void 0, function* () {
            const payload = Object.assign(Object.assign({}, this.roomSettings), { eventListeners: this.queuedEventListeners, UICallbacks: this.queuedUICallbacks });
            this.sendMessage({ type: 'connect', data: payload });
            const confirmationTimeout = window.setTimeout(() => {
                this.logError(UNKNOWN_TARGET);
            }, CONNECT_TIMEOUT);
            this.on('connected', () => {
                this.connected = true;
                this.queuedEventListeners = [];
                this.queuedUICallbacks = [];
                clearTimeout(confirmationTimeout);
            });
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
    get features() {
        return this.stored.features;
    }
    featureEnabled(feature) {
        return !!this.stored.features[feature];
    }
}
_a = DigitalSambaEmbedded;
DigitalSambaEmbedded.createControl = (initOptions, instanceProperties = {}) => new _a(initOptions, instanceProperties, false);
export default DigitalSambaEmbedded;
