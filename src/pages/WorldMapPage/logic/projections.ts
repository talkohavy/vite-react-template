import { geoEqualEarth, geoEquirectangular, geoMercator, geoOrthographic, type GeoProjection } from 'd3-geo';
import type { RadioOption } from '@src/components/controls/RadioButtons';

type ProjectionInfo = {
  label: string;
  createProjection: () => GeoProjection;
};

export const PROJECTIONS = {
  equirectangular: { label: 'Equirectangular', createProjection: geoEquirectangular },
  mercator: { label: 'Mercator', createProjection: geoMercator },
  equalEarth: { label: 'Equal Earth', createProjection: geoEqualEarth },
  orthographic: { label: 'Orthographic', createProjection: geoOrthographic },
} satisfies Record<string, ProjectionInfo>;

export type ProjectionName = keyof typeof PROJECTIONS;

export const PROJECTION_OPTIONS: Array<RadioOption> = Object.entries(PROJECTIONS).map(([value, { label }]) => ({
  value,
  label,
}));
