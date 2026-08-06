import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { ProjectGallery } from "./ProjectGallery";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    ({ heading: "Screenshots", desktop: "Desktop", mobile: "Mobile", close: "Close", prev: "Previous", next: "Next" })[key],
}));

// AnimatePresence holds exiting elements mounted until their exit animation
// completes, which jsdom never drives to completion — swap in a plain
// passthrough so open/close/step logic (ours) isn't gated on framer-motion's
// animation timing (not ours).
vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  motion: {
    div: ({ initial, animate, exit, transition, ...rest }: Record<string, unknown>) => <div {...rest} />,
    img: ({ initial, animate, exit, transition, ...rest }: Record<string, unknown>) => <img {...rest} />,
  },
}));

function lightboxImg(container: HTMLElement) {
  return container.querySelector<HTMLImageElement>("img.shadow-2xl");
}

describe("ProjectGallery", () => {
  it("renders nothing when there are no images", () => {
    const { container } = render(<ProjectGallery slug="x" desktop={[]} mobile={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a thumbnail button per desktop and mobile image", () => {
    render(<ProjectGallery slug="lifeos" desktop={["a.png", "b.png"]} mobile={["c.png"]} />);
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("opens the lightbox on thumbnail click, showing prev/next for a multi-image set", async () => {
    const user = userEvent.setup();
    const { container } = render(<ProjectGallery slug="lifeos" desktop={["a.png", "b.png"]} mobile={[]} />);

    await user.click(screen.getAllByRole("button")[0]);

    expect(lightboxImg(container)).toHaveAttribute("src", "/projects/lifeos/desktop/a.png");
    expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  it("hides prev/next for a single-image set", async () => {
    const user = userEvent.setup();
    render(<ProjectGallery slug="lifeos" desktop={["a.png"]} mobile={[]} />);

    await user.click(screen.getAllByRole("button")[0]);

    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
  });

  it("steps to the next/previous image and wraps around", async () => {
    const user = userEvent.setup();
    const { container } = render(<ProjectGallery slug="lifeos" desktop={["a.png", "b.png"]} mobile={[]} />);
    await user.click(screen.getAllByRole("button")[0]);

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(lightboxImg(container)).toHaveAttribute("src", "/projects/lifeos/desktop/b.png");

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(lightboxImg(container)).toHaveAttribute("src", "/projects/lifeos/desktop/a.png");

    await user.click(screen.getByRole("button", { name: "Previous" }));
    expect(lightboxImg(container)).toHaveAttribute("src", "/projects/lifeos/desktop/b.png");
  });

  it("navigates with arrow keys and closes on Escape", async () => {
    const user = userEvent.setup();
    const { container } = render(<ProjectGallery slug="lifeos" desktop={["a.png", "b.png"]} mobile={[]} />);
    await user.click(screen.getAllByRole("button")[0]);

    await user.keyboard("{ArrowRight}");
    expect(lightboxImg(container)).toHaveAttribute("src", "/projects/lifeos/desktop/b.png");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });

  it("closes when the close button is clicked", async () => {
    const user = userEvent.setup();
    render(<ProjectGallery slug="lifeos" desktop={["a.png"]} mobile={[]} />);
    await user.click(screen.getAllByRole("button")[0]);

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });
});
