import EventEmitter from 'events';
import { PermissionManager } from './utils/PermissionManager';
import {
  CONNECT_TIMEOUT,
  defaultStoredState,
  internalEvents,
  LayoutMode,
  PermissionTypes,
} from './utils/vars';
import { createWatchedProxy } from './utils/proxy';
import {
  CaptionsOptions,
  EmbeddedInstance,
  InitialRoomSettings,
  InitOptions,
  InstanceProperties,
  ReceiveMessage,
  RoomJoinedPayload,
  SendMessage,
  Stored,
  StoredVBState,
  UserId,
  VirtualBackgroundOptions,
} from './types';

import {
  ALLOW_ATTRIBUTE_MISSING,
  INVALID_CONFIG,
  INVALID_URL,
  RichError,
  UNKNOWN_TARGET,
} from './utils/errors';

export class DigitalSambaEmbedded extends EventEmitter implements EmbeddedInstance {
  initOptions: Partial<InitOptions>;
  roomSettings: Partial<InitialRoomSettings> = {};

  savedIframeSrc: string = '';

  allowedOrigin: string = '*';

  connected: boolean = false;

  frame: HTMLIFrameElement = document.createElement('iframe');

  reportErrors: boolean = false;

  stored: Stored = { ...defaultStoredState };

  permissionManager = new PermissionManager(this);

  constructor(
    options: Partial<InitOptions> = {},
    instanceProperties: Partial<InstanceProperties> = {},
    loadImmediately = true
  ) {
    super();

    this.initOptions = options;
    this.roomSettings = options.roomSettings || {};

    this.reportErrors = instanceProperties.reportErrors || false;

    this.frame.allow = 'camera; microphone; display-capture; autoplay;';
    this.frame.setAttribute('allowFullscreen', 'true');

    this.mountFrame(loadImmediately);

    if (loadImmediately) {
      this.load(instanceProperties);
    } else {
      this.frame.style.display = 'none';
    }

    window.addEventListener('message', this.onMessage);

    this.setupInternalEventListeners();
  }

  static createControl = (initOptions: Partial<InitOptions>) => new this(initOptions, {}, false);

  private mountFrame = (loadImmediately: boolean) => {
    const { url, frame, root } = this.initOptions;

    if (root) {
      root.appendChild(this.frame);
    } else if (frame) {
      this.frame = frame;

      if (!frame.allow) {
        this.logError(ALLOW_ATTRIBUTE_MISSING);
      }
    } else {
      document.body.appendChild(this.frame);
    }

    if (url || (this.frame.src && this.frame.src !== window.location.href)) {
      try {
        const frameSrc = new URL(url || this.frame.src).toString();

        this.frame.src = frameSrc;
        this.savedIframeSrc = frameSrc;
      } catch {
        this.logError(INVALID_URL);
      }
    }

    if (!loadImmediately) {
      this.savedIframeSrc = this.frame.src;
      this.frame.src = '';
    }
  };

  load = (instanceProperties: InstanceProperties = {}) => {
    this.reportErrors = instanceProperties.reportErrors || false;

    this.setFrameSrc();

    this.applyFrameProperties(instanceProperties);

    this.frame.style.display = 'block';
  };

