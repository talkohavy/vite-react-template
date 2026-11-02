import { useEffect, useState } from 'react';
import { loadCountries, type CountryResolution } from '../../../logic/data/loadCountries';
import { WORLD_COUNTRIES, type CountryFeature } from '../../../logic/data/worldCountries';

type LoadedCountries = {
  resolution: CountryResolution;
  countries: Array<CountryFeature>;
};

type UseCountriesAtResolutionProps = {
  resolution: CountryResolution;
};

/**
 * Keeps showing the countries already on screen until the requested resolution has loaded.
 */
export function useCountriesAtResolution(props: UseCountriesAtResolutionProps) {
  const { resolution } = props;

  const [loaded, setLoaded] = useState<LoadedCountries>({ resolution: '110m', countries: WORLD_COUNTRIES });

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      const countries = await loadCountries({ resolution });

      if (isCancelled) return;

      setLoaded({ resolution, countries });
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [resolution]);

  const isLoading = loaded.resolution !== resolution;

  return { countries: loaded.countries, loadedResolution: loaded.resolution, isLoading };
}
