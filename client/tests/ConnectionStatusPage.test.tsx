import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ConnectionStatusPage from "@/components/connection/ConnectionStatusPage.tsx";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

beforeAll(() => {
    jest.spyOn(console, "warn").mockImplementation((message) => {
        if (
            message.includes("React Router Future Flag Warning") ||
            message.includes("Relative route resolution within Splat routes is changing")
        ) {
            return;
        }
        console.warn(message);
    });
});

afterAll(() => {
    jest.restoreAllMocks();
});

describe("ConnectionStatusPage Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders error message and buttons", () => {
        render(
            <Router>
                <ConnectionStatusPage />
            </Router>
        );

        expect(
            screen.getByText("Oops! Something went wrong. Please try again")
        ).toBeInTheDocument();
        expect(screen.getByText("Try Again")).toBeInTheDocument();
        expect(screen.getByText("Go to HomePage")).toBeInTheDocument();
    });

    test("reloads the page when 'Try Again' button is clicked", () => {
        const reloadSpy = jest.fn();
        Object.defineProperty(window, "location", {
            value: { reload: reloadSpy },
            writable: true,
        });

        render(
            <Router>
                <ConnectionStatusPage />
            </Router>
        );

        const tryAgainButton = screen.getByText("Try Again");
        fireEvent.click(tryAgainButton);

        expect(reloadSpy).toHaveBeenCalledTimes(1);
    });

    test("navigates to home page when 'Go to HomePage' button is clicked", () => {
        render(
            <Router>
                <ConnectionStatusPage />
            </Router>
        );

        const goToHomePageButton = screen.getByText("Go to HomePage");
        fireEvent.click(goToHomePageButton);

        expect(mockNavigate).toHaveBeenCalledWith("/");
    });
});