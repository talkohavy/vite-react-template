import { formatCoords } from './formatCoords';

describe('formatCoords', () => {
  it('should join a flat list of numbers into a comma-separated string', () => {
    const expectedResult = '30,30,220,196';
    const actualResult = formatCoords({ coords: [30, 30, 220, 196] });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should return an empty string for an empty array', () => {
    const expectedResult = '';
    const actualResult = formatCoords({ coords: [] });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should support a single coordinate pair', () => {
    const expectedResult = '350,110,60';
    const actualResult = formatCoords({ coords: [350, 110, 60] });

    expect(actualResult).toEqual(expectedResult);
  });
});
