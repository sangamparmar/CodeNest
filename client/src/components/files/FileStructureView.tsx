import { useAppContext } from "@/context/AppContext"
import { useFileSystem } from "@/context/FileContext"
import { useViews } from "@/context/ViewContext"
import { useContextMenu } from "@/hooks/useContextMenu"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import { ACTIVITY_STATE } from "@/types/app"
import { FileSystemItem, Id } from "@/types/file"
import { sortFileSystemItem } from "@/utils/file"
import { getIconClassName } from "@/utils/getIconClassName"
import { Icon } from "@iconify/react"
import cn from "classnames"
import { MouseEvent, useEffect, useRef, useState } from "react"
import { AiOutlineFolder, AiOutlineFolderOpen } from "react-icons/ai"
import { MdDelete } from "react-icons/md"
import { PiPencilSimpleFill } from "react-icons/pi"
import {
    RiFileAddLine,
    RiFolderAddLine,
    RiFolderUploadLine,
} from "react-icons/ri"
import RenameView from "./RenameView"
import useResponsive from "@/hooks/useResponsive"
import toast from "react-hot-toast"
import NewItemInput from "./NewItemInput"

// Interface for new item creation state
interface NewItemState {
    parentId: Id;
    isDirectory: boolean;
}

function FileStructureView() {
    const { fileStructure, createFile, createDirectory, collapseDirectories } =
        useFileSystem()
    const explorerRef = useRef<HTMLDivElement | null>(null)
    // We're using a ref instead of state since we don't need re-renders for this
    const selectedDirIdRef = useRef<Id>(fileStructure.id)
    const { minHeightReached } = useResponsive()
    
    // State for new file/folder creation
    const [creatingNewItem, setCreatingNewItem] = useState<NewItemState | null>(null)
    
    // Force re-render helper
    const [] = useState({});
    
    // Debug: log state changes
    useEffect(() => {
        console.log("Creating new item state changed:", creatingNewItem);
    }, [creatingNewItem]);
    
    // Helper function to set the selected directory ID
    const setSelectedDirId = (id: Id) => {
        selectedDirIdRef.current = id;
    }
      const handleClickOutside = (e: MouseEvent) => {
        if (
            explorerRef.current &&
            !explorerRef.current.contains(e.target as Node)
        ) {
            selectedDirIdRef.current = fileStructure.id
            setCreatingNewItem(null) // Cancel any active file creation
        }
    }    // Main file structure button handlers
    const handleCreateRootFile = () => {
        console.log("Creating new root file");
        // Cancel any existing creation first
        setCreatingNewItem(null);
        // Then set the new creation state in the next tick
        setTimeout(() => {
            setCreatingNewItem({
                parentId: fileStructure.id,
                isDirectory: false
            });
        }, 0);
    }

    const handleCreateRootDirectory = () => {
        console.log("Cre ating new root directory");
        // Cancel any existing creation first
        setCreatingNewItem(null);
        // Then set the new creation state in the next tick
        setTimeout(() => {
            setCreatingNewItem({
                parentId: fileStructure.id,
                isDirectory: true
            });
        }, 0);
    }
      // Handle keyboard shortcuts for file creation
    useEffect(() => {
        const handleKeyDown = (e: globalThis.KeyboardEvent) => {
            // Ctrl+Alt+N for new file
            if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'n') {
                e.preventDefault();
                handleCreateRootFile();
            }
            // Ctrl+Alt+Shift+N for new folder
            else if (e.ctrlKey && e.altKey && e.shiftKey && e.key.toLowerCase() === 'n') {
                e.preventDefault();
                handleCreateRootDirectory();
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    
    // Handler to create a new file/folder in the selected directory
    const handleCreateItem = (parentId: Id, name: string, isDirectory: boolean) => {
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }
        
        // Validate file name
        const invalidChars = /[\\/:*?"<>|]/;
        if (invalidChars.test(name)) {
            toast.error("Name contains invalid characters");
            return;
        }
        
        if (isDirectory) {
            createDirectory(parentId, name);
        } else {
            createFile(parentId, name);
        }
        setCreatingNewItem(null);
    }
      // Handler to cancel the file/folder creation
    const handleCancelCreate = () => {
        console.log("Canceling file/folder creation");
        setCreatingNewItem(null);
    }
      const sortedFileStructure = sortFileSystemItem(fileStructure)

    return (
        <div onClick={handleClickOutside} className="flex flex-grow flex-col">            
            <div className="view-title flex justify-between">
                <h2>Files</h2>
                <div className="flex gap-2">                    <button
                        className="rounded-md px-1 hover:bg-darkHover"                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log("New file button clicked");
                            // Clear any existing creation first, then set new one
                            setCreatingNewItem(null);
                            setTimeout(() => {
                                setCreatingNewItem({
                                    parentId: fileStructure.id,
                                    isDirectory: false
                                });
                            }, 0);
                        }}
                        title="Create File"
                    >
                        <RiFileAddLine size={20} />
                    </button>
                    <button
                        className="rounded-md px-1 hover:bg-darkHover"                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log("New folder button clicked");
                            // Clear any existing creation first, then set new one
                            setCreatingNewItem(null);
                            setTimeout(() => {
                                setCreatingNewItem({
                                    parentId: fileStructure.id,
                                    isDirectory: true
                                });
                            }, 0);
                        }}
                        title="Create Directory"
                    >
                        <RiFolderAddLine size={20} />
                    </button>                    <button
                        className="rounded-md px-1 hover:bg-darkHover"
                        onClick={collapseDirectories}
                        title="Collapse All Directories"
                    >
                        <RiFolderUploadLine size={20} />
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                        <button
                            className="rounded-md px-1 hover:bg-darkHover text-gray-500"
                            onClick={() => {
                                console.log("Force update");
                                // Force a re-render by making a new creatingNewItem object
                                if (creatingNewItem) {
                                    setCreatingNewItem({...creatingNewItem});
                                } else {
                                    setCreatingNewItem(null);
                                }
                            }}
                            title="Debug: Force Update"
                        >
                            ↻
                        </button>
                    )}
                </div>
            </div>
            <div
                className={cn(
                    "min-h-[200px] flex-grow overflow-auto pr-2 sm:min-h-0",
                    {
                        "h-[calc(80vh-170px)]": !minHeightReached,
                        "h-[85vh]": minHeightReached,
                    },
                )}
                ref={explorerRef}
            >                {sortedFileStructure.children &&
                    sortedFileStructure.children.map((item) => (
                        <Directory
                            key={item.id}
                            item={item}
                            setSelectedDirId={setSelectedDirId}
                            creatingNewItem={creatingNewItem}
                            onCreateItem={handleCreateItem}
                            onCancelCreate={handleCancelCreate}
                            onCreateNewItem={setCreatingNewItem}
                        />
                    ))}                {/* Handle root level new item creation */}
                {creatingNewItem && creatingNewItem.parentId === fileStructure.id && (
                    <div className="border-l-2 border-blue-500 ml-2 bg-opacity-20 bg-blue-900 rounded my-1">
                        <NewItemInput 
                            isDirectory={creatingNewItem.isDirectory}
                            onSubmit={(name) => handleCreateItem(fileStructure.id, name, creatingNewItem.isDirectory)}
                            onCancel={handleCancelCreate}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

interface DirectoryProps {
    item: FileSystemItem;
    setSelectedDirId: (id: Id) => void;
    creatingNewItem: NewItemState | null;
    onCreateItem: (parentId: Id, name: string, isDirectory: boolean) => void;
    onCancelCreate: () => void;
    onCreateNewItem: (state: NewItemState) => void;
}

function Directory({
    item,
    setSelectedDirId,
    creatingNewItem,
    onCreateItem,
    onCancelCreate,
    onCreateNewItem
}: DirectoryProps) {
    const [isEditing, setEditing] = useState<boolean>(false)
    const [, setIsHovering] = useState<boolean>(false)
    const dirRef = useRef<HTMLDivElement | null>(null)
    const { position: coords, showMenu: menuOpen, handleContextMenu, closeMenu } = useContextMenu()
    const { deleteDirectory, toggleDirectory } = useFileSystem()
    
    const handleDirClick = (dirId: string) => {
        setSelectedDirId(dirId)
        toggleDirectory(dirId)
    }

    const handleContextMenuEvent = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        handleContextMenu(e)
    }

    const handleRenameDirectory = (e: MouseEvent) => {
        e.stopPropagation()
        closeMenu()
        setEditing(true)
    }

    const handleDeleteDirectory = (e: MouseEvent, id: Id) => {
        e.stopPropagation()
        closeMenu()
        const isConfirmed = confirm(
            `Are you sure you want to delete directory?`,
        )
        if (isConfirmed) {
            deleteDirectory(id)
        }
    }      // Create new file in this directory
    const handleCreateNewFile = (e: MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        closeMenu()
        console.log("Creating new file in directory:", item.id);
        
        // Cancel any existing creation first
        onCancelCreate();
        // Create new file directly without setTimeout
        onCreateNewItem({
            parentId: item.id,
            isDirectory: false
        });
    }
    
    // Create new folder in this directory
    const handleCreateNewFolder = (e: MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        closeMenu()
        console.log("Creating new folder in directory:", item.id);
        
        // Cancel any existing creation first
        onCancelCreate();
        // Create new folder directly without setTimeout
        onCreateNewItem({
            parentId: item.id,
            isDirectory: true
        });
    }// Add F2 key event listener to directory for renaming
    useEffect(() => {
        const dirNode = dirRef.current

        if (!dirNode) return

        dirNode.tabIndex = 0

        const handleF2 = (e: any) => {
            e.stopPropagation()
            if (e.key === "F2") {
                setEditing(true)
            }
        }

        dirNode.addEventListener("keydown", handleF2)

        return () => {
            dirNode.removeEventListener("keydown", handleF2)
        }
    }, [])

    if (item.type === "file") {
        return <File item={item} setSelectedDirId={setSelectedDirId} />
    }    return (
        <div className="overflow-x-auto">
            <div 
                className="flex w-full justify-between items-center rounded-md px-2 py-1 hover:bg-darkHover group"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >                <div 
                    className="flex flex-grow items-center"
                    onClick={() => handleDirClick(item.id)}
                    ref={dirRef}
                    onContextMenu={handleContextMenuEvent}
                >                    <div className="flex items-center justify-center min-w-[24px] mr-2">
                        {item.isOpen ? (
                            <AiOutlineFolderOpen size={24} />
                        ) : (
                            <AiOutlineFolder size={24} />
                        )}
                    </div>{isEditing ? (
                        <RenameView
                            id={item.id}
                            preName={item.name}
                            type="directory"
                            setEditing={setEditing}
                        />
                    ) : (
                        <p
                            className="flex-grow cursor-pointer overflow-hidden truncate flex items-center"
                            title={item.name}
                        >
                            {item.name}
                        </p>
                    )}
                </div>                  {/* Quick action buttons - visible on hover */}
                <div 
                    className="hidden group-hover:flex gap-1"
                    onMouseEnter={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsHovering(true);
                    }}
                >
                    <button 
                        className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
                        title="New File"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log("Creating new file in directory:", item.id);
                            // Make sure to explicitly set the parent ID without relying on state
                            onCancelCreate();
                            onCreateNewItem({
                                parentId: item.id,
                                isDirectory: false
                            });
                        }}
                    >
                        <RiFileAddLine size={16} />
                    </button>
                    <button 
                        className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
                        title="New Folder"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log("Creating new folder in directory:", item.id);
                            // Make sure to explicitly set the parent ID without relying on state
                            onCancelCreate();
                            onCreateNewItem({
                                parentId: item.id,
                                isDirectory: true
                            });
                        }}
                    >
                        <RiFolderAddLine size={16} />
                    </button>
                </div>
            </div>
            
            <div
                className={cn(
                    { hidden: !item.isOpen },
                    { block: item.isOpen },
                    { "pl-4": item.name !== "root" },
                )}
            >                {/* Show the new item input if this directory is the target for new item creation */}
                {creatingNewItem && creatingNewItem.parentId === item.id && (
                    <div className="pl-2 border-l-2 border-blue-500 bg-opacity-20 bg-blue-900 rounded my-1">
                        <NewItemInput 
                            isDirectory={creatingNewItem.isDirectory}
                            onSubmit={(name) => onCreateItem(item.id, name, creatingNewItem.isDirectory)}
                            onCancel={onCancelCreate}
                        />
                    </div>
                )}
                
                {/* Render children */}
                {item.children &&
                    item.children.map((childItem) => (
                        <Directory
                            key={childItem.id}
                            item={childItem}
                            setSelectedDirId={setSelectedDirId}
                            creatingNewItem={creatingNewItem}
                            onCreateItem={onCreateItem}
                            onCancelCreate={onCancelCreate}
                            onCreateNewItem={onCreateNewItem}
                        />
                    ))}
            </div>

            {menuOpen && (
                <DirectoryMenu
                    handleDeleteDirectory={handleDeleteDirectory}
                    handleRenameDirectory={handleRenameDirectory}
                    handleCreateNewFile={handleCreateNewFile}
                    handleCreateNewFolder={handleCreateNewFolder}
                    id={item.id}
                    left={coords.x}
                    top={coords.y}
                />
            )}
        </div>
    )
}

