import { render, screen } from "@testing-library/react";
import ChatsView from "@/components/sidebar/sidebar-views/ChatsView.tsx";

jest.mock("@/components/chats/ChatList", () => jest.fn(() => <div data-testid="chat-list">ChatList</div>));
jest.mock("@/components/chats/ChatInput", () => jest.fn(() => <div data-testid="chat-input">ChatInput</div>));
jest.mock("@/hooks/useResponsive", () => jest.fn(() => ({ viewHeight: "500px" })));

describe("ChatsView Component", () => {
    test("renders the ChatsView component", () => {
        render(<ChatsView />);

        // Check if the title is rendered
        expect(screen.getByText("Group Chat")).toBeInTheDocument();

        // Check if the ChatList and ChatInput components are rendered
        expect(screen.getByTestId("chat-list")).toBeInTheDocument();
        expect(screen.getByTestId("chat-input")).toBeInTheDocument();
    });

    test("applies the correct height from useResponsive", () => {
        render(<ChatsView />);

        // Check if the height style is applied correctly
        const container = screen.getByText("Group Chat").parentElement;
        expect(container).toHaveStyle("height: 500px");
    });
});