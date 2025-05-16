import { render, screen, fireEvent } from "@testing-library/react";
import { jest } from "@jest/globals";
import ChatInput from "@/components/chats/ChatInput.tsx";
import { useAppContext } from "@/context/AppContext.tsx";
import { useChatRoom } from "@/context/ChatContext.tsx";
import { useSocket } from "@/context/SocketContext.tsx";
import { SocketEvent } from "@/types/socket";

jest.mock("@/context/AppContext", () => ({
  useAppContext: jest.fn(),
}));

jest.mock("@/context/ChatContext", () => ({
  useChatRoom: jest.fn(),
}));

jest.mock("@/context/SocketContext", () => ({
  useSocket: jest.fn(),
}));

jest.mock("uuid", () => ({
  v4: jest.fn(() => "mocked-uuid"), // Properly mock uuidV4
}));

describe("ChatInput Component", () => {
  let mockSetMessages: jest.Mock;
  let mockEmit: jest.Mock;

  beforeEach(() => {
    mockSetMessages = jest.fn();
    mockEmit = jest.fn();

    (useAppContext as jest.Mock).mockReturnValue({
      currentUser: { username: "testuser" },
    });

    (useChatRoom as jest.Mock).mockReturnValue({
      setMessages: mockSetMessages,
    });

    (useSocket as jest.Mock).mockReturnValue({
      socket: { emit: mockEmit },
    });

    render(<ChatInput />);
  });

  test("renders input field and send button", () => {
    expect(screen.getByPlaceholderText("Enter a message...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("updates input field value when user types", () => {
    const inputField = screen.getByPlaceholderText("Enter a message...") as HTMLInputElement;

    fireEvent.change(inputField, { target: { value: "Hello, World!" } });

    expect(inputField.value).toBe("Hello, World!");
  });

  test("sends a message and clears input on form submit", () => {
    const inputField = screen.getByPlaceholderText("Enter a message...") as HTMLInputElement;
    const form = inputField.closest("form") as HTMLFormElement;

    fireEvent.change(inputField, { target: { value: "Test Message" } });
    fireEvent.submit(form);

    expect(mockEmit).toHaveBeenCalledWith(SocketEvent.SEND_MESSAGE, {
      message: {
        id: "mocked-uuid",
        message: "Test Message",
        username: "testuser",
        timestamp: expect.any(String),
      },
    });

    expect(mockSetMessages).toHaveBeenCalledWith(expect.any(Function));
    expect(inputField.value).toBe(""); // Ensure input is cleared
  });

  test("does not send an empty message", () => {
    const inputField = screen.getByPlaceholderText("Enter a message...") as HTMLInputElement;
    const form = inputField.closest("form") as HTMLFormElement;

    fireEvent.change(inputField, { target: { value: "" } });
    fireEvent.submit(form);

    expect(mockEmit).not.toHaveBeenCalled();
    expect(mockSetMessages).not.toHaveBeenCalled();
  });
});