import React from "react";
import { useAppContext } from "@/context/AppContext";
import { RemoteUser, USER_CONNECTION_STATUS, USER_ROLE } from "@/types/user";
import { useRoomSettings } from "@/context/RoomSettingsContext";
import { useSocket } from "@/context/SocketContext";
import useContextMenu from "@/hooks/useContextMenu";
import Avatar from "react-avatar";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

function Users() {
    const { users } = useAppContext();
    
    return (
        <div className="grid grid-cols-2 gap-4" data-testid="users-component">
            {users.map((user) => (
                <User key={user.socketId} user={user} />
            ))}
        </div>
    );
}

const User = ({ user }: { user: RemoteUser }) => {
    const { username, status, role } = user;
    const { socket } = useSocket();
    const { updateUserRole, isCurrentUserAdmin } = useRoomSettings();
    const { showMenu, position, handleContextMenu, closeMenu } = useContextMenu({});
    const [showTooltip, setShowTooltip] = useState(false);
    
    const isCurrentUser = user.socketId === socket.id;
    const isAdmin = isCurrentUserAdmin();
    const canModifyUser = isAdmin && !isCurrentUser && user.role !== USER_ROLE.ADMIN;
    
    const title = `${username} - ${
        status === USER_CONNECTION_STATUS.ONLINE ? "online" : "offline"
    } (${role})`;
    
    const handleRoleChange = (newRole: USER_ROLE) => {
        updateUserRole(user.socketId, newRole);
        toast.success(`${user.username}'s role changed to ${newRole}`, {
            icon: newRole === USER_ROLE.EDITOR ? '✏️' : '👁️',
            duration: 3000,
            position: 'bottom-center'
        });
        // Close the menu after changing the role
        closeMenu();
    };

    const handleUserContextMenu = (e: React.MouseEvent) => {
        if (!canModifyUser) return;
        handleContextMenu(e);
    };

    // Close the context menu if the user's role changes
    useEffect(() => {
        closeMenu();
    }, [role, closeMenu]);
    
    return (
        <div
            className={`relative flex w-[100px] flex-col items-center gap-2 ${canModifyUser ? 'cursor-context-menu' : ''}`}
            title={title}
            onContextMenu={handleUserContextMenu}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div className="relative">
                <Avatar name={username} size="50" round={"12px"} title={title} />
            </div>
            
            <p className="line-clamp-2 max-w-full text-ellipsis break-words">
                {username}
            </p>
            
            {/* Role badge */}
            <div className={`absolute right-0 top-0 rounded px-1.5 py-0.5 text-[10px] text-white ${
                role === USER_ROLE.ADMIN ? "bg-red-600" : 
                role === USER_ROLE.EDITOR ? "bg-green-600" : "bg-blue-600"
            }`}>
                {role}
            </div>
            
            {/* Online/Offline indicator */}
            <div
                className={`absolute left-5 top-0 h-3 w-3 rounded-full ${
                    status === USER_CONNECTION_STATUS.ONLINE
                        ? "bg-green-500"
                        : "bg-danger"
                }`}
            ></div>
            
            {/* Right-click hint for admins (only shown on hover) */}
            {showTooltip && canModifyUser && (
                <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-400">
                    Right-click to manage
                </div>
            )}
            
            {/* Context Menu */}
            {showMenu && canModifyUser && (
                <div 
                    className="fixed z-50 min-w-32 overflow-hidden rounded-md bg-gray-800 shadow-lg"
                    style={{ top: position.y, left: position.x }}
                >
                    <div className="border-b border-gray-700 bg-gray-900 px-4 py-2 text-sm font-semibold">
                        {user.username}
                    </div>
                    {user.role === USER_ROLE.VIEWER ? (
                        <div 
                            className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm hover:bg-gray-700"
                            onClick={() => handleRoleChange(USER_ROLE.EDITOR)}
                        >
                            <span className="text-lg">✏️</span>
                            Grant Edit Access
                        </div>
                    ) : (
                        <div 
                            className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm hover:bg-gray-700"
                            onClick={() => handleRoleChange(USER_ROLE.VIEWER)}
                        >
                            <span className="text-lg">👁️</span>
                            Revoke Edit Access
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Users;
