import { geoDistance } from 'd3-geo';
import { getBoundingCircle, type BoundingCircle } from './getBoundingCircle';
import type { CountryFeature } from '../data/worldCountries';

type CirclePolygon = {
  coordinates: Array<Array<GeoJSON.Position>>;
  circle: BoundingCircle;
};

const polygonCache = new WeakMap<CountryFeature, Array<CirclePolygon>>();

function getCirclePolygons(country: CountryFeature) {
  const cachedPolygons = polygonCache.get(country);

  if (cachedPolygons) return cachedPolygons;

  const { geometry } = country;
  const polygonCoordinates = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  const circlePolygons = polygonCoordinates.map((coordinates) => ({
    coordinates,
    circle: getBoundingCircle({ object: { type: 'Polygon', coordinates } }),
  }));
  polygonCache.set(country, circlePolygons);

  return circlePolygons;
}

type GetFacingGeometryProps = {
  country: CountryFeature;
  facingPoint: [number, number];
  /**
   * How far from the facing point the globe is still on screen, in radians.
   */
  capRadius: number;
};

/**
 * The country's polygons that may be on screen, judged by a circle around each one (computed once), or null when none
 * are. A country like Canada is hundreds of islands, so most of it can be skipped while one corner is in view. It
 * never misses a polygon on screen, though it can keep a few that turn out not to be.
 */
export function getFacingGeometry(props: GetFacingGeometryProps): GeoJSON.MultiPolygon | null {
  const { country, facingPoint, capRadius } = props;

  const facingPolygons = getCirclePolygons(country).filter(
    ({ circle }) => geoDistance(facingPoint, circle.center) <= capRadius + circle.radius,
  );

  const facingGeometry: GeoJSON.MultiPolygon | null = facingPolygons.length
    ? { type: 'MultiPolygon', coordinates: facingPolygons.map(({ coordinates }) => coordinates) }
    : null;

  return facingGeometry;
}
