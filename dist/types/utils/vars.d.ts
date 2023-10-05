import { Stored } from '../types';
export declare const CONNECT_TIMEOUT = 10000;
export declare const internalEvents: Record<string, boolean>;
export declare enum LayoutMode {
    tiled = "tiled",
    auto = "auto"
}
export declare enum PermissionTypes {
    broadcast = "broadcast",
    manageBroadcast = "manage_broadcast",
    endSession = "end_session",
    startSession = "start_session",
    removeParticipant = "remove_participant",
    screenshare = "screenshare",
    manageScreenshare = "manage_screenshare",
    recording = "recording",
    generalChat = "general_chat",
    remoteMuting = "remote_muting",
    askRemoteUnmute = "ask_remote_unmute",
    raiseHand = "raise_hand",
    manageRoles = "manage_roles",
    inviteParticipant = "invite_participant",
    seeParticipantsPanel = "see_participants_panel",
    controlRoomEntry = "control_room_entry",
    editWhiteboard = "edit_whiteboard"
}
export declare const getDefaultStoredState: () => Stored;
