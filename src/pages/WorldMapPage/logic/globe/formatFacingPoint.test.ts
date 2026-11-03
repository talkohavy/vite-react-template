import { describe, expect, it } from 'vite-plus/test';
import { formatFacingPoint } from './formatFacingPoint';

describe('formatFacingPoint', () => {
  it('should show the unrotated globe facing 0°, 0°', () => {
    const expectedResult = '0°, 0°';

    const actualResult = formatFacingPoint({ rotation: [0, 0] });

    expect(actualResult).toBe(expectedResult);
  });

  it('should show the point opposite the rotation, rounded to whole degrees', () => {
    const expectedResult = '32°N, 35°E';

    const actualResult = formatFacingPoint({ rotation: [-34.8, -31.8] });

    expect(actualResult).toBe(expectedResult);
  });

  it('should use south for a globe tilted to show the southern hemisphere', () => {
    const expectedResult = '34°S, 151°E';

    const actualResult = formatFacingPoint({ rotation: [-151.2, 33.9] });

    expect(actualResult).toBe(expectedResult);
  });

  it('should use west for a globe turned east', () => {
    const expectedResult = '0°, 30°W';

    const actualResult = formatFacingPoint({ rotation: [30, 0] });

    expect(actualResult).toBe(expectedResult);
  });
});
