import { render, screen, fireEvent } from "@testing-library/react";
import FilesView from "@/components/sidebar/sidebar-views/FilesView";

jest.mock("@/components/files/FileStructureView", () => jest.fn(() => <div data-testid="file-structure-view">FileStructureView</div>));
jest.mock("@/hooks/useResponsive", () => jest.fn(() => ({ viewHeight: "500px", minHeightReached: false })));
jest.mock("@/context/FileContext", () => ({
    useFileSystem: jest.fn(() => ({
        downloadFilesAndFolders: jest.fn(),
        updateDirectory: jest.fn(),
    })),
}));

describe("FilesView Component", () => {
    test("renders the FilesView component", () => {
        render(<FilesView />);

        // Check if the FileStructureView is rendered
        expect(screen.getByTestId("file-structure-view")).toBeInTheDocument();

        // Check if the buttons are rendered
        expect(screen.getByText("Open File/Folder")).toBeInTheDocument();
        expect(screen.getByText("Download Code")).toBeInTheDocument();
    });

    test("renders 'Open File/Folder' button and allows clicking", () => {
        render(<FilesView />);

        const openButton = screen.getByText("Open File/Folder");

        // Simulate clicking the button
        fireEvent.click(openButton);

        // Ensure the button is rendered and clickable
        expect(openButton).toBeInTheDocument();
    });

    test("renders with correct height from useResponsive", () => {
        render(<FilesView />);

        // Check if the height style is applied correctly
        const container = screen.getByTestId("file-structure-view").parentElement;
        expect(container).toHaveStyle("height: 500px");
        expect(container).toHaveStyle("max-height: 500px");
    });
});