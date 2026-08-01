import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "./ContactForm";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    ({
      nameLabel: "Name",
      emailLabel: "Email",
      messageLabel: "Message",
      sendButton: "Send",
      sending: "Sending…",
      successMsg: "Thanks, I'll get back to you.",
      errorMsg: "Something went wrong.",
    })[key],
}));

afterEach(() => {
  vi.unstubAllGlobals();
});

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Name"), "Michał");
  await user.type(screen.getByLabelText("Email"), "m@example.com");
  await user.type(screen.getByLabelText("Message"), "Let's work together.");
}

describe("ContactForm", () => {
  it("submits the form data as JSON and shows a success message", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(<ContactForm />);
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => expect(screen.getByText("Thanks, I'll get back to you.")).toBeInTheDocument());

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({ method: "POST" }),
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body).toEqual({ name: "Michał", email: "m@example.com", message: "Let's work together." });
  });

  it("shows an error message when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response(null, { status: 500 })));
    const user = userEvent.setup();

    render(<ContactForm />);
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => expect(screen.getByText("Something went wrong.")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("shows an error message when the network request throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new Error("offline")));
    const user = userEvent.setup();

    render(<ContactForm />);
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => expect(screen.getByText("Something went wrong.")).toBeInTheDocument());
  });
});
