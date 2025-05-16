import React from "react";
import { ReactNode } from "react"
import { AppContextProvider } from "./AppContext"
import { ChatContextProvider } from "./ChatContext"
import { FileContextProvider } from "./FileContext"
import { RoomSettingsProvider } from "./RoomSettingsContext"
import { RunCodeContextProvider } from "./RunCodeContext"
import { SettingContextProvider } from "./SettingContext"
import { SocketProvider } from "./SocketContext"
import { ViewContextProvider } from "./ViewContext"
import { AIAssistantProvider } from "./AIAssistantContext"

// Simple error boundary component to catch errors in providers
class ProviderErrorBoundary extends React.Component<{children: ReactNode, fallback?: ReactNode}> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: any, info: any) {
        console.error("Provider Error:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || null;
        }
        return this.props.children;
    }
}

function AppProvider({ children }: { children: ReactNode }) {
    return (
        <AppContextProvider>
            <SocketProvider>
                <SettingContextProvider>
                    <RoomSettingsProvider>
                        <ViewContextProvider>
                            <FileContextProvider>
                                <AIAssistantProvider>
                                        <ProviderErrorBoundary>
                                            <RunCodeContextProvider>
                                                <ChatContextProvider>
                                                    {children}
                                                </ChatContextProvider>
                                            </RunCodeContextProvider>
                                        </ProviderErrorBoundary>
                                </AIAssistantProvider>
                            </FileContextProvider>
                        </ViewContextProvider>
                    </RoomSettingsProvider>
                </SettingContextProvider>
            </SocketProvider>
        </AppContextProvider>
    )
}

export default AppProvider
