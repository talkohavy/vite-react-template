export const pageSlug = 'world-map'; // <--- has to match the route path in routes.ts

export const Tabs = {
  BareMap: '',
  SphereAndGraticule: 'sphere-and-graticule', // <--- has to match the sub-route path in routes.ts
  Projections: 'projections', // <--- has to match the sub-route path in routes.ts
} as const;

export const tabOptions = [
  { value: Tabs.BareMap, label: '1. Bare map' },
  { value: Tabs.SphereAndGraticule, label: '2. Graticule' },
  { value: Tabs.Projections, label: '3. Projections' },
];
