/*
Language: TypeScript
Author: Tal Kohavy <talkohavy@gmail.com>
Description: TypeScript is a strict superset of JavaScript
Website: https://www.typescriptlang.org
Category: common, scripting
*/

import { javascriptLanguageToRegister as javascript } from './javascript';
import { IDENT_RE, KEYWORDS as JAVASCRIPT_KEYWORDS } from './javascript/constants';

export function typescriptLanguageToRegister(hljs: any) {
  const tsLanguage = javascript(hljs);

  // `void` is left out on purpose, since it's already highlighted as a keyword.
  const TYPES = ['any', 'number', 'boolean', 'string', 'object', 'never', 'symbol', 'bigint', 'unknown'];

  /**
   * Types are only highlighted in a type position, so a variable named `number` or `string` is left alone:
   * - `a: string`, `a?: string`, `(): string`
   * - `string | number`, `A & object`
   * - `Array<string>`, `Record<string, number>`
   * - `readonly string[]`, `keyof object`, `x as unknown`, `x satisfies object`, `x is string`, `T extends string`
   * - `type Id = string`
   */
  const TYPE_POSITION_RE = String.raw`(?<=(?:[:|&]|[\w$]<|[\w$]<[^;(){}<>=]*,|\b(?:readonly|keyof|as|satisfies|is|extends)|\btype\s+[\w$]+\s*=)\s*)`;

  const TYPE_RULE = {
    scope: 'built_in',
    match: new RegExp(`${TYPE_POSITION_RE}\\b(?:${TYPES.join('|')})\\b(?![\\w$])`),
    relevance: 0,
  };

  const NAMESPACE = {
    // `namespace Foo {` & `namespace A.B.C {`, but not a variable named `namespace`.
    match: [/\bnamespace/, /\s+/, new RegExp(`${IDENT_RE}(?=\\s*[{.])`)],
    scope: {
      1: 'keyword2',
      3: 'title.class',
    },
  };

  const INTERFACE = {
    begin: [/\binterface/, /\s+/, IDENT_RE],
    beginScope: {
      1: 'keyword2',
      3: 'title.class',
    },
    // Ends right before the `{`, so the curly braces rule still colors it.
    end: /(?=\{)/,
    keywords: {
      $pattern: IDENT_RE,
      keyword2: ['extends'],
    },
    contains: [
      {
        scope: 'title.class.inherited',
        begin: `(?<=\\bextends\\s+|,\\s*)${IDENT_RE}`,
        relevance: 0,
      },
    ],
  };

  const USE_STRICT = {
    scope: 'meta',
    relevance: 10,
    begin: /^\s*['"]use strict['"]/,
  };

  const TS_KEYWORDS_GROUP2 = [
    'type',
    'namespace',
    'declare',
    'interface',
    'public',
    'private',
    'protected',
    'implements',
    'abstract',
    'readonly',
    'enum',
    'override',
    'keyof',
    'satisfies',
    'infer',
  ];

  /*
    namespace is a TS keyword but it's fine to use it as a variable name too.
    const message = 'foo';
    const namespace = 'bar';
  */

  const KEYWORDS = {
    ...JAVASCRIPT_KEYWORDS,
    keyword2: JAVASCRIPT_KEYWORDS.keyword2.concat(TS_KEYWORDS_GROUP2),
  };

  const DECORATOR = {
    scope: 'meta',
    begin: `@${IDENT_RE}`,
  };

  const swapMode = (mode: any, label: string, replacement: any) => {
    const indx = mode.contains.findIndex((m: any) => m.label === label);
    if (indx === -1) {
      throw new Error('can not find mode to replace');
    }

    mode.contains.splice(indx, 1, replacement);
  };

  // `tsLanguage.keywords` is a TypeScript-only copy (shared with the embedded expressions rules, i.e. `${...}`),
  // so extending it here updates all of them without leaking into JavaScript.
  Object.assign(tsLanguage.keywords, KEYWORDS);

  tsLanguage.contains = tsLanguage.contains.concat([DECORATOR, NAMESPACE, INTERFACE, TYPE_RULE]);
  // i.e. `onChange={(e: string) => {}}` inside JSX
  tsLanguage.exports.EXPRESSION_CONTAINS.push(TYPE_RULE);

  // TS gets a simpler shebang rule than JS
  swapMode(tsLanguage, 'shebang', hljs.SHEBANG());

  // JS use strict rule purposely excludes `asm` which makes no sense
  swapMode(tsLanguage, 'use_strict', USE_STRICT);

  Object.assign(tsLanguage, {
    name: 'TypeScript',
    aliases: ['ts', 'tsx', 'mts', 'cts'],
  });

  return tsLanguage;
}
