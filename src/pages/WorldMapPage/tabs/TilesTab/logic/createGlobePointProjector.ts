import type { GlobeRotation } from '../../../logic/globe/getRotationAfterDrag';

const RADIANS_PER_DEGREE = Math.PI / 180;

export type LonLatTrig = {
  cosLongitude: number;
  sinLongitude: number;
  cosLatitude: number;
  sinLatitude: number;
};

export type GlobePoint = {
  x: number;
  y: number;
  isFacing: boolean;
};

export function getLonLatTrig(lonLat: [number, number]): LonLatTrig {
  const [longitude, latitude] = lonLat;

  const lonLatTrig = {
    cosLongitude: Math.cos(longitude * RADIANS_PER_DEGREE),
    sinLongitude: Math.sin(longitude * RADIANS_PER_DEGREE),
    cosLatitude: Math.cos(latitude * RADIANS_PER_DEGREE),
    sinLatitude: Math.sin(latitude * RADIANS_PER_DEGREE),
  };

  return lonLatTrig;
}

type CreateGlobePointProjectorProps = {
  rotation: GlobeRotation;
  radius: number;
  center: [number, number];
};

/**
 * The same as d3's `geoOrthographic().rotate(rotation).scale(radius).translate(center)` for a single point, but
 * taking the sines and cosines of its longitude and latitude, so a tile's grid only computes them once per row and
 * column. Also tells whether the point is on the facing hemisphere.
 */
export function createGlobePointProjector(props: CreateGlobePointProjectorProps) {
  const { rotation, radius, center } = props;
  const [lambda, phi] = rotation;
  const [centerX, centerY] = center;

  const cosLambda = Math.cos(lambda * RADIANS_PER_DEGREE);
  const sinLambda = Math.sin(lambda * RADIANS_PER_DEGREE);
  const cosPhi = Math.cos(phi * RADIANS_PER_DEGREE);
  const sinPhi = Math.sin(phi * RADIANS_PER_DEGREE);

  function projectPoint(lonLatTrig: LonLatTrig): GlobePoint {
    const { cosLongitude, sinLongitude, cosLatitude, sinLatitude } = lonLatTrig;

    const cosRotatedLongitude = cosLongitude * cosLambda - sinLongitude * sinLambda;
    const sinRotatedLongitude = sinLongitude * cosLambda + cosLongitude * sinLambda;
    const towardsMeridian = cosRotatedLongitude * cosLatitude;
    const sideways = sinRotatedLongitude * cosLatitude;
    const towardsViewer = towardsMeridian * cosPhi - sinLatitude * sinPhi;
    const upwards = sinLatitude * cosPhi + towardsMeridian * sinPhi;

    const globePoint = { x: centerX + radius * sideways, y: centerY - radius * upwards, isFacing: towardsViewer > 0 };

    return globePoint;
  }

  return projectPoint;
}
