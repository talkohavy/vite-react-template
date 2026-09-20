import { getWrappedIndex } from './getWrappedIndex';

describe('getWrappedIndex', () => {
  it('should move forward within range', () => {
    const expectedResult = 1;
    const actualResult = getWrappedIndex({ index: 0, length: 3, delta: 1 });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should wrap forward from the last index', () => {
    const expectedResult = 0;
    const actualResult = getWrappedIndex({ index: 2, length: 3, delta: 1 });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should wrap backward from the first index', () => {
    const expectedResult = 2;
    const actualResult = getWrappedIndex({ index: 0, length: 3, delta: -1 });

    expect(actualResult).toEqual(expectedResult);
  });
});
