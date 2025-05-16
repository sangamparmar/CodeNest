import { render, screen } from "@testing-library/react";
import ViewButton from "@/components/sidebar/sidebar-views/SidebarButton";
import { VIEWS } from "@/types/view";

jest.mock("@/context/ViewContext", () => ({
    useViews: jest.fn(() => ({
        activeView: VIEWS.FILES,
        setActiveView: jest.fn(),
        isSidebarOpen: false,
        setIsSidebarOpen: jest.fn(),
    })),
}));

jest.mock("@/context/ChatContext", () => ({
    useChatRoom: jest.fn(() => ({
        isNewMessage: false,
    })),
}));

jest.mock("@/hooks/useWindowDimensions", () => jest.fn(() => ({ width: 1200 })));

describe("SidebarButton Component", () => {
    test("renders the SidebarButton component", () => {
        render(<ViewButton viewName={VIEWS.FILES} icon={<div>Icon</div>} />);

        // Check if the button is rendered
        expect(screen.getByRole("button")).toBeInTheDocument();

        // Check if the icon is rendered
        expect(screen.getByText("Icon")).toBeInTheDocument();
    });

    test("shows tooltip when width is greater than 1024", () => {
        render(<ViewButton viewName={VIEWS.FILES} icon={<div>Icon</div>} />);

        // Check if the tooltip is rendered
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("data-tooltip-id", "tooltip-FILES");
        expect(button).toHaveAttribute("data-tooltip-content", "FILES");
    });

    test("renders without crashing", () => {
        render(<ViewButton viewName={VIEWS.FILES} icon={<div>Icon</div>} />);

        // Ensure the component renders without errors
        expect(screen.getByRole("button")).toBeInTheDocument();
    });
});