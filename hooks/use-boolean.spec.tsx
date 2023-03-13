import { act, renderHook } from "@testing-library/react";
import useBoolean from "./use-boolean";

describe("useBoolean", () => {
  it("'options.defaultValue'", () => {
    const { result } = renderHook(useBoolean, {
      initialProps: { defaultValue: true },
    });

    expect(result.current[0]).toBe(true);
  });

  it("'on'", () => {
    const { result, rerender } = renderHook(useBoolean);

    /* false */
    expect(result.current[0]).toBe(false);
    act(() => result.current[1].on());
    rerender();
    /* true */
    expect(result.current[0]).toBe(true);
  });

  it("'off'", () => {
    const { result, rerender } = renderHook(useBoolean, {
      initialProps: { defaultValue: true },
    });

    /* true */
    expect(result.current[0]).toBe(true);
    act(() => result.current[1].off());
    rerender();
    /* false */
    expect(result.current[0]).toBe(false);
  });

  it("'toggle'", () => {
    const { result, rerender } = renderHook(useBoolean);

    /* false */
    expect(result.current[0]).toBe(false);
    act(() => result.current[1].on());
    rerender();
    /* true */
    expect(result.current[0]).toBe(true);
    act(() => result.current[1].off());
    rerender();
    /* false */
    expect(result.current[0]).toBe(false);
  });
});
