import { render, screen, fireEvent } from "@testing-library/react";
import UsersView from "@/components/sidebar/sidebar-views/UsersView";
import { USER_STATUS } from "@/types/user";

jest.mock("@/components/common/Users", () => jest.fn(() => <div data-testid="users-component">Users Component</div>));
jest.mock("@/hooks/useResponsive", () => jest.fn(() => ({ viewHeight: "500px" })));

const mockSetStatus = jest.fn();
const mockSocket = { disconnect: jest.fn() };
const mockNavigate = jest.fn();

jest.mock("@/context/AppContext", () => ({
    useAppContext: jest.fn(() => ({
        setStatus: mockSetStatus,
    })),
}));

jest.mock("@/context/SocketContext", () => ({
    useSocket: jest.fn(() => ({
        socket: mockSocket,
    })),
}));

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(() => mockNavigate),
}));

describe("UsersView Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders the UsersView component", () => {
        render(<UsersView />);

        // Check if the title is rendered
        expect(screen.getByText("Users")).toBeInTheDocument();

        // Check if the Users component is rendered
        expect(screen.getByTestId("users-component")).toBeInTheDocument();

        // Check if the buttons are rendered
        expect(screen.getByTitle("Share Unique ID")).toBeInTheDocument();
        expect(screen.getByTitle("Copy Unique ID")).toBeInTheDocument();
        expect(screen.getByTitle("Leave room")).toBeInTheDocument();
    });

    test("leaves the room when 'Leave room' button is clicked", () => {
        render(<UsersView />);

        const leaveButton = screen.getByTitle("Leave room");
        fireEvent.click(leaveButton);

        // Ensure the socket is disconnected
        expect(mockSocket.disconnect).toHaveBeenCalled();

        // Ensure the user status is updated
        expect(mockSetStatus).toHaveBeenCalledWith(USER_STATUS.DISCONNECTED);

        // Ensure the user is navigated to the home page
        expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });

    test("renders without crashing", () => {
        render(<UsersView />);

        // Ensure the component renders without errors
        expect(screen.getByText("Users")).toBeInTheDocument();
    });

    test("applies correct height from useResponsive", () => {
        render(<UsersView />);

        // Check if the height style is applied correctly
        const container = screen.getByText("Users").parentElement;
        expect(container).toHaveStyle("height: 500px");
    });

    test("renders the Users component", () => {
        render(<UsersView />);

        // Ensure the Users component is rendered
        expect(screen.getByTestId("users-component")).toBeInTheDocument();
    });

    test("renders all buttons", () => {
        render(<UsersView />);

        // Ensure all buttons are rendered
        expect(screen.getByTitle("Share Unique ID")).toBeInTheDocument();
        expect(screen.getByTitle("Copy Unique ID")).toBeInTheDocument();
        expect(screen.getByTitle("Leave room")).toBeInTheDocument();
    });
});