const File = ({
    item,
    setSelectedDirId,
}: {
    item: FileSystemItem
    setSelectedDirId: (id: Id) => void
}) => {
    const { deleteFile, openFile } = useFileSystem()
    const [isEditing, setEditing] = useState<boolean>(false)
    const { setIsSidebarOpen } = useViews()
    const { isMobile } = useWindowDimensions()
    const { activityState, setActivityState } = useAppContext()
    const fileRef = useRef<HTMLDivElement | null>(null)
    const { showMenu: menuOpen, position: coords, handleContextMenu, closeMenu: setMenuOpen } = useContextMenu()

    const handleFileClick = (fileId: string) => {
        if (isEditing) return
        setSelectedDirId(fileId)
        openFile(fileId)
        if (isMobile) {
            setIsSidebarOpen(false)
        }
        if (activityState === ACTIVITY_STATE.DRAWING) {
            setActivityState(ACTIVITY_STATE.CODING)
        }
    }
    
    const handleContextMenuEvent = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        handleContextMenu(e)
    }

    const handleRenameFile = (e: MouseEvent) => {
        e.stopPropagation()
        setEditing(true)
        setMenuOpen()
    }

    const handleDeleteFile = (e: MouseEvent, id: Id) => {
        e.stopPropagation()
        setMenuOpen()
        const isConfirmed = confirm(`Are you sure you want to delete file?`)
        if (isConfirmed) {
            deleteFile(id)
        }
    }    // Add F2 key event listener to file for renaming
    useEffect(() => {
        const fileNode = fileRef.current

        if (!fileNode) return

        fileNode.tabIndex = 0

        const handleF2 = (e: any) => {
            e.stopPropagation()
            if (e.key === "F2") {
                setEditing(true)
            }
        }

        fileNode.addEventListener("keydown", handleF2)

        return () => {
            fileNode.removeEventListener("keydown", handleF2)
        }
    }, []);    return (
        <div
            className="flex w-full items-center rounded-md px-2 py-1 hover:bg-darkHover"
            onClick={() => handleFileClick(item.id)}
            ref={fileRef}
            onContextMenu={handleContextMenuEvent}
        >            <div className="flex items-center justify-center min-w-[24px] mr-2">
                <Icon
                    icon={getIconClassName(item.name)}
                    fontSize={22}
                />
            </div>{isEditing ? (
                <RenameView
                    id={item.id}
                    preName={item.name}
                    type="file"
                    setEditing={setEditing}
                />
            ) : (
                <p
                    className="flex-grow cursor-pointer overflow-hidden truncate flex items-center"
                    title={item.name}
                >
                    {item.name}
                </p>
            )}

            {/* Context Menu For File*/}
            {menuOpen && (
                <FileMenu
                    top={coords.y}
                    left={coords.x}
                    id={item.id}
                    handleRenameFile={handleRenameFile}
                    handleDeleteFile={handleDeleteFile}
                />
            )}
        </div>
    )
}

