import { useState, useRef, FormEvent, useEffect } from "react";
import { useAIAssistant } from "@/context/AIAssistantContext.tsx";
import useResponsive from "@/hooks/useResponsive.tsx";
import { useFileSystem } from "@/context/FileContext.tsx";
import { LuSendHorizontal, LuTrash } from "react-icons/lu";
import { IoMdRefresh } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import React from "react";

const AIAssistantView = () => {
    const { viewHeight } = useResponsive();
    const { messages, sendMessage, clearConversation, isLoading } = useAIAssistant();
    const { activeFile } = useFileSystem();
    const [input, setInput] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    
    // Suggested prompts for the AI assistant
    const suggestedPrompts = [
        "Explain this code",
        "Generate documentation",
        "Find bugs in this code",
        "Refactor this function",
        "Suggest improvements",
        "Auto-complete this code"
    ];
    
    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    // Auto-resize textarea as user types
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = "auto";
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    }, [input]);
    
    // Handle message submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;
        
        await sendMessage(input);
        setInput("");
    };
    
    // Handle suggested prompt click
    const handlePromptClick = async (prompt: string) => {
        await sendMessage(prompt);
    };
    
    return (
        <div 
            className="flex flex-col w-full h-full overflow-hidden p-4"
            style={{ height: viewHeight }}
        >
            <div className="flex justify-between items-center mb-4">
                <h1 className="view-title">AI Code Assistant</h1>
                <button 
                    onClick={clearConversation}
                    className="p-2 rounded-md hover:bg-gray-700 text-gray-300"
                    title="Clear conversation"
                >
                    <LuTrash size={18} />
                </button>
            </div>
            
            {/* Message history */}
            <div className="flex-grow overflow-y-auto mb-4 pr-2">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <div className="mb-6 text-primary text-4xl">
                            <IoMdRefresh className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Gemini AI Assistant</h3>
                        <p className="text-gray-400 mb-4">
                            Ask me anything about your code. I can help explain, debug, refactor, and suggest improvements.
                        </p>
                        
                        {/* Suggested prompts */}
                        <div className="grid grid-cols-1 gap-2 w-full mt-2">
                            {suggestedPrompts.map((prompt, index) => (
                                <button 
                                    key={index}
                                    onClick={() => handlePromptClick(prompt)}
                                    className="py-2 px-3 text-sm text-left rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`mb-4 ${
                                message.role === 'user' ? 'ml-4' : 'mr-4'
                            }`}
                        >
                            <div 
                                className={`p-3 rounded-lg max-w-full ${
                                    message.role === 'user' 
                                        ? 'bg-primary text-black ml-auto' 
                                        : 'bg-gray-800 text-white'
                                }`}
                                style={{ maxWidth: "85%" }}
                            >
                                {message.role === 'user' ? (
                                    <div className="whitespace-pre-wrap">{message.content}</div>
                                ) : (
                                    <div className="markdown-content">
                                        <Markdown
                                            components={{
                                                code({node, className, children, ...props}: any) {
                                                    const match = /language-(\w+)/.exec(className || '');
                                                    return !props.inline && match ? (
                                                        <SyntaxHighlighter
                                                            style={vscDarkPlus as any}
                                                            language={match[1]}
                                                            PreTag="div"
                                                            {...props}
                                                        >
                                                            {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    ) : (
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    );
                                                }
                                            }}
                                        >
                                            {message.content}
                                        </Markdown>
                                    </div>
                                )}
                            </div>
                            <div 
                                className={`text-xs text-gray-400 mt-1 ${
                                    message.role === 'user' ? 'text-right' : 'text-left'
                                }`}
                            >
                                {message.timestamp}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
                
                {/* Loading animation */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center space-x-2 p-3 rounded-lg bg-gray-800 text-white mb-4"
                            style={{ maxWidth: "85%" }}
                        >
                            <div className="flex space-x-1">
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                                    className="h-2 w-2 bg-primary rounded-full"
                                ></motion.div>
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                    className="h-2 w-2 bg-primary rounded-full"
                                ></motion.div>
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                    className="h-2 w-2 bg-primary rounded-full"
                                ></motion.div>
                            </div>
                            <span className="text-sm text-gray-300">AI is thinking...</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* File context indicator */}
            {activeFile && (
                <div className="text-xs text-gray-400 mb-2">
                    <span>Using context from: </span>
                    <span className="text-primary font-medium">{activeFile.name}</span>
                </div>
            )}
            
            {/* Input form */}
            <form 
                onSubmit={handleSubmit}
                className="flex items-end bg-gray-800 rounded-md overflow-hidden border border-gray-700"
            >
                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask the AI about your code..."
                    className="w-full min-h-[44px] max-h-[150px] p-3 bg-transparent border-none outline-none resize-none"
                    disabled={isLoading}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (input.trim()) {
                                handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                            }
                        }
                    }}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="p-3 text-black bg-primary hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                    <LuSendHorizontal size={20} />
                </button>
            </form>
        </div>
    );
};

export default AIAssistantView;