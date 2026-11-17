import { describe, expect, it } from 'vite-plus/test';
import { formatDistance, formatDuration } from './formatRoute';

describe('formatDistance', () => {
  it('should round short distances to tens of meters', () => {
    const expectedResult = '480 m';

    const actualResult = formatDistance(476);

    expect(actualResult).toBe(expectedResult);
  });

  it('should show longer distances in kilometers with one decimal', () => {
    const expectedResult = '16.5 km';

    const actualResult = formatDistance(16_510);

    expect(actualResult).toBe(expectedResult);
  });
});

describe('formatDuration', () => {
  it('should show trips under an hour in minutes', () => {
    const expectedResult = '18 min';

    const actualResult = formatDuration(1_070);

    expect(actualResult).toBe(expectedResult);
  });

  it('should show hours and minutes for longer trips', () => {
    const expectedResult = '3 h 40 min';

    const actualResult = formatDuration(13_200);

    expect(actualResult).toBe(expectedResult);
  });

  it('should leave out zero minutes', () => {
    const expectedResult = '2 h';

    const actualResult = formatDuration(7_200);

    expect(actualResult).toBe(expectedResult);
  });

  it('should never say zero minutes', () => {
    const expectedResult = '1 min';

    const actualResult = formatDuration(10);

    expect(actualResult).toBe(expectedResult);
  });
});
