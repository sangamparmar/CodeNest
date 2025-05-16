import { ChatContext as ChatContextType, ChatMessage } from "@/types/chat"
import { SocketEvent } from "@/types/socket"
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"
import { useSocket } from "./SocketContext.tsx"
import { v4 as uuidV4 } from "uuid"
import { formatDate } from "@/utils/formateDate"

const ChatContext = createContext<ChatContextType | null>(null)

export const useChatRoom = (): ChatContextType => {
    const context = useContext(ChatContext)
    if (!context) {
        throw new Error("useChatRoom must be used within a ChatContextProvider")
    }
    return context
}

function ChatContextProvider({ children }: { children: ReactNode }) {
    const { socket } = useSocket()
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        // Initialize with a welcome message
        return [{
            id: uuidV4(),
            message: "Welcome to the chat! Send a message to start collaborating.",
            username: "System",
            timestamp: formatDate(new Date().toISOString()),
        }]
    })
    const [isNewMessage, setIsNewMessage] = useState<boolean>(false)
    const [lastScrollHeight, setLastScrollHeight] = useState<number>(0)

    useEffect(() => {
        socket.on(
            SocketEvent.RECEIVE_MESSAGE,
            ({ message }: { message: ChatMessage }) => {
                setMessages((messages) => [...messages, message])
                setIsNewMessage(true)
            },
        )
        return () => {
            socket.off(SocketEvent.RECEIVE_MESSAGE)
        }
    }, [socket])

    return (
        <ChatContext.Provider
            value={{
                messages,
                setMessages,
                isNewMessage,
                setIsNewMessage,
                lastScrollHeight,
                setLastScrollHeight,
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export { ChatContextProvider }
export default ChatContext
