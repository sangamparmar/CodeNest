import { Socket } from "socket.io"

export type SocketId = string;

export enum SocketEvent {
  // User connection events
  JOIN_REQUEST = "join-request",
  JOIN_ACCEPTED = "join-accepted",
  USER_JOINED = "user-joined",
  USER_DISCONNECTED = "user-disconnected",
  USERNAME_EXISTS = "username-exists",
  USER_OFFLINE = "user-offline",
  USER_ONLINE = "user-online",

  // File structure events
  SYNC_FILE_STRUCTURE = "sync-file-structure",
  FILE_UPDATED = "file-updated",
  DIRECTORY_CREATED = "directory-created",
  DIRECTORY_UPDATED = "directory-updated",
  DIRECTORY_RENAMED = "directory-renamed",
  DIRECTORY_DELETED = "directory-deleted",
  FILE_CREATED = "file-created",
  FILE_RENAMED = "file-renamed",
  FILE_DELETED = "file-deleted",

  // Chat events
  SEND_MESSAGE = "send-message",
  RECEIVE_MESSAGE = "receive-message",
  TYPING_START = "typing-start",
  TYPING_PAUSE = "typing-pause",

  // Permission events
  REQUEST_EDIT_ACCESS = "request-edit-access",
  EDIT_ACCESS_RESPONSE = "edit-access-response",
  TOGGLE_EVERYONE_CAN_EDIT = "toggle-everyone-can-edit",
  EVERYONE_CAN_EDIT_TOGGLED = "everyone-can-edit-toggled",
  UPDATE_USER_ROLE = "update-user-role",
  USER_ROLE_UPDATED = "user-role-updated",

  // Drawing events
  REQUEST_DRAWING = "request-drawing",
  SYNC_DRAWING = "sync-drawing",
  DRAWING_UPDATE = "drawing-update",

  // Video call events
  VIDEO_CALL_REQUEST = "video-call-request",
  VIDEO_CALL_ACCEPTED = "video-call-accepted",
  VIDEO_CALL_USER_JOINED = "video-call-user-joined",
  VIDEO_CALL_PEER_CONNECTED = "video-call-peer-connected",
  VIDEO_CALL_PEER_DISCONNECTED = "video-call-peer-disconnected",
  VIDEO_CALL_SIGNAL = "video-call-signal",
  VIDEO_CALL_ENDED = "video-call-ended",
  
  // Voice chat events
  VOICE_JOIN = "voice-join",
  VOICE_LEAVE = "voice-leave",
  VOICE_SIGNAL = "voice-signal",
  USER_SPEAKING = "user-speaking",
  MUTE_STATUS = "mute-status",
}

export interface SocketContext {
  socket: Socket
}
