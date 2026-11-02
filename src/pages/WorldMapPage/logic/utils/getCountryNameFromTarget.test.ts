import { describe, expect, it } from 'vite-plus/test';
import { getCountryNameFromTarget } from './getCountryNameFromTarget';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

describe('getCountryNameFromTarget', () => {
  it('should read the country name from a path that carries data-name', () => {
    const path = document.createElementNS(SVG_NAMESPACE, 'path');
    path.dataset.name = 'France';

    const actualResult = getCountryNameFromTarget({ target: path });

    expect(actualResult).toEqual('France');
  });

  it('should return null for a path without data-name', () => {
    const path = document.createElementNS(SVG_NAMESPACE, 'path');

    const actualResult = getCountryNameFromTarget({ target: path });

    expect(actualResult).toBeNull();
  });

  it('should return null for a missing target', () => {
    const actualResult = getCountryNameFromTarget({ target: null });

    expect(actualResult).toBeNull();
  });
});
