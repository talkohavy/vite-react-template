import { LOWERCASED_VARIABLE_RE } from '../constants';
import type { HLJSApi } from 'highlight.js';

const FUNCTION_LIKE_GLOBALS = [
  'async',
  'super',
  'import',
  'constructor',
  'return',
  'if',
  'for',
  'while',
  'switch',
  'catch',
  'function',
  'typeof',
  'void',
  'delete',
  'await',
  'yield',
  'throw',
  'new',
  'instanceof',
  'else',
  'do',
  'try',
  'with',
  'case',
].join('|');

function getFunctionCallRule(hljs: HLJSApi) {
  const { regex } = hljs;

  // Only a whole word that is not a property, so `motif()`, `reimport()` & `cache.delete()` are still function calls.
  const IGNORE_FUNCTION_LIKE_GLOBALS_RE = `(?<!(?<![\\w$.])(?:${FUNCTION_LIKE_GLOBALS}))`;
  const WITH_OPEN_PARENTHESIS_UP_AHEAD_RE = /(?=\s*\()/;

  return {
    match: regex.concat(
      /(?<!function\s+)/,
      /\b/,
      LOWERCASED_VARIABLE_RE,
      WITH_OPEN_PARENTHESIS_UP_AHEAD_RE,
      IGNORE_FUNCTION_LIKE_GLOBALS_RE,
    ),
    scope: 'title.function.call',
    relevance: 0,
  };
}

export { getFunctionCallRule };
