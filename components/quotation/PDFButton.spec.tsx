import { render, screen } from "@testing-library/react";

import { PDFButton } from "./PDFButton";

describe("PDFButton component", () => {
    it("renders without crashing", () => {
        render(<PDFButton quotationId="123" />);
        const buttonElement = screen.getByText(/Generar PDF/i);
        expect(buttonElement).toBeInTheDocument();
    });

    it("opens the PDF in a new tab when clicked", () => {
        window.open = jest.fn();
        render(<PDFButton quotationId="123" />);
        const buttonElement = screen.getByText(/Generar PDF/i);
        buttonElement.click();
        expect(window.open).toHaveBeenCalledWith("/api/quotations/123/pdf", "_blank");
    });
});
