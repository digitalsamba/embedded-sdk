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
  | 'connect'
  | 'enableVideo'
  | 'enableAudio'
  | 'disableVideo'
  | 'disableAudio'
  | 'toggleVideo'
  | 'toggleAudio'
  | 'startScreenshare'
  | 'stopScreenshare'
  | 'startRecording'
  | 'stopRecording'
  | 'showToolbar'
  | 'hideToolbar'
  | 'toggleToolbar'
  | 'changeLayoutMode'
  | 'leaveSession'
  | 'endSession'
  | 'requestToggleAudio'
  | 'requestMute'
  | 'requestUnmute'
  | 'removeUser';

export type ReceiveMessageType =
  | 'connected'
  | 'userJoined'
  | 'userLeft'
  | 'roomJoined'
  | 'videoEnabled'
  | 'videoDisabled'
  | 'audioEnabled'
  | 'audioDisabled'
  | 'screenshareStarted'
  | 'screenshareStopped'
  | 'recordingStarted'
  | 'recordingStopped'
  | 'recordingFailed'
  | 'layoutModeChanged'
  | 'activeSpeakerChanged'
  | 'appError';

export interface SendMessage<D> {
  type: SendMessageType;
  data?: D;
}

export interface ReceiveMessage {
  DSPayload: {
    type: ReceiveMessageType;
    data: unknown;
  };
}

export enum LayoutMode {
  tiled = 'tiled',
  auto = 'auto',
}

export type UserId = string;

export interface User {
  avatarColor: string;
  id: UserId;
  name: string;
  role: string;
  kind: 'local' | 'remote';
}

export type UsersList = Record<UserId, User>;

export interface Stored {
  users: UsersList;
}
