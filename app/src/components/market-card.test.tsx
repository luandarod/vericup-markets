// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarketCard } from "./market-card";

describe("MarketCard", () => {
  it("registers a walletless guest prediction", () => {
    render(<MarketCard home="Brasil" away="Japao" kickoff="16 JUN, 22:00" pools={[482, 126, 209]} />);

    expect(screen.getAllByText("Brasil").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Japao").length).toBeGreaterThan(0);

    const draw = screen.getByRole("button", { name: /empate/i });
    fireEvent.click(draw);

    expect(draw).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/nenhuma carteira necessaria/i)).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /registrar empate/i }));

    expect(screen.getByRole("status")).toHaveTextContent(/palpite registrado/i);
    expect(screen.getByRole("status")).toHaveTextContent(/empate/i);
  });
});
