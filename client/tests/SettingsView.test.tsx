import { render, screen, fireEvent } from "@testing-library/react";
import SettingsView from "@/components/sidebar/sidebar-views/SettingsView";

jest.mock("@/hooks/useResponsive", () => jest.fn(() => ({ viewHeight: "500px" })));

const mockResetSettings = jest.fn();

jest.mock("@/context/SettingContext", () => ({
    useSettings: jest.fn(() => ({
        theme: "dark",
        setTheme: jest.fn(),
        language: "JavaScript",
        setLanguage: jest.fn(),
        fontSize: 14,
        setFontSize: jest.fn(),
        fontFamily: "Fira Code",
        setFontFamily: jest.fn(),
        showGitHubCorner: true,
        setShowGitHubCorner: jest.fn(),
        resetSettings: mockResetSettings,
    })),
}));

describe("SettingsView Component", () => {
    test("renders with correct height from useResponsive", () => {
        render(<SettingsView />);

        // Check if the height style is applied correctly
        const container = screen.getByText("Settings").parentElement;
        expect(container).toHaveStyle("height: 500px");
    });

    test("calls resetSettings when 'Reset to default' button is clicked", () => {
        render(<SettingsView />);

        const resetButton = screen.getByText("Reset to default");
        fireEvent.click(resetButton);

        // Ensure the resetSettings function is called
        expect(mockResetSettings).toHaveBeenCalled();
    });

    test("renders without crashing", () => {
        render(<SettingsView />);

        // Ensure the component renders without errors
        expect(screen.getByText("Settings")).toBeInTheDocument();
    });
});