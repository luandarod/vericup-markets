// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarketCard } from "./market-card";

describe("MarketCard", () => {
  it("shows a live fixture and lets the user choose one outcome", () => {
    render(<MarketCard home="Brasil" away="Japão" kickoff="16 JUN, 22:00" pools={[482, 126, 209]} />);
    expect(screen.getByText("Brasil")).toBeInTheDocument();
    expect(screen.getByText("Japão")).toBeInTheDocument();
    const draw = screen.getByRole("button", { name: /empate/i });
    fireEvent.click(draw);
    expect(draw).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /confirmar empate/i })).toBeEnabled();
  });
});
