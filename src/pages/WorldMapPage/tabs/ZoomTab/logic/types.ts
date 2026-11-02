/**
 * Scale by `k`, then translate by `x`,`y` map units (the same shape as a d3-zoom transform).
 */
export type ZoomTransform = {
  k: number;
  x: number;
  y: number;
};
