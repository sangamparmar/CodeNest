import { Socket } from "socket.io-client"

type SocketId = string

enum SocketEvent {
    JOIN_REQUEST = "join-request",
    JOIN_ACCEPTED = "join-accepted",
    USER_JOINED = "user-joined",
    USER_DISCONNECTED = "user-disconnected",
    SYNC_FILE_STRUCTURE = "sync-file-structure",
    DIRECTORY_CREATED = "directory-created",
    DIRECTORY_UPDATED = "directory-updated",
    DIRECTORY_RENAMED = "directory-renamed",
    DIRECTORY_DELETED = "directory-deleted",
    FILE_CREATED = "file-created",
    FILE_UPDATED = "file-updated",
    FILE_RENAMED = "file-renamed",
    FILE_DELETED = "file-deleted",
    USER_OFFLINE = "offline",
    USER_ONLINE = "online",
    SEND_MESSAGE = "send-message",
    RECEIVE_MESSAGE = "receive-message",
    TYPING_START = "typing-start",
    TYPING_PAUSE = "typing-pause",
    USERNAME_EXISTS = "username-exists",
    REQUEST_DRAWING = "request-drawing",
    SYNC_DRAWING = "sync-drawing",
    DRAWING_UPDATE = "drawing-update",
    // Permission related events
    REQUEST_EDIT_ACCESS = "request-edit-access",
    EDIT_ACCESS_RESPONSE = "edit-access-response",
    TOGGLE_EVERYONE_CAN_EDIT = "toggle-everyone-can-edit",
    UPDATE_USER_ROLE = "update-user-role",
    USER_ROLE_UPDATED = "user-role-updated",
    EVERYONE_CAN_EDIT_TOGGLED = "everyone-can-edit-toggled",
    // Voice chat events
    VOICE_SIGNAL = "voice-signal",
    USER_SPEAKING = "user-speaking",
    VOICE_JOIN = "voice-join",
    VOICE_LEAVE = "voice-leave",
    // Legacy video call events - keeping these for backward compatibility
    VIDEO_CALL_REQUEST = "video-call-request",
    VIDEO_CALL_ACCEPTED = "video-call-accepted",
    VIDEO_CALL_REJECTED = "video-call-rejected",
    VIDEO_CALL_SIGNAL = "video-call-signal",
    VIDEO_CALL_PEER_CONNECTED = "video-call-peer-connected",
    VIDEO_CALL_PEER_DISCONNECTED = "video-call-peer-disconnected",
    VIDEO_CALL_ENDED = "video-call-ended",
    VIDEO_CALL_JOINED = "video-call-joined",
    VIDEO_CALL_USER_JOINED = "video-call-user-joined",
}

interface SocketContext {
    socket: Socket
}

export { SocketEvent, SocketContext, SocketId }
