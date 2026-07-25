/**
 * Shared SVG wrapper for the flat art sets (stickers / shapes): fills its
 * container unless `size` is given, and carries the decorative contract —
 * `aria-hidden`, unfocusable, block display so it never sits on a text
 * baseline.
 */
export function svgProps(size: number | undefined, viewBox: string) {
  return {
    viewBox,
    width: size ?? "100%",
    height: size ? undefined : "100%",
    style: { display: "block", overflow: "visible" as const },
    "aria-hidden": true,
    focusable: false as const,
  };
}
