import { render, screen } from "@testing-library/react"
import Footer from "@/components/common/Footer"

describe("Footer Component", () => {
    test("renders footer text correctly", () => {
        render(<Footer />)

        expect(screen.getByText("Build with ❤️ by")).toBeInTheDocument()
        expect(screen.getByText("sahilatahar")).toBeInTheDocument()
    })

    test("contains the correct GitHub link", () => {
        render(<Footer />)

        const link = screen.getByRole("link", { name: "sahilatahar" })
        expect(link).toHaveAttribute("href", "https://github.com/sangamparmar")
        expect(link).toHaveClass("text-primary underline underline-offset-1")
    })
})
