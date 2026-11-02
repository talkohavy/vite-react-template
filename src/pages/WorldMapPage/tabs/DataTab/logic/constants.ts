export type MetricName = 'population' | 'density';

export type ScaleType = 'linear' | 'log' | 'quantile';

export const METRIC_OPTIONS: Array<{ value: MetricName; label: string }> = [
  { value: 'population', label: 'Population' },
  { value: 'density', label: 'People per km²' },
];

export const SCALE_OPTIONS: Array<{ value: ScaleType; label: string }> = [
  { value: 'linear', label: 'Linear' },
  { value: 'log', label: 'Logarithmic' },
  { value: 'quantile', label: 'Quantiles' },
];

/**
 * ColorBrewer's YlGnBu: a change in hue on top of the change in lightness keeps neighbouring values apart.
 */
export const COLOR_RAMP = ['#ffffcc', '#41b6c4', '#253494'];

export const QUANTILE_CLASS_COUNT = 7;
