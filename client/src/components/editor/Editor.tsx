import { useAppContext } from "@/context/AppContext"
import { useFileSystem } from "@/context/FileContext"
import { useRoomSettings } from "@/context/RoomSettingsContext"
import { useSettings } from "@/context/SettingContext"
import { useSocket } from "@/context/SocketContext"
import usePageEvents from "@/hooks/usePageEvents"
import useResponsive from "@/hooks/useResponsive"
import { editorThemes } from "@/resources/Themes"
import { FileSystemItem } from "@/types/file"
import { SocketEvent } from "@/types/socket"
import { color } from "@uiw/codemirror-extensions-color"
import { hyperLink } from "@uiw/codemirror-extensions-hyper-link"
import { LanguageName, loadLanguage } from "@uiw/codemirror-extensions-langs"
import CodeMirror, {
    Extension,
    ViewUpdate,
    scrollPastEnd,
    EditorView,
} from "@uiw/react-codemirror"
import { useCallback, useEffect, useMemo, useState, useRef } from "react"
import toast from "react-hot-toast"
import { LuLock } from "react-icons/lu"
import { BiCode, BiShow } from "react-icons/bi"
import { cursorTooltipBaseTheme, tooltipField } from "./tooltip"
import HtmlPreview from "./HtmlPreview"

function Editor() {
    const { users, currentUser } = useAppContext()
    const { activeFile, setActiveFile } = useFileSystem()
    const { theme, language, fontSize } = useSettings()
    const { socket } = useSocket()
    const { viewHeight } = useResponsive()
    const { hasEditRights, requestEditAccess } = useRoomSettings()
    const [timeOut, setTimeOut] = useState(setTimeout(() => {}, 0))
    const filteredUsers = useMemo(
        () => users.filter((u) => u.username !== currentUser.username),
        [users, currentUser],
    )
    const [extensions, setExtensions] = useState<Extension[]>([])
    const [canEdit, setCanEdit] = useState(hasEditRights())
    const [requestSent, setRequestSent] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const editorRef = useRef<any>(null)
    
    // Check if the current file is an HTML file
    const isHtmlFile = useMemo(() => {
        if (!activeFile?.name) return false
        return activeFile.name.toLowerCase().endsWith('.html')
    }, [activeFile?.name])

    const onCodeChange = (code: string, view: ViewUpdate) => {
        if (!activeFile || !canEdit) return

        const file: FileSystemItem = { ...activeFile, content: code }
        setActiveFile(file)
        const cursorPosition = view.state?.selection?.main?.head
        socket.emit(SocketEvent.TYPING_START, { cursorPosition })
        socket.emit(SocketEvent.FILE_UPDATED, {
            fileId: activeFile.id,
            newContent: code,
        })
        clearTimeout(timeOut)

        const newTimeOut = setTimeout(
            () => socket.emit(SocketEvent.TYPING_PAUSE),
            1000,
        )
        setTimeOut(newTimeOut)
    }

    // Listen wheel event to zoom in/out and prevent page reload
    usePageEvents()

    // Create a helper function to update editor extensions based on current edit rights
    const updateEditorExtensions = useCallback(() => {
        const hasRights = hasEditRights()
        setCanEdit(hasRights)
        
        const extensions = [
            color,
            hyperLink,
            tooltipField(filteredUsers),
            cursorTooltipBaseTheme,
            scrollPastEnd(),
        ]
        
        // Add readonly extension if user doesn't have edit rights
        if (!hasRights) {
            extensions.push(EditorView.editable.of(false))
        }

        const langExt = loadLanguage(language.toLowerCase() as LanguageName)
        if (langExt) {
            extensions.push(langExt)
        } else if (language) {
            toast.error(
                "Syntax highlighting is unavailable for this language. Please adjust the editor settings; it may be listed under a different name.",
                {
                    duration: 5000,
                },
            )
        }

        setExtensions(extensions)
    }, [filteredUsers, language, hasEditRights])

    // Update extensions when editor settings change
    useEffect(() => {
        updateEditorExtensions()
    }, [filteredUsers, language, updateEditorExtensions])

    // Listen for role updates that might affect editing permissions
    useEffect(() => {
        const handleUserRoleUpdated = () => {
            updateEditorExtensions()
        }

        socket.on(SocketEvent.USER_ROLE_UPDATED, handleUserRoleUpdated)
        socket.on(SocketEvent.EVERYONE_CAN_EDIT_TOGGLED, handleUserRoleUpdated)
        
        return () => {
            socket.off(SocketEvent.USER_ROLE_UPDATED, handleUserRoleUpdated)
            socket.off(SocketEvent.EVERYONE_CAN_EDIT_TOGGLED, handleUserRoleUpdated)
        }
    }, [socket, updateEditorExtensions])

    // Force editor to update when permissions change
    useEffect(() => {
        if (editorRef.current && canEdit) {
            // Force editor to recognize it's now editable
            setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.view?.dispatch({})
                }
            }, 100)
        }
    }, [canEdit])

    const handleRequestEditAccess = () => {
        requestEditAccess()
        setRequestSent(true)
        
        // Automatically reset after 30 seconds so user can request again if needed
        setTimeout(() => {
            setRequestSent(false)
        }, 30000)
    }    // Toggle between editor and preview modes
    const togglePreview = () => {
        setShowPreview(prev => !prev);
    };

    return (
        <div className="relative h-full w-full">
            {isHtmlFile && (
                <div className="absolute top-2 right-4 z-10">
                    <button 
                        onClick={togglePreview}
                        className="flex items-center rounded-md bg-gray-800 px-3 py-2 shadow-md text-white hover:bg-gray-700 transition-colors duration-200"
                        title={showPreview ? "Show Code" : "Show Preview"}
                    >
                        {showPreview ? (
                            <>
                                <BiCode className="mr-1.5" />
                                <span className="text-sm font-medium">Code</span>
                            </>
                        ) : (
                            <>
                                <BiShow className="mr-1.5" />
                                <span className="text-sm font-medium">Preview</span>
                            </>
                        )}
                    </button>
                </div>
            )}
            
            {(!isHtmlFile || !showPreview) && (
                <CodeMirror
                    theme={editorThemes[theme]}
                    onChange={onCodeChange}
                    value={activeFile?.content || ""}
                    height={`${viewHeight - 175}px`}
                    extensions={extensions}
                    style={{ fontSize: `${fontSize}px` }}
                    className="active-file w-full"
                    ref={editorRef}
                    basicSetup={{
                        lineNumbers: true,
                        highlightActiveLine: true,
                        highlightSelectionMatches: true,
                        syntaxHighlighting: true,
                        allowMultipleSelections: true,
                    }}
                />
            )}
            
            {isHtmlFile && showPreview && (
                <HtmlPreview 
                    content={activeFile?.content || ""} 
                    height={`${viewHeight - 175}px`}
                />
            )}
            
            {/* Only show overlay for permission request, not blocking the view */}
            {!canEdit && !showPreview && (
                <div className="absolute bottom-4 right-4 flex items-center justify-center">
                    <div className="flex items-center rounded-lg bg-gray-800 p-2 shadow-md">
                        <LuLock className="mr-2 text-lg text-yellow-500" />
                        <span className="mr-2 text-sm text-white">Read-only mode</span>
                        {!requestSent ? (
                            <button 
                                onClick={handleRequestEditAccess}
                                className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                            >
                                Request Edit Access
                            </button>
                        ) : (
                            <span className="text-xs text-green-400">Request sent ✓</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Editor
