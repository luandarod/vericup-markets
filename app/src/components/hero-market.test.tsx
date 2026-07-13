// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeroMarket } from "./hero-market";

describe("HeroMarket", () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("focuses the market amount when the hero CTA is clicked", () => {
    render(<HeroMarket />);

    fireEvent.click(screen.getByRole("button", { name: /testar mercado/i }));

    expect(screen.getByLabelText("Quantidade de PLAY")).toHaveFocus();
    expect(screen.getByLabelText("Brasil contra Japão")).toHaveClass("is-prompted");
  });

  it("focuses the market amount when the nav CTA is clicked", () => {
    render(<HeroMarket />);

    fireEvent.click(screen.getByRole("button", { name: "Testar" }));

    expect(screen.getByLabelText("Quantidade de PLAY")).toHaveFocus();
    expect(screen.getByLabelText("Brasil contra Japão")).toHaveClass("is-prompted");
  });
});
