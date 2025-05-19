import { Suspense, lazy } from "react"
import useResponsive from "@/hooks/useResponsive.tsx"
import React from "react"

const ChatInput = lazy(() => import("@/components/chats/ChatInput.tsx"))
const ChatList = lazy(() => import("@/components/chats/ChatList.tsx"))

const ChatsView = () => {
    const { viewHeight } = useResponsive()

    return (
        <div
            className="flex max-h-full min-h-[400px] w-full flex-col gap-2 p-4"
            style={{ height: viewHeight }}
        >
            <h1 className="view-title">Group Chat</h1>
            {/* Chat list */}
            <Suspense fallback={<div>Loading chat...</div>}>
                <ChatList />
            </Suspense>
            {/* Chat input */}
            <Suspense fallback={<div>Loading input...</div>}>
                <ChatInput />
            </Suspense>
        </div>
    )
}

export default ChatsView
