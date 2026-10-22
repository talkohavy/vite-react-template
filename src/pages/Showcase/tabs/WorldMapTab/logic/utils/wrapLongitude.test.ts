import { describe, expect, it } from 'vite-plus/test';
import { wrapLongitude } from './wrapLongitude';

describe('wrapLongitude', () => {
  it('should keep a longitude that is already in range', () => {
    const expectedResult = 35;
    const actualResult = wrapLongitude({ longitude: 35 });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should wrap a longitude past 180 around to the negative side', () => {
    const expectedResult = -170;
    const actualResult = wrapLongitude({ longitude: 190 });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should wrap a longitude below -180 around to the positive side', () => {
    const expectedResult = 170;
    const actualResult = wrapLongitude({ longitude: -190 });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should map exactly 180 to -180', () => {
    const expectedResult = -180;
    const actualResult = wrapLongitude({ longitude: 180 });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should wrap longitudes that are several turns away', () => {
    const expectedResult = 10;
    const actualResult = wrapLongitude({ longitude: 730 });

    expect(actualResult).toEqual(expectedResult);
  });
});
