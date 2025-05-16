import { SocketEvent, SocketContext, SocketId } from "../src/types/socket";

describe("Socket Types and Enums", () => {
    test("SocketId type is defined as a string", () => {
        const socketId: SocketId = "12345";
        expect(typeof socketId).toBe("string");
    });

    test("SocketContext interface contains a socket property", () => {
        const mockSocket = { id: "mock-socket-id" } as any; // Mocking a Socket object
        const socketContext: SocketContext = { socket: mockSocket };
        expect(socketContext).toHaveProperty("socket");
        expect(socketContext.socket.id).toBe("mock-socket-id");
    });

    test("SocketEvent enum contains valid keys", () => {
        const keys = Object.keys(SocketEvent);
        keys.forEach((key) => {
            expect(typeof key).toBe("string");
            expect(key).not.toBe("");
        });
    });

    test("SocketEvent enum does not contain duplicate values", () => {
        const values = Object.values(SocketEvent);
        const uniqueValues = new Set(values);

        expect(values.length).toBe(uniqueValues.size);
    });

    test("SocketEvent enum contains a specific event", () => {
        expect(SocketEvent).toHaveProperty("USER_JOINED", "user-joined");
    });
});