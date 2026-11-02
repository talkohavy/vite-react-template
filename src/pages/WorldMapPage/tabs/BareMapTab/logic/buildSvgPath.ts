import { geoEquirectangular, geoPath, type GeoPermissibleObjects } from 'd3-geo';

type BuildSvgPathProps = {
  geoObject: GeoPermissibleObjects;
  width: number;
  height: number;
};

/**
 * Projects `geoObject` with a plain equirectangular projection (longitude → x, latitude → y),
 * scaled to fit `width` x `height`, and returns it as an SVG path `d` string.
 */
export function buildSvgPath(props: BuildSvgPathProps) {
  const { geoObject, width, height } = props;

  const projection = geoEquirectangular().fitSize([width, height], geoObject);
  const pathGenerator = geoPath(projection);

  const svgPath = pathGenerator(geoObject) ?? '';

  return svgPath;
}
