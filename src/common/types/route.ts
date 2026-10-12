import type { LazyExoticComponent, ReactNode } from 'react';

export type RouteWithTo = {
  to: any;
  index?: never;
};

export type RouteWithIndex = {
  index: true;
  to?: never;
};

export type Route = (RouteWithTo | RouteWithIndex) & {
  text?: string;
  Component: (() => any) | LazyExoticComponent<() => ReactNode>;
  hideFromSidebar?: boolean;
  children?: Array<Route>;
};
