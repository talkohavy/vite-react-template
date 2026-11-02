import { scaleLinear, scaleLog, scaleQuantile } from 'd3-scale';
import { COLOR_RAMP, QUANTILE_CLASS_COUNT, type ScaleType } from './constants';

export type LegendTick = { value: number; offset: number };

export type LegendClass = { color: string; lowerBound: number };

export type ColorLegend =
  | { kind: 'continuous'; ticks: Array<LegendTick> }
  | { kind: 'classes'; classes: Array<LegendClass> };

export type ColorScale = {
  getColor: (value: number) => string;
  legend: ColorLegend;
};

const LINEAR_TICK_COUNT = 5;

const colorRamp = scaleLinear<string>()
  .domain(COLOR_RAMP.map((_, index) => index / (COLOR_RAMP.length - 1)))
  .range(COLOR_RAMP);

function isPowerOfTen(value: number) {
  const exponent = Math.log10(value);
  const isWholeExponent = Math.abs(exponent - Math.round(exponent)) < 1e-9;

  return isWholeExponent;
}

type BuildColorScaleProps = {
  values: Array<number>;
  scaleType: ScaleType;
};

/**
 * The legend's gradient spaces the ramp's colors evenly, so `offset` places a tick on it directly.
 */
export function buildColorScale(props: BuildColorScaleProps): ColorScale {
  const { values, scaleType } = props;

  const maxValue = Math.max(...values);

  if (scaleType === 'quantile') {
    const classColors = Array.from({ length: QUANTILE_CLASS_COUNT }, (_, index) =>
      colorRamp(index / (QUANTILE_CLASS_COUNT - 1)),
    );
    const quantileScale = scaleQuantile<string>().domain(values).range(classColors);
    const lowerBounds = [Math.min(...values), ...quantileScale.quantiles()];
    const classes = classColors.map((color, index) => ({ color, lowerBound: lowerBounds[index]! }));

    return { getColor: (value) => quantileScale(value), legend: { kind: 'classes', classes } };
  }

  if (scaleType === 'log') {
    const smallestPositiveValue = Math.min(...values.filter((value) => value > 0));
    const offsetScale = scaleLog().domain([smallestPositiveValue, maxValue]).range([0, 1]).clamp(true);
    const ticks = offsetScale
      .ticks()
      .filter(isPowerOfTen)
      .map((value) => ({ value, offset: offsetScale(value) }));

    return { getColor: (value) => colorRamp(offsetScale(value)), legend: { kind: 'continuous', ticks } };
  }

  const offsetScale = scaleLinear().domain([0, maxValue]).range([0, 1]).clamp(true);
  const ticks = offsetScale.ticks(LINEAR_TICK_COUNT).map((value) => ({ value, offset: offsetScale(value) }));

  return { getColor: (value) => colorRamp(offsetScale(value)), legend: { kind: 'continuous', ticks } };
}
