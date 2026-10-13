import { IDENT_RE } from '../constants';
import type { HLJSApi } from 'highlight.js';

// ES6 classes
function getClassAndExtendsRule(hljs: HLJSApi) {
  const { regex } = hljs;

  return {
    variants: [
      // class Car extends vehicle
      // class Car<T> extends Vehicle<T>
      {
        match: [
          /\bclass/,
          /\s+/,
          IDENT_RE,
          /(?:\s*<[^{}]*?>)?\s+/, // optional generics
          /extends/,
          /\s+/,
          regex.concat(IDENT_RE, '(', regex.concat(/\./, IDENT_RE), ')*'),
        ],
        scope: {
          1: 'keyword2',
          3: 'title.class',
          5: 'keyword2',
          7: 'title.class.inherited',
        },
      },
      // class extends Vehicle (an anonymous class)
      {
        match: [/\bclass/, /\s+/, /extends/, /\s+/, IDENT_RE],
        scope: {
          1: 'keyword2',
          3: 'keyword2',
          5: 'title.class.inherited',
        },
      },
      // class Car
      {
        match: [/\bclass/, /\s+/, regex.concat(/(?!extends\b)/, IDENT_RE)],
        scope: {
          1: 'keyword2',
          3: 'title.class',
        },
      },
    ],
  };
}

export { getClassAndExtendsRule };
