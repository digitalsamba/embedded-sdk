/// <reference types="node" />
import { EventEmitter } from 'events';
import { PermissionManager } from './utils/PermissionManager';
import { LayoutMode } from './utils/vars';
import { AnyFn, BrandingOptionsConfig, CaptionsOptions, EmbeddedInstance, FeatureFlag, InitialRoomSettings, InitOptions, InstanceProperties, QueuedEventListener, QueuedUICallback, QueuedTileAction, Stored, TileActionProperties, UICallbackName, UserId, UserTileType, VirtualBackgroundOptions, AddImageToWhiteboardOptions, TemplateParams, CreateWhiteboardOptions, AddCustomTileOptions, BroadcastOptions, SendMessageToCustomTileOptions } from './types';
export declare class DigitalSambaEmbedded extends EventEmitter implements EmbeddedInstance {
    initOptions: Partial<InitOptions>;
    templateParams?: TemplateParams;
    roomSettings: Partial<InitialRoomSettings>;
    savedIframeSrc: string;
    allowedOrigin: string;
    connected: boolean;
    frame: HTMLIFrameElement;
    reportErrors: boolean;
    stored: Stored;
    permissionManager: PermissionManager;
    queuedEventListeners: QueuedEventListener[];
    queuedUICallbacks: QueuedUICallback[];
    queuedTileActions: QueuedTileAction[];
    private tileActionListeners;
    private defaultMediaDevices;
    constructor(options?: Partial<InitOptions>, instanceProperties?: Partial<InstanceProperties>, loadImmediately?: boolean);
    static createControl: (initOptions: Partial<InitOptions>, instanceProperties?: InstanceProperties) => DigitalSambaEmbedded;
    private mountFrame;
    load: (instanceProperties?: InstanceProperties) => void;
    private prepareRoomSettings;
    private onMessage;
    addFrameEventListener: (eventName: string, target: 'document' | 'window', listener: (...args: any[]) => void) => void;
    removeFrameEventListener: (eventName: string, target: 'document' | 'window', listener: (...args: any[]) => void) => void;
    addUICallback: (name: UICallbackName, listener: (...args: any[]) => void) => void;
    removeUICallback: (name: UICallbackName, listener: AnyFn) => void;
    addTileAction: (name: string, properties: TileActionProperties, listener: AnyFn) => void;
    removeTileAction: (name: string) => void;
    addCustomTile: (options: AddCustomTileOptions) => void;
    removeCustomTile: (name: string) => void;
    sendMessageToCustomTile: (options: SendMessageToCustomTileOptions) => void;
    private setupInternalEventListeners;
    private _emit;
    private handleInternalMessage;
    private emitUsersUpdated;
    private emitRoomStateUpdated;
    private emitFeatureSetUpdated;
    private setFrameSrc;
    private checkTarget;
    private sendMessage;
    private logError;
    private applyFrameProperties;
    private setTemplateParams;
    get roomState(): import("./types").RoomState;
    get localUser(): import("./types").User;
    get features(): import("./types").FeatureSet;
    featureEnabled(feature: FeatureFlag): boolean;
    enableVideo: () => void;
    disableVideo: () => void;
    toggleVideo: (enable?: boolean) => void;
    enableAudio: () => void;
    disableAudio: () => void;
    toggleAudio: (enable?: boolean) => void;
    openLibraryFile: (id: string) => void;
    closeLibraryFile: (id?: string) => void;
    toggleLibraryFile: (id?: string, show?: boolean) => void;
    createWhiteboard: (options: CreateWhiteboardOptions) => void;
    openWhiteboard: (id?: string) => void;
    closeWhiteboard: (id?: string) => void;
    toggleWhiteboard: (show?: boolean, id?: string) => void;
    addImageToWhiteboard: (options: AddImageToWhiteboardOptions) => void;
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
    endSession: (requireConfirmation?: boolean) => void;
    toggleToolbar: (show?: boolean) => void;
    requestToggleAudio: (userId: UserId, shouldMute?: boolean) => void;
    requestMute: (userId: UserId) => void;
    requestUnmute: (userId: UserId) => void;
    removeUser: (userId: UserId) => void;
    listUsers: () => import("./types").User[];
    getUser: (userId: UserId) => import("./types").User;
    showCaptions: () => void;
    hideCaptions: () => void;
    toggleCaptions: (show?: boolean) => void;
    configureCaptions: (options: Partial<CaptionsOptions>) => void;
    raiseHand: () => void;
    lowerHand: (target?: UserId) => void;
    allowBroadcast: (options: UserId | BroadcastOptions) => void;
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
    changeRole: (userId: UserId, role: string) => void;
}
export default DigitalSambaEmbedded;
