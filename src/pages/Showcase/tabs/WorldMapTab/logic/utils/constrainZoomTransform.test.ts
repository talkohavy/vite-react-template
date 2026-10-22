import { describe, expect, it } from 'vite-plus/test';
import { constrainZoomTransform } from './constrainZoomTransform';

const EXTENT: [[number, number], [number, number]] = [
  [0, 0],
  [800, 400],
];

describe('constrainZoomTransform', () => {
  it('should pin the translation to zero when not zoomed in', () => {
    const expectedResult = { k: 1, x: 0, y: 0 };
    const actualResult = constrainZoomTransform({ transform: { k: 1, x: 50, y: -30 }, extent: EXTENT });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should keep a translation that stays within bounds', () => {
    const expectedResult = { k: 2, x: -300, y: -100 };
    const actualResult = constrainZoomTransform({ transform: { k: 2, x: -300, y: -100 }, extent: EXTENT });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should stop the content from being dragged past the top-left corner', () => {
    const expectedResult = { k: 2, x: 0, y: 0 };
    const actualResult = constrainZoomTransform({ transform: { k: 2, x: 120, y: 60 }, extent: EXTENT });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should stop the content from being dragged past the bottom-right corner', () => {
    const expectedResult = { k: 2, x: -800, y: -400 };
    const actualResult = constrainZoomTransform({ transform: { k: 2, x: -1000, y: -900 }, extent: EXTENT });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should respect an extent that does not start at the origin', () => {
    const expectedResult = { k: 2, x: -100, y: -50 };
    const actualResult = constrainZoomTransform({
      transform: { k: 2, x: 0, y: 0 },
      extent: [
        [100, 50],
        [900, 450],
      ],
    });

    expect(actualResult).toEqual(expectedResult);
  });
});
