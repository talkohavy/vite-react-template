import { TILE_SIZE } from './constants';

/**
 * The color OpenStreetMap's standard style paints seas, lakes and rivers with.
 */
const OSM_WATER_RGB: Rgb = [170, 211, 223];

/**
 * How far a pixel's color may be from the water color and still count as water. Keeps the anti-aliased pixels along
 * coastlines, which are part land, from turning fully into the new color.
 */
const WATER_COLOR_TOLERANCE = 12;

type Rgb = [number, number, number];

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

type RecolorWaterProps = {
  /**
   * Must have been loaded with `crossOrigin = 'anonymous'`, or its pixels can't be read.
   */
  image: HTMLImageElement;
  waterColor: string;
};

/**
 * A copy of the tile with its water painted in `waterColor`, or the tile itself if the browser can't draw it.
 */
export function recolorWater(props: RecolorWaterProps): CanvasImageSource {
  const { image, waterColor } = props;

  const waterRgb = getRgb(waterColor);
  const context = createContext();

  if (!waterRgb || !context) return image;

  context.drawImage(image, 0, 0, TILE_SIZE, TILE_SIZE);
  const imageData = context.getImageData(0, 0, TILE_SIZE, TILE_SIZE);
  const { data } = imageData;
  const [waterRed, waterGreen, waterBlue] = OSM_WATER_RGB;

  for (let index = 0; index < data.length; index += 4) {
    const distance = Math.hypot(data[index]! - waterRed, data[index + 1]! - waterGreen, data[index + 2]! - waterBlue);

    if (distance <= WATER_COLOR_TOLERANCE) {
      data[index] = waterRgb[0];
      data[index + 1] = waterRgb[1];
      data[index + 2] = waterRgb[2];
    }
  }

  context.putImageData(imageData, 0, 0);

  return context.canvas;
}
