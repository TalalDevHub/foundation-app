import "@testing-library/jest-dom";

// Polyfill window.HTMLElement scroll behaviors for JSDOM
HTMLElement.prototype.scrollTo = () => {};
