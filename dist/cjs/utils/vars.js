"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultStoredState = exports.PermissionTypes = exports.LayoutMode = exports.internalEvents = exports.CONNECT_TIMEOUT = void 0;
exports.CONNECT_TIMEOUT = 10000;
exports.internalEvents = {
    roomJoined: true,
};
var LayoutMode;
(function (LayoutMode) {
    LayoutMode["tiled"] = "tiled";
    LayoutMode["auto"] = "auto";
})(LayoutMode = exports.LayoutMode || (exports.LayoutMode = {}));
var PermissionTypes;
(function (PermissionTypes) {
    PermissionTypes["broadcast"] = "broadcast";
    PermissionTypes["manageBroadcast"] = "manage_broadcast";
    PermissionTypes["endSession"] = "end_session";
    PermissionTypes["startSession"] = "start_session";
    PermissionTypes["removeParticipant"] = "remove_participant";
    PermissionTypes["screenshare"] = "screenshare";
    PermissionTypes["manageScreenshare"] = "manage_screenshare";
    PermissionTypes["recording"] = "recording";
    PermissionTypes["generalChat"] = "general_chat";
    PermissionTypes["remoteMuting"] = "remote_muting";
    PermissionTypes["askRemoteUnmute"] = "ask_remote_unmute";
    PermissionTypes["raiseHand"] = "raise_hand";
    PermissionTypes["manageRoles"] = "manage_roles";
})(PermissionTypes = exports.PermissionTypes || (exports.PermissionTypes = {}));
exports.defaultStoredState = {
    userId: '',
    roomState: {
        media: {
            micEnabled: false,
            cameraEnabled: false,
        },
        layout: {
            mode: LayoutMode.tiled,
            showToolbar: true,
            toolbarPosition: 'left',
        },
        captionsState: {
            showCaptions: false,
            spokenLanguage: 'en',
            fontSize: 'medium',
        },
    },
    users: {},
};
