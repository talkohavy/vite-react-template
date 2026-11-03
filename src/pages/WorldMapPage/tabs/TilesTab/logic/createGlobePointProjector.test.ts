import { geoDistance, geoOrthographic } from 'd3-geo';
import { describe, expect, it } from 'vite-plus/test';
import { createGlobePointProjector, getLonLatTrig } from './createGlobePointProjector';
import type { GlobeRotation } from '../../../logic/globe/getRotationAfterDrag';

const ROTATIONS: Array<GlobeRotation> = [
  [0, 0],
  [-2.3, -48.9],
  [151, 33],
  [-170, 80],
];
const POINTS: Array<[number, number]> = [
  [0, 0],
  [2.29, 48.86],
  [-73.97, 40.78],
  [151.2, -33.9],
  [179.9, 70],
  [-120, -85],
];

describe('createGlobePointProjector', () => {
  it("should project like d3's rotated orthographic projection", () => {
    ROTATIONS.forEach((rotation) => {
      const projection = geoOrthographic().rotate(rotation).scale(1000).translate([480, 240]);
      const projectPoint = createGlobePointProjector({ rotation, radius: 1000, center: [480, 240] });

      POINTS.forEach((point) => {
        const [expectedX, expectedY] = projection(point)!;

        const actualResult = projectPoint(getLonLatTrig(point));

        expect(actualResult.x).toBeCloseTo(expectedX, 6);
        expect(actualResult.y).toBeCloseTo(expectedY, 6);
      });
    });
  });

  it('should tell which points are on the facing hemisphere', () => {
    ROTATIONS.forEach((rotation) => {
      const facingPoint: [number, number] = [-rotation[0], -rotation[1]];
      const projectPoint = createGlobePointProjector({ rotation, radius: 1, center: [0, 0] });

      POINTS.forEach((point) => {
        const expectedResult = geoDistance(facingPoint, point) < Math.PI / 2;

        const actualResult = projectPoint(getLonLatTrig(point)).isFacing;

        expect(actualResult).toBe(expectedResult);
      });
    });
  });
});
