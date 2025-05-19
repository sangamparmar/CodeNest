import React, { useContext } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ACTIVITY_STATE, DrawingData } from "@/types/app";
import { USER_CONNECTION_STATUS, USER_ROLE, USER_STATUS } from "@/types/user";
import AppContext from "@/context/AppContext";

// Mock functions for context setters
const mockSetUsers = jest.fn();
const mockSetCurrentUser = jest.fn();
const mockSetStatus = jest.fn();
const mockSetActivityState = jest.fn();
const mockSetDrawingData = jest.fn();

// Mock component to consume the context
const MockComponent = () => {
  const context = useContext(AppContext);

  return (
    <div>
      <p data-testid="current-status">{context?.status ?? "Unknown"}</p>
      <p data-testid="current-activity">{context?.activityState ?? "Unknown"}</p>
      <button onClick={() => context?.setStatus(USER_STATUS.ONLINE)}>
        Set Online Status
      </button>
      <button onClick={() => context?.setActivityState(ACTIVITY_STATE.CODING)}>
        Set Coding State
      </button>
      <button onClick={() => context?.setUsers([{
        username: "User2", roomId: "room2", status: USER_CONNECTION_STATUS.ONLINE, cursorPosition: 0, typing: false, currentFile: "file2", socketId: "socket2",
        inCall: false,
        role: USER_ROLE.ADMIN
      }])}>
        Set Users
      </button>
      <button
        onClick={() =>
          context?.setDrawingData({
              state: null,
              records: [],
          } as unknown as DrawingData)
        }
      >
        Set Drawing Data
      </button>
    </div>
  );
};

describe("AppContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("sets user status to online when button clicked", () => {
    render(
      <AppContext.Provider
        value={{
          users: [],
          setUsers: mockSetUsers,
          currentUser: {
            username: "Current User", roomId: "room1",
            socketId: undefined
          },
          setCurrentUser: mockSetCurrentUser,
          status: USER_STATUS.OFFLINE,
          setStatus: mockSetStatus,
          activityState: ACTIVITY_STATE.DRAWING,
          setActivityState: mockSetActivityState,
          drawingData: null,
          setDrawingData: mockSetDrawingData,
          roomId: "room1",
          setRoomId: jest.fn(),
        }}
      >
        <MockComponent />
      </AppContext.Provider>
    );

    fireEvent.click(screen.getByText(/Set Online Status/i));
    expect(mockSetStatus).toHaveBeenCalledWith(USER_STATUS.ONLINE);
  });

  test("sets activity state to coding when button clicked", () => {
    render(
      <AppContext.Provider
        value={{
          users: [],
          setUsers: mockSetUsers,
          currentUser: {
            username: "Current User", roomId: "room1",
            socketId: undefined
          },
          setCurrentUser: mockSetCurrentUser,
          status: USER_STATUS.OFFLINE,
          setStatus: mockSetStatus,
          activityState: ACTIVITY_STATE.DRAWING,
          setActivityState: mockSetActivityState,
          drawingData: null,
          setDrawingData: mockSetDrawingData,
          roomId: "room1",
          setRoomId: jest.fn(),
        }}
      >
        <MockComponent />
      </AppContext.Provider>
    );

    fireEvent.click(screen.getByText(/Set Coding State/i));
    expect(mockSetActivityState).toHaveBeenCalledWith(ACTIVITY_STATE.CODING);
  });

  test("sets users when button clicked", () => {
    render(
      <AppContext.Provider
        value={{
          users: [],
          setUsers: mockSetUsers,
          currentUser: {
            username: "Current User", roomId: "room1",
            socketId: undefined
          },
          setCurrentUser: mockSetCurrentUser,
          status: USER_STATUS.OFFLINE,
          setStatus: mockSetStatus,
          activityState: ACTIVITY_STATE.DRAWING,
          setActivityState: mockSetActivityState,
          drawingData: null,
          setDrawingData: mockSetDrawingData,
          roomId: "room1",
          setRoomId: jest.fn(),
        }}
      >
        <MockComponent />
      </AppContext.Provider>
    );

    fireEvent.click(screen.getByText(/Set Users/i));
    expect(mockSetUsers).toHaveBeenCalledWith([
      {
        username: "User2",
        roomId: "room2",
        status: "online",
        cursorPosition: 0,
        typing: false,
        currentFile: "file2",
        socketId: "socket2",
      },
    ]);
  });

  test("sets drawing data when button clicked", () => {
    render(
      <AppContext.Provider
        value={{
          users: [],
          setUsers: mockSetUsers,
          currentUser: {
            username: "Current User", roomId: "room1",
            socketId: undefined
          },
          setCurrentUser: mockSetCurrentUser,
          status: USER_STATUS.OFFLINE,
          setStatus: mockSetStatus,
          activityState: ACTIVITY_STATE.DRAWING,
          setActivityState: mockSetActivityState,
          drawingData: null,
          setDrawingData: mockSetDrawingData,
          roomId: "room1",
          setRoomId: jest.fn(),
        }}
      >
        <MockComponent />
      </AppContext.Provider>
    );

    fireEvent.click(screen.getByText(/Set Drawing Data/i));
    expect(mockSetDrawingData).toHaveBeenCalledWith({
      state: null,
      records: [],
    });
  });
});