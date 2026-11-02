import { toCountryFeatures, WORLD_COUNTRIES, type CountryFeature } from './worldCountries';

export type CountryResolution = '110m' | '50m' | '10m';

type CountryResolutionInfo = {
  label: string;
  /**
   * The zoom level from which this resolution is used.
   */
  minZoom: number;
  fileSizeKb: number;
  positionCount: number;
  /**
   * Average distance between two consecutive outline positions.
   */
  averageSegmentKm: number;
};

/**
 * Measured from the world-atlas 2.0.2 files. The zoom thresholds keep the average segment at about 5 pixels
 * (at the equator, in equirectangular, where one unit of the 960-wide map is about 41.7 km at 1×).
 */
export const COUNTRY_RESOLUTIONS: Record<CountryResolution, CountryResolutionInfo> = {
  '110m': { label: '1:110m', minZoom: 1, fileSizeKb: 108, positionCount: 10_587, averageSegmentKm: 73 },
  '50m': { label: '1:50m', minZoom: 3, fileSizeKb: 756, positionCount: 99_539, averageSegmentKm: 10.4 },
  '10m': { label: '1:10m', minZoom: 20, fileSizeKb: 3661, positionCount: 544_898, averageSegmentKm: 2.6 },
};

const TOPOLOGY_LOADERS: Record<Exclude<CountryResolution, '110m'>, () => Promise<{ default: unknown }>> = {
  '50m': () => import('world-atlas/countries-50m.json'),
  '10m': () => import('world-atlas/countries-10m.json'),
};

const loadedCountries = new Map<CountryResolution, Array<CountryFeature>>([['110m', WORLD_COUNTRIES]]);

type LoadCountriesProps = {
  resolution: CountryResolution;
};

/**
 * The 1:110m countries ship with the page. The bigger files are fetched the first time they're needed, then kept.
 */
export async function loadCountries(props: LoadCountriesProps) {
  const { resolution } = props;

  const cachedCountries = loadedCountries.get(resolution);

  if (cachedCountries) return cachedCountries;

  const topologyModule = await TOPOLOGY_LOADERS[resolution as Exclude<CountryResolution, '110m'>]();
  const countries = toCountryFeatures({ topologyJson: topologyModule.default });

  loadedCountries.set(resolution, countries);

  return countries;
}
