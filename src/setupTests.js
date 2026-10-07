import "@testing-library/jest-dom/vitest";

window.scrollTo = () => {};

window.matchMedia =
  window.matchMedia ||
  function matchMediaStub(query) {
    return {
      matches: false,
      media: query,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };
  };
