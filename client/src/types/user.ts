enum USER_CONNECTION_STATUS {
    OFFLINE = "offline",
    ONLINE = "online",
}

enum USER_ROLE {
    ADMIN = "admin",
    EDITOR = "editor",
    VIEWER = "viewer",
}

interface User {
    socketId: any 
    username: string
    roomId: string
}

interface RemoteUser extends User {
    inCall: boolean
    status: USER_CONNECTION_STATUS
    cursorPosition: number
    typing: boolean
    currentFile: string
    socketId: string
    role: USER_ROLE
    isMicMuted?: boolean // Track if user has muted their microphone
    isSpeaking?: boolean // Track if user is currently speaking
}

enum USER_STATUS {
    INITIAL = "initial",
    CONNECTING = "connecting",
    ATTEMPTING_JOIN = "attempting-join",
    JOINED = "joined",
    CONNECTED = "connected", // ✅ Added missing status
    CONNECTION_FAILED = "connection-failed",
    DISCONNECTED = "disconnected",
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
}

export { USER_CONNECTION_STATUS, USER_STATUS, USER_ROLE, RemoteUser, User }
