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
	username: string
	roomId: string
	status: USER_CONNECTION_STATUS
	cursorPosition: number
	typing: boolean
	currentFile: string | null
	socketId: string
	role: USER_ROLE
	inCall?: boolean // Track if user is in video call
}

export { USER_CONNECTION_STATUS, USER_ROLE, User }
