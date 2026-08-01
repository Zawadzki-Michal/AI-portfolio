import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { JsonLd } from "./JsonLd";

describe("JsonLd", () => {
  it("serializes the given data into a JSON-LD script tag", () => {
    const { container } = render(<JsonLd data={{ "@type": "Person", name: "Michał" }} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(JSON.parse(script!.innerHTML)).toEqual({ "@type": "Person", name: "Michał" });
  });
});
