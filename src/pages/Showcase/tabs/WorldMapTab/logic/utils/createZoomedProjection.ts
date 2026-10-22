import type { GeoProjectionContext } from '@tanstack/charts/geo';
import type { GeoPermissibleObjects, GeoProjection } from 'd3-geo';
import { applyZoomToProjection } from './applyZoomToProjection';
import type { MapZoomTransform } from '../types';

const INSET = 4;

type CreateZoomedProjectionProps = {
  createProjection: () => GeoProjection;
  /**
   * Geometry fitted into the plot at zoom level 1.
   */
  fitObject: GeoPermissibleObjects;
  transform: MapZoomTransform;
};

/**
 * Builds a `geoShape` projection callback that fits `fitObject` into the plot bounds,
 * then applies the zoom transform on top.
 */
export function createZoomedProjection(props: CreateZoomedProjectionProps) {
  const { createProjection, fitObject, transform } = props;

  function projectionForBounds(context: GeoProjectionContext<unknown>) {
    const { x, y, width, height } = context.chart;

    const projection = createProjection().fitExtent(
      [
        [x + INSET, y + INSET],
        [x + width - INSET, y + height - INSET],
      ],
      fitObject,
    );

    const zoomedProjection = applyZoomToProjection({ projection, transform });

    return zoomedProjection;
  }

  return projectionForBounds;
}
