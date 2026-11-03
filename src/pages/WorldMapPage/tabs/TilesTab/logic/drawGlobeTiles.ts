import { geoCircle, geoPath, type GeoProjection, type GeoSphere } from 'd3-geo';
import { createGlobePointProjector } from './createGlobePointProjector';
import { getTileCells, MAX_CELL_ERROR, MAX_CELLS_PER_SIDE } from './getTileCells';
import { MERCATOR_MAX_LATITUDE } from './tileCoordinates';
import type { GlobeRotation } from '../../../logic/globe/getRotationAfterDrag';
import type { GlobeTile } from './getGlobeVisibleTiles';
import type { TileImageSource } from './useTileImages';

const SPHERE: GeoSphere = { type: 'Sphere' };
const POLAR_CAP_RADIUS = 90 - MERCATOR_MAX_LATITUDE;
const POLAR_CAPS: GeoJSON.MultiPolygon = {
  type: 'MultiPolygon',
  coordinates: [
    geoCircle().center([0, 90]).radius(POLAR_CAP_RADIUS)().coordinates,
    geoCircle().center([0, -90]).radius(POLAR_CAP_RADIUS)().coordinates,
  ],
};

const POLAR_CAP_COLOR = '#d4d4d4';

type DrawGlobeTilesProps = {
  context: CanvasRenderingContext2D;
  tiles: Array<GlobeTile>;
  getTileImage: (tile: GlobeTile) => TileImageSource | null;
  /**
   * Rotated, scaled and clipped to the visible part of the globe, for the sphere and the polar caps.
   */
  projection: GeoProjection;
  rotation: GlobeRotation;
  radiusOnScreen: number;
  center: [number, number];
  pixelRatio: number;
  /**
   * Shown where a tile hasn't loaded yet.
   */
  oceanColor: string;
};

/**
 * Each tile is cut into cells that are nearly flat, and each cell is drawn as a parallelogram: the image stretched by
 * an affine transform. Cells are drawn a little bigger than they are, so neighbours overlap instead of leaving
 * hairline gaps where their parallelograms don't quite meet.
 */
export function drawGlobeTiles(props: DrawGlobeTilesProps) {
  const { context, tiles, getTileImage, projection, rotation, radiusOnScreen, center, pixelRatio, oceanColor } = props;

  const canvasPath = geoPath(projection, context);
  const projectPoint = createGlobePointProjector({ rotation, radius: radiusOnScreen, center });

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  context.save();
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.beginPath();
  canvasPath(SPHERE);
  context.fillStyle = oceanColor;
  context.fill();
  context.clip();

  tiles.forEach((tile) => {
    const tileImage = getTileImage(tile);

    if (!tileImage) return;

    const { image, sourceX, sourceY, sourceSize } = tileImage;
    const sourcePerCell = sourceSize / MAX_CELLS_PER_SIDE;

    getTileCells({ tile, projectPoint }).forEach(
      ({ column, row, size, originX, originY, acrossX, acrossY, downX, downY }) => {
        const acrossLength = Math.hypot(acrossX, acrossY);
        const downLength = Math.hypot(downX, downY);

        if (acrossLength === 0 || downLength === 0) return;

        const cellSourceSize = sourcePerCell * size;
        const pixelsPerSourcePixel = pixelRatio / cellSourceSize;
        const overlapAcross = (MAX_CELL_ERROR / acrossLength) * cellSourceSize;
        const overlapDown = (MAX_CELL_ERROR / downLength) * cellSourceSize;

        context.setTransform(
          acrossX * pixelsPerSourcePixel,
          acrossY * pixelsPerSourcePixel,
          downX * pixelsPerSourcePixel,
          downY * pixelsPerSourcePixel,
          originX * pixelRatio,
          originY * pixelRatio,
        );
        context.drawImage(
          image,
          sourceX + column * sourcePerCell,
          sourceY + row * sourcePerCell,
          cellSourceSize,
          cellSourceSize,
          -overlapAcross,
          -overlapDown,
          cellSourceSize + 2 * overlapAcross,
          cellSourceSize + 2 * overlapDown,
        );
      },
    );
  });

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.beginPath();
  canvasPath(POLAR_CAPS);
  context.fillStyle = POLAR_CAP_COLOR;
  context.fill();
  context.restore();
}
