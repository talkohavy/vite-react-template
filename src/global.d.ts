/// <reference types="vite/client" />

/**
 * This following svg import only works if this file doesn't include:
 * - A global `import` statement
 * - An `export {}` statement
 *
 * If it does, then the following code will work in runtime, but will produce a type error:
 * import { ReactComponent as ViteIconComponent } from '@src/assets/vite2.svg';
 *
 * That's because it doesn't work on regex paths.
 * If the path was EXACTLY like this: '../../../../assets/vite2.svg', then it would work.
 * But since it's a regex path, it doesn't work.
 */
declare module '*.svg' {
  // 1. When config is set to: exportType: 'default':
  // const content: React.FC<React.SVGProps<SVGElement>>;
  // export default content;

  // 2. When config is set to: exportType: 'named':
  import type React from 'react';

  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  // biome-ignore lint: ambient module type declaration
  export { ReactComponent };
  export default ReactComponent;
}

interface Performance {
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}
