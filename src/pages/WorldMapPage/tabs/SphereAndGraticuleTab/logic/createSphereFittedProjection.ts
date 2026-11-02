import { geoEquirectangular, type GeoSphere } from 'd3-geo';

const SPHERE: GeoSphere = { type: 'Sphere' };

type CreateSphereFittedProjectionProps = {
  width: number;
  height: number;
};

/**
 * An equirectangular projection scaled so the whole globe (not just the land) fills `width` x `height`.
 * Every layer drawn with it shares the same frame.
 */
export function createSphereFittedProjection(props: CreateSphereFittedProjectionProps) {
  const { width, height } = props;

  const projection = geoEquirectangular().fitSize([width, height], SPHERE);

  return projection;
}
