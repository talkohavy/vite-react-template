import { describe, expect, it } from 'vite-plus/test';
import { extractTabValueFromPathname } from './extractTabValueFromPathname';

describe('extractTabValueFromPathname', () => {
  it('should return the segment that follows the page slug', () => {
    const expectedResult = 'analytics';
    const actualResult = extractTabValueFromPathname({ pageSlug: 'outlet', pathname: '/app/outlet/analytics' });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should return an empty string when the page slug is the last segment', () => {
    const expectedResult = '';
    const actualResult = extractTabValueFromPathname({ pageSlug: 'outlet', pathname: '/app/outlet' });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should return an empty string when the page slug is not in the pathname', () => {
    const expectedResult = '';
    const actualResult = extractTabValueFromPathname({ pageSlug: 'outlet', pathname: '/app/home' });

    expect(actualResult).toEqual(expectedResult);
  });
});
