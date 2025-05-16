import { USER_CONNECTION_STATUS, User } from "../src/types/user";

describe("User Types and Enums", () => {
    test("USER_CONNECTION_STATUS enum contains correct values", () => {
        expect(USER_CONNECTION_STATUS).toHaveProperty("OFFLINE", "offline");
        expect(USER_CONNECTION_STATUS).toHaveProperty("ONLINE", "online");

        const values = Object.values(USER_CONNECTION_STATUS);
        expect(values).toContain("offline");
        expect(values).toContain("online");
        expect(values.length).toBe(2);
    });

    test("User interface has correct structure", () => {
        const mockUser: User = {
            username: "testuser",
            roomId: "room123",
            status: USER_CONNECTION_STATUS.ONLINE,
            cursorPosition: 42,
            typing: true,
            currentFile: "file.txt",
            socketId: "socket123",
        };

        expect(mockUser).toHaveProperty("username", "testuser");
        expect(mockUser).toHaveProperty("roomId", "room123");
        expect(mockUser).toHaveProperty("status", USER_CONNECTION_STATUS.ONLINE);
        expect(mockUser).toHaveProperty("cursorPosition", 42);
        expect(mockUser).toHaveProperty("typing", true);
        expect(mockUser).toHaveProperty("currentFile", "file.txt");
        expect(mockUser).toHaveProperty("socketId", "socket123");
    });

    test("User interface allows null for currentFile", () => {
        const mockUser: User = {
            username: "testuser",
            roomId: "room123",
            status: USER_CONNECTION_STATUS.OFFLINE,
            cursorPosition: 0,
            typing: false,
            currentFile: null,
            socketId: "socket456",
        };

        expect(mockUser.currentFile).toBeNull();
    });
});