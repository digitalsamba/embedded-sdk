export interface InitOptions {
    root: HTMLElement;
    frame: HTMLIFrameElement;
    url: string;
    team: string;
    room: string;
    token?: string;
}
export declare type FrameAttributes = {
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
export declare type SendMessageType = "connect" | "enableVideo" | "enableAudio" | "disableVideo" | "disableAudio" | "toggleVideo" | "toggleAudio" | "startScreenshare" | "stopScreenshare";
export declare type ReceiveMessageType = "connected" | "userJoined" | "userLeft" | "videoEnabled" | "videoDisabled" | "audioEnabled" | "audioDisabled" | "screenshareStarted" | "screenshareStopped";
export interface SendMessage<P> {
    type: SendMessageType;
    payload?: P;
}
export interface ReceiveMessage {
    type: ReceiveMessageType;
    payload: unknown;
}
export declare class DigitalSambaEmbedded {
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
    private onMessage;
    private setFrameSrc;
    private checkTarget;
    private sendMessage;
    private logError;
    private applyFrameProperties;
    enableVideo: () => void;
    disableVideo: () => void;
    toggleVideo: (enable?: boolean) => void;
    enableAudio: () => void;
    disableAudio: () => void;
    toggleAudio: (enable?: boolean) => void;
    startScreenshare: () => void;
    stopScreenshare: () => void;
}
