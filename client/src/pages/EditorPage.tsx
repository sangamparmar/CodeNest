import React from "react";
import SplitterComponent from "@/components/SplitterComponent"
import ConnectionStatusPage from "@/components/connection/ConnectionStatusPage"
import Sidebar from "@/components/sidebar/Sidebar"
import "@/styles/sidebar-styles.css"
import WorkSpace from "@/components/workspace"
import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import useFullScreen from "@/hooks/useFullScreen"
import useUserActivity from "@/hooks/useUserActivity"
import { SocketEvent } from "@/types/socket"
import { USER_STATUS, User } from "@/types/user"
import { useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useTheme } from "next-themes"

function EditorPage() {
    // Listen user online/offline status
    useUserActivity()
    // Enable fullscreen mode
    useFullScreen()
    const navigate = useNavigate()
    const { roomId } = useParams()
    const { status, setCurrentUser, currentUser } = useAppContext()
    const { socket } = useSocket()
    const location = useLocation()
    const { setTheme } = useTheme()
      // Set dark theme immediately when the editor page loads
    useEffect(() => {
        setTheme("dark")

        // Add a style tag to ensure proper contrast for form fields in sidebar
        const style = document.createElement('style')
        style.textContent = `
            select option {
                background-color: #1e1e1e !important;
                color: white !important;
            }
            .sidebar-select option {
                background-color: #1e1e1e !important;
                color: white !important;
            }
        `
        document.head.appendChild(style)
        
        return () => {
            document.head.removeChild(style)
        }
    }, [setTheme])
    
    useEffect(() => {
        if (currentUser.username.length > 0) return
        
        // Try to get username from location state first, then from sessionStorage
        let username = location.state?.username
        
        // If not found in location state, check sessionStorage
        if (username === undefined) {
            username = sessionStorage.getItem('editorUsername')
            // Clear the sessionStorage after using it to prevent reuse
            if (username) {
                sessionStorage.removeItem('editorUsername')
            } else {
                // If no username found anywhere, redirect to homepage
                navigate("/", {
                    state: { roomId },
                })
                return
            }
        }
        
        // If we have a username and room ID, join the room
        if (roomId) {
            const user: User = {
                username, 
                roomId,
                socketId: undefined
            }
            setCurrentUser(user)
            socket.emit(SocketEvent.JOIN_REQUEST, user)
        }
    }, [
        currentUser.username,
        location.state?.username,
        navigate,
        roomId,
        setCurrentUser,
        socket,
    ])

    if (status === USER_STATUS.CONNECTION_FAILED) {
        return <ConnectionStatusPage />
    }

    return (
        <SplitterComponent>
            <Sidebar />
            <WorkSpace/>
        </SplitterComponent>
    )
}

export default EditorPage
