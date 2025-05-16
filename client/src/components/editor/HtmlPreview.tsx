import React, { useState, useEffect, useRef } from "react";
import { useFileSystem } from "@/context/FileContext.tsx";
import { FileSystemItem } from "@/types/file";
import { toast } from "react-hot-toast";
import { FiMaximize, FiMinimize, FiSmartphone, FiTablet, FiMonitor, FiDownload, FiShare2, FiCopy, FiPlay } from "react-icons/fi";
import { HiOutlineCode, HiOutlineEye, HiOutlineViewGrid } from "react-icons/hi";
import { motion } from "framer-motion";
import useWindowDimensions from "@/hooks/useWindowDimensions.tsx";

interface HtmlPreviewProps {
  content: string;
  height: string;
}

type DeviceType = "mobile" | "tablet" | "desktop" | "fullwidth";
type ViewMode = "preview" | "code" | "split";

const HtmlPreview: React.FC<HtmlPreviewProps> = ({ content, height }) => {  const { fileStructure, activeFile, updateFileContent } = useFileSystem();  const [processedHtml, setProcessedHtml] = useState<string>(content);
  const [editableHtml, setEditableHtml] = useState<string>(content);
  const [blobUrls, setBlobUrls] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [deviceType, setDeviceType] = useState<DeviceType>("fullwidth");
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [, setHoveredButton] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);
  const { isMobile } = useWindowDimensions();

  // Helper function to find the parent directory of a file
  const findParentDirectory = (fileId: string): FileSystemItem | null => {
    const findParent = (directory: FileSystemItem, targetId: string): FileSystemItem | null => {
      if (directory.type === "directory" && directory.children) {
        // Check if any child has the target ID
        for (const child of directory.children) {
          if (child.id === targetId) {
            return directory; // This is the parent
          }
        }
        
        // Recursively check in subdirectories
        for (const child of directory.children) {
          if (child.type === "directory") {
            const found = findParent(child, targetId);
            if (found) return found;
          }
        }
      }
      return null;
    };

    return findParent(fileStructure, fileId);
  };  // Store the previous content for auto-refresh comparison
  const prevContentRef = useRef<string>("");
    // Initialize editable HTML from content and sync it after active file changes
  useEffect(() => {
    setEditableHtml(content);
    // This ensures the preview updates when switching between files
    setProcessedHtml(content);
  }, [content, activeFile]);  // Process HTML content to handle external resources
  useEffect(() => {
    // Always use the editableHtml for processing to ensure edits are reflected
    const htmlToProcess = editableHtml;
    
    // Always process content on every change to ensure preview stays updated
    // This ensures we don't have black/glitchy previews when editing
    
    // Update the previous content reference
    prevContentRef.current = htmlToProcess;
    
    if (!activeFile) {
      setError("No active file found");
      setIsLoading(false);
      return;
    }try {
      setIsLoading(true);
      setError(null);

      // Create a temporary DOM element to parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlToProcess, "text/html");
      
      // Check if there was an error parsing the HTML
      const parseError = doc.querySelector("parsererror");
      if (parseError) {
        setError("Error parsing HTML content");
        setIsLoading(false);
        return;
      }
      
      // Find all external resources (CSS and JavaScript files)
      const links = Array.from(doc.querySelectorAll("link[rel='stylesheet']"));
      const scripts = Array.from(doc.querySelectorAll("script[src]"));
      const images = Array.from(doc.querySelectorAll("img[src]"));
      
      // Release any previous blob URLs
      blobUrls.forEach(url => URL.revokeObjectURL(url));
      const newBlobUrls: string[] = [];
      
      // Find parent directory of the active HTML file
      const parentDir = findParentDirectory(activeFile.id);
      
      if (parentDir && parentDir.children) {
        // Process CSS links
        links.forEach(link => {
          const href = link.getAttribute("href");
          if (!href || href.startsWith("http") || href.startsWith("data:")) return; // Skip absolute URLs and data URLs
          
          // Find the CSS file in the same directory
          const cssFileName = href.split("/").pop();
          if (!cssFileName) return;
          
          const cssFile = parentDir.children?.find(
            file => file.type === "file" && file.name === cssFileName
          );
          
          if (cssFile && cssFile.content) {
            // Create a blob URL for the CSS file
            const cssBlob = new Blob([cssFile.content], { type: "text/css" });
            const cssBlobUrl = URL.createObjectURL(cssBlob);
            newBlobUrls.push(cssBlobUrl);
            
            // Update the href in the HTML
            link.setAttribute("href", cssBlobUrl);
          } else {
            console.warn(`CSS file not found: ${cssFileName}`);
          }
        });
        
        // Process JavaScript scripts
        scripts.forEach(script => {
          const src = script.getAttribute("src");
          if (!src || src.startsWith("http") || src.startsWith("data:")) return; // Skip absolute URLs and data URLs
          
          // Find the JS file in the same directory
          const jsFileName = src.split("/").pop();
          if (!jsFileName) return;
          
          const jsFile = parentDir.children?.find(
            file => file.type === "file" && file.name === jsFileName
          );
          
          if (jsFile && jsFile.content) {
            // Create a blob URL for the JS file
            const jsBlob = new Blob([jsFile.content], { type: "text/javascript" });
            const jsBlobUrl = URL.createObjectURL(jsBlob);
            newBlobUrls.push(jsBlobUrl);
            
            // Update the src in the HTML
            script.setAttribute("src", jsBlobUrl);
          } else {
            console.warn(`JavaScript file not found: ${jsFileName}`);
          }
        });
        
        // Process images
        images.forEach(img => {
          const src = img.getAttribute("src");
          if (!src || src.startsWith("http") || src.startsWith("data:")) return; // Skip absolute URLs and data URLs
          
          // Find the image file in the same directory
          const imgFileName = src.split("/").pop();
          if (!imgFileName) return;
          
          const imgFile = parentDir.children?.find(
            file => file.type === "file" && file.name === imgFileName
          );
          
          if (imgFile && imgFile.content) {
            // Determine image MIME type from extension
            const fileExt = imgFileName.split('.').pop()?.toLowerCase() || '';
            let mimeType = 'image/png'; // default
            
            if (fileExt === 'jpg' || fileExt === 'jpeg') mimeType = 'image/jpeg';
            else if (fileExt === 'gif') mimeType = 'image/gif';
            else if (fileExt === 'svg') mimeType = 'image/svg+xml';
            else if (fileExt === 'webp') mimeType = 'image/webp';
            
            try {
              // For images, we can use base64 encoding to handle binary content
              // Note: This will only work if the image content is properly stored as base64
              if (imgFile.content.startsWith('data:')) {
                img.setAttribute("src", imgFile.content);
              } else {
                // Attempt to create blob URL
                const imgBlob = new Blob([imgFile.content], { type: mimeType });
                const imgBlobUrl = URL.createObjectURL(imgBlob);
                newBlobUrls.push(imgBlobUrl);
                img.setAttribute("src", imgBlobUrl);
              }
            } catch (imageError) {
              console.warn(`Failed to process image ${imgFileName}:`, imageError);
            }
          } else {
            console.warn(`Image file not found: ${imgFileName}`);
          }
        });
      } else {
        console.warn("Parent directory not found for HTML file");
      }
      
      // Create a blob URL for the modified HTML content
      const processedContent = doc.documentElement.outerHTML;
      const htmlBlob = new Blob([processedContent], { type: "text/html" });
      const htmlBlobUrl = URL.createObjectURL(htmlBlob);
      newBlobUrls.push(htmlBlobUrl);
      
      setProcessedHtml(processedContent);
      setPreviewUrl(htmlBlobUrl);
      setBlobUrls(newBlobUrls);
      setIsLoading(false);
    } catch (e) {
      console.error("Error processing HTML preview:", e);
      setError("Failed to generate preview");
      setIsLoading(false);
    }
  }, [content, activeFile, fileStructure]);
  // Clean up all blob URLs when component unmounts
  useEffect(() => {
    return () => {
      blobUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [blobUrls]);
  
  // Save edits when component unmounts
  useEffect(() => {
    return () => {
      // Save any pending changes when component unmounts
      if (activeFile?.id && editableHtml !== content) {
        updateFileContent(activeFile.id, editableHtml);
      }
    };
  }, [activeFile, editableHtml, content, updateFileContent]);
    
  // Faster initialization when component mounts
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Reduced from 1000ms to 300ms for faster initial load
    
    return () => clearTimeout(timer);
  }, []);
  // Handle iframe load events
  const handleIframeLoad = () => {
    setIsLoading(false);
    setLastRefreshed(new Date());
  };
  
  const handleIframeError = () => {
    setError("Failed to load preview");
    setIsLoading(false);
  };
  // Safety mechanism to ensure loading state doesn't get stuck
  useEffect(() => {
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        // If still loading after 1.5 seconds, force reset the loading state
        setIsLoading(false);
      }, 1500); // Reduced from 3000ms to 1500ms for faster timeout
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading]);
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  // Handle device type selection
  const handleDeviceChange = (type: DeviceType) => {
    setDeviceType(type);
  };
  // Handle view mode selection
  const handleViewModeChange = (mode: ViewMode) => {
    // If switching to or staying in preview or split view, update the preview
    if (mode === 'preview' || mode === 'split' || viewMode === 'code') {
      // Always apply the latest editable content to preview when switching modes
      setProcessedHtml(editableHtml);
      // Reset loading state to trigger a refresh
      setIsLoading(true);
      
      // Save changes to file
      if (activeFile && activeFile.id && editableHtml !== content) {
        updateFileContent(activeFile.id, editableHtml);
      }
      
      // Force the iframe to refresh by updating the key
      if (previewUrl) {
        // Generate a new blob URL to force refresh
        const htmlBlob = new Blob([editableHtml], { type: "text/html" });
        const newBlobUrl = URL.createObjectURL(htmlBlob);
        blobUrls.forEach(url => URL.revokeObjectURL(url));
        setBlobUrls([newBlobUrl]);
        setPreviewUrl(newBlobUrl);
      }
    }
    setViewMode(mode);
  };// Force sync between edited content and preview  // Handle code editor changes
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setEditableHtml(newValue);
    
    if (autoRefresh) {
      // If auto-refresh is enabled, process the new content after a short delay
      setIsLoading(true);
      // Use debouncing to prevent too many refreshes
      const timeoutId = setTimeout(() => {
        try {
          // Reset any previous errors before processing
          setError(null);
          setProcessedHtml(newValue);
          
          // Create a new blob URL to force the iframe to refresh with new content
          const htmlBlob = new Blob([newValue], { type: "text/html" });
          const newBlobUrl = URL.createObjectURL(htmlBlob);
          
          // Clean up old blob URLs
          blobUrls.forEach(url => URL.revokeObjectURL(url));
          setBlobUrls([newBlobUrl]);
          setPreviewUrl(newBlobUrl);
          
          // Update the file content in the file system
          if (activeFile && activeFile.id) {
            updateFileContent(activeFile.id, newValue);
            toast.success("Changes saved", { duration: 1000 });
          }
        } catch (err) {
          console.error("Error updating preview:", err);
          setIsLoading(false);
        }
      }, 300); // Reduced from 500ms to 300ms for faster updates
      
      return () => clearTimeout(timeoutId);
    }
  };// Apply changes from code editor to preview - improved performance
  const handleApplyChanges = () => {
    setIsLoading(true);
    try {
      // Reset any previous errors
      setError(null);
      // Apply the changes to preview
      setProcessedHtml(editableHtml);
      
      // Create a new blob URL to force the iframe to refresh with new content
      const htmlBlob = new Blob([editableHtml], { type: "text/html" });
      const newBlobUrl = URL.createObjectURL(htmlBlob);
      
      // Clean up old blob URLs
      blobUrls.forEach(url => URL.revokeObjectURL(url));
      setBlobUrls([newBlobUrl]);
      setPreviewUrl(newBlobUrl);
      
      // Update the file content in the file system
      if (activeFile && activeFile.id) {
        updateFileContent(activeFile.id, editableHtml);
        toast.success("Changes applied and saved", { duration: 1500 });
      }
      
      // Ensure loading state gets cleared if iframe doesn't trigger onLoad
      setTimeout(() => {
        if (document.querySelector('.preview-container iframe')) {
          setIsLoading(false);
        }
      }, 500); // Even faster timeout for better responsiveness
    } catch (err) {
      console.error("Error applying changes:", err);
      setIsLoading(false);
    }
  };
  
  // Download HTML file
  const handleDownload = () => {
    if (!processedHtml) return;
    
    const element = document.createElement("a");
    const file = new Blob([processedHtml], {type: "text/html"});
    element.href = URL.createObjectURL(file);
    element.download = activeFile?.name || "preview.html";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("HTML file downloaded");
  };
  
  // Share preview link (creates a sharable object URL)
  const handleShare = () => {
    if (navigator.share && previewUrl) {
      navigator.share({
        title: activeFile?.name || "HTML Preview",
        text: "Check out this HTML preview",
        url: previewUrl
      }).then(() => {
        toast.success("Shared successfully");
      }).catch((error) => {
        toast.error("Error sharing: " + error);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(previewUrl)
        .then(() => toast.success("Preview URL copied to clipboard"))
        .catch(() => toast.error("Failed to copy URL"));
    }
  };
  // Calculate iframe dimensions based on device type
  const getIframeStyles = () => {
    if (isFullscreen) {
      return { width: '100%', height: '100%' };
    }
    
    switch (deviceType) {
      case 'mobile':
        return { width: '375px', height: height, margin: '0 auto', border: '10px solid #333', borderRadius: '20px' };
      case 'tablet':
        return { width: '768px', height: height, margin: '0 auto', border: '16px solid #333', borderRadius: '12px' };
      case 'desktop':
        return { width: '1280px', height: height, margin: '0 auto', border: '0', boxShadow: '0 3px 10px rgba(0,0,0,0.2)' };
      default:
        return { width: '100%', height: height, border: '0' };
    }
  };
  
  // Calculate toolbar status text
  const getStatusText = () => {
    if (lastRefreshed) {
      const formattedTime = lastRefreshed.toLocaleTimeString();
      return `Last refreshed at ${formattedTime}`;
    }
    return '';
  };
  
  // Prepare code view content
  const prepareCodeView = () => {
    return processedHtml
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center flex-col">        <div className="text-red-500 mb-2">⚠️ {error}</div>
        <div className="text-gray-400 text-sm">Try switching back to code view and check for HTML errors</div>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={() => setViewMode('code')}
        >
          Switch to Code View
        </button>
      </div>
    );
  }
  return (
    <div className={`w-full relative ${isFullscreen ? 'fixed inset-0 bg-gray-900 z-50' : 'h-full'}`}>
      {/* Preview Toolbar */}
      <div className="w-full bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle - Animated Enhanced Version */}
          <div className="flex bg-gray-700 rounded-md overflow-hidden shadow-lg">
            <motion.button 
              className={`px-3 py-2 text-xs relative`}
              onClick={() => handleViewModeChange('preview')}
              title="Preview Mode"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setHoveredButton('preview')}
              onHoverEnd={() => setHoveredButton(null)}
            >
              <div className="relative z-10 flex items-center justify-center">
                <HiOutlineEye className={`${isMobile ? '' : 'mr-1'} inline text-lg`} />
                {!isMobile && <span>Preview</span>}
              </div>
              {viewMode === 'preview' && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-md"
                  layoutId="viewModeBackground"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{ zIndex: 0 }}
                />
              )}
              <span className={`${viewMode === 'preview' ? 'text-white' : 'text-gray-300'} relative z-10`}></span>
            </motion.button>
            
            <motion.button 
              className={`px-3 py-2 text-xs relative`}
              onClick={() => handleViewModeChange('code')}
              title="Code Mode"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setHoveredButton('code')}
              onHoverEnd={() => setHoveredButton(null)}
            >
              <div className="relative z-10 flex items-center justify-center">
                <HiOutlineCode className={`${isMobile ? '' : 'mr-1'} inline text-lg`} />
                {!isMobile && <span>Code</span>}
              </div>
              {viewMode === 'code' && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-md"
                  layoutId="viewModeBackground"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{ zIndex: 0 }}
                />
              )}
              <span className={`${viewMode === 'code' ? 'text-white' : 'text-gray-300'} relative z-10`}></span>
            </motion.button>
            
            <motion.button 
              className={`px-3 py-2 text-xs relative`}
              onClick={() => handleViewModeChange('split')}
              title="Split View"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setHoveredButton('split')}
              onHoverEnd={() => setHoveredButton(null)}
            >
              <div className="relative z-10 flex items-center justify-center">
                <HiOutlineViewGrid className={`${isMobile ? '' : 'mr-1'} inline text-lg`} />
                {!isMobile && <span>Split</span>}
              </div>
              {viewMode === 'split' && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-md"
                  layoutId="viewModeBackground"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{ zIndex: 0 }}
                />
              )}
              <span className={`${viewMode === 'split' ? 'text-white' : 'text-gray-300'} relative z-10`}></span>
            </motion.button>
          </div>
            {/* Responsive View Options (Only visible in preview mode) - Animated Enhanced Version */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className="flex bg-gray-700 rounded-md overflow-hidden ml-2 shadow-md">
              <motion.button 
                className={`px-2 py-2 text-xs relative`}
                onClick={() => handleDeviceChange('mobile')}
                title="Mobile View"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative z-10">
                  <FiSmartphone className="text-lg" />
                </div>
                {deviceType === 'mobile' && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-600"
                    layoutId="deviceBackground"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ zIndex: 0 }}
                  />
                )}
                <span className={`${deviceType === 'mobile' ? 'text-white' : 'text-gray-300'} relative z-10`}></span>
              </motion.button>
              
              <motion.button 
                className={`px-2 py-2 text-xs relative`}
                onClick={() => handleDeviceChange('tablet')}
                title="Tablet View"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative z-10">
                  <FiTablet className="text-lg" />
                </div>
                {deviceType === 'tablet' && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-600"
                    layoutId="deviceBackground"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ zIndex: 0 }}
                  />
                )}
                <span className={`${deviceType === 'tablet' ? 'text-white' : 'text-gray-300'} relative z-10`}></span>
              </motion.button>
              
              <motion.button 
                className={`px-2 py-2 text-xs relative`}
                onClick={() => handleDeviceChange('desktop')}
                title="Desktop View"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative z-10">
                  <FiMonitor className="text-lg" />
                </div>
                {deviceType === 'desktop' && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-600"
                    layoutId="deviceBackground"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ zIndex: 0 }}
                  />
                )}
                <span className={`${deviceType === 'desktop' ? 'text-white' : 'text-gray-300'} relative z-10`}></span>
              </motion.button>
              
              <motion.button 
                className={`px-2 py-2 text-xs relative`}
                onClick={() => handleDeviceChange('fullwidth')}
                title="Full Width"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative z-10">
                  <FiMaximize style={{ transform: 'rotate(45deg)' }} className="text-lg" />
                </div>
                {deviceType === 'fullwidth' && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-600"
                    layoutId="deviceBackground"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ zIndex: 0 }}
                  />
                )}
                <span className={`${deviceType === 'fullwidth' ? 'text-white' : 'text-gray-300'} relative z-10`}></span>
              </motion.button>
            </div>
          )}</div>
        
        <div className="text-xs text-gray-400 flex items-center">
          <label className="inline-flex items-center cursor-pointer mr-3">
            <span className="sr-only">Auto-refresh</span>
            <input 
              type="checkbox" 
              checked={autoRefresh} 
              onChange={() => setAutoRefresh(!autoRefresh)} 
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ms-2 text-xs text-gray-400">Auto</span>
          </label>
          {getStatusText()}
        </div>
          <div className="flex space-x-2">
          {/* Show apply changes button when in editable code view */}
          {(viewMode === 'code' || viewMode === 'split') && isEditing && !autoRefresh && (
            <motion.button 
              className="flex items-center px-3 py-1 text-xs bg-gradient-to-r from-green-500 to-green-600 text-white rounded shadow-md"
              onClick={handleApplyChanges}
              title="Apply Changes"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlay className="mr-1" />
              Apply
            </motion.button>
          )}
            <motion.button 
            className="p-2 text-gray-300 bg-gray-700 rounded-full shadow-md"
            onClick={handleDownload}
            title="Download HTML"
            whileHover={{ 
              scale: 1.1, 
              backgroundColor: "#3B82F6", 
              color: "white", 
              transition: { duration: 0.2 } 
            }}
            whileTap={{ scale: 0.9 }}
          >
            <FiDownload />
          </motion.button>
          
          <motion.button 
            className="p-2 text-gray-300 bg-gray-700 rounded-full shadow-md"
            onClick={handleShare}
            title="Share Preview"
            whileHover={{ 
              scale: 1.1, 
              backgroundColor: "#3B82F6", 
              color: "white", 
              transition: { duration: 0.2 } 
            }}
            whileTap={{ scale: 0.9 }}
          >
            <FiShare2 />
          </motion.button>
          
          <motion.button 
            className="p-2 text-gray-300 bg-gray-700 rounded-full shadow-md"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            whileHover={{ 
              scale: 1.1, 
              backgroundColor: "#3B82F6", 
              color: "white", 
              transition: { duration: 0.2 } 
            }}
            whileTap={{ scale: 0.9 }}
          >
            {isFullscreen ? <FiMinimize /> : <FiMaximize />}
          </motion.button>
        </div>
      </div>
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-10">
          <div className="text-gray-200 flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading preview...
          </div>
        </div>
      )}
      
      {/* Content Area */}
      <div className={`preview-container w-full overflow-auto bg-gray-900 ${viewMode === 'split' ? 'flex' : 'block'}`} 
        style={{ height: `calc(${height} - 44px)` }}
      >
        {/* Preview Panel */}        {(viewMode === 'preview' || viewMode === 'split') && previewUrl && (
          <div className={`preview-panel ${viewMode === 'split' ? 'w-1/2' : 'w-full'} h-full overflow-auto p-4`}>
            <div className={`iframe-container ${deviceType !== 'fullwidth' ? 'flex justify-center' : ''}`}>
              <iframe
                ref={iframeRef}
                src={previewUrl}
                title="HTML Preview"
                className={`transition-all duration-200 ${deviceType !== 'fullwidth' ? 'shadow-lg' : 'w-full'}`}
                style={getIframeStyles()}
                sandbox="allow-scripts allow-same-origin"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                key={previewUrl} // Add a key to force re-render when URL changes
              />
            </div>
          </div>
        )}
          {/* Code Panel - Now with Editable Mode */}
        {(viewMode === 'code' || viewMode === 'split') && (
          <div className={`code-panel ${viewMode === 'split' ? 'w-1/2' : 'w-full'} h-full overflow-auto relative`}>
            {/* Code editing controls */}
            <div className="absolute top-2 right-4 z-10 flex space-x-1">
              <motion.button
                className={`px-3 py-1 text-xs rounded-md shadow-md ${isEditing ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                onClick={() => setIsEditing(!isEditing)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isEditing ? 'Editing' : 'Edit'}
              </motion.button>
              
              <motion.button
                className="px-3 py-1 text-xs rounded-md bg-gray-700 text-gray-300 shadow-md"
                onClick={() => {
                  navigator.clipboard.writeText(editableHtml);
                  toast.success("HTML copied to clipboard");
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiCopy className="inline mr-1" />
                Copy
              </motion.button>
            </div>
            
            {/* Display editable textarea when in edit mode, otherwise show highlighted code */}
            {isEditing ? (
              <motion.textarea
                ref={codeEditorRef}
                value={editableHtml}
                onChange={handleCodeChange}
                className="w-full h-full bg-gray-800 text-gray-200 p-4 m-0 text-sm font-mono resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                style={{
                  lineHeight: '1.5rem',
                  tabSize: 2,
                }}
                spellCheck={false}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <motion.pre 
                className="bg-gray-800 text-gray-200 p-4 h-full m-0 text-sm overflow-x-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <code dangerouslySetInnerHTML={{ __html: prepareCodeView() }} />
              </motion.pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HtmlPreview;
