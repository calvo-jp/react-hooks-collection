import { faker } from "@faker-js/faker";
import { act, renderHook } from "@testing-library/react";
import useClipboard from "./use-clipboard";

Object.defineProperty(navigator, "clipboard", {
  value: {
    read: jest.fn(),
    write: jest.fn(),
    readText: jest.fn(),
    writeText: jest.fn(),
    dispatchEvent: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
});

describe("useClipboard", () => {
  it("'options.initialValue'", () => {
    const initialValue = faker.random.word();
    const { result } = renderHook(useClipboard, { initialProps: initialValue });
    expect(result.current.value).toBe(initialValue);
  });

  it("'setValue'", async () => {
    const { result, rerender } = renderHook(useClipboard);
    expect(result.current.value).toBe("");
    const newValue = faker.random.word();
    await act(async () => result.current.setValue(newValue));
    rerender();
    expect(result.current.value).toBe(newValue);
  });

  it("'onCopy'", async () => {
    const { result, rerender } = renderHook(useClipboard);
    expect(result.current.value).toBe("");
    const newValue = faker.random.word();
    await act(async () => result.current.setValue(newValue));
    rerender();
    await act(async () => result.current.onCopy());
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(newValue);
  });
});
