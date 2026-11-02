export const pageSlug = 'world-map'; // <--- has to match the route path in routes.ts

export const Tabs = {
  BareMap: '',
} as const;

export const tabOptions = [{ value: Tabs.BareMap, label: '1. Bare map' }];
