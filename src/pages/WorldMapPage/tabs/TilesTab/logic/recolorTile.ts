import { TILE_SIZE } from './constants';

type Rgb = [number, number, number];

/**
 * The color OpenStreetMap's standard style paints seas, lakes and rivers with.
 */
const OSM_WATER_RGB: Rgb = [170, 211, 223];

/**
 * The color OpenStreetMap's standard style paints bare land with. Zoomed in, most land is covered by parks, buildings
 * and streets, which keep their own colors.
 */
const OSM_LAND_RGB: Rgb = [242, 239, 233];

/**
 * How far a pixel's color may be from an OpenStreetMap color and still count as it. Keeps the anti-aliased pixels
 * along coastlines, which are part land and part water, from turning fully into either new color.
 */
const COLOR_TOLERANCE = 12;

type ColorReplacement = {
  from: Rgb;
  to: Rgb;
};

function createContext() {
  const canvas = document.createElement('canvas');
  canvas.width = TILE_SIZE;
  canvas.height = TILE_SIZE;
  const context = canvas.getContext('2d', { willReadFrequently: true });

  return context;
}

/**
 * Lets the browser parse any CSS color, like `blue` or `#1d4ed8`, by painting a pixel with it.
 */
function getRgb(color: string): Rgb | null {
  const context = createContext();

  if (!context) return null;

  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
  const rgb: Rgb = [red!, green!, blue!];

  return rgb;
}

type GetReplacementsProps = {
  waterColor?: string;
  landColor?: string;
};

function getReplacements(props: GetReplacementsProps) {
  const { waterColor, landColor } = props;

  const waterRgb = waterColor ? getRgb(waterColor) : null;
  const landRgb = landColor ? getRgb(landColor) : null;
  const replacements: Array<ColorReplacement> = [];

  if (waterRgb) replacements.push({ from: OSM_WATER_RGB, to: waterRgb });
  if (landRgb) replacements.push({ from: OSM_LAND_RGB, to: landRgb });

  return replacements;
}

type RecolorTileProps = {
  /**
   * Must have been loaded with `crossOrigin = 'anonymous'`, or its pixels can't be read.
   */
  image: HTMLImageElement;
  waterColor?: string;
  landColor?: string;
};

/**
 * A copy of the tile with its water and bare land repainted, or the tile itself if there's nothing to repaint or the
 * browser can't draw it.
 */
export function recolorTile(props: RecolorTileProps): CanvasImageSource {
  const { image, waterColor, landColor } = props;

  const replacements = getReplacements({ waterColor, landColor });
  const context = createContext();

  if (replacements.length === 0 || !context) return image;

  context.drawImage(image, 0, 0, TILE_SIZE, TILE_SIZE);
  const imageData = context.getImageData(0, 0, TILE_SIZE, TILE_SIZE);
  const { data } = imageData;

  for (let index = 0; index < data.length; index += 4) {
    const replacement = replacements.find(
      ({ from }) =>
        Math.hypot(data[index]! - from[0], data[index + 1]! - from[1], data[index + 2]! - from[2]) <= COLOR_TOLERANCE,
    );

    if (replacement) {
      data[index] = replacement.to[0];
      data[index + 1] = replacement.to[1];
      data[index + 2] = replacement.to[2];
    }
  }

  context.putImageData(imageData, 0, 0);

  return context.canvas;
}
