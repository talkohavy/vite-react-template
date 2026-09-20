export type Slide = {
  accentClassName: string;
  description: string;
  id: string;
  title: string;
};

export const FIRST_SLIDE: Slide = {
  id: 'ridge',
  title: 'Sunrise Ridge',
  description: 'Warm light over the high trail.',
  accentClassName: 'from-orange-400 to-rose-600',
};

export const SLIDES: Array<Slide> = [
  FIRST_SLIDE,
  {
    id: 'harbor',
    title: 'Harbor Lights',
    description: 'Boats coming in after dusk.',
    accentClassName: 'from-sky-500 to-indigo-700',
  },
  {
    id: 'pines',
    title: 'Pine Trail',
    description: 'Needles, shade, and quiet switchbacks.',
    accentClassName: 'from-emerald-400 to-teal-800',
  },
];

export const SHARED_ELEMENT_NAME = 'view-transition-shared-card';
