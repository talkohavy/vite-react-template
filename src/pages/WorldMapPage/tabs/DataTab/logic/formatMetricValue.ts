import type { MetricName } from './constants';

const WHOLE_NUMBER_FORMAT = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const SMALL_NUMBER_FORMAT = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 2 });
const COMPACT_FORMAT = new Intl.NumberFormat('en-US', { notation: 'compact', maximumSignificantDigits: 2 });

type FormatMetricValueProps = {
  value: number;
  metric: MetricName;
};

export function formatMetricValue(props: FormatMetricValueProps) {
  const { value, metric } = props;

  if (metric === 'population') {
    const formattedPopulation = `${WHOLE_NUMBER_FORMAT.format(value)} people`;

    return formattedPopulation;
  }

  const numberFormat = value < 10 ? SMALL_NUMBER_FORMAT : WHOLE_NUMBER_FORMAT;
  const formattedDensity = `${numberFormat.format(value)} people per km²`;

  return formattedDensity;
}

type FormatCompactNumberProps = { value: number };

export function formatCompactNumber(props: FormatCompactNumberProps) {
  const { value } = props;

  const formattedValue = COMPACT_FORMAT.format(value);

  return formattedValue;
}
