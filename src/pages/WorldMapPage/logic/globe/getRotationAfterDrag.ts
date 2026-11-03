/**
 * d3's `projection.rotate([λ, φ])`. The point facing the viewer is `[-λ, -φ]`.
 */
export type GlobeRotation = [number, number];

function wrapLongitude(longitude: number) {
  const wrappedLongitude = ((((longitude + 180) % 360) + 360) % 360) - 180;

  return wrappedLongitude;
}

type GetRotationAfterDragProps = {
  rotation: GlobeRotation;
  /**
   * How far the pointer moved, in map units.
   */
  deltaX: number;
  deltaY: number;
  /**
   * The globe's radius in map units, which is the orthographic projection's scale.
   */
  radius: number;
};

/**
 * Turns a drag into a rotation that moves the point at the middle of the globe along with the pointer. Tilting stops
 * at the poles, so the globe can't be turned upside down.
 */
export function getRotationAfterDrag(props: GetRotationAfterDragProps): GlobeRotation {
  const { rotation, deltaX, deltaY, radius } = props;
  const [lambda, phi] = rotation;

  const degreesPerUnit = 180 / (Math.PI * radius);
  const nextLambda = wrapLongitude(lambda + deltaX * degreesPerUnit);
  const nextPhi = Math.max(-90, Math.min(90, phi - deltaY * degreesPerUnit));

  return [nextLambda, nextPhi];
}
