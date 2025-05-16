import { render, screen } from "@testing-library/react";
import { useFileSystem } from "@/context/FileContext";
import FileStructureView from "@/components/files/FileStructureView";

jest.mock("@/context/FileContext", () => ({
    useFileSystem: jest.fn(),
}));

describe("FileStructureView Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useFileSystem as jest.Mock).mockReturnValue({
            fileStructure: {
                id: "root",
                name: "root",
                type: "directory",
                isOpen: true,
                children: [],
            },
        });
    });

    test("renders the file structure view", () => {
        render(<FileStructureView />);

        // Check if the "Files" title is rendered
        expect(screen.getByText("Files")).toBeInTheDocument();
    });

    test("renders without crashing", () => {
        render(<FileStructureView />);

        // Ensure the component renders without throwing errors
        expect(screen.getByText("Files")).toBeInTheDocument();
    });
});