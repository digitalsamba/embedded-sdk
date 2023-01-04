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

export type SendMessageType =
  | "connect"
  | "enableVideo"
  | "enableAudio"
  | "disableVideo"
  | "disableAudio"
  | "toggleVideo"
  | "toggleAudio"
  | "startScreenshare"
  | "stopScreenshare"
  | "startRecording"
  | "stopRecording"
  | "showToolbar"
  | "hideToolbar"
  | "toggleToolbar"
  | "changeLayoutMode";

export type ReceiveMessageType =
  | "connected"
  | "userJoined"
  | "userLeft"
  | "videoEnabled"
  | "videoDisabled"
  | "audioEnabled"
  | "audioDisabled"
  | "screenshareStarted"
  | "screenshareStopped"
  | "recordingStarted"
  | "recordingStopped"
  | "recordingFailed"
  | "layoutModeChanged"
  | "activeSpeakerChanged";

export interface SendMessage<D> {
  type: SendMessageType;
  data?: D;
}

export interface ReceiveMessage {
  type: ReceiveMessageType;
  payload: unknown;
}

export enum LayoutMode {
  tiled = "tiled",
  auto = "auto",
}
