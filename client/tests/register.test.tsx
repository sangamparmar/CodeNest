import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "@/pages/Register";

describe("Register Component", () => {
  test("renders register form with username, name, email, and password inputs", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create Account/i })).toBeInTheDocument();
  });

  test("username input updates on change", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/Username/i) as HTMLInputElement;
    fireEvent.change(usernameInput, { target: { value: "newuser123" } });

    expect(usernameInput.value).toBe("newuser123");
  });

  test("name input updates on change", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "John Doe" } });

    expect(nameInput.value).toBe("John Doe");
  });

  test("email input updates on change", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email Address/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "johndoe@example.com" } });

    expect(emailInput.value).toBe("johndoe@example.com");
  });

  test("password input updates on change", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(passwordInput.value).toBe("password123");
  });

  test("displays loading spinner when registration is in progress", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "newuser123" } });
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "johndoe@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    expect(screen.getByRole("button", { name: /Registering.../i })).toBeInTheDocument();
  });
});