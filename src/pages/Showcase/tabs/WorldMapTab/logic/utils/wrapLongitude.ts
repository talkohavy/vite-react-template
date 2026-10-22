/**
 * Wraps any longitude, in degrees, into the [-180, 180) range.
 */
export function wrapLongitude(props: { longitude: number }): number {
  const { longitude } = props;

  const wrapped = ((((longitude + 180) % 360) + 360) % 360) - 180;

  return wrapped;
}
