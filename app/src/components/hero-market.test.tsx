// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HeroMarket } from "./hero-market";

describe("HeroMarket", () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("focuses the market amount when the CTA is clicked", () => {
    render(<HeroMarket />);

    fireEvent.click(screen.getByRole("button", { name: /testar mercado/i }));

    expect(screen.getByLabelText("Quantidade de PLAY")).toHaveFocus();
    expect(screen.getByLabelText("Brasil contra Japão")).toHaveClass("is-prompted");
  });
});
