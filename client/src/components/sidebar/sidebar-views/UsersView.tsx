import Users from "@/components/common/Users.tsx";
import { useAppContext } from "@/context/AppContext.tsx";
import { useRoomSettings } from "@/context/RoomSettingsContext.tsx";
import { useSocket } from "@/context/SocketContext.tsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { IoShareOutline } from "react-icons/io5";
import { LuCopy, LuLogOut } from "react-icons/lu";
import useResponsive from "@/hooks/useResponsive.tsx";
import { USER_STATUS } from "@/types/user";
import React from "react";

function UsersView() {
    const navigate = useNavigate();
    const { viewHeight } = useResponsive();
    const { setStatus } = useAppContext();
    const { socket } = useSocket();
    const { everyoneCanEdit, toggleEveryoneCanEdit, isCurrentUserAdmin } = useRoomSettings();

    const isAdmin = isCurrentUserAdmin();

    const copyURL = async () => {
        const pathname = window.location.pathname;
        try {
            const parts = pathname.split("/");
            const uniqueId = parts[parts.length - 1];

            if (!uniqueId) {
                toast.error("Unique ID not found in the URL");
                return;
            }

            await navigator.clipboard.writeText(uniqueId);
            toast.success("Unique ID copied to clipboard");
        } catch (error) {
            toast.error("Unable to copy Unique ID to clipboard");
            console.log(error);
        }
    };

    const shareURL = async () => {
        const pathname = window.location.pathname;
        try {
            const parts = pathname.split("/");
            const uniqueId = parts[parts.length - 1];

            if (!uniqueId) {
                toast.error("Unique ID not found in the URL");
                return;
            }

            if (navigator.share) {
                await navigator.share({                    title: "Join my CodeNest session",
                    text: `Join my CodeNest session with ID: ${uniqueId}`,
                });
            } else {
                await navigator.clipboard.writeText(uniqueId);
                toast.success("Unique ID copied to clipboard");
            }
        } catch (error) {
            toast.error("Unable to share Unique ID");
            console.log(error);
        }
    };

    const leaveRoom = () => {
        toast.success("Left the room");
        socket.disconnect();
        setStatus(USER_STATUS.OFFLINE);
        navigate("/");
    };

    const pathname = window.location.pathname;
    const parts = pathname.split("/");
    const uniqueId = parts[parts.length - 1];

    return (
        <div
            className="relative flex w-full flex-grow flex-col overflow-y-auto p-4"
            style={{ height: viewHeight - 175 }}
        >
            {/* Editing Permission Controls (Admin only) */}
            {isAdmin && (
                <div className="mb-4 rounded-lg bg-gray-800 p-3">
                    <h3 className="mb-2 text-lg font-semibold">Editing Permissions</h3>
                    <div className="flex items-center justify-between">
                        <span>{everyoneCanEdit ? "🔓 Everyone can edit" : "🔒 Only allowed users can edit"}</span>
                        <button
                            onClick={toggleEveryoneCanEdit}
                            className={`rounded px-3 py-1 text-sm text-white ${
                                everyoneCanEdit ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                            }`}
                        >
                            {everyoneCanEdit ? "Restrict Editing" : "Allow Everyone"}
                        </button>
                    </div>
                </div>
            )}

            <div className="text-center mb-4">
                <p>
                    Share this room ID <strong>{uniqueId}</strong> with your buddy.
                </p>
                <p>
                    Tell them to enter the ID above and join the room to collaborate!
                </p>
            </div>
            <div className="flex flex-col items-center gap-4 pt-4">
                <div className="flex w-full gap-4">
                    {/* Share URL button */}
                    <button
                        className="flex flex-grow items-center justify-center rounded-md bg-white p-3 text-black"
                        onClick={shareURL}
                        title="Share Unique ID"
                    >
                        <IoShareOutline size={26} />
                    </button>
                    {/* Copy URL button */}
                    <button
                        className="flex flex-grow items-center justify-center rounded-md bg-white p-3 text-black"
                        onClick={copyURL}
                        title="Copy Unique ID"
                    >
                        <LuCopy size={22} />
                    </button>
                    {/* Leave room button */}
                    <button
                        className="flex flex-grow items-center justify-center rounded-md bg-white p-3 text-black"
                        onClick={leaveRoom}
                        title="Leave Room"
                    >
                        <LuLogOut size={22} />
                    </button>
                </div>
            </div>
            <div className="py-2">
                <h4 className="pt-6 font-bold">Online Users</h4>
                <div className="pt-4">
                    <Users />
                </div>
            </div>
        </div>
    );
}

export default UsersView;
