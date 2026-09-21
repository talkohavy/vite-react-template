export type RectAreaCoords = [x1: number, y1: number, x2: number, y2: number];

export type CircleAreaCoords = [cx: number, cy: number, r: number];

export type PolyAreaCoords = Array<number>;

type BaseArea = {
  accentClassName: string;
  description: string;
  id: string;
  label: string;
};

export type ImageMapArea =
  | (BaseArea & { coords: RectAreaCoords; shape: 'rect' })
  | (BaseArea & { coords: CircleAreaCoords; shape: 'circle' })
  | (BaseArea & { coords: PolyAreaCoords; shape: 'poly' });

export const IMAGE_MAP_NAME = 'workmap-demo';

export const IMAGE_MAP_SRC = '/image-map-demo.svg';

export const IMAGE_MAP_WIDTH = 500;

export const IMAGE_MAP_HEIGHT = 320;

export const IMAGE_MAP_AREAS: Array<ImageMapArea> = [
  {
    id: 'computer',
    shape: 'rect',
    coords: [30, 30, 220, 196],
    label: 'Computer',
    description: 'shape="rect" takes two corners [x1,y1, x2,y2]: the top-left and the bottom-right of the box.',
    accentClassName: 'bg-sky-500',
  },
  {
    id: 'coffee',
    shape: 'circle',
    coords: [350, 110, 60],
    label: 'Coffee cup',
    description: 'shape="circle" takes the center and a radius: [cx, cy, r].',
    accentClassName: 'bg-amber-700',
  },
  {
    id: 'croissant',
    shape: 'poly',
    coords: [
      140, 275, 120, 240, 130, 205, 170, 185, 230, 175, 290, 180, 330, 200, 355, 230, 360, 255, 340, 275, 310, 260, 270,
      250, 230, 248, 190, 252, 160, 262,
    ],
    label: 'Croissant',
    description:
      'shape="poly" takes any number of [x,y] pairs joined by straight lines - enough points can approximate a curve.',
    accentClassName: 'bg-orange-500',
  },
];
