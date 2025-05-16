import { render, screen } from "@testing-library/react";
import FormComponent from "@/components/forms/FormComponent";

describe("FormComponent", () => {
    test("renders the form inputs and buttons", () => {
        render(<FormComponent />);

        // Check if the form inputs and buttons are rendered
        expect(screen.getByPlaceholderText("Room Id")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
        expect(screen.getByText("Join")).toBeInTheDocument();
        expect(screen.getByText("Generate Unique Room Id")).toBeInTheDocument();
    });

    test("renders the 'Join' button without crashing", () => {
        render(<FormComponent />);

        // Ensure the "Join" button is rendered
        expect(screen.getByText("Join")).toBeInTheDocument();
    });
});