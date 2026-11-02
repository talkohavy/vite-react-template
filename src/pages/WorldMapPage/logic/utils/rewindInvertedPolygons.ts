import { geoArea } from 'd3-geo';
import type { CountryFeature } from '../data/worldCountries';

const HEMISPHERE_AREA_IN_STERADIANS = 2 * Math.PI;

type RewindPolygonProps = {
  rings: Array<Array<GeoJSON.Position>>;
};

function rewindPolygon(props: RewindPolygonProps) {
  const { rings } = props;

  const area = geoArea({ type: 'Polygon', coordinates: rings });

  if (area <= HEMISPHERE_AREA_IN_STERADIANS) return rings;

  const rewoundRings = rings.map((ring) => ring.toReversed());

  return rewoundRings;
}

type RewindInvertedPolygonsProps = {
  feature: CountryFeature;
};

/**
 * d3-geo reads a counterclockwise ring as "everything except this ring". No country is larger than a hemisphere,
 * so any polygon that comes out larger is wound the wrong way and gets reversed.
 */
export function rewindInvertedPolygons(props: RewindInvertedPolygonsProps): CountryFeature {
  const { feature } = props;
  const { geometry } = feature;

  if (geometry.type === 'Polygon') {
    const coordinates = rewindPolygon({ rings: geometry.coordinates });

    return { ...feature, geometry: { ...geometry, coordinates } };
  }

  const coordinates = geometry.coordinates.map((rings) => rewindPolygon({ rings }));

  return { ...feature, geometry: { ...geometry, coordinates } };
}
