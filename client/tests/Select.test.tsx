import { render, screen } from "@testing-library/react";
import Select from "@/components/common/Select";

describe("Select Component", () => {
    const mockOnChange = jest.fn();
    const options = ["apple", "banana", "cherry"];
    const title = "Select a fruit";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders select component with correct title", () => {
        render(<Select onChange={mockOnChange} value="" options={options} title={title} />);

        expect(screen.getByText(title)).toBeInTheDocument();
    });

    test("renders options in sorted order", () => {
        render(<Select onChange={mockOnChange} value="" options={options} title={title} />);

        const selectElement = screen.getByRole("combobox");
        const renderedOptions = Array.from(selectElement.children).map(
            (option) => option.textContent
        );

        expect(renderedOptions).toEqual(["Apple", "Banana", "Cherry"]);
    });

    test("renders empty select when no options are provided", () => {
        render(<Select onChange={mockOnChange} value="" options={[]} title={title} />);

        const selectElement = screen.getByRole("combobox");
        expect(selectElement.children.length).toBe(0); // No options should be rendered
    });

    test("displays the correct selected value", () => {
        render(<Select onChange={mockOnChange} value="banana" options={options} title={title} />);

        const selectElement = screen.getByRole("combobox") as HTMLSelectElement;
        expect(selectElement.value).toBe("banana");
    });
});