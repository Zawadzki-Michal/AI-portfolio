import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// vitest doesn't expose Jest-style globals by default (test.globals is off),
// so @testing-library/react's auto-cleanup — which detects a global
// `afterEach` — never registers on its own; without this, DOM from one
// component test leaks into the next.
afterEach(() => {
  cleanup();
});

// jsdom doesn't implement these — framer-motion (whileInView, reduced-motion
// checks) and a few components probe for them, so stub minimal versions
// rather than pulling in a browser for component tests.
if (typeof window !== "undefined") {
  if (!window.matchMedia) {
    window.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }

  if (!("IntersectionObserver" in window)) {
    class MockIntersectionObserver implements IntersectionObserver {
      readonly root = null;
      readonly rootMargin = "";
      readonly thresholds: ReadonlyArray<number> = [];
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    }
    // @ts-expect-error — partial polyfill, enough for framer-motion's feature checks
    window.IntersectionObserver = MockIntersectionObserver;
  }
}
