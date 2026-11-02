import { formatMetricValue } from './formatMetricValue';
import { getMetricValue } from './getMetricValue';
import type { CountryPopulationRow } from '../../../logic/data/countryPopulation';
import type { CountryFeature } from '../../../logic/data/worldCountries';
import type { MetricName } from './constants';

type DescribeCountryValueProps = {
  country: CountryFeature;
  row: CountryPopulationRow | null;
  metric: MetricName;
};

export function describeCountryValue(props: DescribeCountryValueProps) {
  const { country, row, metric } = props;

  if (!row) {
    const missingRowDescription =
      country.id === undefined ? 'no data: no ISO code to join on' : `no data: no row for code ${country.id}`;

    return missingRowDescription;
  }

  const value = getMetricValue({ row, metric });

  if (value === null) return `row ${row.isoCode} (${row.name}) · no data: its outline has no area`;

  const description = `row ${row.isoCode} (${row.name}) · ${formatMetricValue({ value, metric })}`;

  return description;
}
