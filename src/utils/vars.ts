import { Stored } from '../types';

export const CONNECT_TIMEOUT = 10000;

export const internalEvents: Record<string, boolean> = {
  roomJoined: true,
};

export enum LayoutMode {
  tiled = 'tiled',
  auto = 'auto',
}

export enum AppLayout {
  tiled = 'tiled',
  tiled_content = 'tiled_content',
}

export enum PermissionTypes {
  broadcast = 'broadcast',
  manageBroadcast = 'manage_broadcast',
  endSession = 'end_session',
  startSession = 'start_session',
  removeParticipant = 'remove_participant',
  screenshare = 'screenshare',
  manageScreenshare = 'manage_screenshare',
  recording = 'recording',
  generalChat = 'general_chat',
  remoteMuting = 'remote_muting',
  askRemoteUnmute = 'ask_remote_unmute',
  raiseHand = 'raise_hand',
  manageRoles = 'manage_roles',
}

export const defaultStoredState: Stored = {
  userId: '',
  roomState: {
    media: {
      micEnabled: false,
      cameraEnabled: false,
    },
    layout: {
      mode: LayoutMode.tiled,
      presentation: AppLayout.tiled,
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
