import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import useDisclosure from "./use-disclosure";

describe("useDisclosure", () => {
  it("'options.defaultIsOpen'", () => {
    const { result } = renderHook(useDisclosure, {
      initialProps: { defaultIsOpen: true },
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("'onOpen'", () => {
    const { result, rerender } = renderHook(useDisclosure);

    act(() => {
      result.current.onOpen();
    });

    rerender();
    expect(result.current.isOpen).toBe(true);
  });

  it("'onClose'", () => {
    const { result, rerender } = renderHook(useDisclosure);

    // ensure opened
    act(() => {
      result.current.onOpen();
    });

    rerender();
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.onClose();
    });

    rerender();
    expect(result.current.isOpen).toBe(false);
  });

  it("'onToggle'", () => {
    const { result, rerender } = renderHook(useDisclosure);

    act(() => {
      result.current.onToggle();
    });

    rerender();
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.onToggle();
    });

    rerender();
    expect(result.current.isOpen).toBe(false);
  });
});
