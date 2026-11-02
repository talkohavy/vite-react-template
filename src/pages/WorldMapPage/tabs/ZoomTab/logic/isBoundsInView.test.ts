import { describe, expect, it } from 'vite-plus/test';
import { isBoundsInView } from './isBoundsInView';

const WIDTH = 100;
const HEIGHT = 100;

describe('isBoundsInView', () => {
  it('should see everything when not zoomed in', () => {
    const actualResult = isBoundsInView({
      bounds: [
        [90, 90],
        [95, 95],
      ],
      transform: { k: 1, x: 0, y: 0 },
      width: WIDTH,
      height: HEIGHT,
    });

    expect(actualResult).toBe(true);
  });

  it('should hide a shape outside the top-left quarter when zoomed in 2x on it', () => {
    const actualResult = isBoundsInView({
      bounds: [
        [60, 60],
        [70, 70],
      ],
      transform: { k: 2, x: 0, y: 0 },
      width: WIDTH,
      height: HEIGHT,
    });

    expect(actualResult).toBe(false);
  });

  it('should show a shape once the view is panned onto it', () => {
    const actualResult = isBoundsInView({
      bounds: [
        [60, 60],
        [70, 70],
      ],
      transform: { k: 2, x: -100, y: -100 },
      width: WIDTH,
      height: HEIGHT,
    });

    expect(actualResult).toBe(true);
  });

  it('should show a shape that only partly overlaps the view', () => {
    const actualResult = isBoundsInView({
      bounds: [
        [45, 45],
        [70, 70],
      ],
      transform: { k: 2, x: 0, y: 0 },
      width: WIDTH,
      height: HEIGHT,
    });

    expect(actualResult).toBe(true);
  });
});
