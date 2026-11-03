import type { GlobeRotation } from './getRotationAfterDrag';

function formatDegrees(value: number, positiveSuffix: string, negativeSuffix: string) {
  const roundedValue = Math.round(value);

  if (roundedValue === 0) return '0°';

  const formattedDegrees = `${Math.abs(roundedValue)}°${roundedValue > 0 ? positiveSuffix : negativeSuffix}`;

  return formattedDegrees;
}

type FormatFacingPointProps = { rotation: GlobeRotation };

/**
 * The point in the middle of the globe, as latitude then longitude.
 */
export function formatFacingPoint(props: FormatFacingPointProps) {
  const { rotation } = props;
  const [lambda, phi] = rotation;

  const latitude = formatDegrees(-phi, 'N', 'S');
  const longitude = formatDegrees(-lambda, 'E', 'W');
  const facingPoint = `${latitude}, ${longitude}`;

  return facingPoint;
}
