import { geoStream, type GeoProjection } from 'd3-geo';
import type { CountryFeature } from '../../../logic/data/worldCountries';

export type PlanarOutline = {
  outline: GeoJSON.MultiLineString;
  bounds: [[number, number], [number, number]];
};

function toBorderLines(country: CountryFeature): GeoJSON.MultiLineString {
  const { geometry } = country;
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  const borderLines: GeoJSON.MultiLineString = { type: 'MultiLineString', coordinates: polygons.flat() };

  return borderLines;
}

type ProjectOutlineProps = {
  country: CountryFeature;
  projection: GeoProjection;
};

/**
 * Projects a country's borders as lines rather than as a polygon: clipping a polygon to the view adds the view's own
 * edges to it, while clipping a line only cuts it.
 */
export function projectOutline(props: ProjectOutlineProps): PlanarOutline {
  const { country, projection } = props;

  const lines: Array<Array<GeoJSON.Position>> = [];
  let currentLine: Array<GeoJSON.Position> = [];
  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;

  const collector = projection.stream({
    point(x, y) {
      currentLine.push([x, y]);
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    },
    lineStart() {
      currentLine = [];
    },
    lineEnd() {
      if (currentLine.length > 1) lines.push(currentLine);
    },
    polygonStart() {},
    polygonEnd() {},
    sphere() {},
  });

  geoStream(toBorderLines(country), collector);

  const planarOutline: PlanarOutline = {
    outline: { type: 'MultiLineString', coordinates: lines },
    bounds: [
      [left, top],
      [right, bottom],
    ],
  };

  return planarOutline;
}
