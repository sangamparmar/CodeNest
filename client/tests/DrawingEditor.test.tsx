import { render, screen } from "@testing-library/react";
import { SocketEvent } from "@/types/socket";
import { useAppContext } from "@/context/AppContext.tsx";
import { useSocket } from "@/context/SocketContext.tsx";
import DrawingEditor from "@/components/drawing/DrawingEditor.tsx";

jest.mock("@/context/AppContext", () => ({
    useAppContext: jest.fn(),
}));

jest.mock("@/context/SocketContext", () => ({
    useSocket: jest.fn(),
}));

jest.mock("tldraw", () => ({
    Tldraw: jest.fn(({ children }) => <div data-testid="tldraw">{children}</div>),
    useEditor: jest.fn(() => ({
        store: {
            getSnapshot: jest.fn(),
            loadSnapshot: jest.fn(),
            listen: jest.fn(() => jest.fn()), // Mock cleanup function
            mergeRemoteChanges: jest.fn((callback) => callback()),
            put: jest.fn(),
            remove: jest.fn(),
        },
    })),
}));

describe("DrawingEditor Component", () => {
    const mockSetDrawingData = jest.fn();
    const mockEmit = jest.fn();
    const mockOn = jest.fn();
    const mockOff = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useAppContext as jest.Mock).mockReturnValue({
            drawingData: {},
            setDrawingData: mockSetDrawingData,
        });

        (useSocket as jest.Mock).mockReturnValue({
            socket: {
                emit: mockEmit,
                on: mockOn,
                off: mockOff,
            },
        });
    });

    test("renders Tldraw component", () => {
        render(<DrawingEditor />);

        expect(screen.getByTestId("tldraw")).toBeInTheDocument();
    });

    test("initializes and listens for events in ReachEditor", () => {
        render(<DrawingEditor />);

        expect(mockOn).toHaveBeenCalledWith(
            SocketEvent.DRAWING_UPDATE,
            expect.any(Function)
        );
    });

    test("renders with default properties", () => {
        render(<DrawingEditor />);

        const tldrawElement = screen.getByTestId("tldraw");
        expect(tldrawElement).toBeInTheDocument();
    });

    test("does not call emit or setDrawingData on initial render", () => {
        render(<DrawingEditor />);

        expect(mockEmit).not.toHaveBeenCalled();
        expect(mockSetDrawingData).not.toHaveBeenCalled();
    });
});