import React, { useEffect, useRef, useState } from "react";
import { AiOutlineFolder } from "react-icons/ai";
import { PiFileFill } from "react-icons/pi";
import toast from "react-hot-toast";

interface NewItemInputProps {
    isDirectory: boolean;
    onSubmit: (name: string) => void;
    onCancel: () => void;
}

function NewItemInput({ isDirectory, onSubmit, onCancel }: NewItemInputProps) {
    const [name, setName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
      useEffect(() => {
        // Focus the input when component mounts
        if (inputRef.current) {
            // Small delay to ensure the DOM is ready
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            }, 10);
        }
    }, []);
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Form submitted with name:", name);
        
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }
        
        const invalidChars = /[\\/:*?"<>|]/;
        if (invalidChars.test(name)) {
            toast.error("Name contains invalid characters");
            return;
        }
        
        // Provide visual feedback that submission is happening
        setTimeout(() => {
            onSubmit(name);
        }, 10);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            onCancel();
        }
    };
      return (
        <div className="px-2 py-1">
            <form onSubmit={handleSubmit} className="flex items-center w-full">
                {isDirectory ? (
                    <AiOutlineFolder size={24} className="mr-2 min-w-fit text-gray-400" />
                ) : (
                    <PiFileFill size={22} className="mr-2 min-w-fit text-gray-400" />
                )}<input
                    type="text"
                    ref={inputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                        handleKeyDown(e);
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    // Only cancel on blur if clicked outside the form
                    onBlur={(e) => {
                        // Give a small timeout to allow for clicking the form submit button
                        setTimeout(() => {
                            if (document.activeElement?.tagName !== 'BUTTON' && 
                                !e.currentTarget.contains(document.activeElement)) {
                                if (name.trim()) {
                                    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
                                } else {
                                    onCancel();
                                }
                            }
                        }, 100);
                    }}                    placeholder={isDirectory ? "Folder name..." : "File name..."}
                    className="flex-grow bg-gray-800 border-b-2 border-blue-500 outline-none text-white py-1 px-2 rounded"
                    autoFocus
                />
            </form>
        </div>
    );
}

export default NewItemInput;
