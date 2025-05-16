import { useState, useEffect, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileSystemItem } from "@/types/file";
import { toast } from "react-hot-toast";
import { PiFileCodeFill, PiFileCssFill, PiFileHtmlFill, PiFileJsFill, PiFileTextFill } from "react-icons/pi";
import { AiOutlineFolder } from "react-icons/ai";

// Common file types with their icons and extensions
const FILE_TEMPLATES = [
  { type: "HTML", icon: <PiFileHtmlFill size={20} />, extension: ".html" },
  { type: "CSS", icon: <PiFileCssFill size={20} />, extension: ".css" },
  { type: "JavaScript", icon: <PiFileJsFill size={20} />, extension: ".js" },
  { type: "TypeScript", icon: <PiFileCodeFill size={20} className="text-blue-400" />, extension: ".ts" },
  { type: "Text", icon: <PiFileTextFill size={20} />, extension: ".txt" },
];

interface FileCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  parentDir: FileSystemItem | null;
  onCreate: (name: string, isDirectory: boolean) => void;
  isFileExist: (name: string) => boolean;
}

export default function FileCreateDialog({
  isOpen,
  onClose,
  parentDir,
  onCreate,
  isFileExist
}: FileCreateDialogProps) {
  const [fileName, setFileName] = useState("");
  const [isDirectory, setIsDirectory] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFileName("");
      setIsDirectory(false);
      setActiveTemplate(null);
      // Focus the input field after a short delay to allow the dialog to render
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    }
  }, [isOpen]);

  // Apply file template
  const handleTemplateClick = (index: number) => {
    setActiveTemplate(index);
    setIsDirectory(false);
    
    // If user has already started typing a name, preserve that part
    const currentName = fileName.split(".")[0];
    setFileName(currentName ? `${currentName}${FILE_TEMPLATES[index].extension}` : FILE_TEMPLATES[index].extension);
  };

  // Switch to folder creation mode
  const handleFolderClick = () => {
    setIsDirectory(true);
    setActiveTemplate(null);
    
    // Remove file extension if present
    const nameParts = fileName.split(".");
    if (nameParts.length > 1) {
      setFileName(nameParts[0]);
    }
  };

  const handleCreateFile = () => {
    if (!fileName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    
    // Validate file name
    const invalidChars = /[\\/:*?"<>|]/;
    if (invalidChars.test(fileName)) {
      toast.error("Name contains invalid characters");
      return;
    }

    // Check if a file with the same name exists
    if (isFileExist(fileName)) {
      toast.error(isDirectory ? "Folder already exists" : "File already exists");
      return;
    }

    // Create the file or folder
    onCreate(fileName, isDirectory);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark text-white border-gray-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isDirectory ? "Create New Folder" : "Create New File"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <Input
            ref={inputRef}
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder={isDirectory ? "Folder name" : "File name"}
            className="bg-gray-800 border-gray-700 focus:border-gray-600 text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateFile();
              }
            }}
          />

          {/* Type selector */}
          <div className="mt-4 grid grid-cols-6 gap-2">
            <button
              type="button"
              className={`flex flex-col items-center justify-center p-2 rounded-md transition-all ${
                isDirectory ? "bg-gray-700" : "hover:bg-gray-800"
              }`}
              onClick={handleFolderClick}
              title="Folder"
            >
              <AiOutlineFolder size={24} />
              <span className="text-xs mt-1">Folder</span>
            </button>
            
            {FILE_TEMPLATES.map((template, index) => (
              <button
                key={template.type}
                type="button"
                className={`flex flex-col items-center justify-center p-2 rounded-md transition-all ${
                  activeTemplate === index ? "bg-gray-700" : "hover:bg-gray-800"
                }`}
                onClick={() => handleTemplateClick(index)}
                title={template.type}
              >
                {template.icon}
                <span className="text-xs mt-1">{template.type}</span>
              </button>
            ))}
          </div>
          
          {parentDir && (
            <div className="mt-4 text-sm text-gray-400">
              <span>
                Location: {parentDir.name === "root" ? "/" : parentDir.name}
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-700 text-white hover:bg-gray-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateFile}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
