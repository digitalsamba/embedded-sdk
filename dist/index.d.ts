declare const INVALID_CONFIG = "Initializations options are invalid. Missing team name or room ID";
interface InitOptions {
    root: HTMLElement;
    frame: HTMLIFrameElement;
    url: string;
    team: string;
    room: string;
    token?: string;
}
declare type FrameAttributes = {
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
interface InstanceProperties {
    frameAttributes?: Partial<FrameAttributes>;
    reportErrors?: boolean;
}
declare const CONNECT_TIMEOUT = 5000;
declare type SendMessageType = "connect" | "enableVideo" | "enableAudio" | "disableVideo" | "disableAudio" | "toggleVideo" | "toggleAudio";
declare type ReceiveMessageType = "connected" | "userJoined" | "userLeft" | "videoEnabled" | "videoDisabled" | "audioEnabled" | "audioDisabled";
interface SendMessage<P> {
    type: SendMessageType;
    payload?: P;
}
interface ReceiveMessage {
    type: ReceiveMessageType;
    payload: unknown;
}
declare function isFunction(func: any): func is (payload: any) => void;
declare class DigitalSambaEmbedded {
    initOptions: Partial<InitOptions>;
    savedIframeSrc: string;
    allowedOrigin: string;
    connected: boolean;
    frame: HTMLIFrameElement;
    eventHandlers: Partial<Record<ReceiveMessageType | "*", (payload: any) => void>>;
    reportErrors: boolean;
    constructor(options?: Partial<InitOptions>, instanceProperties?: Partial<InstanceProperties>, loadImmediately?: boolean);
    static createControl: (initOptions: InitOptions) => DigitalSambaEmbedded;
    private mountFrame;
    load: (instanceProperties?: InstanceProperties) => void;
    on: (type: ReceiveMessageType, handler: (payload: any) => void) => void;
    enableVideo: () => void;
    disableVideo: () => void;
    toggleVideo: (enable?: boolean) => void;
    enableAudio: () => void;
    disableAudio: () => void;
    toggleAudio: (enable?: boolean) => void;
    private onMessage;
    private setFrameSrc;
    private checkTarget;
    private sendMessage;
    private logError;
    private applyFrameProperties;
}
