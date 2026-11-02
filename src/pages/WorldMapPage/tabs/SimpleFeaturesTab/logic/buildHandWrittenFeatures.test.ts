import { geoArea, geoContains } from 'd3-geo';
import { describe, expect, it } from 'vite-plus/test';
import { buildHandWrittenFeatures } from './buildHandWrittenFeatures';

const PARIS: [number, number] = [2.35, 48.85];

function getTriangle(props: { isTriangleReversed: boolean }) {
  const features = buildHandWrittenFeatures(props);

  const triangle = features.find((feature) => feature.geometry.type === 'Polygon')!;

  return triangle;
}

describe('buildHandWrittenFeatures', () => {
  it('should close the triangle ring by repeating the first position at the end', () => {
    const triangle = getTriangle({ isTriangleReversed: false });
    const [ring] = (triangle.geometry as GeoJSON.Polygon).coordinates;

    expect(ring!.at(-1)).toEqual(ring![0]);
  });

  it('should make the clockwise triangle cover a small area', () => {
    const triangle = getTriangle({ isTriangleReversed: false });

    const areaInSteradians = geoArea(triangle);

    expect(areaInSteradians).toBeLessThan(0.05);
  });

  it('should make the reversed triangle cover everything except the triangle', () => {
    const triangle = getTriangle({ isTriangleReversed: true });

    const containsParis = geoContains(triangle, PARIS);

    expect(containsParis).toBe(true);
  });

  it('should list the reversed triangle positions in the opposite order', () => {
    const clockwiseRing = (getTriangle({ isTriangleReversed: false }).geometry as GeoJSON.Polygon).coordinates[0]!;

    const expectedResult = clockwiseRing.toReversed();
    const actualResult = (getTriangle({ isTriangleReversed: true }).geometry as GeoJSON.Polygon).coordinates[0];

    expect(actualResult).toEqual(expectedResult);
  });
});
