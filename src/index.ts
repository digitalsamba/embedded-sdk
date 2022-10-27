import {
  ALLOW_ATTRIBUTE_MISSING,
  INVALID_CONFIG,
  INVALID_URL,
  RichError,
  UNKNOWN_TARGET,
} from "./utils/errors";

export interface InitOptions {
  root: HTMLElement;
  frame: HTMLIFrameElement;

  url: string;
  team: string;
  room: string;
  token?: string;
}

export type FrameAttributes = {
  align: string;
  allow: string;
  allowFullscreen: boolean;
  frameBorder: string;
  height: string;
  longDesc: string;
  marginHeight: string;
  marginWidth: string;
  name: string;
  referrerPolicy: ReferrerPolicy;
  scrolling: string;
  src: string;
  srcdoc: string;
  width: string;
} & HTMLElement;

export interface InstanceProperties {
  frameAttributes?: Partial<FrameAttributes>;
  reportErrors?: boolean;
}

const CONNECT_TIMEOUT = 5000;

export type SendMessageType =
  | "connect"
  | "enableVideo"
  | "enableAudio"
  | "disableVideo"
  | "disableAudio"
  | "toggleVideo"
  | "toggleAudio"
  | "startScreenshare"
  | "stopScreenshare";

export type ReceiveMessageType =
  | "connected"
  | "userJoined"
  | "userLeft"
  | "videoEnabled"
  | "videoDisabled"
  | "audioEnabled"
  | "audioDisabled"
  | "screenshareStarted"
  | "screenshareStopped";

export interface SendMessage<P> {
  type: SendMessageType;
  payload?: P;
}

export interface ReceiveMessage {
  type: ReceiveMessageType;
  payload: unknown;
}

function isFunction(func: any): func is (payload: any) => void {
  return func instanceof Function;
}

export class DigitalSambaEmbedded {
  initOptions: Partial<InitOptions>;

  savedIframeSrc: string = "";

  allowedOrigin: string = "*";

  connected: boolean = false;

  frame: HTMLIFrameElement = document.createElement("iframe");

  eventHandlers: Partial<
    Record<ReceiveMessageType | "*", (payload: any) => void>
  > = {};

  reportErrors: boolean = false;

  constructor(
    options: Partial<InitOptions> = {},
    instanceProperties: Partial<InstanceProperties> = {},
    loadImmediately = true
  ) {
    this.initOptions = options;

    this.frame.allow = "camera; microphone; display-capture; autoplay;";
    this.frame.setAttribute("allowFullscreen", "true");

    this.mountFrame(loadImmediately);

    if (loadImmediately) {
      this.load(instanceProperties);
    } else {
      this.frame.style.display = "none";
    }

    window.addEventListener("message", this.onMessage);
  }

  static createControl = (initOptions: InitOptions) => {
    return new this(initOptions, {}, false);
  };

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

    if (url) {
      try {
        const frameSrc = new URL(url).toString();

        this.frame.src = frameSrc;
        this.savedIframeSrc = frameSrc;
      } catch {
        this.logError(INVALID_URL);
      }
    }

    if (!loadImmediately) {
      this.savedIframeSrc = this.frame.src;
      this.frame.src = "";
    }
  };

  load = (instanceProperties: InstanceProperties = {}) => {
    this.reportErrors = instanceProperties.reportErrors || false;

    this.setFrameSrc();

    this.applyFrameProperties(instanceProperties);

    this.frame.style.display = "block";
  };

  on = (type: ReceiveMessageType, handler: (payload: any) => void) => {
    this.eventHandlers[type] = handler;
  };

  private onMessage = (event: MessageEvent<ReceiveMessage>) => {
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

  private setFrameSrc = () => {
    let url = this.savedIframeSrc;
    const { team, room, token } = this.initOptions;

    if (team && room) {
      url = `https://${team}.digitalsamba.com/${room}`;
      if (token) {
        const params = new URLSearchParams({ token });

        url = `${url}?${params}`;
      }

      this.frame.src = url;
    } else {
      this.logError(INVALID_CONFIG);
      return;
    }

    const allowedURL = new URL(this.frame.src);

    this.allowedOrigin = allowedURL.origin;

    this.frame.onload = () => this.checkTarget();
  };

  private checkTarget() {
    this.sendMessage({ type: "connect" });

    const confirmationTimeout = window.setTimeout(() => {
      this.logError(UNKNOWN_TARGET);
    }, CONNECT_TIMEOUT);

    this.on("connected", () => {
      this.connected = true;
      clearTimeout(confirmationTimeout);
    });
  }

  private sendMessage<G>(message: SendMessage<G>) {
    if (this.frame.contentWindow) {
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

  private applyFrameProperties = (
    instanceProperties: Partial<InstanceProperties>
  ) => {
    if (instanceProperties.frameAttributes) {
      // TODO: only allow specific attrs here; This is a heck to support
      Object.entries(instanceProperties.frameAttributes).forEach(
        ([attr, value]) => {
          if (value !== null && typeof value !== "undefined") {
            this.frame.setAttribute(attr, value.toString());
          } else {
            this.frame.removeAttribute(attr);
          }
        }
      );
    }

    if (instanceProperties.reportErrors) {
      this.reportErrors = true;
    }
  };

  // commands
  enableVideo = () => {
    this.sendMessage({ type: "enableVideo" });
  };

  disableVideo = () => {
    this.sendMessage({ type: "disableVideo" });
  };

  toggleVideo = (enable?: boolean) => {
    if (typeof enable === "undefined") {
      this.sendMessage({ type: "toggleVideo" });
    } else {
      if (enable) {
        this.enableVideo();
      } else {
        this.disableVideo();
      }
    }
  };

  enableAudio = () => {
    this.sendMessage({ type: "enableAudio" });
  };

  disableAudio = () => {
    this.sendMessage({ type: "disableAudio" });
  };

  toggleAudio = (enable?: boolean) => {
    if (typeof enable === "undefined") {
      this.sendMessage({ type: "toggleAudio" });
    } else {
      if (enable) {
        this.enableAudio();
      } else {
        this.disableAudio();
      }
    }
  };

  startScreenshare = () => {
    this.sendMessage({ type: "startScreenshare" });
  };

  stopScreenshare = () => {
    this.sendMessage({ type: "stopScreenshare" });
  };
}
