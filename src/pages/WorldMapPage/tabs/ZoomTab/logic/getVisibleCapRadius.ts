type GetVisibleCapRadiusProps = {
  /**
   * The globe's radius at 1x, in map units.
   */
  radius: number;
  zoomLevel: number;
  width: number;
  height: number;
};

/**
 * How far from the facing point, in radians, the globe can still be on screen: a whole hemisphere until the globe
 * outgrows the view, then the angle at which its surface leaves the corners of the view.
 */
export function getVisibleCapRadius(props: GetVisibleCapRadiusProps) {
  const { radius, zoomLevel, width, height } = props;

  const halfDiagonal = Math.hypot(width, height) / 2;
  const radiusOnScreen = radius * zoomLevel;

  const capRadius = radiusOnScreen <= halfDiagonal ? Math.PI / 2 : Math.asin(halfDiagonal / radiusOnScreen);

  return capRadius;
}