const FileMenu = ({
    top,
    left,
    id,
    handleRenameFile,
    handleDeleteFile,
}: {
    top: number
    left: number
    id: Id
    handleRenameFile: (e: MouseEvent) => void
    handleDeleteFile: (e: MouseEvent, id: Id) => void
}) => {
    return (
        <div
            className="absolute z-10 w-[150px] rounded-md border border-darkHover bg-dark p-1"
            style={{
                top,
                left,
            }}
        >
            <button
                onClick={handleRenameFile}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-darkHover"
            >
                <PiPencilSimpleFill size={18} />
                Rename
            </button>
            <button
                onClick={(e) => handleDeleteFile(e, id)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-danger hover:bg-darkHover"
            >
                <MdDelete size={20} />
                Delete
            </button>
        </div>
    )
}

const DirectoryMenu = ({
    top,
    left,
    id,
    handleRenameDirectory,
    handleDeleteDirectory,
    handleCreateNewFile,
    handleCreateNewFolder,
}: {
    top: number
    left: number
    id: Id
    handleRenameDirectory: (e: MouseEvent) => void
    handleDeleteDirectory: (e: MouseEvent, id: Id) => void
    handleCreateNewFile: (e: MouseEvent) => void
    handleCreateNewFolder: (e: MouseEvent) => void
}) => {
    return (
        <div
            className="absolute z-10 w-[180px] rounded-md border border-darkHover bg-dark p-1"
            style={{
                top,
                left,
            }}
        >            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCreateNewFile(e);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-darkHover"
            >
                <RiFileAddLine size={18} />
                New File
            </button>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCreateNewFolder(e);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-darkHover"
            >
                <RiFolderAddLine size={18} />
                New Folder
            </button>
            <hr className="my-1 border-gray-700" />
            <button
                onClick={handleRenameDirectory}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-darkHover"
            >
                <PiPencilSimpleFill size={18} />
                Rename
            </button>
            <button
                onClick={(e) => handleDeleteDirectory(e, id)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-danger hover:bg-darkHover"
            >
                <MdDelete size={20} />
                Delete
            </button>
        </div>
    )
}

export default FileStructureView
