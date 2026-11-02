import { TILE_URL_TEMPLATE } from './constants';

type GetTileUrlProps = {
  z: number;
  x: number;
  y: number;
};

export function getTileUrl(props: GetTileUrlProps) {
  const { z, x, y } = props;

  const url = TILE_URL_TEMPLATE.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y));

  return url;
}
