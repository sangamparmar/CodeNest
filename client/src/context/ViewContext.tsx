import ChatsView from "@/components/sidebar/sidebar-views/ChatsView.tsx";
import FilesView from "@/components/sidebar/sidebar-views/FilesView.tsx";
import SettingsView from "@/components/sidebar/sidebar-views/SettingsView.tsx";
import RunView from "@/components/sidebar/sidebar-views/RunView.tsx";
import UsersView from "@/components/sidebar/sidebar-views/UsersView.tsx";
import AIAssistantView from "@/components/sidebar/sidebar-views/AIAssistantView.tsx";
import useWindowDimensions from "@/hooks/useWindowDimensions.tsx";
import { VIEWS, ViewContext as ViewContextType } from "@/types/view";
import { ReactNode, createContext, useContext, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { LuFiles, LuBrain } from "react-icons/lu";
import { PiChats, PiPlay, PiUsers } from "react-icons/pi";

const ViewContext = createContext<ViewContextType | null>(null);

export const useViews = (): ViewContextType => {
    const context = useContext(ViewContext);
    if (!context) {
        throw new Error("useViews must be used within a ViewContextProvider");
    }
    return context;
};

function ViewContextProvider({ children }: { children: ReactNode }) {
    const { isMobile } = useWindowDimensions();
    const [activeView, setActiveView] = useState<VIEWS>(VIEWS.FILES);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(!isMobile);
    const [viewComponents] = useState({
        [VIEWS.FILES]: <FilesView />,
        [VIEWS.CLIENTS]: <UsersView />,
        [VIEWS.SETTINGS]: <SettingsView />,
        [VIEWS.CHATS]: <ChatsView />,
        [VIEWS.RUN]: <RunView />,
        [VIEWS.AI_ASSISTANT]: <AIAssistantView />
    });
    const [viewIcons] = useState({
        [VIEWS.FILES]: <LuFiles size={28} />,
        [VIEWS.CLIENTS]: <PiUsers size={30} />,
        [VIEWS.SETTINGS]: <IoSettingsOutline size={28} />,
        [VIEWS.CHATS]: <PiChats size={30} />,
        [VIEWS.RUN]: <PiPlay size={28} />,
        [VIEWS.AI_ASSISTANT]: <LuBrain size={28} />
    });

    return (
        <ViewContext.Provider
            value={{
                activeView,
                setActiveView,
                isSidebarOpen,
                setIsSidebarOpen,
                viewComponents,
                viewIcons,
            }}
        >
            {children}
        </ViewContext.Provider>
    );
}

export { ViewContextProvider };
export default ViewContext;
