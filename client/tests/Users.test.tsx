import { render, screen } from "@testing-library/react";
import Users from "@/components/common/Users";
import { useAppContext } from "@/context/AppContext";
import { USER_CONNECTION_STATUS } from "@/types/user";

jest.mock("@/context/AppContext", () => ({
    useAppContext: jest.fn(),
}));

describe("Users Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders users correctly", () => {
        (useAppContext as jest.Mock).mockReturnValue({
            users: [
                { socketId: "1", username: "Alice", status: USER_CONNECTION_STATUS.ONLINE },
                { socketId: "2", username: "Bob", status: USER_CONNECTION_STATUS.OFFLINE },
            ],
        });

        render(<Users />);

        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    test("displays correct status indicators", () => {
        (useAppContext as jest.Mock).mockReturnValue({
            users: [
                { socketId: "1", username: "Alice", status: USER_CONNECTION_STATUS.ONLINE },
                { socketId: "2", username: "Bob", status: USER_CONNECTION_STATUS.OFFLINE },
            ],
        });

        render(<Users />);

        const onlineUser = screen.getByText("Alice").closest("div")?.querySelector(".bg-green-500");
        const offlineUser = screen.getByText("Bob").closest("div")?.querySelector(".bg-danger");

        expect(onlineUser).toBeInTheDocument();
        expect(offlineUser).toBeInTheDocument();
    });

    test("renders all users without filtering", () => {
        (useAppContext as jest.Mock).mockReturnValue({
            users: [
                { socketId: "1", username: "Alice", status: USER_CONNECTION_STATUS.ONLINE },
                { socketId: "2", username: "Bob", status: USER_CONNECTION_STATUS.OFFLINE },
                { socketId: "3", username: "Charlie", status: USER_CONNECTION_STATUS.ONLINE },
            ],
        });

        render(<Users />);

        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();
        expect(screen.getByText("Charlie")).toBeInTheDocument();
    });

    test("renders no users when the users array is empty", () => {
        (useAppContext as jest.Mock).mockReturnValue({
            users: [],
        });

        render(<Users />);

        // Since the component does not handle empty states, we check that no user elements are rendered
        expect(screen.queryByText("Alice")).not.toBeInTheDocument();
        expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    });
});