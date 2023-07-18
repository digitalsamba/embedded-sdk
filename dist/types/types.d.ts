import { PermissionsMap } from './utils/PermissionManager/types';
import { LayoutMode, PermissionTypes } from './utils/vars';
export type FeatureFlag = 'languageSelection' | 'screenshare' | 'participantsList' | 'chat' | 'qa' | 'contentLibrary' | 'whiteboard' | 'pin' | 'fullScreen' | 'minimizeOwnTile' | 'endSession' | 'recordings' | 'captions' | 'virtualBackgrounds' | 'raiseHand' | 'invite';
export type FeatureSet = Record<FeatureFlag, boolean>;
export interface InitialRoomSettings {
    videoEnabled: boolean;
    audioEnabled: boolean;
    username: string;
    layoutMode: LayoutMode;
    showToolbar: boolean;
    showCaptions: boolean;
    virtualBackground: VirtualBackgroundOptions;
    muteFrame: boolean;
}
export type InitOptions = {
    root: HTMLElement;
    frame: HTMLIFrameElement;
    url: string;
    team: string;
    room: string;
    token?: string;
    roomSettings?: Partial<InitialRoomSettings>;
};
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
export type SendMessageType = 'connect' | 'enableVideo' | 'enableAudio' | 'disableVideo' | 'disableAudio' | 'toggleVideo' | 'toggleAudio' | 'startScreenshare' | 'stopScreenshare' | 'startRecording' | 'stopRecording' | 'showToolbar' | 'hideToolbar' | 'toggleToolbar' | 'changeLayoutMode' | 'leaveSession' | 'endSession' | 'requestToggleAudio' | 'requestMute' | 'requestUnmute' | 'removeUser' | 'showCaptions' | 'hideCaptions' | 'toggleCaptions' | 'configureCaptions' | 'raiseHand' | 'lowerHand' | 'allowBroadcast' | 'disallowBroadcast' | 'allowScreenshare' | 'disallowScreenshare' | 'configureVirtualBackground' | 'disableVirtualBackground' | 'muteFrame' | 'unmuteFrame' | 'toggleMuteFrame' | 'changeToolbarPosition' | 'changeBrandingOptions';
export type ReceiveMessageType = 'connected' | 'frameLoaded' | 'userJoined' | 'usersUpdated' | 'userLeft' | 'roomJoined' | 'videoEnabled' | 'videoDisabled' | 'audioEnabled' | 'audioDisabled' | 'screenshareStarted' | 'screenshareStopped' | 'recordingStarted' | 'recordingStopped' | 'recordingFailed' | 'layoutModeChanged' | 'activeSpeakerChanged' | 'appError' | 'captionsEnabled' | 'captionsDisabled' | 'captionsSpokenLanguageChanged' | 'captionsFontSizeChanged' | 'permissionsChanged' | 'handRaised' | 'handLowered' | 'virtualBackgroundChanged' | 'virtualBackgroundDisabled' | 'roomStateUpdated';
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
export type UserId = string;
export interface User {
    avatarColor: string;
    id: UserId;
    name: string;
    role: string;
    kind: 'local' | 'remote';
    dynamicPermissions: PermissionTypes[] | undefined;
}
export type CaptionsSpokenLanguage = 'zh' | 'zh-CN' | 'zh-TW' | 'da' | 'nl' | 'en' | 'en-AU' | 'en-GB' | 'en-IN' | 'en-NZ' | 'en-US' | 'fr' | 'fr-CA' | 'de' | 'hi' | 'hi-Latn' | 'id' | 'it' | 'ja' | 'ko' | 'no' | 'pl' | 'pt' | 'pt-BR' | 'pt-PT' | 'ru' | 'es' | 'es-419' | 'sv' | 'ta' | 'tr' | 'uk';
type CaptionsFontSize = 'small' | 'medium' | 'large';
export interface CaptionsOptions {
    spokenLanguage: CaptionsSpokenLanguage;
    fontSize: CaptionsFontSize;
}
export interface VirtualBackgroundOptions {
    enforce?: boolean;
    blur?: 'balanced' | 'strong';
    image?: string;
    imageUrl?: string;
}
export type UsersList = Record<UserId, User>;
export interface StoredVBState {
    enabled: boolean;
    enforced?: boolean;
    type?: 'blur' | 'image' | 'imageUrl';
    value?: string | {
        src: string;
        thumb: string;
        alt: string;
    };
}
export interface BrandingOptionsConfig {
    paletteMode: 'dark' | 'light';
    primaryColor: string;
    toolbarColor: string;
    roomBackgroundColor: string;
}
export interface RoomState {
    frameMuted: boolean;
    media: {
        videoEnabled: boolean;
        audioEnabled: boolean;
    };
    layout: {
        mode: LayoutMode;
        showToolbar: boolean;
        toolbarPosition: 'left' | 'right' | 'bottom';
    };
    captionsState: {
        showCaptions: boolean;
    } & CaptionsOptions;
    virtualBackground: StoredVBState;
}
export interface Stored {
    userId: UserId;
    users: UsersList;
    activeSpeaker?: UserId;
    roomState: RoomState;
    features: FeatureSet;
}
export type RoomJoinedPayload = Stored & {
    permissionsMap: PermissionsMap;
};
export interface EmbeddedInstance {
    initOptions: Partial<InitOptions>;
    roomSettings: Partial<InitialRoomSettings>;
    savedIframeSrc: string;
    allowedOrigin: string;
    connected: boolean;
    frame: HTMLIFrameElement;
    reportErrors: boolean;
    stored: Stored;
    enableVideo: () => void;
    disableVideo: () => void;
    toggleVideo: (enable?: boolean) => void;
    enableAudio: () => void;
    disableAudio: () => void;
    toggleAudio: (enable?: boolean) => void;
    startScreenshare: () => void;
    stopScreenshare: () => void;
    startRecording: () => void;
    stopRecording: () => void;
    showToolbar: () => void;
    hideToolbar: () => void;
    changeLayoutMode: (mode: LayoutMode) => void;
    leaveSession: () => void;
    endSession: () => void;
    toggleToolbar: (show?: boolean) => void;
    requestToggleAudio: (userId: UserId, shouldMute?: boolean) => void;
    requestMute: (userId: UserId) => void;
    requestUnmute: (userId: UserId) => void;
    removeUser: (userId: UserId) => void;
    listUsers: () => User[];
    get roomState(): RoomState;
    get localUser(): User;
    showCaptions: () => void;
    hideCaptions: () => void;
    toggleCaptions: (show?: boolean) => void;
    configureCaptions: (options: Partial<CaptionsOptions>) => void;
    raiseHand: () => void;
    lowerHand: (target?: UserId) => void;
    allowBroadcast: (userId: UserId) => void;
    disallowBroadcast: (userId: UserId) => void;
    allowScreenshare: (userId: UserId) => void;
    disallowScreenshare: (userId: UserId) => void;
}
export {};
