// Represents a message in the AI chat
interface AIMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

// AI assistant context type
interface AIAssistantContext {
    messages: AIMessage[];
    setMessages: (messages: AIMessage[] | ((messages: AIMessage[]) => AIMessage[])) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    sendMessage: (content: string) => Promise<void>;
    clearConversation: () => void;
}

// Gemini AI model options
type AIModelOptions = 'gemini-pro' | 'gemini-pro-vision' | 'gemini-1.5-pro' | 'gemini-2.0-flash-lite';

export { AIMessage, AIAssistantContext, AIModelOptions };