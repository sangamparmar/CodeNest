import React from "react";
import { RemoteUser, USER_CONNECTION_STATUS, USER_ROLE } from "@/types/user";
import Avatar from "react-avatar";
import { useMemo, useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { LuMoveHorizontal } from "react-icons/lu";
import { useRoomSettings } from "@/context/RoomSettingsContext";
import { useSocket } from "@/context/SocketContext";
import useContextMenu from "@/hooks/useContextMenu";
import toast from "react-hot-toast";

interface UserProps {
    user: RemoteUser;
}

function User({ user }: UserProps) {
    const { socket } = useSocket();
    const { updateUserRole, respondToEditRequest, pendingAccessRequests, isCurrentUserAdmin } = useRoomSettings();
    const { showMenu, position, handleContextMenu, closeMenu } = useContextMenu({});
    const [targetUser, setTargetUser] = useState<RemoteUser | null>(null);
    const [showActionHint, setShowActionHint] = useState(false);
    
    const isPending = useMemo(() => {
        return pendingAccessRequests.some(request => request.socketId === user.socketId);
    }, [pendingAccessRequests, user.socketId]);
    
    const isCurrentUser = user.socketId === socket.id;
    const isAdmin = isCurrentUserAdmin();
    const canModifyUser = isAdmin && !isCurrentUser && user.role !== USER_ROLE.ADMIN;

    const getRoleBadgeClass = (role: USER_ROLE) => {
        switch (role) {
            case USER_ROLE.ADMIN:
                return "bg-red-600";
            case USER_ROLE.EDITOR:
                return "bg-green-600";
            case USER_ROLE.VIEWER:
                return "bg-blue-600";
            default:
                return "bg-gray-600";
        }
    };

    const handleRoleChange = (role: USER_ROLE) => {
        updateUserRole(user.socketId, role);
        toast.success(`${user.username}'s role changed to ${role}`, {
            icon: role === USER_ROLE.EDITOR ? '✏️' : '👁️',
            duration: 3000,
            position: 'bottom-center'
        });
        closeMenu();
    };

    const handleContextMenuOpen = (e: React.MouseEvent) => {
        if (!canModifyUser) return; // Only show context menu if user can be modified
        setTargetUser(user);
        handleContextMenu(e);
    };

    const handleApproveRequest = () => {
        respondToEditRequest(user.socketId, true);
        toast.success(`Granted edit access to ${user.username}`, {
            icon: '✅',
            duration: 3000,
        });
    };

    const handleDenyRequest = () => {
        respondToEditRequest(user.socketId, false);
        toast.error(`Denied edit access for ${user.username}`, {
            icon: '❌',
            duration: 3000,
        });
    };

    return (
        <div 
            className={`group relative flex h-12 w-32 flex-shrink-0 flex-grow-0 flex-col items-center justify-center rounded-md bg-darkHover text-sm ${canModifyUser ? 'cursor-context-menu' : ''}`}
            onContextMenu={handleContextMenuOpen}
            onMouseEnter={() => canModifyUser && setShowActionHint(true)}
            onMouseLeave={() => setShowActionHint(false)}
        >
            <div className="absolute -top-4 left-0 right-0 mx-auto flex h-8 w-8 items-center justify-center rounded-full">
                <Avatar
                    name={user.username}
                    size="32"
                    round={true}
                    className={user.status === USER_CONNECTION_STATUS.OFFLINE ? "opacity-40" : ""}
                />
                <div
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${
                        user.status === USER_CONNECTION_STATUS.ONLINE ? "bg-green-500" : "bg-gray-600"
                    }`}
                />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden text-ellipsis px-2 text-center">
                {user.username} {isCurrentUser && "(You)"}
            </div>

            {/* Right-click hint for admins (only shown on hover) */}
            {showActionHint && canModifyUser && (
                <div className="absolute -right-8 top-0">
                    <LuMoveHorizontal className="text-gray-400" />
                    <div className="absolute -top-8 left-1/2 w-32 -translate-x-1/2 transform rounded bg-gray-900 px-2 py-1 text-xs text-gray-200">
                        Right-click to manage permissions
                    </div>
                </div>
            )}

            {/* Role badge */}
            <div className="absolute right-1 top-1">
                <div className={`cursor-default rounded-md px-2 py-0.5 text-xs text-white ${getRoleBadgeClass(user.role)}`}>
                    {user.role}
                </div>
            </div>

            {/* Context Menu */}
            {showMenu && targetUser && targetUser.socketId === user.socketId && (
                <div 
                    className="fixed z-50 min-w-32 overflow-hidden rounded-md bg-gray-800 shadow-lg"
                    style={{ top: position.y, left: position.x }}
                >
                    <div className="border-b border-gray-700 bg-gray-900 px-4 py-2 text-sm font-semibold">
                        {user.username}
                    </div>
                    {user.role !== USER_ROLE.ADMIN && (
                        <>
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
                        </>
                    )}
                </div>
            )}

            {/* Pending request controls */}
            {isPending && (
                <div className="absolute -right-4 -top-4 flex gap-1">
                    <button
                        onClick={handleApproveRequest}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700"
                        title="Approve edit access"
                    >
                        <IoMdCheckmark />
                    </button>
                    <button
                        onClick={handleDenyRequest}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
                        title="Deny edit access"
                    >
                        <IoClose />
                    </button>
                </div>
            )}
        </div>
    );
}

export default User;