import { render, screen, fireEvent } from "@testing-library/react";
import RunView from "@/components/sidebar/sidebar-views/RunView";

jest.mock("react-hot-toast", () => ({
    success: jest.fn(),
}));

jest.mock("@/hooks/useResponsive", () => jest.fn(() => ({ viewHeight: "500px" })));

jest.mock("@/context/RunCodeContext", () => ({
    useRunCode: jest.fn(() => ({
        setInput: jest.fn(),
        output: "Hello, World!",
        isRunning: false,
        supportedLanguages: [
            { language: "JavaScript", version: "ES6" },
            { language: "Python", version: "3.9" },
        ],
        selectedLanguage: { language: "JavaScript", version: "ES6" },
        setSelectedLanguage: jest.fn(),
        runCode: jest.fn(),
    })),
}));

describe("RunView Component", () => {
    test("renders the RunView component", () => {
        render(<RunView />);

        // Check if the title is rendered
        expect(screen.getByText("Run Code")).toBeInTheDocument();

        // Check if the select dropdown is rendered
        expect(screen.getByRole("combobox")).toBeInTheDocument();

        // Check if the textarea and buttons are rendered
        expect(screen.getByPlaceholderText("Write you input here...")).toBeInTheDocument();
        expect(screen.getByText("Run")).toBeInTheDocument();
        expect(screen.getByTitle("Copy Output")).toBeInTheDocument();
    });

    test("copies output to clipboard", () => {
        const mockWriteText = jest.fn();
        Object.assign(navigator, {
            clipboard: {
                writeText: mockWriteText,
            },
        });

        render(<RunView />);

        const copyButton = screen.getByTitle("Copy Output");
        fireEvent.click(copyButton);

        // Ensure the output is copied to the clipboard
        expect(mockWriteText).toHaveBeenCalledWith("Hello, World!");
    });

    test("renders without crashing", () => {
        render(<RunView />);

        // Ensure the component renders without errors
        expect(screen.getByText("Run Code")).toBeInTheDocument();
    });
});