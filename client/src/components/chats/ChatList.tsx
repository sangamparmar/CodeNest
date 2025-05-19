import { useAppContext } from "@/context/AppContext"
import { useChatRoom } from "@/context/ChatContext"
import React from "react"
import { SyntheticEvent, useEffect, useRef } from "react"

function ChatList() {
    const {
        messages,
        isNewMessage,
        setIsNewMessage,
        lastScrollHeight,
        setLastScrollHeight,
    } = useChatRoom()
    const { currentUser } = useAppContext()
    const messagesContainerRef = useRef<HTMLDivElement | null>(null)

    const handleScroll = (e: SyntheticEvent) => {
        const container = e.target as HTMLDivElement
        setLastScrollHeight(container.scrollTop)
    }

    // Scroll to bottom when messages change
    useEffect(() => {
        if (!messagesContainerRef.current) return
        messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight
    }, [messages])

    useEffect(() => {
        if (isNewMessage) {
            setIsNewMessage(false)
        }
        if (messagesContainerRef.current)
            messagesContainerRef.current.scrollTop = lastScrollHeight
    }, [isNewMessage, setIsNewMessage, lastScrollHeight])

    return (
        <div
            className="flex-grow overflow-auto rounded-md bg-darkHover p-2"
            ref={messagesContainerRef}
            onScroll={handleScroll}
        >
            {messages.length > 0 ? (
                messages.map((message, index) => {
                    const isSystemMessage = message.username === "System";
                    const isCurrentUser = message.username === currentUser.username;
                    
                    return (
                        <div
                            key={message.id || index}
                            className={`mb-3 w-[85%] break-words rounded-md px-3 py-2 ${
                                isSystemMessage 
                                    ? "mx-auto bg-gray-700/50 text-center" 
                                    : isCurrentUser
                                        ? "ml-auto bg-indigo-600 text-white" 
                                        : "bg-slate-700 text-white"
                            }`}
                        >
                            <div className="flex justify-between">
                                <span className={`text-xs font-medium ${
                                    isSystemMessage 
                                        ? "text-gray-300" 
                                        : isCurrentUser 
                                            ? "text-white" 
                                            : "text-indigo-200"
                                }`}>
                                    {message.username}
                                </span>
                                <span className="text-xs text-gray-300">
                                    {message.timestamp}
                                </span>
                            </div>
                            <p className={`py-1 ${isSystemMessage ? "text-gray-300 italic" : "text-white"}`}>
                                {message.message}
                            </p>
                        </div>
                    )
                })
            ) : (
                <div className="flex h-full flex-col items-center justify-center">
                    <p className="text-gray-400">No messages yet</p>
                </div>
            )}
        </div>
    )
}

export default ChatList
