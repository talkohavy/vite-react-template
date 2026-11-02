import { describe, expect, it } from 'vite-plus/test';
import { formatDistance } from './formatDistance';

describe('formatDistance', () => {
  it('should use kilometers from 1000 meters up', () => {
    const expectedResult = '160 km';

    const actualResult = formatDistance({ meters: 156543 });

    expect(actualResult).toBe(expectedResult);
  });

  it('should use meters below 1000 meters', () => {
    const expectedResult = '0.3 m';

    const actualResult = formatDistance({ meters: 0.2986 });

    expect(actualResult).toBe(expectedResult);
  });
});
