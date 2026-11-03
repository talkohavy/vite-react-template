import { describe, expect, it } from 'vite-plus/test';
import { GLOBE_RADIUS } from './constants';
import { getGlobeTileZoom, getGlobeZoomForTileZoom } from './getGlobeTileZoom';

describe('getGlobeTileZoom', () => {
  it('should use level 3 for the unzoomed globe facing the equator', () => {
    const expectedResult = 3;

    const actualResult = getGlobeTileZoom({ radiusOnScreen: GLOBE_RADIUS, latitude: 0 });

    expect(actualResult).toBe(expectedResult);
  });

  it('should use a shallower level far north, where Mercator tiles cover less ground', () => {
    const radiusOnScreen = GLOBE_RADIUS * 1000;

    const equatorTileZoom = getGlobeTileZoom({ radiusOnScreen, latitude: 0 });
    const arcticTileZoom = getGlobeTileZoom({ radiusOnScreen, latitude: 70 });

    expect(arcticTileZoom).toBe(equatorTileZoom - 2);
  });

  it('should never go below level 3', () => {
    const expectedResult = 3;

    const actualResult = getGlobeTileZoom({ radiusOnScreen: GLOBE_RADIUS, latitude: 80 });

    expect(actualResult).toBe(expectedResult);
  });
});

describe('getGlobeZoomForTileZoom', () => {
  it('should pick a zoom at which the globe shows that tile level', () => {
    const tileZooms = [3, 10, 14, 17];
    const latitudes = [0, 40.78, 48.86, -33.86];

    const actualResult = latitudes.map((latitude) =>
      tileZooms.map((tileZoom) => {
        const zoomLevel = getGlobeZoomForTileZoom({ tileZoom, latitude });

        return getGlobeTileZoom({ radiusOnScreen: GLOBE_RADIUS * zoomLevel, latitude });
      }),
    );

    expect(actualResult).toEqual(latitudes.map(() => tileZooms));
  });
});
