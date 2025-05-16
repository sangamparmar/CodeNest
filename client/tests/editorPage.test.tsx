import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EditorPage from "@/pages/EditorPage.tsx";
import { useAppContext } from "@/context/AppContext.tsx";
import { useSocket } from "@/context/SocketContext.tsx";
import { USER_STATUS } from "@/types/user";

// Mock necessary hooks & contexts
jest.mock("@/context/AppContext", () => ({
  useAppContext: jest.fn(),
}));

jest.mock("@/context/SocketContext", () => ({
  useSocket: jest.fn(),
}));

jest.mock("@/hooks/useFullScreen", () => jest.fn());
jest.mock("@/hooks/useUserActivity", () => jest.fn());

jest.mock("@/components/SplitterComponent", () => ({ children }: any) => (
  <div data-testid="splitter-component">{children}</div>
));
jest.mock("@/components/sidebar/Sidebar", () => () => (
  <div data-testid="sidebar-component">Sidebar</div>
));
jest.mock("@/components/workspace", () => () => (
  <div data-testid="workspace-component">WorkSpace</div>
));
jest.mock("@/components/connection/ConnectionStatusPage", () => () => (
  <div data-testid="connection-status-page">ConnectionStatusPage</div>
));

describe("EditorPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Sidebar and WorkSpace when connection is successful", () => {
    (useAppContext as jest.Mock).mockReturnValue({
      status: "CONNECTED",
      currentUser: { username: "testUser" },
      setCurrentUser: jest.fn(),
    });

    (useSocket as jest.Mock).mockReturnValue({
      socket: { emit: jest.fn() },
    });

    render(
      <MemoryRouter>
        <EditorPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId("sidebar-component")).toBeInTheDocument();
    expect(screen.getByTestId("workspace-component")).toBeInTheDocument();
  });

  test("renders ConnectionStatusPage when connection fails", () => {
    (useAppContext as jest.Mock).mockReturnValue({
      status: USER_STATUS.CONNECTION_FAILED,
      currentUser: { username: "" },
      setCurrentUser: jest.fn(),
    });

    render(
      <MemoryRouter>
        <EditorPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId("connection-status-page")).toBeInTheDocument();
  });
});