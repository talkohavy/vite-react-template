import type { CountryPopulationRow } from '../../../logic/data/countryPopulation';
import type { MetricName } from './constants';

type GetMetricValueProps = {
  row: CountryPopulationRow;
  metric: MetricName;
};

export function getMetricValue(props: GetMetricValueProps) {
  const { row, metric } = props;

  if (metric === 'population') return row.population;

  if (row.areaKm2 === 0) return null;

  const density = row.population / row.areaKm2;

  return density;
}
