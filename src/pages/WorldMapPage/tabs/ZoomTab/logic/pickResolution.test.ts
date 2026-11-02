import { describe, expect, it } from 'vite-plus/test';
import { pickResolution } from './pickResolution';

describe('pickResolution', () => {
  it('should use the 1:110m countries when not zoomed in', () => {
    const actualResult = pickResolution({ zoomLevel: 1 });

    expect(actualResult).toEqual('110m');
  });

  it('should switch to the 1:50m countries from 3x', () => {
    const actualResult = pickResolution({ zoomLevel: 3 });

    expect(actualResult).toEqual('50m');
  });

  it('should stay on the 1:50m countries just below 20x', () => {
    const actualResult = pickResolution({ zoomLevel: 19.9 });

    expect(actualResult).toEqual('50m');
  });

  it('should switch to the 1:10m countries from 20x', () => {
    const actualResult = pickResolution({ zoomLevel: 20 });

    expect(actualResult).toEqual('10m');
  });
});
