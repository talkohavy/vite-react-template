import type { GeoProjection, GeoSphere } from 'd3-geo';

const SPHERE: GeoSphere = { type: 'Sphere' };

type FitProjectionToSphereProps = {
  createProjection: () => GeoProjection;
  width: number;
  height: number;
};

/**
 * Creates a projection and scales it so the whole globe fits inside `width` x `height`, centered.
 */
export function fitProjectionToSphere(props: FitProjectionToSphereProps) {
  const { createProjection, width, height } = props;

  const projection = createProjection().fitSize([width, height], SPHERE);

  return projection;
}
