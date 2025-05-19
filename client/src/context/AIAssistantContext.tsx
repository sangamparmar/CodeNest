import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { AIAssistantContext as AIAssistantContextType, AIMessage } from "@/types/aiAssistant";
import { GenerativeModel, GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import { formatDate } from "@/utils/formateDate";
import { useFileSystem } from "./FileContext";

const AIAssistantContext = createContext<AIAssistantContextType | null>(null);

export const useAIAssistant = (): AIAssistantContextType => {
    const context = useContext(AIAssistantContext);
    if (!context) {
        throw new Error("useAIAssistant must be used within an AIAssistantProvider");
    }
    return context;
};

export const AIAssistantProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<AIMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { activeFile } = useFileSystem();
    const [, setGenAI] = useState<GoogleGenerativeAI | null>(null);
    const [model, setModel] = useState<GenerativeModel | null>(null);
    const [apiKeyError, setApiKeyError] = useState<string | null>(null);

    useEffect(() => {
        const initializeAI = async () => {
            try {
                const apiKeyRaw = import.meta.env.VITE_GEMINI_API_KEY;
                if (!apiKeyRaw || typeof apiKeyRaw !== 'string') {
                    setApiKeyError("Gemini API key not found in environment variables");
                    return;
                }

                const API_KEY = apiKeyRaw.trim();
                const ai = new GoogleGenerativeAI(API_KEY);
                setGenAI(ai);

                const generativeModel = ai.getGenerativeModel({
                    model: "gemini-2.0-flash-lite",
                    safetySettings: [
                        {
                            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
                        }
                    ]
                });

                setModel(generativeModel);
                const testResult = await generativeModel.generateContent("Hello");
                if (!testResult || !testResult.response) {
                    throw new Error("Empty response from Gemini API");
                }
                setApiKeyError(null);
            } catch (error: any) {
                console.error("Gemini initialization error:", error);
                setApiKeyError("Gemini initialization failed: " + error.message);
            }
        };

        initializeAI();
    }, []);

    const sendMessage = async (content: string): Promise<void> => {
        try {
            setIsLoading(true);

            const userMessage: AIMessage = {
                id: uuidv4(),
                role: 'user',
                content: content,
                timestamp: formatDate(new Date().toISOString()),
            };

            setMessages(prev => [...prev, userMessage]);

            if (apiKeyError || !model) {
                throw new Error(apiKeyError || "AI model not initialized");
            }

            // ✅ FIX: Correct roles for Gemini chat history
            const history = [...messages, userMessage].map(msg => ({
                role: msg.role === "assistant" ? "model" : msg.role,
                parts: [{ text: msg.content }]
            }));

            let contextPrompt = "";
            if (activeFile?.content) {
                contextPrompt = `\nHere's the active file content:\n\`\`\`${activeFile.language || "text"}\n${activeFile.content}\n\`\`\`\n`;
            }

            const chat = model.startChat({
                history: history,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                },
            });

            const result = await chat.sendMessage(`${contextPrompt}${content}`);
            const aiResponse = result.response.text();

            const aiMessage: AIMessage = {
                id: uuidv4(),
                role: 'assistant',
                content: aiResponse,
                timestamp: formatDate(new Date().toISOString()),
            };

            setMessages(prev => [...prev, aiMessage]);

        } catch (error: any) {
            console.error('AI Communication Error:', error);

            const errorMessage: AIMessage = {
                id: uuidv4(),
                role: 'assistant',
                content: `Sorry, I encountered an error: ${apiKeyError || error.message || "Unknown error"}. Please make sure your Gemini API key is valid and configured in the .env file.`,
                timestamp: formatDate(new Date().toISOString()),
            };

            setMessages(prev => [...prev, errorMessage]);

        } finally {
            setIsLoading(false);
        }
    };

    const clearConversation = () => {
        setMessages([]);
    };

    return (
        <AIAssistantContext.Provider
            value={{
                messages,
                setMessages,
                isLoading,
                setIsLoading,
                sendMessage,
                clearConversation
            }}
        >
            {children}
        </AIAssistantContext.Provider>
    );
};
