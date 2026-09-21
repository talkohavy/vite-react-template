/**
 * Formats a flat list of numbers into the comma-separated string expected by
 * the HTML `<area coords="...">` attribute (and accepted as-is by SVG's
 * `points` attribute too).
 */
export function formatCoords(props: { coords: Array<number> }): string {
  const { coords } = props;

  const formatted = coords.join(',');

  return formatted;
}
