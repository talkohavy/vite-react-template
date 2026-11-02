type HandWrittenProperties = {
  name: string;
};

export type HandWrittenFeature = GeoJSON.Feature<
  GeoJSON.Point | GeoJSON.LineString | GeoJSON.Polygon,
  HandWrittenProperties
>;

const NEW_YORK: GeoJSON.Position = [-74.01, 40.71];
const TOKYO: GeoJSON.Position = [139.69, 35.68];

const MIAMI: GeoJSON.Position = [-80.19, 25.76];
const BERMUDA: GeoJSON.Position = [-64.78, 32.29];
const SAN_JUAN: GeoJSON.Position = [-66.11, 18.47];

/**
 * Clockwise on a north-up map, which is what d3-geo expects for a polygon smaller than a hemisphere.
 */
const CLOCKWISE_TRIANGLE_RING: Array<GeoJSON.Position> = [MIAMI, BERMUDA, SAN_JUAN, MIAMI];

type BuildHandWrittenFeaturesProps = {
  /**
   * Winds the triangle counterclockwise instead, as RFC 7946 asks for.
   */
  isTriangleReversed: boolean;
};

export function buildHandWrittenFeatures(props: BuildHandWrittenFeaturesProps): Array<HandWrittenFeature> {
  const { isTriangleReversed } = props;

  const triangleRing = isTriangleReversed ? CLOCKWISE_TRIANGLE_RING.toReversed() : CLOCKWISE_TRIANGLE_RING;

  const features: Array<HandWrittenFeature> = [
    {
      type: 'Feature',
      properties: { name: 'New York' },
      geometry: { type: 'Point', coordinates: NEW_YORK },
    },
    {
      type: 'Feature',
      properties: { name: 'Tokyo' },
      geometry: { type: 'Point', coordinates: TOKYO },
    },
    {
      type: 'Feature',
      properties: { name: 'New York → Tokyo' },
      geometry: { type: 'LineString', coordinates: [NEW_YORK, TOKYO] },
    },
    {
      type: 'Feature',
      properties: { name: 'Bermuda Triangle' },
      geometry: { type: 'Polygon', coordinates: [triangleRing] },
    },
  ];

  return features;
}
