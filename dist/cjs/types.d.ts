import { PermissionsMap } from './utils/PermissionManager/types';
import { LayoutMode, PermissionTypes } from './utils/vars';
export type FeatureFlag = 'languageSelection' | 'screenshare' | 'participantsList' | 'chat' | 'qa' | 'contentLibrary' | 'whiteboard' | 'pin' | 'fullScreen' | 'minimizeOwnTile' | 'endSession' | 'recordings' | 'captions' | 'virtualBackgrounds' | 'raiseHand' | 'invite';
export type FeatureSet = Record<FeatureFlag, boolean>;
export interface InitialRoomSettings {
    videoEnabled: boolean;
    audioEnabled: boolean;
    username: string;
    initials: string;
    layoutMode: LayoutMode;
    showToolbar: boolean;
    showCaptions: boolean;
    virtualBackground: VirtualBackgroundOptions;
    appLanguage: string;
    muteFrame: boolean;
    mediaDevices?: Partial<Record<MediaDeviceKind, string>>;
}
export interface QueuedEventListener {
    operation: 'connectEventListener' | 'disconnectEventListener';
    event: string;
    target: string;
}
export interface QueuedUICallback {
    operation: 'connectUICallback' | 'disconnectUICallback';
    name: UICallbackName;
}
export interface ConnectToFramePayload extends Partial<InitialRoomSettings> {
    eventListeners: QueuedEventListener[];
    UICallbacks: QueuedUICallback[];
}
export type InitOptions = {
    root: HTMLElement;
    frame: HTMLIFrameElement;
    url: string;
    cname: string;
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
export type SendMessageType = 'connect' | 'enableVideo' | 'enableAudio' | 'disableVideo' | 'disableAudio' | 'toggleVideo' | 'toggleAudio' | 'startScreenshare' | 'stopScreenshare' | 'startRecording' | 'stopRecording' | 'showToolbar' | 'hideToolbar' | 'toggleToolbar' | 'changeLayoutMode' | 'leaveSession' | 'endSession' | 'requestToggleAudio' | 'requestMute' | 'requestUnmute' | 'removeUser' | 'showCaptions' | 'hideCaptions' | 'toggleCaptions' | 'configureCaptions' | 'raiseHand' | 'lowerHand' | 'allowBroadcast' | 'disallowBroadcast' | 'allowScreenshare' | 'disallowScreenshare' | 'configureVirtualBackground' | 'disableVirtualBackground' | 'muteFrame' | 'unmuteFrame' | 'toggleMuteFrame' | 'changeToolbarPosition' | 'changeBrandingOptions' | 'minimizeLocalTile' | 'maximizeLocalTile' | 'pinUser' | 'maximizeUser' | 'minimizeContent' | 'connectEventListener' | 'disconnectEventListener' | 'connectUICallback' | 'disconnectUICallback' | 'changeRole';
export declare const receiveMessagesTypes: readonly ["connected", "frameLoaded", "userJoined", "usersUpdated", "userLeft", "sessionEnded", "roomJoined", "videoEnabled", "videoDisabled", "audioEnabled", "audioDisabled", "screenshareStarted", "screenshareStopped", "recordingStarted", "recordingStopped", "recordingFailed", "layoutModeChanged", "activeSpeakerChanged", "appError", "captionsEnabled", "captionsDisabled", "captionsSpokenLanguageChanged", "captionsFontSizeChanged", "permissionsChanged", "handRaised", "handLowered", "virtualBackgroundChanged", "virtualBackgroundDisabled", "roomStateUpdated", "localTileMaximized", "localTileMinimized", "userMaximized", "internalMediaDeviceChanged", "mediaPermissionsFailed", "documentEvent", "UICallback", "appLanguageChanged", "roleChanged"];
export type ReceiveMessageType = (typeof receiveMessagesTypes)[number];
export type UICallbackName = 'leaveSession';
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
    name?: string;
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
export type UserTileType = 'media' | 'screenshare';
export type ActiveMediaDevices = Partial<Record<MediaDeviceKind, string>>;
export interface RoomState {
    frameMuted: boolean;
    appLanguage: string;
    media: {
        videoEnabled: boolean;
        audioEnabled: boolean;
        activeDevices: ActiveMediaDevices;
    };
    layout: {
        mode: LayoutMode;
        showToolbar: boolean;
        toolbarPosition: 'left' | 'right' | 'bottom';
        localTileMinimized: boolean;
        contentMode?: 'maximize' | 'pin';
        content?: {
            userId: UserId;
            type: UserTileType;
        };
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
export type MediaDeviceUpdatePayload = {
    deviceId: string;
    previousDeviceId?: string;
    kind: MediaDeviceKind;
    label: string;
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
    get roomState(): RoomState;
    get localUser(): User;
    get features(): FeatureSet;
    featureEnabled(feature: FeatureFlag): boolean;
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
    changeToolbarPosition: (side: 'left' | 'right' | 'bottom') => void;
    changeBrandingOptions: (brandingOptionsConfig: Partial<BrandingOptionsConfig>) => void;
    changeLayoutMode: (mode: LayoutMode) => void;
    leaveSession: () => void;
    endSession: () => void;
    toggleToolbar: (show?: boolean) => void;
    requestToggleAudio: (userId: UserId, shouldMute?: boolean) => void;
    requestMute: (userId: UserId) => void;
    requestUnmute: (userId: UserId) => void;
    removeUser: (userId: UserId) => void;
    listUsers: () => User[];
    getUser: (userId: UserId) => User;
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
    configureVirtualBackground: (options: VirtualBackgroundOptions) => void;
    enableVirtualBackground: (options: VirtualBackgroundOptions) => void;
    disableVirtualBackground: () => void;
    muteFrame: () => void;
    unmuteFrame: () => void;
    toggleMuteFrame: (mute?: boolean) => void;
    minimizeLocalTile: () => void;
    maximizeLocalTile: () => void;
    pinUser: (userId: UserId, tile?: UserTileType) => void;
    unpinUser: () => void;
    maximizeUser: (userId: UserId, tile?: UserTileType) => void;
    minimizeUser: () => void;
    minimizeContent: () => void;
}
export {};
