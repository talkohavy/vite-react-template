import type { ProjectionName } from '../../../logic/projections';

export const PROJECTION_DESCRIPTIONS: Record<ProjectionName, string> = {
  equirectangular:
    'The one from the previous tabs. Neither shapes nor areas are kept: everything gets stretched sideways as you move away from the equator. On screen, Greenland comes out about 3.6 times the size of DR Congo.',
  mercator:
    'Keeps angles, so small shapes look right and a straight line is a constant compass bearing. That made it the sailing chart, and a variant of it is what web maps like OpenStreetMap use. The price is area: parallels spread further apart toward the poles, and Greenland comes out about 15 times the size of DR Congo. The poles themselves are infinitely far away, so the map is cut at about ±85°, which is exactly where it becomes a square.',
  equalEarth:
    'Keeps areas. Greenland and DR Congo come out at their true ratio: Greenland is slightly smaller. The price is shape: parallels stay straight, but meridians curve inward, and land near the edges gets sheared.',
  orthographic:
    'What a globe looks like from very far away. Only the hemisphere facing you is drawn; the rest is clipped. Shapes and areas are true near the center and squeezed toward the rim. Grab the globe and drag to spin it.',
};
