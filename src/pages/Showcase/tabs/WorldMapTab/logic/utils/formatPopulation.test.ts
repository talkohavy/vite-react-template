import { describe, expect, it } from 'vite-plus/test';
import { formatPopulation } from './formatPopulation';

describe('formatPopulation', () => {
  it('should format values of a thousand millions and above as billions', () => {
    const expectedResult = '1.41 billion';
    const actualResult = formatPopulation({ millions: 1410.7 });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should format values between one and a thousand as millions', () => {
    const expectedResult = '339.9 million';
    const actualResult = formatPopulation({ millions: 339.9 });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should drop a trailing zero fraction', () => {
    const expectedResult = '7 million';
    const actualResult = formatPopulation({ millions: 7 });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should format values below one million as thousands', () => {
    const expectedResult = '3.7 thousand';
    const actualResult = formatPopulation({ millions: 0.0037 });

    expect(actualResult).toEqual(expectedResult);
  });
});
