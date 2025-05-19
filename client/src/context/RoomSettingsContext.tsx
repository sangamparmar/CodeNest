import React from "react";
import { SocketEvent } from "@/types/socket";
import { USER_ROLE } from "@/types/user";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAppContext } from "./AppContext";
import { useSocket } from "./SocketContext";


interface RoomSettingsContextType {
    everyoneCanEdit: boolean;
    toggleEveryoneCanEdit: () => void;
    requestEditAccess: () => void;
    updateUserRole: (socketId: string, role: USER_ROLE) => void;
    respondToEditRequest: (socketId: string, approved: boolean) => void;
    hasEditRights: (socketId?: string) => boolean;
    pendingAccessRequests: Array<{ username: string; socketId: string }>;
    isCurrentUserAdmin: () => boolean;
}

const RoomSettingsContext = createContext<RoomSettingsContextType | null>(null);

export const useRoomSettings = (): RoomSettingsContextType => {
    const context = useContext(RoomSettingsContext);
    if (!context) {
        throw new Error("useRoomSettings must be used within a RoomSettingsProvider");
    }
    return context;
};

function RoomSettingsProvider({ children }: { children: ReactNode }) {
    const { socket } = useSocket();
    const { users } = useAppContext();
    const [everyoneCanEdit, setEveryoneCanEdit] = useState(false);
    const [pendingAccessRequests, setPendingAccessRequests] = useState<
        Array<{ username: string; socketId: string }>
    >([]);

    // Check if current user is the admin
    const isCurrentUserAdmin = () => {
        const currentUserInRoom = users.find((u) => u.socketId === socket.id);
        return currentUserInRoom?.role === USER_ROLE.ADMIN;
    };

    // Check if a user has editing rights
    const hasEditRights = (socketId?: string) => {
        if (everyoneCanEdit) return true;

        const userToCheck = socketId 
            ? users.find((u) => u.socketId === socketId)
            : users.find((u) => u.socketId === socket.id);
            
        return userToCheck?.role === USER_ROLE.ADMIN || userToCheck?.role === USER_ROLE.EDITOR;
    };

    // Toggle everyone can edit mode (admin only)
    const toggleEveryoneCanEdit = () => {
        if (!isCurrentUserAdmin()) {
            toast.error("Only the admin can change this setting");
            return;
        }

        socket.emit(SocketEvent.TOGGLE_EVERYONE_CAN_EDIT);
    };

    // Request edit access from admin (non-admin users)
    const requestEditAccess = () => {
        if (hasEditRights()) {
            toast.error("You already have edit access");
            return;
        }

        socket.emit(SocketEvent.REQUEST_EDIT_ACCESS);
        toast.success("Edit access request sent to admin");
    };

    // Update a user's role (admin only)
    const updateUserRole = (socketId: string, role: USER_ROLE) => {
        if (!isCurrentUserAdmin()) {
            toast.error("Only the admin can change user roles");
            return;
        }

        socket.emit(SocketEvent.UPDATE_USER_ROLE, { targetSocketId: socketId, newRole: role });
    };

    // Respond to edit access request (admin only)
    const respondToEditRequest = (socketId: string, approved: boolean) => {
        if (!isCurrentUserAdmin()) {
            toast.error("Only the admin can approve edit access");
            return;
        }

        socket.emit(SocketEvent.EDIT_ACCESS_RESPONSE, { targetSocketId: socketId, approved });
        
        // Remove the request from pending list
        setPendingAccessRequests((prev) => 
            prev.filter((req) => req.socketId !== socketId)
        );
    };

    // Socket event handlers
    useEffect(() => {
        // Handle everyone can edit setting change
        const handleEveryoneCanEditToggled = ({ everyoneCanEdit }: { everyoneCanEdit: boolean }) => {
            setEveryoneCanEdit(everyoneCanEdit);
            toast.success(
                everyoneCanEdit 
                    ? "🔓 Everyone can now edit" 
                    : "🔒 Only admin and editors can now edit"
            );
        };

        // Handle edit access request (admin only)
        const handleRequestEditAccess = ({ username, socketId }: { username: string; socketId: string }) => {
            if (isCurrentUserAdmin()) {
                setPendingAccessRequests((prev) => [...prev, { username, socketId }]);
                toast.success(`${username} is requesting edit access`);
            }
        };

        // Handle response to edit access request
        const handleEditAccessResponse = ({ approved, message }: { approved: boolean; message: string }) => {
            toast[approved ? "success" : "error"](message);
        };

        // Handle user role updates
        const handleUserRoleUpdated = ({ 
            socketId, 
            role 
        }: { 
            socketId: string; 
            role: USER_ROLE 
        }) => {
            const user = users.find((u) => u.socketId === socketId);
            if (user) {
                if (socketId === socket.id) {
                    // Current user's role was updated
                    toast.success(`Your role has been changed to ${role}`);
                } else {
                    // Another user's role was updated
                    toast.success(`${user.username}'s role has been changed to ${role}`);
                }
            }
        };

        // Listen for socket events
        socket.on(SocketEvent.EVERYONE_CAN_EDIT_TOGGLED, handleEveryoneCanEditToggled);
        socket.on(SocketEvent.REQUEST_EDIT_ACCESS, handleRequestEditAccess);
        socket.on(SocketEvent.EDIT_ACCESS_RESPONSE, handleEditAccessResponse);
        socket.on(SocketEvent.USER_ROLE_UPDATED, handleUserRoleUpdated);

        return () => {
            // Clean up event listeners
            socket.off(SocketEvent.EVERYONE_CAN_EDIT_TOGGLED);
            socket.off(SocketEvent.REQUEST_EDIT_ACCESS);
            socket.off(SocketEvent.EDIT_ACCESS_RESPONSE);
            socket.off(SocketEvent.USER_ROLE_UPDATED);
        };
    }, [socket, users]);

    return (
        <RoomSettingsContext.Provider
            value={{
                everyoneCanEdit,
                toggleEveryoneCanEdit,
                requestEditAccess,
                updateUserRole,
                respondToEditRequest,
                hasEditRights,
                pendingAccessRequests,
                isCurrentUserAdmin,
            }}
        >
            {children}
        </RoomSettingsContext.Provider>
    );
}

export { RoomSettingsProvider };
export default RoomSettingsContext;