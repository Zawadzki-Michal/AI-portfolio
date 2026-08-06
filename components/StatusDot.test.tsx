import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusDot } from "./StatusDot";

describe("StatusDot", () => {
  it("defaults to the 'operational' label", () => {
    render(<StatusDot />);
    expect(screen.getByText("operational")).toBeInTheDocument();
  });

  it("renders a custom label", () => {
    render(<StatusDot label="degraded" />);
    expect(screen.getByText("degraded")).toBeInTheDocument();
  });

  it("applies an extra class to the label", () => {
    render(<StatusDot label="x" labelClassName="text-red-400" />);
    expect(screen.getByText("x")).toHaveClass("text-red-400");
  });
});
