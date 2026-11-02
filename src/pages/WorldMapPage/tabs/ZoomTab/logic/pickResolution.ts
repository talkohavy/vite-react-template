import { COUNTRY_RESOLUTIONS, type CountryResolution } from '../../../logic/data/loadCountries';

const RESOLUTIONS_FROM_MOST_DETAILED: Array<CountryResolution> = ['10m', '50m', '110m'];

type PickResolutionProps = {
  zoomLevel: number;
};

export function pickResolution(props: PickResolutionProps): CountryResolution {
  const { zoomLevel } = props;

  const resolution = RESOLUTIONS_FROM_MOST_DETAILED.find(
    (candidate) => zoomLevel >= COUNTRY_RESOLUTIONS[candidate].minZoom,
  );

  return resolution ?? '110m';
}