  private onMessage = (event: MessageEvent<ReceiveMessage>) => {
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
      } else {
        this._emit(message.type, message);
      }
    }
  };

  private setupInternalEventListeners = () => {
    this.on('userJoined', (event) => {
      const { user, type } = event.data;

      this.stored.users[user.id] = {
        ...user,
        kind: type,
      };

      if (type === 'local') {
        this.stored.userId = user.id;
      }

      this.emitUsersUpdated();
    });

    this.on('userLeft', (event) => {
      if (event.data?.user?.id) {
        delete this.stored.users[event.data.user.id];
      }

      this.emitUsersUpdated();
    });

    this.on('permissionsChanged', (event) => {
      if (this.stored.users[this.stored.userId]) {
        let modifiedPermissions: string[] = [
          ...(this.stored.users[this.stored.userId].dynamicPermissions || []),
        ];

        Object.entries<boolean>(event.data).forEach(([permission, enabled]) => {
          if (enabled && !modifiedPermissions.includes(permission)) {
            modifiedPermissions.push(permission);
          }

          if (!enabled) {
            modifiedPermissions = modifiedPermissions.filter(
              (userPermission) => userPermission !== permission
            );
          }
        });

        this.stored.users[this.stored.userId].dynamicPermissions =
          modifiedPermissions as PermissionTypes[];
      }
    });

    this.on('activeSpeakerChanged', (event) => {
      this.stored.activeSpeaker = event.data?.user?.id;
    });

    this.on('videoEnabled', (event) => {
      if (event.data?.type === 'local') {
        this.stored.roomState.media.videoEnabled = true;
      }
    });

    this.on('videoDisabled', (event) => {
      if (event.data?.type === 'local') {
        this.stored.roomState.media.videoEnabled = false;
      }
    });

    this.on('audioEnabled', (event) => {
      if (event.data?.type === 'local') {
        this.stored.roomState.media.audioEnabled = true;
      }
    });

    this.on('audioDisabled', (event) => {
      if (event.data?.type === 'local') {
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

  private _emit = (eventName: string | symbol, ...args: any[]) => {
    this.emit('*', ...args);

    return this.emit(eventName, ...args);
  };

  private handleInternalMessage = (event: ReceiveMessage) => {
    const message = event.DSPayload;

    switch (message.type) {
      case 'roomJoined': {
        const { users, roomState, activeSpeaker, permissionsMap } =
          message.data as RoomJoinedPayload;

        this.stored.users = { ...this.stored.users, ...users };
        this.stored.roomState = createWatchedProxy({ ...roomState }, this.emitRoomStateUpdated);
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

  private emitUsersUpdated = () => {
    this._emit('usersUpdated', { type: 'usersUpdated', data: { users: this.listUsers() } });
  };

  private emitRoomStateUpdated = () => {
    this._emit('roomStateUpdated', { type: 'roomStateUpdated', data: { state: this.roomState } });
  };

  private setFrameSrc = () => {
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
    } else {
      this.logError(INVALID_CONFIG);

      return;
    }

    const allowedURL = new URL(this.frame.src);

    this.allowedOrigin = allowedURL.origin;

    this.frame.onload = () => {
      this._emit('frameLoaded', { type: 'frameLoaded' });
      this.checkTarget();
    };
  };

  private checkTarget() {
    this.sendMessage({ type: 'connect', data: this.roomSettings || {} });

    const confirmationTimeout = window.setTimeout(() => {
      this.logError(UNKNOWN_TARGET);
    }, CONNECT_TIMEOUT);

    this.on('connected', () => {
      this.connected = true;
      clearTimeout(confirmationTimeout);
    });
  }

  private sendMessage<G>(message: SendMessage<G>) {
    if (this.frame.contentWindow) {
      if (!this.connected && message.type !== 'connect') {
        return;
      }

      this.frame.contentWindow.postMessage(message, {
        targetOrigin: this.allowedOrigin,
      });
    }
  }

  private logError = (error: RichError) => {
    if (this.reportErrors) {
      throw error;
    }
  };

  private applyFrameProperties = (instanceProperties: Partial<InstanceProperties>) => {
    if (instanceProperties.frameAttributes) {
      // TODO: only allow specific attrs here; This is a heck to support
      Object.entries(instanceProperties.frameAttributes).forEach(([attr, value]) => {
        if (value !== null && typeof value !== 'undefined') {
          this.frame.setAttribute(attr, value.toString());
        } else {
          this.frame.removeAttribute(attr);
        }
      });
    }

    if (instanceProperties.reportErrors) {
      this.reportErrors = true;
    }
  };

  // getters
  get roomState() {
    return this.stored.roomState;
  }

  get localUser() {
    return this.stored.users[this.stored.userId];
  }

  // commands
  enableVideo = () => {
    this.roomSettings.videoEnabled = true;

    this.sendMessage({ type: 'enableVideo' });
  };

  disableVideo = () => {
    this.roomSettings.videoEnabled = false;

    this.sendMessage({ type: 'disableVideo' });
  };

  toggleVideo = (enable?: boolean) => {
    if (typeof enable === 'undefined') {
      this.sendMessage({ type: 'toggleVideo' });
    } else if (enable) {
      this.enableVideo();
    } else {
      this.disableVideo();
    }
  };

  enableAudio = () => {
    this.roomSettings.audioEnabled = true;
    this.sendMessage({ type: 'enableAudio' });
  };

  disableAudio = () => {
    this.roomSettings.audioEnabled = false;
    this.sendMessage({ type: 'disableAudio' });
  };

  toggleAudio = (enable?: boolean) => {
    if (typeof enable === 'undefined') {
      this.sendMessage({ type: 'toggleAudio' });
    } else if (enable) {
      this.enableAudio();
    } else {
      this.disableAudio();
    }
  };

  startScreenshare = () => {
    this.sendMessage({ type: 'startScreenshare' });
  };

  stopScreenshare = () => {
    this.sendMessage({ type: 'stopScreenshare' });
  };

  startRecording = () => {
    this.sendMessage({ type: 'startRecording' });
  };

  stopRecording = () => {
    this.sendMessage({ type: 'stopRecording' });
  };

  showToolbar = () => {
    this.roomSettings.showToolbar = true;
    this.stored.roomState.layout.showToolbar = true;
    this.sendMessage({ type: 'showToolbar' });
  };

  hideToolbar = () => {
    this.roomSettings.showToolbar = false;
    this.stored.roomState.layout.showToolbar = false;
    this.sendMessage({ type: 'hideToolbar' });
  };

  changeLayoutMode = (mode: LayoutMode) => {
    this.roomSettings.layoutMode = mode;

    this.sendMessage({ type: 'changeLayoutMode', data: mode });
  };

  leaveSession = () => {
    this.sendMessage({ type: 'leaveSession' });
  };

  endSession = () => {
    this.sendMessage({ type: 'endSession' });
  };

  toggleToolbar = (show?: boolean) => {
    if (typeof show === 'undefined') {
      this.stored.roomState.layout.showToolbar = !this.stored.roomState.layout.showToolbar;
      this.sendMessage({ type: 'toggleToolbar' });
    } else if (show) {
      this.showToolbar();
    } else {
      this.hideToolbar();
    }
  };

  requestToggleAudio = (userId: UserId, shouldMute?: boolean) => {
    if (typeof shouldMute === 'undefined') {
      this.sendMessage({ type: 'requestToggleAudio', data: userId });
    } else if (shouldMute) {
      this.requestMute(userId);
    } else {
      this.requestUnmute(userId);
    }
  };

  requestMute = (userId: UserId) => {
    this.sendMessage({ type: 'requestMute', data: userId });
  };

  requestUnmute = (userId: UserId) => {
    this.sendMessage({ type: 'requestUnmute', data: userId });
  };

  removeUser = (userId: UserId) => {
    this.sendMessage({ type: 'removeUser', data: userId });
  };

  listUsers = () => Object.values(this.stored.users);

  getUser = (userId: UserId) => this.stored.users?.[userId];

  showCaptions = () => {
    this.roomSettings.showCaptions = true;
    this.sendMessage({ type: 'showCaptions' });
  };

  hideCaptions = () => {
    this.roomSettings.showCaptions = false;
    this.sendMessage({ type: 'hideCaptions' });
  };

  toggleCaptions = (show?: boolean) => {
    if (typeof show === 'undefined') {
      this.sendMessage({ type: 'toggleCaptions' });
    } else if (show) {
      this.showCaptions();
    } else {
      this.hideCaptions();
    }
  };
  configureCaptions = (options: Partial<CaptionsOptions>) => {
    this.sendMessage({ type: 'configureCaptions', data: options || {} });
  };

  raiseHand = () => {
    this.sendMessage({ type: 'raiseHand' });
  };

  lowerHand = (target?: UserId) => {
    this.sendMessage({ type: 'lowerHand', data: target });
  };

  allowBroadcast = (userId: UserId) => {
    this.sendMessage({ type: 'allowBroadcast', data: userId });
  };

  disallowBroadcast = (userId: UserId) => {
    this.sendMessage({ type: 'disallowBroadcast', data: userId });
  };

  allowScreenshare = (userId: UserId) => {
    this.sendMessage({ type: 'allowScreenshare', data: userId });
  };

  disallowScreenshare = (userId: UserId) => {
    this.sendMessage({ type: 'disallowScreenshare', data: userId });
  };

  configureVirtualBackground = (options: VirtualBackgroundOptions) => {
    this.roomSettings.virtualBackground = options;
    const optionsToState: StoredVBState = {
      enabled: true,
      type: undefined,
      value: '',
      enforced: options.enforce,
    };

    const vbOptions: ('blur' | 'image' | 'imageUrl')[] = ['blur', 'image', 'imageUrl'];

    vbOptions.forEach((value) => {
      if (options[value]) {
        optionsToState.type = value;
        optionsToState.value = options[value]!;
      }
    });

    this.sendMessage({ type: 'configureVirtualBackground', data: options || {} });
  };

  enableVirtualBackground = (options: VirtualBackgroundOptions) =>
    this.configureVirtualBackground(options);

  disableVirtualBackground = () => {
    this.roomSettings.virtualBackground = undefined;

    this.sendMessage({ type: 'disableVirtualBackground' });
  };
}

export default DigitalSambaEmbedded;
