import { BASE_WORLD_SIZE } from './constants';
import { createTileAlignedProjection } from './createTileAlignedProjection';
import { projectOutline, type PlanarOutline } from './projectOutline';
import type { CountryFeature } from '../../../logic/data/worldCountries';

const UNZOOMED_PROJECTION = createTileAlignedProjection({
  transform: { k: 1, x: 0, y: 0 },
  baseWorldSize: BASE_WORLD_SIZE,
});

const outlineCache = new WeakMap<CountryFeature, PlanarOutline>();

type GetUnzoomedOutlineProps = { country: CountryFeature };

/**
 * A country's borders in Web Mercator at 1x, projected once and cached. Zooming only scales and translates them.
 */
export function getUnzoomedOutline(props: GetUnzoomedOutlineProps) {
  const { country } = props;

  const cachedOutline = outlineCache.get(country);

  if (cachedOutline) return cachedOutline;

  const planarOutline = projectOutline({ country, projection: UNZOOMED_PROJECTION });
  outlineCache.set(country, planarOutline);

  return planarOutline;
}
