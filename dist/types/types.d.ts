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
export declare type SendMessageType = "connect" | "enableVideo" | "enableAudio" | "disableVideo" | "disableAudio" | "toggleVideo" | "toggleAudio" | "startScreenshare" | "stopScreenshare" | "startRecording" | "stopRecording" | "showToolbar" | "hideToolbar" | "toggleToolbar";
export declare type ReceiveMessageType = "connected" | "userJoined" | "userLeft" | "videoEnabled" | "videoDisabled" | "audioEnabled" | "audioDisabled" | "screenshareStarted" | "screenshareStopped" | "recordingStarted" | "recordingStopped" | "recordingFailed";
export interface SendMessage<P> {
    type: SendMessageType;
    payload?: P;
}
export interface ReceiveMessage {
    type: ReceiveMessageType;
    payload: unknown;
}
