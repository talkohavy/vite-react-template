import type { CountryFeature } from '../data/worldCountries';

type PluralizeProps = {
  count: number;
  word: string;
};

function pluralize(props: PluralizeProps) {
  const { count, word } = props;

  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

type SummarizeCoordinatesProps = {
  geometry: CountryFeature['geometry'];
};

function summarizeCoordinates(props: SummarizeCoordinatesProps) {
  const { geometry } = props;

  if (geometry.type === 'Polygon') {
    const rings = pluralize({ count: geometry.coordinates.length, word: 'ring' });
    const positions = pluralize({ count: geometry.coordinates.flat().length, word: 'position' });

    return `[ ${rings}, ${positions} ]`;
  }

  const polygons = pluralize({ count: geometry.coordinates.length, word: 'polygon' });
  const positions = pluralize({ count: geometry.coordinates.flat(2).length, word: 'position' });

  return `[ ${polygons}, ${positions} ]`;
}

type SummarizeCountryFeatureProps = {
  feature: CountryFeature;
};

/**
 * Pretty-prints a country feature the way it looks as GeoJSON, with the coordinates collapsed into counts.
 */
export function summarizeCountryFeature(props: SummarizeCountryFeatureProps) {
  const { feature } = props;
  const { id, properties, geometry } = feature;

  const idText = id === undefined ? 'undefined' : `"${id}"`;
  const coordinatesSummary = summarizeCoordinates({ geometry });

  const summary = [
    '{',
    '  type: "Feature",',
    `  id: ${idText},`,
    `  properties: { name: "${properties.name}" },`,
    '  geometry: {',
    `    type: "${geometry.type}",`,
    `    coordinates: ${coordinatesSummary}`,
    '  }',
    '}',
  ].join('\n');

  return summary;
}
